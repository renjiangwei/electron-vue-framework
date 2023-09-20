import axios, { AxiosRequestConfig } from 'axios'
import Storage from './Storage'
import { ACCESS_TOKEN_KEY } from '@/enums/cacheEnum'
import qs from 'qs'
const instance = axios.create({
  baseURL: '',
  timeout: 12000,
})

const baseURL = import.meta.env.VITE_BASE_API
const baseMockURL = import.meta.env.VITE_MOCK_API

const UNKNOWN_ERROR = '未知错误'
type RequestOptions = {
  isGetDataDirectly?: boolean,
  isMock?: boolean,
  // successMsg?: string,
  // errorMsg?: string,
}

instance.interceptors.request.use((config) => {
  const token = Storage.get(ACCESS_TOKEN_KEY);
  if (token && config.headers) {
    // 请求头token信息，请根据实际情况进行修改
    config.headers['Authorization'] = token;
  }

  // 针对get请求进行qs处理
  if (config.method === 'get' || config.method === 'GET') {
    if (config.params) {
      config.params = qs.stringify(config.params, { arrayFormat: 'indices', allowDots: true });
      config.params = decodeURI(config.params);
      const result: {[key:string]: string} = {};
      config.params.split('&').forEach((item: string) => {
        if (!item) return;
        let s = item.split('=');
        result[s[0]] = s[1].replace(/%2C/g, ',');
      });
      config.params = result;
    }
  }
  return config;
})

instance.interceptors.response.use((response) => {
  const res = response.data;
  if (res.code >= 200 && res.code < 300) {
    return res
  }
  if (res.code === 401) {
    Storage.clear();
    Storage.removeCookie('token');
    return Promise.reject(new Error('权限过期'))
  }
  return Promise.reject(new Error(res.data || UNKNOWN_ERROR))
},
(error) => {
  // 处理 422 或者 500 的错误异常提示
  const errMsg = error?.response?.data?.message ?? UNKNOWN_ERROR;
  error.message = errMsg;
  return Promise.reject(error);
},)



export const request = async <T = any>(
  config: AxiosRequestConfig,
  options: RequestOptions = {}
): Promise<T> => {
  try {
    const { isGetDataDirectly = true, isMock } = options
    console.log(baseURL, 'base', import.meta.env)
    config.baseURL ??= isMock ? baseMockURL : baseURL
    const res = await instance.request(config)
    return isGetDataDirectly ? res.data : res
  } catch (error) {
    return Promise.reject(error)
  }
}