/*
 * @Author: lixiaoyun
 * @Company: http://hangzhou.com.cn
 * @Github: http://github.com/siaoynli
 * @Date: 2020-07-31 15:45:38
 * @LastEditors: lixiaoyun
 * @LastEditTime: 2020-07-31 15:55:07
 * @Description:
 */

import { request } from 'umi';
import { TableListParams } from './data';

export async function queryAdmins(params?: TableListParams) {
  console.log('params:', params);
  return request('/admins/index', {
    params,
  });
}
