let app = {
  arr: [],
  callback (ctx) {
    console.log(ctx)
  },
  
  use (fn) {
    this.arr.push(fn)
  },
  
  go (ctx) {
  let rev = this.arr.reverse().reduce((p,c) => {
    console.log('-----')
    return () => {
      console.log('+++++')
      return c(ctx, p)
      }
    }, () => { 
      console.log('init')
      return this.callback(ctx)
    })
  console.log(rev)
  rev()
  }
}

// 测试用例

app.use((ctx, next) => {
  ctx.name = 'Lucy'
  next()
})

app.use((ctx, next) => {
  ctx.age = 12
  next()
})

app.use((ctx, next) => {
  console.log(`${ctx.name} is ${ctx.age} years old.`) // => Lucy is 12 years old.
  next()
})

// ... 任意调用 use 插入中间件

app.go({})