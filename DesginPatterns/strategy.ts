type FilterFunc<T> = (item: T) => boolean

type MyFilter = <T>(myArr: Array<T>, filterFunc: FilterFunc<T>) => Array<T>

const myFilter: MyFilter = (myArr, filterFunc) => {
  let result: typeof myArr = []
  for (let i = 0; i < myArr.length; i++) {
    if (filterFunc(myArr[i])) {
      result.push(myArr[i])
    }
  }
  return result
}

const myArr = [
  {
    id: 1,
    name: 'quocthihnh',
    age: 24
  },
  {
    id: 2,
    name: 'xuan truc',
    age: 21
  },
  {
    id: 3,
    name: 'quocbao',
    age: 14
  }
]

console.log(
  myFilter(myArr, item => {
    if (item.age > 20) return true
    return false
  })
)
