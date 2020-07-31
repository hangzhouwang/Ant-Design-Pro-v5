import { Helmet, HelmetProvider } from 'react-helmet-async';
import { message } from 'antd';
import React, { useState } from 'react';
import { useModel } from 'umi';
import { getPageQuery } from '@/utils/utils';
import ParticlesBg from 'particles-bg';
import { LoginParamsType, fakeAccountLogin } from '@/services/login';
import LocalStore from '@/utils/store';

import LoginForm from './components/LoginForm';
import './index.less';

/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const replaceGoto = () => {
  const urlParams = new URL(window.location.href);
  const params = getPageQuery();
  let { redirect } = params as { redirect: string };
  if (redirect) {
    const redirectUrlParams = new URL(redirect);
    if (redirectUrlParams.origin === urlParams.origin) {
      redirect = redirect.substr(urlParams.origin.length);
      if (redirect.match(/^\/.*#/)) {
        redirect = redirect.substr(redirect.indexOf('#'));
      }
    } else {
      window.location.href = '/';
      return;
    }
  }
  window.location.href = urlParams.href.split(urlParams.pathname)[0] + (redirect || '/');
};

const Login: React.FC<{}> = () => {
  const [submitting, setSubmitting] = useState(false);

  const { refresh, initialState } = useModel('@@initialState');

  const title = initialState?.settings?.title;

  const handleSubmit = async (values: LoginParamsType) => {
    setSubmitting(true);
    try {
      // 登录
      const response = await fakeAccountLogin({ ...values, type: 'account' });
      if (response.status === 'ok') {
        message.success('登录成功！');
        // 记录token
        LocalStore.set('token', response.data.token);
        replaceGoto();
        setTimeout(() => {
          refresh();
        }, 500);
        return;
      }
      message.error(response.message);
    } catch (error) {
      message.error('登录失败，请重试！');
    }
    setSubmitting(false);
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>欢迎登录{title}后台管理系统</title>
      </Helmet>
      <ParticlesBg type="lines" />
      <div className="container">
        <div className="loginContainer">
          <h2>{title}</h2>
          <LoginForm handleSubmit={handleSubmit} submitting={submitting} />
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Login;
