/*
* 单例设计模式，保证我们系统中的某一个类在任何情况实例化的时候
* 都获得同一个实例
*/

// 使用Proxy
function singletonify(Origin) {
  const obj = new Origin()
  return new Proxy(Origin, {
    // 拦截new操作的
    construct(target, args, newTarget) {
      return obj
    }
  })
 }

class A {}
const Singleton = singletonify(A)
let re1 = new Singleton()
let re2 = new Singleton('jskl')
console.log(re1, re2, re1 === re2, re1 instanceof A, re1 instanceof Singleton)
