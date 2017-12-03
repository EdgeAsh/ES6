// ES6的继承机制，好新啊。跟java很像
class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  toString() {
    return 'x: ' + this.x + ' y: ' + this.y + ' circle-point'
  }
}

class ColorPoint extends Point {
 constructor(x, y, color) {
   /*
   * 调用父类的constructor(x,y)
   * --------------------------------------------------------------------------
   * ES6继承机制
   * 子类没有自己的this对象，而是继承父类的this对象，然后对其进行加工
   * 只有调用了super方法才能返回父类实例，才能使用this
   */
   // ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor
   // this.color = color // 报上面的错
   let fa = super(x,y)
   console.log(fa,'是父类，什么样？') //ColorPoint { x: 1, y: 2 } '是父类，什么样？'
   this.color = color
   console.log(fa,'是父类，什么样？') //ColorPoint { x: 1, y: 2, color: 'red'} '是父类，什么样？'
 }

 toString() {
   return this.color + ' --- ' + super.toString();
 }
}

const instance = new ColorPoint(1, 2, 'red')

console.log(instance.toString())
