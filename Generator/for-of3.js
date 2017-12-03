/*
* 使用Generator函数为JS对象添加Iterator接口
* 给原生不支持for-of遍历的JS对象实现for-of遍历
*/
let jane = {first: 'Jane', last: 'Doe'}

// 实现1
// function* objectEntries(obj) {
//   // Reflect是怎么一回事？我还不知道呢
//   let propKeys = Reflect.ownKeys(obj);

//   for(let propKey of propKeys) {
//     yield [propKey, obj[propKey]]
//   }
// }
// for(let [key, value] of objectEntries(jane)) {
//   console.log(`${key}: ${value}`)
// }


// 实现2
jane[Symbol.iterator] = function* () {
  let propKeys = Object.keys(this);

  for(let propKey of propKeys) {
    yield [propKey, this[propKey]]
  }
}
for(let [key, value] of jane) {
  console.log(`${key}: ${value}`)
}