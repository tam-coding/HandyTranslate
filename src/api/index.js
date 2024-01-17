import axios from "axios";
import qs from "qs";

const baseURL=import.meta.env.VITE_APP_BASE_API
// import.meta.env.VITE_APP_API_URL
const requests = axios.create({
	// baseURL: "https://fanyi-api.baidu.com",
	timeout: 20*1000,
	headers: {
		"Content-type": "application/json;charset=utf-8",
	},

	paramsSerializer: (params) => qs.stringify(params, { indices: false }),
})


requests.interceptors.request.use((config) => {
	config.headers = config.headers || {} 
	// if (localStorage.getItem("token")) {
	// 	config.headers.token = localStorage.getItem("token") || ""
	// }
	return config
}, error => {
	return Promise.reject(error)
})

requests.interceptors.response.use((res) => {
	// const code = res.data.code ?? 1
	// if (code !== 0) {
	// 	return Promise.reject(res)
	// } else {
	// 	return Promise.resolve(res)
	// }
	return Promise.resolve(res)
}, (err) => {
	return Promise.reject(err)
})
export default requests