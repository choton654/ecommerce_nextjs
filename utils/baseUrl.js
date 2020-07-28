const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://e-commerce-nextjs.now.sh'
    : 'http://localhost:3000';

export default baseUrl;
