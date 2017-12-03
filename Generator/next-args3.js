/*
* next方法返回的对象的value属性就是当前yield表达式的值,
* 每次调用next方法，都会返回新的{value,done}对象
*/

function* dataComsumer() {
  console.log('start')
  console.log(`1. ${yield 1}`)
  console.log(`2. ${yield 2}`)
  return 'result'
}

let getObj = dataComsumer();
let r1 = getObj.next()
let r2 = getObj.next('a')
let r3 = getObj.next('b')

console.log(r1,r2,r3, r1==r2, r2===r3)