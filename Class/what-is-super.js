/*
* super可以当对象使用，也可以当函数使用。
* 用法完全不同
* 1，super作为函数时，只能在子类的构造函数constructor中。
* 2，super作为对象是，在普通方法中，指向父类的原型对象；在静态方法中，指向父类
*/
class A {
  constructor() {
    console.log(new.target.name) // new还有这功能？！new.target指向当前正在执行的函数
  }
}

/*
 * 1----
* B中的super()代表调用父类A的constructor()
* ## 但是super()返回的是B的实例，即super内部的this指向B
*    相当于A.prototype.constructor.call(this)
*/
class B extends A {
  constructor() {
    super()
  }
}
new A()
new B()
