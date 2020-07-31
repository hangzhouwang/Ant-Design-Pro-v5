import { request } from 'umi';

// 登录参数
export interface LoginParamsType {
  username?: string;
  password?: string;
  phone?: string;
  captcha?: string;
  type?: 'account' | 'phone' | 'weixin' | 'dingding';
}

//  登录
export async function fakeAccountLogin(params: LoginParamsType) {
  return request<API.LoginStateType>('/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function outLogin() {
  return request('/api/login/outLogin');
}
