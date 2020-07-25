import Axios from 'axios';
import { parseCookies } from 'nookies';
import AccountHeader from '../components/Account/AccountHeader';
import AccountOrders from '../components/Account/AccountOrders';
import baseUrl from '../utils/baseUrl';

function Account({ users, orders }) {
  return (
    <>
      <AccountHeader {...users} />
      <AccountOrders orders={orders} />
    </>
  );
}

Account.getInitialProps = async (ctx) => {
  const { token } = parseCookies(ctx);
  if (!token) {
    return { orders: [] };
  }
  const payload = { headers: { Authorization: token } };
  const url = `${baseUrl}/api/orders`;
  const { data } = await Axios.get(url, payload);
  return data;
};

export default Account;
