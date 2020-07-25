import axios from 'axios';
import App from 'next/app';
import Router from 'next/router';
import { parseCookies } from 'nookies';
import Layout from '../components/_App/Layout';
import { redirectUser } from '../utils/auth';
import baseUrl from '../utils/baseUrl';
class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const { token } = parseCookies(ctx);

    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    if (!token) {
      const protectRoute =
        ctx.pathname === '/account' || ctx.pathname === '/create';
      if (protectRoute) {
        redirectUser(ctx, '/login');
      }
    } else {
      try {
        const payload = { headers: { Authorization: token } };
        const url = `${baseUrl}/api/account`;
        const { data } = await axios.get(url, payload);
        const user = data;
        const isRoot = user.role === 'root';
        const isAdmin = user.role === 'admin';
        // if authenticated but role is not root or admin redirect from '/create' page
        const isNotPermited =
          !(isRoot || isAdmin) && ctx.pathname === '/create';
        if (isNotPermited) {
          redirectUser(ctx, '/');
        }
        pageProps.user = user;
      } catch (error) {
        console.error('Error getting current error', error);

        // throw out invalid token
        destroyCookie(ctx, token);

        // redirect to login
        redirectUser(ctx, '/login');
      }
    }

    return { pageProps };
  }

  componentDidMount() {
    window.addEventListener('storage', (e) => {
      if (e.key === 'logout') {
        console.log('logout from storage');
        Router.push('/login');
      }
    });
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    );
  }
}

export default MyApp;
