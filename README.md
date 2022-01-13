# anime-scraper

anime scraper from websites: gogoanime.ai, myanimelist.net


Usage example: JavaScript


const { search } = require("anime-scraper")

await search("mayoi neko")
.then((anime) => console.log(anime))


Returns: {
name: 'Mayoi Neko Overrun',
pictureGOGO: 'https://gogocdn.net/images/anime/M/mayoi-neko-overrun.jpg',
type: 'TV Series',
summary: 'The story revolves around Takumi Tsuzuki, a boy who lives with his older “sister” Otome, although the two have no blood ties between them. Otome manages a run-down 
confectionary store called Stray Cats. One day, Otome picks up a mysterious beautiful girl off the streets.',
pictureMAL: 'https://cdn.myanimelist.net/images/anime/10/23770.jpg',
genre: 'Comedy, Harem, Romance, Shounen',
releasedDate: '2010',
status: 'Complete',
link: 'https://gogoanime.ai/category/mayoi-neko-overrun',
japaneseTitle: '迷い猫オーバーラン!',
synonyms: [ 'Stray Cats Overrun!' ],
episodes: '13',
studios: [ 'AIC' ],
duration: '24 min. per ep.',
score: '6.68',
url: 'https://myanimelist.net/anime/7590/Mayoi_Neko_Overrun'
}


forked package of the following packages

an-anime-scraper
mal-scraper

full credits to the creators of these packages I hope it will be useful to you.
