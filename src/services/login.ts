import { request } from 'umi';

// 登录参数
export interface LoginParamsType {
  username?: string;
  password?: string;
  phone?: string;
  captcha?: string;
  type?: string;
}

//  登录
export async function fakeAccountLogin(params: LoginParamsType) {
  return request<API.LoginStateType>('/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function getSystemInfo() {
  return request<API.SystemInfoType>('/system/info');
}

export async function logout() {
  return request('/logout');
}
