/*
* 实现Promise是根据Promise规范来的：https://promisesaplus.com/
* 规范很短，所以每句都可能很重要

* Promise特点
* 1. 状态改变后不可再改变(状态凝固)
*     pending,fullfilled,rejected
*
* 2. then方法（此方法就是最重要的部分）
*     可以链式调用
*     then方法返回一个新的promise实例
*   promise2 = promise.then(f1, f2)
*     当promise的状态确定的时候会执行then中的f1或者f2。
*     在f1/f2执行之前then就已经返回了一个Promise实例(promise2)
*     promise2的状态由f1/f2的返回值确定，以此类推就是链式调用
* 
* 3. promise创建时传入的函数会立即执行  
*/

/*
* 考虑四中情况，分别会有什么问题
* 假设new一个Promise时传入的函数为funA, then中的函数为funCD
*  1 funA是同步，funCD为同步
*  2 funA是同步，funCD为异步
*  3 funA是异步，funCD为同步
*  4 funA是异步，funCD为异步
*/

/*
* 状态确定后挨个调用数组中的方法
*/
function Promise(executor) {
  var self = this
  // 保存then中的回调方法
  self.resolvedCallbacks = []
  self.rejectedCallbacks = []
  // 状态
  self.status = 'pending'

  /*
  * 状态确定后挨个调用数组中的方法，必须被当做函数调用。
  * 即调用时函数体内的this应该是undefined/window
  */ 
  function resolve(value) {
    // 测试用例给我们传了一个我自己定义的Promise实例时
    if (value instanceof Promise) {
      value.then(resolve, reject)
      return
    }
    // 这里为什么也要异步
    setTimeout(function() {
      if (self.status === 'pending') {      // 这里是为了确保状态不可改变
        self.status = 'resolved'
        // 保存传入的参数，promise成功时的值
        self.data = value
        var f
        for (var i = 0; i < self.resolvedCallbacks.length; i++) {
          // 为什么分开写？
          // 确保是函数的调用，即被调用时函数体内的this为undefined/window
          f = self.resolvedCallbacks[i]
          f(value)
        }
      }
    })
  }
  function reject(reason) {
    // 为什么是异步
    setTimeout(function() {
      if (self.status === 'pending') {
        self.status = 'rejected'
        self.data = reason
        var f
        for (var i = 0; i < self.rejectedCallbacks.length; i++) {
          f = self.rejectedCallbacks[i]
          f(reason)
        }
      }
    })
  }

  try {
    // promise创建时传入的函数会立即执行，而传入的函数不知道有没有问题.所以要try下
    executor(resolve, reject)
  } catch(e) {
    reject(e)
  }
}


