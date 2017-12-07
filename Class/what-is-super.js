/*
* super关键字
* super在子类的构造函数中必须被调用，放在函数体顶部最好了。
* super 有两种状态。对象，函数
*    1，作为函数时，只能在子类的构造函数中被调用，否则会报错。super()就相当于调用父类的构造函数
*       但是super()返回的是子类的实例，即super内的this指向子类
*       相当于(B extends A)
*         在子类B的构造函数中A.prototype.constructor.call(this)
* 
*    2，作为对象时，感觉要复杂一些
*       ES6 规定，通过super调用父类的方法时，方法内部的this指向子类
*       相当于super.FUN_NAME.call(this)
*       a, 在静态方法中使用
*          super指向#父类本身#
*          应用起来应该很广，我得承认我想象力有限
*       b, 在普通方法中使用
*          super指向#父类的prototype#(父类实例上的方法或属性能不能被super访问到？)
* -------------------------------------------------------------
* super被使用时显示指定是函数形式还是对象形式，不然会报错
* -------------------------------------------------------------
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
