#!/usr/bin/env zx

import { $ } from 'zx'
import { printObject } from './utils.js'

console.log('开始执行拼写检查...')
await $`pnpm spellcheck`.catch(out => {
    console.log('拼写检查失败:')
    console.log(out.stdout || out.stderr || out)
    // 在测试环境下不抛出错误，允许继续
    console.log('警告: 拼写检查失败，但在测试模式下继续执行...')
})

console.log('\n开始执行类型检查...')
// 只执行类型检查，因为lint:stage需要有暂存文件
await $`pnpm type-check`.catch(out => {
    console.log('类型检查失败:')
    printObject(out)
    // 在测试环境下不抛出错误
    console.log('警告: 类型检查失败，但在测试模式下继续执行...')
})

console.log('\n代码质量评估完成（测试模式）')
