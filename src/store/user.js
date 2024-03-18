import { defineStore } from 'pinia'
import { sendEmailCode as sendEmailCodeAPI, register as registerAPI, login as loginAPI } from '@/api/api.js'
import { reactive } from 'vue'


export const useUserStore = defineStore('users', () => {
  const user = reactive({})
  const sendEmailCode = async (email) => {
    const result = await sendEmailCodeAPI(email)
    if (result.data.code === 0) {
      user.codeExpire = result.data.result.expireTime
    }
    return result
  }
  const login = async (email, password) => {
    const result = await loginAPI({ email, password })
    console.log("loginSTore", result);
    if (result.data.code === 0) {
      localStorage.setItem('token', result.data.result.token)
      localStorage.setItem('refreshToken', result.data.result.refreshToken)
      Object.assign(user, result.data.result)
    }
    return result.data
  }
  const register = async (user_name, email, password, code, is_admin) => {
    const result = await registerAPI({ user_name, email, password, code, is_admin })
    console.log("registerSTore", result);
    return result.data
  }
  return { user, sendEmailCode, login, register }
}, {
  persist: {
    key: 'storekey',
    storage: window.localStorage,
    paths: ['user'],
  }
})

