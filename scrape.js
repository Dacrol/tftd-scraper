const cheerio = require('cheerio')
const axios = require('axios').default
const fs = require('fs')

const urls = [
  'https://wh40k.lexicanum.com/wiki/Thought_for_the_day_(A_-_H)',
  'https://wh40k.lexicanum.com/wiki/Thought_for_the_day_(I_-_P)',
  'https://wh40k.lexicanum.com/wiki/Thought_for_the_day_(Q_-_Z)'
]

const scrape = async url => {
  const { data } = await axios.get(url)
  const $ = cheerio.load(data)
  const text = $('.mw-parser-output')
    .children('table')
    .map(function(i, tables) {
      return $(tables).map(function(_i, table) {
        
        return $(table)
          .find('tr td:nth-child(2):not([style*=\'background\']) >:first-child')
          .map(function(__i, row) {
             return $(row)
                .text()
          }).get()
      }).get()
    }).get()
    return text
}

(async () => {
  const thoughts = (await Promise.all(urls.map(scrape))).reduce((acc, result) => {
    return [...acc, ...result]
  }, [])
  const string = JSON.stringify(thoughts, null, 2)
  fs.writeFileSync('./thoughts.json', string)
})()