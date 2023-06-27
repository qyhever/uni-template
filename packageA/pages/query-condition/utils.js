import dayjs from '@/utils/dayjs.min.js'

function getShortcutDate (val) {
    const today = dayjs().format('YYYY-MM-DD')
    if (val === 'today') {
        return [today, today]
    }
    if (val === 'yesterday') {
        const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
        return [yesterday, yesterday]
    }
    if (val === 'currentWeek') {
        const startDate = dayjs().startOf('week').add(1, 'day').format('YYYY-MM-DD')
        return [startDate, today]
    }
    if (val === 'currentMonth') {
        const startDate = dayjs().startOf('month').format('YYYY-MM-DD')
        return [startDate, today]
    }
    if (val === 'latestWeek') {
        const startDate = dayjs().subtract(6, 'day').format('YYYY-MM-DD')
        return [startDate, today]
    }
    if (val === 'latestMonth') {
        const startDate = dayjs().subtract(1, 'month').format('YYYY-MM-DD')
        return [startDate, today]
    }
    if (val === 'latestThreeMonth') {
        const startDate = dayjs().subtract(3, 'month').format('YYYY-MM-DD')
        return [startDate, today]
    }
    if (val === 'latestYear') {
        const startDate = dayjs().subtract(1, 'year').format('YYYY-MM-DD')
        return [startDate, today]
    }
    return [today, today]
}

export {
    getShortcutDate
}