/*
* then方法中实现根据状态调用不同的函数，
* 并且在调用回调前返回一个新的promise且此promise的状态由回调函数确定
*   pending -> fullfilled : 调用onResolved
*   pending -> rejected : 调用onRejected
*   onRejected\onResolved必须是函数，否则忽略它
*/
Promise.prototype.then = function(onResolved, onRejected) {
  var self = this
  if (typeof onResolved !== 'function') {
    // 为什么要这样
    onResolved = function(value) { return value }
  }
  if (typeof onRejected !== 'function') {
    // 为什么要这样，这里throw,后面的try可以catch到。catch到就会reject(e)
    onRejected = function(reason) { throw reason}
  }

  /*
  * 判断状态的三种情况。为了方便
  * 在三种情况下
  * 我要实现的是
  */

  var promise2
  if (self.status === 'resolved') {
    /*
    * 返回一个新的promise2，在promise2中调用onResolved且传入promise成功时传入的值
    * 而promise成功时传入的值到底是什么，我们是不知道的。这是promise中最复杂的！！！
    * onResolved返回值x决定了promise2的状态
    * 
    */
    promise2 = new Promise(function(resolve, reject) {
      // 为什么这里要异步？
      setTimeout(function() {
        try {
          // 这个data是第一个promise中传入的函数中的resolve携带的参数！！！！！！！！！！！！
          // onResolved是在then里的，
          // 如果onResolved返回的又是Promise实例x呢，直接resolve是不行的，需要在返回的实例x中的then里resolve值
          var x = onResolved(self.data)
          // 非兼容
          // if (x instanceof Promise) {
          //   // 非简化。可以想想了，tmd又是递归？
          //   // x.then(function(value) {
          //   //   resolve(value)
          //   // }, function(reason) {
          //   //   reject(reason)
          //   // })

          //   // 简化
          //   x.then(resolve, reject)
          // } else {
          //   resolve(x)
          // }

          // 兼容下
          RESOLVE_PROMISE(promise2, x, resolve, reject)
        } catch(e) {
          reject(e)
        }
      })
    })
  }

  if (self.status === 'rejected') {
    promise2 = new Promise(function(resolve, reject) {
      // 为什么要异步
      setTimeout(function() {
        try {
          var x = onRejected(self.data)
          // 非兼容
          // if (x instanceof Promise) {
          //   x.then(resolve, reject)
          // } else {
          //   // 为什么是resolve
          //   resolve(x)
          // }

          // 兼容
          RESOLVE_PROMISE(promise2, x, resolve, reject)
        } catch(e) {
          reject(e)
        }
      })
    })
  }

  if (self.status === 'pending') {
    // promise1还是不确定状态，需要等到promise1确地了状态才能确定promise2应该怎么走
    // 查看构造函数里resolve函数的注释，找找灵感。
    promise2 = new Promise(function(resolve, reject) {
      self.resolvedCallbacks.push(function(value) {
        try {
          var x = onResolved(self.data)
          // 非兼容
          // if (x instanceof Promise) {
          //   x.then(resolve, reject)
          // } else {
          //   resolve(x)
          // }

          // 兼容
          RESOLVE_PROMISE(promise2, x, resolve, reject)
        } catch(e) {
          reject(e)
        }
      })
      self.rejectedCallbacks.push(function(reason) {
        try {
          var x = onRejected(self.data)
          // 非兼容
          // if (x instanceof Promise) {
          //   x.then(resolve, reject)
          // } else {
          //   resolve(x)
          // }

          // 兼容
          RESOLVE_PROMISE(promise2, x, resolve, reject)
        } catch(e) {
          reject(e)
        }
      })
    })
  }

  return promise2
}

/*
* 上面就基本已经实现了Promise,但是没有达到 https://promisesaplus.com/ 规范的要求
* 这个函数的作用是使其他的Promise可以互相兼容------兼容
*/
function RESOLVE_PROMISE(promise, x, resolve, reject) {
  if (promise === x) {
    reject(new TypeError('Chaining cycle is deteced for promise'))
    return
  }

  if (x instanceof Promise) {
    if (x.status === 'pending') {
      x.then(function(v) {
        RESOLVE_PROMISE(promise, v, resolve, reject)
      }, reject)
    } else {
      x.then(resolve, reject)
    }
    return
  }
  
  // 只有这两种数据类型可以保存属性
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      /*
      * 为什么要把then单独拿出来？
      *   因为我们是在读别人给的属性，但是我们不知道该属性具体为什么。也可能报错
      *   如果该属性是getter,则每次调用就会返回不同的值。
      * 所以只调用一次
      * 
      * a,b,c三者只能调用一个,为什么？
      * 
      */
      var then = x.then
      var called = false
      if (typeof then === 'function') {
        then.call(x, function resolvePromise(y) {
          if (called) {
            return
          }
          called = true
          // 产生了递归
          RESOLVE_PROMISE(promise, y, resolve, reject)//--- a
        }, function rejectPromise(r) {
          if (called) {
            return
          }
          called = true
          reject(r) //------------------------------------- b
        })
      } else {
        resolve(x)
      }
    } catch(e) {
      if (called) {
        return
      }
      called =true
      reject(e) //----------------------------------------- c
    }
  } else {
    resolve(x)
  }
}

// 测试的方式
Promise.deferred = function() {
  var dfd = {}

  dfd.promise = new Promise(function(resolve, reject) {
    dfd.resolve = resolve
    dfd.reject = reject
  })

  return dfd
}
try {
  module.exports = Promise
} catch(e) {}