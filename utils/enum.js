/**
 * 格式化枚举值
 * @param {Array} list 枚举值数组
 * @returns {Object} EnumAndArray {obj: {}, arr: []}
 */
function setEnumAndArray (list) {
  const obj = {}
  const arr = []
  list.forEach(item => {
    if (typeof item === 'object') {
      const label = item.v
      const value = item.k
      arr.push({ label, value })
      obj[value] = label
    }
  })
  return {
    obj,
    arr
  }
}

export const enumTraffic = setEnumAndArray([
  { k: '1', v: '飞机' },
  { k: '2', v: '火车' },
  { k: '3', v: '客车' },
  { k: '4', v: '自驾' },
  { k: '5', v: '其它' }
])

export const enumLive = setEnumAndArray([
  { k: '1', v: '宾馆饭店' },
  { k: '2', v: '回家' },
  { k: '3', v: '借住' },
  { k: '4', v: '其它' }
])
