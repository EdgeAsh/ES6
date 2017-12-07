/*
* 中间件模式，广泛应用在Express,Koa,Reduc等类库中
*
* 中间件就是在调用目标函数之前，你可以随意插入其他函数预先对数据进行处理、过滤，
* 在这个过程里面你可以打印数据、或者停止往下执行中间件等
* -----------------------------------------------------------------------------
* 这里面应该会牵扯到比较有趣的东西，属于以前见过的但就是吃不透的那种
*   肯定会牵扯到执行上下文和this!!!
* ----- 打脸了
*
* -------------------------------
* 过程就是将中间件函数存起来，等到执行回调函数前挨个执行中间件函数
*/

const app = {
  arr: [],
  callback(ctx) {
    console.log(ctx)
  },
  use(fn) {
    this.arr.push(fn)
  },
  go(ctx) {
    /*
     * 屌丝版
    let m = 0
    const next = () => {m++}
    for(let i = 0; i === m; i++) {
      let fun = this.arr[i]
      fun && fun(ctx, next)
    }
    m === this.arr.length && this.callback(ctx)
    */

    // 高富帅版
    let redu = this.arr.reverse().reduce(function(p,c,ci,arr1) {
      return () => c(ctx,p)
    },() => {this.callback(ctx)})
    // reduce返回值是,最后一次调用回调函数获得的累积结果
    reduc()
  }
}

/*
// reduce的例子

 let array = [1,2,3,4,5]

 array.reduce((p,c,ci,arr) => {
   console.log(p)
   console.log(c)
   console.log(ci)
   console.log(arr)
   return c 
 }, 'initialVal')

*/
