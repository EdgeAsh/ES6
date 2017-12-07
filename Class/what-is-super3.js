/**
* ES6 规定，通过super调用父类的方法时，方法内部的this指向子类
*/

class A {
  constructor() {
    this.x = 'A'
  }
  p() {
    console.log(this.x)
  }
}

class B extends A {
  constructor() {
    super()
    this.x = 'B'
    super.p() // super.p.call(this)
  }
}

new B()
