/*
* 该函数的作用是?证明next传参的应用？
* ------------------------------------------
* Generator函数从暂停状态到恢复运行，它的上下文状态（context)是不变的。
* 通过next方法的参数，有办法在Generator函数开始运行之后，继续向函数体内部注入值
* next方法的参数表示上一个yield表达式的返回值
*/
function* foo(x) {
  // 假设，next()从不穿参
  let y = 2 * (yield (x + 1));
  // 第二次next时就执行了z所在地，但yield是不返回值的(undefined)。2 * undefined => y = NaN
  // next方法可以带一个参数，该参数就会#被当作#上一个yield表达式的返回值。为什么是上一个yield表达式？
  let z = yield (y/3); // next()无参，yield表达式无返回(undefined)
  console.log(x)
  // 同样的，下面只有x是一个数字,
  // 返回NaN
  return (x+y+z);
}

// 这里Generator执行中途没有打扰
const a = foo(5)
let r1 = a.next()
let r2 = a.next()
let r3 = a.next()

console.log(r1,r2,r3)

// 这里执行中打扰了
const b = foo(5)
let r4 = b.next()
let r5 = b.next(12)
let r6 = b.next(13)

console.log(r4,r5,r6)

