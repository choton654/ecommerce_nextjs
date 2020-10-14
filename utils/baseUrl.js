const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://ecommerce-nextjs-theta.vercel.app"
    : "http://localhost:3000";

export default baseUrl;
