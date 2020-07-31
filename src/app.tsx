import React from 'react';
import { BasicLayoutProps, Settings as LayoutSettings } from '@ant-design/pro-layout';
import { notification } from 'antd';
import { history, RequestConfig, useIntl, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer/index';
import { ResponseError } from 'umi-request';
import { queryCurrent } from './services/user';
import defaultSettings from '../config/defaultSettings';
import logo from './assets/logo.png';
import LocalStore from './utils/store';
import { getSystemInfo } from './services/login';
import { removeAuth } from './utils/utils';

// 初始化全局数据 比如从后台获取系统名称，当前用户信息
export async function getInitialState(): Promise<{
  currentUser?: API.CurrentUser;
  settings?: LayoutSettings;
}> {
  let appName = LocalStore.getToJson('app');
  if (!appName) {
    try {
      const result = await getSystemInfo();
      if (result.status === 'ok') {
        LocalStore.set('app', result.data);
        appName = result.data;
      }
    } catch (error) {
      notification.error({
        message: `请求错误`,
        description: `getSystemInfo方法请求错误，请联系管理员`,
      });
    }
  }

  const settings = { ...defaultSettings, title: appName.site_name };

  // 如果不是登录页面，获取用户信息
  if (history.location.pathname !== '/login') {
    try {
      // 返回当前登录用户的信息 和 菜单权限
      const resp = await queryCurrent();
      let currentUser;
      if (resp.status === 'ok') {
        currentUser = resp.data;
      }

      return {
        currentUser,
        settings,
      };
    } catch (error) {
      history.push('/login');
    }
  }
  return {
    settings,
  };
}

export const layout = ({
  initialState,
}: {
  initialState: { settings?: LayoutSettings; currentUser?: API.CurrentUser };
}): BasicLayoutProps => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      // 判断有没有登录，没有登录，销毁token 重定向到 login
      if (!initialState?.currentUser?.id && history.location.pathname !== '/login') {
        removeAuth();
        history.push('/login');
      }
    },

    logo: () => {
      return <img src={logo} alt="" />;
    },
    // 添加首页
    breadcrumbRender: (routers = []) => [
      {
        path: '/',
        breadcrumbName: useIntl().formatMessage({
          id: 'menu.home',
        }),
      },
      ...routers,
    ],
    // 过滤掉一级导航菜单
    itemRender: (route, params, routes, paths) => {
      const first = routes.indexOf(route) === 0;
      return first ? (
        <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
      ) : (
        <span>{route.breadcrumbName}</span>
      );
    },
    menuHeaderRender: undefined,
    // 禁用移动端
    disableMobile: false,
    // 菜单https://procomponents.ant.design/layout/menu
    // menuDataRender:()=> menuData
    ...initialState?.settings,
  };
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: ResponseError) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    console.log('status:', status);

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  }

  if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  throw error;
};
const token = LocalStore.get('token');

export const request: RequestConfig = {
  errorHandler,
  credentials: 'include', // 默认请求是否带上cookie
  prefix: '/api/v1',
  timeout: 1000, // 超时
  headers: {
    Authorization: `Bearer ${token}`,
  },
};
