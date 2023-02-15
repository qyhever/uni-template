import request from '@/utils/request'
let isDevtool = false
const {
    platform
} = wx.getSystemInfoSync()
if (platform && /(windows|devtools)/i.test(platform)) {
    isDevtool = true
}

function getURL (str) {
    if (isDevtool) {
        return 'http://localhost:3023/' + str
    }
    return 'https://qinyhquery.gitee.io/static/region/' + str + '.json'
}
export function getProvinceList () {
    return request({
        method: 'get',
        url: getURL('province'),
        originalData: true,
        params: {}
    })
}

export function getCityList (params) {
    return request({
        method: 'get',
        url: getURL('city'),
        originalData: true,
        params
    }).then(res => {
        return res[params.code]
    })
}

export function getCountyList (params) {
    return request({
        method: 'get',
        url: getURL('county'),
        originalData: true,
        params
    }).then(res => {
        return res[params.code]
    })
}

export function getTownList (params) {
    return request({
        method: 'get',
        url: getURL('town'),
        originalData: true,
        params
    }).then(res => {
        return res[params.code]
    })
}

export function getOrderList (params) {
    return request({
        method: 'get',
        url: '/orders',
        params
    })
}
