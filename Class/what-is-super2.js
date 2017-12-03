/*
* super作为对象时的情况
* 在普通方法中，指向父类的原型对象；在静态方法中，指向父类
* 构造函数也是普通函数
*/

class A {
  f() {
    return 2
  }
}

class B extends A {
  constructor() {
    super()
    console.log(super.f()) // A.prototype.f()
    console.log(super.f === A.f , super.f === A.prototype.f) // 我不知道这么比是否有问题，比较怀疑
  }
}

let b = new B()
