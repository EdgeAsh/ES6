/*    new 的过程
创建一个空对象，作为将要返回的对象实例
将这个空对象的原型，指向构造函数的prototype属性
将这个空对象赋值给函数内部的this关键字
开始执行构造函数内部的代码
*/



/* 
* 简化的new内部流程 (难度比较高，知道过程就好了）
* -----------------------------------------
* constructor: 构造函数
* param1: 构造函数参数
*/
function _new(constructor, param1) {
  // 将arguments对象转成数组
  var args = [].slice.call(arguments);
  // 取出构造函数
  var constructor = args.shift();
  // 创建一个空对象，继承构造函数的prototype属性
  var context = Object.create(constructor.prototype);
  // 执行构造函数
  var result = constructor.apply(context, args)
  // 如果返回结果是对象，就直接返回，否则返回context对象
  return (typeof result === 'object' && result != null) ? result : context;
}

// 例子
function Person(name, age) {
  this.name = name
  this.age = age
}

var actor = _new(Person, '张三', 28)
console.log(actor)
