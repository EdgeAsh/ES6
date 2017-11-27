/*
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
* Promise原理
* 1. 
*
*
*
*
*
*
*
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
  }
  function reject(reason) {
    if (self.status === 'pending') {
      self.status = 'rejected'
      self.data = reason
      var f
      for (var i = 0; i < self.rejectedCallbacks.length; i++) {
        f = self.rejectedCallbacks[i]
        f(reason)
      }
    }
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
    // 一般人想法是将onRejected/onResolved变为函数.为了方便后面使用
    onResolved = function() {}
  }
  if (typeof onRejected !== 'function') {
    onRejected = function() {}
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
      try {
        // 这个data是第一个promise中传入的函数中的resolve携带的参数！！！！！！！！！！！！
        // onResolved是在then里的，
        // 如果onResolved返回的又是Promise实例x呢，直接resolve是不行的，需要在返回的实例x中的then里resolve值
        var x = onResolved(self.data)
        if (x instanceof Promise) {
          // 非简化。可以想想了，tmd又是递归？
          // x.then(function(value) {
          //   resolve(value)
          // }, function(reason) {
          //   reject(reason)
          // })

          // 简化
          x.then(resolve, reject)
        } else {
          resolve(x)
        }
      } catch(e) {
        reject(e)
      }
    })
  }

  if (self.status === 'rejected') {
    promise2 = new Promise(function(resolve, reject) {
      try {
        var x = onRejected(self.data)
        if (x instanceof Promise) {
          x.then(resolve, reject)
        } else {
          // 为什么是resolve
          resolve(x)
        }
      } catch(e) {
        reject(e)
      }
    })
  }

  if (self.status === 'pending') {
    // promise1还是不确定状态，需要等到promise1确地了状态才能确定promise2应该怎么走
    // 查看构造函数里resolve函数的注释，找找灵感。
    promise2 = new Promise(function(resolve, reject) {
      self.resolvedCallbacks.push(function(value) {
        try {
          var x = onResolved(self.data)
          if (x instanceof Promise) {
            x.then(resolve, reject)
          } else {
            resolve(x)
          }
        } catch(e) {
          reject(e)
        }
      })
      self.rejectedCallbacks.push(function(reason) {
        try {
          var x = onRejected(self.data)
          if (x instanceof Promise) {
            x.then(resolve, reject)
          } else {
            resolve(x)
          }
        } catch(e) {
          reject(e)
        }
      })
    })
  }

  return promise2
}

function RESOLVE_PROMISE(promise, x, resolve, reject) {
  if (promise === x) {
    reject(new TypeError('Chaining cycle is deteced for promise'))
    return
  }
  if (x instanceof Promise) {
    x.then(resolve, reject)
    return
  }
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      var then = x.then
      var called = false
      if (typeof then === 'function') {
        then.call(x, function resolvePromise(y) {
          if (called) {
            return
          }
          called = true
          RESOLVE_PROMISE(promise, y, resolve, reject)
        }, function rejectPromise(r) {
          if (called) {
            return
          }
          called = true
          reject(r)
        })
      } else {
        resolve(x)
      }
    } catch(e) {
      if (called) {
        return
      }
      called =true
      reject(e)
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
module.exports = Promise