import cookie from 'js-cookie';
import Router from 'next/router';

export function handelLogin(token) {
  cookie.set('token', token);
  Router.push('/account');
}
