/*
* yield表达式本身没有返回值，或者返回undefined.
* next方法可以带一个参数，该参数就会被当作上一个yield表达式的返回值
*/

function* f() {
  for(let i=0; true; i++) {
    let reset = yield i;
    if(reset) {i = -1;}
  }
}

const g = f();

let r1 = g.next()
let r2 = g.next()
let r3 = g.next(true)
console.log(r1,r2,r3)
