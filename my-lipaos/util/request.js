import { toast, clearStorageSync, getStorageSync, useRouter } from './utils'
import { BASE_URL } from '@/config/config.js'
import RequestManager from './requestManager.js'

let cookie=null

const manager = new RequestManager()

const baseRequest = async (url, method, data = {}, loading = true) => {
	let requestId = manager.generateId(method, url, data)
	if (!requestId) {
		console.log('重复请求')
	}
	if (!requestId) return false;

	const header = {}
	header.token = getStorageSync('token') || ''


	return new Promise((resolve, reject) => {
			uni.request({
				url: BASE_URL + url,
				method: method || 'GET',
				header: {...header,"Cookie": cookie},
				timeout: 10000,
				data: data || {},
				withCredentials: true, // 允许携带 Cookie
				complete: () => {
					manager.deleteById(requestId)
				},
				success: (successData) => {
					
					
					if(url=="/user/login")
					{
						
						cookie=successData.cookies[0]?successData.cookies[0]:null
					}
					 
					 
					 
					const res = successData.data
					if(res.code==0)
					{
							resolve(res)
							
					}
					else{
						toast('网络连接失败，请稍后重试')
						reject(res)
					}
					
				
				
				},
				fail: (msg) => {
					toast('网络连接失败，请稍后重试')
					reject(msg)
				}
			})
		})
	
}


const request = {};

['options', 'get', 'post', 'put', 'head', 'delete', 'trace', 'connect'].forEach((method) => {
	request[method] = (api, data, loading) => baseRequest(api, method, data, loading)
})



export default request