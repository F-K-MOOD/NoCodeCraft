#!/usr/bin/env zx

/**
 * 打印对象内容，用于调试
 * @param obj 要打印的对象
 */
export function printObject(obj) {
  console.log(JSON.stringify(obj, null, 2));
}