import qs from './qs'
import { baseURL } from '@/config/index.js'

// 默认配置
const defaultConfig = {
  baseURL,
  timeout: 20000
}

const codeMessage = {
  400: '请求错误',
  401: '未授权',
  403: '禁止访问',
  404: '请求地址不存在',
  500: '服务器繁忙',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时'
}

const genEmptyPromise = () => new Promise(() => {})

let count = 0

function startLoading () {
    count++
    uni.showLoading({
    	title: '加载中...',
        mask: true
    })
}

function endLoading () {
    count--
      // count 为 0，即为所有请求发送完毕
      count === 0 && uni.hideLoading()
      if (count < 0) {
        count = 0
      }
}

// 请求之前
function requestStart(config, loadingCb, loading) {
  loadingCb(true)
  if (loading) {
    startLoading()
  }
  config.header = config.header || {}
  // 添加请求头
  config.header['X-Requested-With'] = 'XMLHttpRequest'
}

// 响应正常
function requestThenEnd({response, resolve, reject, originalData, loadingCb, showWarning, warningMsg, throwWarningError, showError, errorMsg, throwHttpError}) {
  loadingCb(false)
  endLoading()
  const responseData = response.data
  if (originalData) {
      resolve(responseData)
      return
  }
  // http success
  if (response.statusCode === 200) {
    if (responseData.success) { // success code
      resolve(responseData.data)
      return
    }
    // not success code
    if (showWarning) {
      uni.showModal({
        content: warningMsg || responseData.msg || '操作失败',
        showCancel: false,
        confirmText: '我知道了'
      })
    }
    console.log('业务报错', responseData)
    // 抛出业务错误
    if (throwWarningError) {
      const err = new Error('warning')
      err.name = 'warning'
      err.response = responseData
      reject(err)
      return
    }
    resolve( genEmptyPromise() )
    return
  }
  // http fail
  if (showError) {
    const msg = getErrorMsg(response.statusCode, errorMsg)
    uni.showModal({
      content: msg,
      showCancel: false,
      confirmText: '我知道了'
    })
  }
  console.log('http报错', responseData)
  if (throwHttpError) {
    const err = new Error('err')
    err.name = 'err'
    err.response = responseData
    reject(err)
    return
  }
  resolve( genEmptyPromise() )
}

// 响应异常
function requestCatchEnd({error, resolve, reject, loadingCb, showError, throwHttpError}) {
  loadingCb(false)
  endLoading()
  // 超时或断网
  let msg = ''
  if (error.errMsg.indexOf('timeout') >= 0) {
    msg = '请求超时！请检查网络是否正常'
  } else {
    msg = '网络错误，请检查网络是否已连接！'
  }
  if (showError && msg) {
    uni.showModal({
      content: msg,
      showCancel: false,
      confirmText: '我知道了'
    })
  }
  // 抛出http错误
  if (throwHttpError) {
    const err = new Error('network fail')
    err.name = 'network fail'
    reject(err)
    return
  }
  resolve( genEmptyPromise() )
}

/**
 * 发起异步请求
 * @param {Object} options 请求配置参数
 * @param {Boolean} [options.originalData=false] 是否返回源数据
 * @param {Boolean} [options.showWarning=true] 是否显示业务错误提示（请求成功，但业务状态码非成功状态）
 * @param {Boolean} [options.showError=true] 是否显示http错误提示（http请求失败）
 * @param {Boolean} [options.loading=true] 是否显示 loading
 * @param {Function} [options.loadingCb=()=>{}] loading 状态回调
 * @param {Boolean} [options.throwWarningError=false] 是否抛出业务逻辑错误（请求成功，但业务状态码非成功状态）
 * @param {Boolean} [options.throwHttpError=false] 是否显示http错误（http请求失败）
 * @param {String} [options.warningMsg=''] 业务错误提示
 * @param {String} [options.errorMsg=''] http错误提示
 * @return {Promise} Promise
 */
function request(options = {}) {
  const {
    originalData = false,
    showWarning = true,
    showError = true,
    loading = true,
    loadingCb = () => {},
    throwWarningError = false,
    throwHttpError = false,
    warningMsg = '',
    errorMsg = '',
    ...restOptions
  } = options
  const opts = normalizeOptions(restOptions)
  requestStart(opts, loadingCb, loading)
  return new Promise((resolve, reject) => {
    opts.success = response => {
      requestThenEnd({response, resolve, reject, originalData, loadingCb, showWarning, warningMsg, throwWarningError, showError, errorMsg, throwHttpError})
    }
    opts.fail = error => {
      requestCatchEnd({error, resolve, reject, loadingCb, showError, errorMsg, throwHttpError})
    }
    const requestTask = uni.request(opts)
    if (opts.cancel) {
      opts.cancel(requestTask)
    }
  })
}

export default request

function get(url, params = {}, options = {}) {
	const result = {
		method: 'get',
		url,
		params,
		...options
	}
	return request(result)
}

function post(url, data = {}, options = {}) {
	const result = {
		method: 'post',
		url,
		data: data || {},
		...options
	}
	return request(result)
}

function put(url, data = {}, options = {}) {
	const result = {
		method: 'put',
		url,
		data: data || {},
		...options
	}
	return request(result)
}

export {
	request,
	get,
	post
}

/**
 * 生成错误信息
 */
function getErrorMsg (statusCode, errorMsg) {
  let msg = ''
  if (errorMsg) {
    return errorMsg
  }
  if (statusCode) {
    return codeMessage[statusCode]
  }
  return msg
}

// 判断是否 http 路径开头
function isHttpURL(url) {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

// 处理参数，主要是处理 url 和 url 携带参数
function normalizeOptions(reqOpts = {}) {
  const {
      method = 'get',
      params = {},
        data = {},
      ...restReqOpts
    } = reqOpts
  const { baseURL, ...restDefaultConfig } = defaultConfig

  const opts = Object.assign({}, restReqOpts)
  opts.method = method.toUpperCase()
  // 识别到为绝对路径，添加上 baseURL
  if (!isHttpURL(opts.url)) {
    const separator = opts.url.indexOf('/') === 0 ? '' : '/'
    opts.url = baseURL + separator + opts.url
  }
  // urlParams
  const urlParams = {
    // default params
    t: new Date().getTime()
  }
  // 处理 url 自带的参数
  if (opts.url.indexOf('?') >= 0) {
    const group = opts.url.split('?')
    opts.url = group[0] // reset url
    Object.assign(
      urlParams,
      qs.parse( group[1] )
    )
  }
  if (method === 'get') {
  	Object.assign(
  		urlParams,
  		params,
  		data
  	)
  }
  if (method === 'post') {
  	Object.assign(
  		urlParams,
  		params
  	)
  }
	// 组装 路径和路径参数
  if (Object.keys(urlParams).length) {
    opts.url = opts.url + '?' + qs.stringify(urlParams)
  }
  return Object.assign({}, restDefaultConfig, opts, {
		data
	})
}
