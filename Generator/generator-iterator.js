/*
 * 任意一个对象的Symbol.iterator方法，等于该对象的遍历器生成函数
 * 调用该函数就会返回该对象的一个遍历器对象
 */

var myIterable = {}
// 将Generator函数赋值给Symbol.iterator属性，使对象有了Iterator借口，可以被遍历了。
myIterable[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
}

console.log([...myIterable])
