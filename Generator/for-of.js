/*
* 联系yield-expression.js
* ---------------------------------------------
* for...of循环可以自动遍历 Generator 
* 函数时生成的Iterator对象，且此时不再需要调用next方法

* 为什么return的值没有被遍历？
*/

function* foo() {
  yield 1
  yield 2
  yield 3
  yield 4
  yield 5
  return 6
}

for(let v of foo()) {
  console.log(v)
}
// 1，2，3，4，5