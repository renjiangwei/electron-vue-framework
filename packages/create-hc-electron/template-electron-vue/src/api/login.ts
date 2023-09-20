import { request } from "@/utils/request";
import { AxiosResponse } from 'axios'

/**
 * @description 登录
 */

export const login = (data:API.LoginParams) => {
  return request<AxiosResponse<API.LoginResult>>({
    url: '/authorize/login',
    method: 'post',
    data
  }, {
    isGetDataDirectly: false
  })
}

/**
 * @description 获取用户信息
 */

export const getInfo = () => {
  return request<API.AuthorizationInfo>({
    url: '/authorize/me',
    method: 'get',
  });
}

/**
 * @description 获取验证码
 */

export function getImageCaptcha(params?: API.CaptchaParams) {
  return request<API.CaptchaResult>({
    url: '/captcha/',
    method: 'get',
    params,
  });
}


export function logout() {
  return request({
    url: '/authorize/logout',
    method: 'get',
  });
}