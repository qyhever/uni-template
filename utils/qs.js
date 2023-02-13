export function parse (str) {
    if (!str) {
        return {}
    }
    const ret = {}
    // k=v&k=v -> [k=v, k=v]
    str.split('&').forEach(item => {
        const kv = item.split('=') // [k, v]
        ret[kv[0]] = kv[1]
    })
    return ret
}

export function stringify (obj) {
    if (!obj) {
        return ''
    }
    // {k: v} -> ['k=v']
    const kvs = Object.keys(obj).map(key => {
        return key + '=' + obj[key]
    })
    return kvs.join('&')
}

export default {
    parse,
    stringify
}