const axios = require('axios')
const fs = require('fs')
const path = require('path')

const downloadImage = async (url, localPath) => {
  const response = await axios({
    method: 'GET',
    url,
    responseType: 'stream',
  })

  const writer = fs.createWriteStream(localPath)
  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(response.headers['content-type']))
    writer.on('error', reject)
  })
}

const processMarkdown = async (markdownFile) => {
  let markdown = fs.readFileSync(markdownFile, 'utf8')
  const imgRegex = /!\[.*?\]\((.*?)\)|<img.*?src="(.*?)"/g
  const match = imgRegex.exec(markdown)

  if (!match) {
    console.error('No images found in markdown')
    return
  }

  const imgUrl = match[1] || match[2]
  const filenameWithoutExtension = 'heroImage'
  const localPath = path.join(path.dirname(markdownFile), filenameWithoutExtension)
  const contentType = await downloadImage(imgUrl, localPath)
  const extension = contentType ? `.${contentType.split('/')[1]}` : ''

  const finalLocalPath = `${localPath}${extension}`
  fs.renameSync(localPath, finalLocalPath)

  markdown = markdown.replace(match[0], '')
  fs.writeFileSync(markdownFile, markdown, 'utf8')
}

const inputMarkdownFile = process.argv[2]

if (!inputMarkdownFile) {
  console.log('Usage: node index.js <inputMarkdownFile>')
  process.exit(1)
}

processMarkdown(inputMarkdownFile)
