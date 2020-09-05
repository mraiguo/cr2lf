#!/usr/bin/env node
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const fg = require('fast-glob')
const {
  crlf, chkcrlf, LF
} = require('crlf-normalize')

function checkLRForBinFile() {
  console.log(chalk.yellow('文件夹下的除了 node_modules 外的转为 LF 行尾符'))
  console.log('开始检查')
  fg.sync(
    ['**/*.*'],
    { ignore: ['**/node_modules'] }
  ).forEach((file) => {
    const filePath = path.resolve(__dirname, file)
    const fileContent = fs.readFileSync(filePath, {
      encoding: 'utf-8'
    })
    if (chkcrlf(fileContent).crlf) {
      console.error('Bin入口文件', filePath, '为CRLF, 将自动修正')
      const fixedContent = crlf(fileContent, LF)
      fs.writeFileSync(filePath, fixedContent, {
        encoding: 'utf-8'
      })
    }
  })
  console.log('检查完成')
}

checkLRForBinFile()
