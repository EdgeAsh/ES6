/*
* Proxy用于修改某些操作的默认行为
* 等同于在语言层面做出修改，所以属于一种“元编程”（meta programming），即对编程语言进行编程
*
* ----------------------------------------------------------------------------------------------------
* Proxy主要支持的操作，拦截13个方法。看实例去 -> http://es6.ruanyifeng.com/#docs/proxy#Proxy-实例的方法
* 1，get(target, propKey, receiver)：
*     拦截对象属性的读取，比如proxy.foo和proxy['foo']。
*
* 2，set(target, propKey, value, receiver)：
*     拦截对象属性的设置，比如proxy.foo = v或proxy['foo'] = v，返回一个布尔值。
* 3，has(target, propKey)：拦截propKey in proxy的操作，返回一个布尔值。
*
* 4，deleteProperty(target, propKey)：拦截delete proxy[propKey]的操作，返回一个布尔值。
*
* 5，ownKeys(target)：
*     拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)，
*     返回一个数组。该方法返回目标对象所有自身的属性的属性名，而Object.keys()的返回结果仅包括目标对象自身的可遍历属性。
*
* 6，getOwnPropertyDescriptor(target, propKey)：
*     拦截Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象。
*
* 7，defineProperty(target, propKey, propDesc)：
*     拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值。
*
* 8，preventExtensions(target)：拦截Object.preventExtensions(proxy)，返回一个布尔值。
*
* 9，getPrototypeOf(target)：拦截Object.getPrototypeOf(proxy)，返回一个对象。
*
* 10，isExtensible(target)：拦截Object.isExtensible(proxy)，返回一个布尔值。
*
* 11，setPrototypeOf(target, proto)：
*     拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
*
* 12，apply(target, object, args)：
*     拦截 Proxy 实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。
*
* 13，construct(target, args)：拦截 Proxy 实例作为构造函数调用的操作(拦截new)，比如new proxy(...args)。
*/


const obj = new Proxy({}, {
  get: function (target, key, receiver) {
    console.log('target\n', target)
    console.log('key\n', key)
    console.log('receiver\n', receiver)
    console.log(`getting ${key}!`)
    return Reflect.get(target, key, receiver)
  },
  set: function (target, key, value, receiver) {
    console.log(`setting ${key}!`)
    return Reflect.set(target, key, value, receiver)
  }
})

obj.count = 1
++obj.count

var obj2 = new Proxy({}, {
  get: function(target, key) {
    return 'mm'
  }
})





// construct
class A {
}

let aa = new Proxy(new A('hell'), {
  construct(target, args, newTarget) {
    console.log('target',target)
    console.log('args', args)
    console.log('newTarget', newTarget)
    return {a: 1,ba: 'bal'}
  }
})













