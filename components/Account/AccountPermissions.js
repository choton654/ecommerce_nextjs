import Axios from 'axios';
import cookie from 'js-cookie';
import { useEffect, useRef, useState } from 'react';
import { Checkbox, Header, Icon, Table } from 'semantic-ui-react';
import baseUrl from '../../utils/baseUrl';
import catchErrors from '../../utils/catchErrors';
import { formatedDate } from '../../utils/formatDate';

function AccountPermissions() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const url = `${baseUrl}/api/users`;
      const token = cookie.get('token');
      const headers = { headers: { Authorization: token } };
      const { data } = await Axios.get(url, headers);
      setUsers(data);
    } catch (error) {
      catchErrors(error, window.alert);
    }
  };

  return (
    <>
      <div style={{ margin: '2em 0' }}>
        <Header as='h2'>
          <Icon name='settings' />
          User Permissions
        </Header>
        <Table compact celled definition>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Joined</Table.HeaderCell>
              <Table.HeaderCell>Updated</Table.HeaderCell>
              <Table.HeaderCell>Role</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {users.map((user) => (
              <UserPermission key={user._id} user={user} />
            ))}
          </Table.Body>
        </Table>
      </div>
    </>
  );
}

function UserPermission({ user }) {
  const [admin, setAdmin] = useState(user.role === 'admin');

  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    console.log('role updated', admin);
    updatePermission();
  }, [admin]);

  const updatePermission = async () => {
    const url = `${baseUrl}/api/account`;
    const payload = { _id: user._id, role: admin ? 'admin' : 'user' };
    await Axios.put(url, payload);
  };

  return (
    <Table.Row>
      <Table.Cell collapsing>
        <Checkbox
          toggle
          checked={admin}
          onChange={() => setAdmin((prevState) => !prevState)}
        />
      </Table.Cell>
      <Table.Cell>{user.name}</Table.Cell>
      <Table.Cell>{user.email}</Table.Cell>
      <Table.Cell>{formatedDate(user.createdAt)}</Table.Cell>
      <Table.Cell>{formatedDate(user.updatedAt)}</Table.Cell>
      <Table.Cell>{admin ? 'admin' : 'user'}</Table.Cell>
    </Table.Row>
  );
}

export default AccountPermissions;
