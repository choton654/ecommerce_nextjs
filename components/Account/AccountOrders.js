import { useRouter } from 'next/router';
import {
  Accordion,
  Button,
  Header,
  Icon,
  Image,
  Label,
  List,
  Segment,
} from 'semantic-ui-react';
import { formatedDate } from '../../utils/formatDate';
function AccountOrders({ orders }) {
  const router = useRouter();

  const mapOrdersToPanels = (orders) => {
    return orders.map((order) => ({
      key: order._id,
      title: {
        content: <Label color='blue' content={formatedDate(order.createdAt)} />,
      },
      content: {
        content: (
          <>
            <List.Header as='h3'>
              Total: ${order.total}
              <Label
                content={order.email}
                icon='mail'
                basic
                horizontal
                style={{ marginLeft: '1em' }}
              />
            </List.Header>
            <List>
              {order.products.map((p) => (
                <List.Item key={p._id}>
                  <Image avatar src={p.product.mediaUrl} />
                  <List.Content>
                    <List.Header>{p.product.name}</List.Header>
                    <List.Description>
                      {p.quantity} x ${p.product.price}
                    </List.Description>
                  </List.Content>
                  <List.Content floated='right'>
                    <Label tag color='red' size='tiny'>
                      {p.product.sku}
                    </Label>
                  </List.Content>
                </List.Item>
              ))}
            </List>
          </>
        ),
      },
    }));
  };

  return (
    <>
      <Header as='h2'>
        <Icon name='folder open' />
        Order history
      </Header>
      {orders.length === 0 ? (
        <Segment inverted tertiary color='grey' textAlign='center'>
          <Header icon>
            <Icon name='copy outline' />
            No past orders.
          </Header>
          <div>
            <Button onClick={() => router.push('/')}>View Products</Button>
          </div>
        </Segment>
      ) : (
        <Accordion
          fluid
          styled
          exclusive={false}
          panels={mapOrdersToPanels(orders)}
        />
      )}
    </>
  );
}

export default AccountOrders;
