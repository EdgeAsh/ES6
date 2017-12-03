// 使用Generator，for...of实现菲波那切数列
function* fibonacci() {
  let [prev, curr] = [0, 1]
  for(;;) {
    [prev, curr] = [curr, prev + curr]
    yield curr
  }
}
// Generator函数会返回对象哦。好好想想，for...of怎么实现？
for(let n of fibonacci()) {
  if(n > 1000) break;
  console.log(n)
}
