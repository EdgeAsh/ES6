/*
* 单例设计模式，保证我们系统中的某一个类在任何情况实例化的时候
* 都获得同一个实例
*
* 写一个可以完成单例功能的函数
* 目前知道两种方式，
*     1,使用class继承实现，
*     2,使用Proxy代理实现
*/

// 使用class
function singletonify(Origin) {
  const obj = new Origin()
  class Single extends Origin {
    constructor() {
      super()
      return obj
    }
  }
  // 将obj的原型指向Single的prototype属性
  Object.setPrototypeOf(obj, Single.prototype)
  return Single
}

class A {}
const Singleton = singletonify(A)
let re1 = new Singleton()
let re2 = new Singleton('jskl')
console.log(re1, re2, re1 === re2, re1 instanceof A, re1 instanceof Singleton)
