const fetch = require('node-fetch')
const cheerio = require('cheerio')
const axios = require("axios")
const match = require('match-sorter').default

const SEARCH_URI = 'https://myanimelist.net/search/prefix.json'

const getFromBorder = ($, t) => {
return $(`span:contains("${t}")`).parent().text().trim().split(' ').slice(1).join(' ').split('\n')[0].trim()
}

const parsePage = async (data, anime, name) => {
const $ = cheerio.load(data)
const result = {}

let baseUrl = `https://gogoanime.ai//search.html?keyword=${name.replace(/\s/gi, "%20")}`
let res = await fetch(baseUrl).then(res => res.text())

let $x = cheerio.load(res)
let link = "https://gogoanime.ai" + $x('div.last_episodes > ul.items > li').eq(0).find('div.img').find('a').attr('href')
let body = await fetch(link).then(res => res.text())           
let $y = cheerio.load(body)
let $z = cheerio.load($y('div.anime_info_body_bg').html())

result.name = $z('h1').text(),
result.pictureGOGO = $z('img').attr('src'),
result.type = $z('p.type').eq(0).find('a').text(),
result.summary = $z('p.type').eq(1).text().trim().replace(/Plot Summary:/i, "").trim(),
result.pictureMAL = $('img[itemprop="image"]').attr('data-src')
result.genre = $z('p.type').eq(2).find('a').text(),
result.releasedDate= $z('p.type').eq(3).text().replace(/Released:/i, "").trim(),
result.status = $z('p.type').eq(4).find('a').text().replace(/Completed/g, "Completo").trim(),
result.link = link
result.japaneseTitle = getFromBorder($, 'Japanese:')
result.synonyms = getFromBorder($, 'Synonyms:').split(', ')
result.episodes = getFromBorder($, 'Episodes:')
result.studios = getFromBorder($, 'Studios:').split(',       ')
result.duration = getFromBorder($, 'Duration:')
result.score = getFromBorder($, 'Score:').split(' ')[0].slice(0, -1)

return result
}

const isAnimeFromURL = url => {
const urlSplitted = url.split('/')
return urlSplitted[3] === 'anime'
}

const getInfoFromURL = (url, query) => {
return new Promise((resolve, reject) => {
if (!url || typeof url !== 'string' || !url.toLocaleLowerCase().includes('myanimelist')) {
reject(new Error('[Mal-Scraper]: Invalid Url.'))
return
}

url = encodeURI(url)
const anime = isAnimeFromURL(url)

axios.get(url)
.then(({ data }) => {
const name = query
const res = parsePage(data, anime, name)
res.id = +url.split(/\/+/)[3]
resolve(res)
})
.catch((err) => reject(err))
})
}


const getResultsFromSearch = (keyword) => {
return new Promise((resolve, reject) => {
if (!keyword) {
reject(new Error('[Mal-Scraper]: Received no keyword to search.'))
return
}

axios.get(SEARCH_URI, {
params: {
type: 'anime',
keyword
}
}).then(({ data }) => {
const items = []

data.categories.forEach((elem) => {
elem.items.forEach((item) => {
items.push(item)
})
})

resolve(items)
}).catch((err) => {
reject(err)
})
})
}

const search = (name, getBestMatch = true) => {
return new Promise((resolve, reject) => {
if (!name || typeof name !== 'string') {
reject(new Error('[Mal-Scraper]: Invalid name.'))
return
}

getResultsFromSearch(name)
.then(async (items) => {
if (!items.length) {
resolve(null)
return
}
try {
const bestMatch = match(items, name, { keys: ['name'] })
const itemMatch = getBestMatch && bestMatch && bestMatch.length ? bestMatch[0] : items[0]
const url = itemMatch.url
const query = name
const data = await getInfoFromURL(url, query)
data.url = url
resolve(data)
} catch (e) {
reject(e)
}
})
.catch((err) => reject(err))
})
}

module.exports = { search }