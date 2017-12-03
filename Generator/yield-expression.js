/*
* 这个例子我不知道要干嘛，只是深度遍历。这只是一种应用场景吧，我还不太理解
* 联系for-of.js看
* ----------------------------------------------------------
* yield表达式不是需要next方法才能驱动吗 ？
* 这个例子里没有使用next方法呀！这就是这里例子存在的意义
* ----------------------------------------------------------
* 还有yield*表达式的使用
* 并且yield*可以调用其所在的函数，这也挺奇怪的。
*/
const arr = [1, [[2, 3], 4], [5, 6]];

const flat = function* (a) {
  let len = a.length
  for (let i=0; i< len; i++) {
    let item = a[i];
    if(typeof item !== 'number') {
      yield* flat(item);
    } else {
      yield item;
    }
  }
}

// 这个f应该是Generator函数返回的遍历器对象啊，log(f)的时候居然是数字！这是怎么回事
//
for (let f of flat(arr)) {
  console.log(f)
}
// 1，2，3，4，5，6
