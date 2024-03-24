import axios from "axios";
import qs from "qs";
import { refreshToken } from '@/api/api'
import router from '@/router'; // 引入Vue Router
const baseURL = import.meta.env.VITE_APP_BASE_API;
const requests = axios.create({
	timeout: 40 * 1000,
	paramsSerializer: (params) => qs.stringify(params, { indices: false }),
});

requests.defaults.headers.common['Content-Type'] = 'application/json;charset=utf-8';

requests.interceptors.request.use((config) => {
	config.headers = config.headers || {};
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = "Bearer " + token;
	}
	return config;
}, error => {
	return Promise.reject(error);
});

let isRefreshing = false;
let requestQueue = [];
// 为了防止多次刷新token，通过一个变量isRefreshing 去控制是否在刷新token的状态
// 当第二个过期的请求进来，token正在刷新，我们先将这个请求存到一个数组队列中,当刷新请求的接口返回来后，我们再调用resolve，逐个重试

requests.interceptors.response.use(
	response => {
		if (response.data.code == 10101 || response.data.code == 10102) {
			if (!isRefreshing) {
				isRefreshing = true;
				return refreshToken({ refreshToken: localStorage.getItem('refreshToken'), token: localStorage.getItem('token') }).then(res => {
					if (res.data.code == 10101 || res.data.code == 10102) {
						localStorage.removeItem('token');
						router.push('/register');
						return Promise.reject("refreshToken也过期了");
					}
					let { token } = res.data.result;
					token && localStorage.setItem('token', token);
					response.headers.Authorization = `Bearer ${token}`;
					requestQueue.forEach((cb) => cb(token));
					requestQueue = [];
					return requests(response.config);
				}).catch(err => {
					localStorage.removeItem('token');
					router.push('/register');
					return Promise.reject(err);
				}).finally(() => {
					isRefreshing = false;
				});
			} else {
				return new Promise(resolve => {
					requestQueue.push(token => {
						response.headers.Authorization = `Bearer ${token}`;
						resolve(requests(response.config));
					});
				});
			}
		}
		return response;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default requests;
