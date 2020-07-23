import App from 'next/app';
import Layout from '../components/_App/Layout';
class MyApp extends App {
<<<<<<< HEAD
  render() {
    const { Component } = this.props;
    return (
      <Layout>
        <Component />
=======
  static async getInitialProps({ Component, ctx }) {
    let pageProps;

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Layout>
        <Component {...pageProps} />
>>>>>>> 7dd85a6... make productlist component
      </Layout>
    );
  }
}

export default MyApp;
