import dayjs from './dayjs.min'

export function formatDate (val) {
    return dayjs(val || new Date()).format('YYYY-MM-DD')
}

export function formatDateTime (val) {
    return dayjs(val || new Date()).format('YYYY-MM-DD HH:mm:ss')
}
