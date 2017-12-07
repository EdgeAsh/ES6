/*
* 观察者模式
*
* 一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都得到通知并被自动更新
*/

/*
* 实现EventEmitter
* 实例共有三个方法： on, emit, off
* on添加事件并关联对应的方法，每执行一次on方法。
* 如果第一个参数已经存在，则将函数关联
* emit触发事件，执行第一个参数里对应的所有函数
* off移除事件对应的函数，
*/

class EventEmitter {
  constructor() {
    this.events = {}
  }
  on(event, func) {
    // 将对应事件做键。存入实例的events对象,
    // 键对应的是数据，用来存放每次调用on传入的函数
    let funcs = this.events[event] || []  // 如果事件不存在，则创建一个新的数组
    funcs.push(func)
    this.events[event] = funcs
  }
  emit(event, ...rest) {
    // 触发操作，将事件对应的每个函数执行一次
    let funcs = this.events[event]
    for (let fun of funcs) {
      fun(...rest)
    }
  }
  off(event, func) {
    // 移除事件对应的某个函数,只移除一次,使用splice方法更简化写
    let funcs = this.events[event]
    let index = funcs.indexOf(func)
    // [].splice(index, n) ;从数组下标index处开始删除n个元素，在原数组上操作。
    // 返回被删除的元素组成的数组
    funcs.splice(index,1)
  }
}
