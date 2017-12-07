/**
* super作为对象时的情况
* 在静态方法中，指向父类
* 在普通方法中，指向父类的原型对象
*/

class A {
  static myMethod(msg) {
    console.log('static', msg)
  }
  myMethod(msg) {
    console.log('instance', msg)
  }
}

class B extends A {
  static myMethod(msg) {
    super.myMethod(msg)  // A.myMethod(msg)
  }
  myMethod(msg) {
    super.myMethod(msg)  // A.prototype.myMethod(msg)
  }
}

B.myMethod('Class B')
let b = new B()
b.myMethod('instance B')