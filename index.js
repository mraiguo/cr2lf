#!/usr/bin/env node
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const fg = require('fast-glob')
const {
  crlf, chkcrlf, LF
} = require('crlf-normalize')
const { Command } = require('commander')
const program = new Command()

program
  .option('-i, --ignore <filepath>', '忽略检查的文件')

program.parse(process.argv)

console.log(program.ignore)

function checkLRForBinFile() {
  console.log(chalk.yellow(`文件夹下的除了 node_modules ${program.ignore} 外的转为 LF 行尾符`))
  fg.sync(
    ['**/*.js'],
    { ignore: ['**/node_modules', program.ignore] }
  ).forEach((file) => {
    const filePath = path.resolve(process.cwd(), file)
    const fileContent = fs.readFileSync(filePath, {
      encoding: 'utf-8'
    })

    if (chkcrlf(fileContent).crlf) {
      console.error('文件', filePath, '为CRLF, 将自动修正')
      const fixedContent = crlf(fileContent, LF)
      fs.writeFileSync(filePath, fixedContent, {
        encoding: 'utf-8'
      })
    }
  })
  console.log('检查完成')
}

module.exports = checkLRForBinFile
