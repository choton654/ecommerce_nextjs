import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import nProgress from 'nprogress';
import { Container, Icon, Image, Menu } from 'semantic-ui-react';

Router.events.on('routeChangeStart', () => nProgress.start());
Router.events.on('routeChangeComplete', () => nProgress.done());
Router.events.on('routeChangeError', () => nProgress.done());

function Header() {
  const user = true;
  const router = useRouter();

  function isActive(route) {
    return route === router.pathname;
  }

  return (
    <Menu stackable fluid inverted id='menu'>
      <Container>
        <Link href='/'>
          <Menu.Item header active={isActive('/')}>
            <Image
              size='mini'
              src='/static/logo.svg'
              style={{ marginRight: '1em' }}
            />
            Ecommerce
          </Menu.Item>
        </Link>
        <Link href='/cart'>
          <Menu.Item header active={isActive('/cart')}>
            <Icon name='cart' size='large' />
            cart
          </Menu.Item>
        </Link>
        {user && (
          <Link href='/create'>
            <Menu.Item header active={isActive('/create')}>
              <Icon name='add square' size='large' />
              create
            </Menu.Item>
          </Link>
        )}
        {user ? (
          <>
            <Link href='/account'>
              <Menu.Item header active={isActive('/account')}>
                <Icon name='user' size='large' />
                account
              </Menu.Item>
            </Link>
            <Menu.Item header>
              <Icon name='sign out' size='large' />
              logout
            </Menu.Item>
          </>
        ) : (
          <>
            <Link href='/login'>
              <Menu.Item header active={isActive('/login')}>
                <Icon name='sign in' size='large' />
                signin
              </Menu.Item>
            </Link>
            <Link href='/signup'>
              <Menu.Item header active={isActive('/signup')}>
                <Icon name='signup' size='large' />
                signup
              </Menu.Item>
            </Link>
          </>
        )}
      </Container>
    </Menu>
  );
}

export default Header;
