import Axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button, Header, Modal } from 'semantic-ui-react';
import baseUrl from '../../utils/baseUrl';
function ProductAttributes({ description, _id, user }) {
  const router = useRouter();

  const isRoot = user && user.role === 'root';
  const isAdmin = user && user.role === 'admin';
  const isRootAdmin = isAdmin || isRoot;

  const [modal, setmodal] = useState(false);

  const handeldelete = async () => {
    const url = `${baseUrl}/api/product`;
    await Axios.delete(url, { params: { _id } });
    router.push('/');
  };

  return (
    <>
      <Header as='h3' content='About this product' />
      <p>{description}</p>
      {isRootAdmin && (
        <>
          <Button
            icon='trash alternate outline'
            color='red'
            content='Delete Product'
            onClick={() => setmodal(true)}
          />
          <Modal open={modal} dimmer='blurring'>
            <Modal.Header>Confirm Delete</Modal.Header>
            <Modal.Content>
              <p>Are you sure you want to delete?</p>
            </Modal.Content>
            <Modal.Actions>
              <Button content='cancel' onClick={() => setmodal(false)} />
              <Button
                negative
                icon='trash'
                labelPosition='right'
                content='Delete'
                onClick={handeldelete}
              />
            </Modal.Actions>
          </Modal>
        </>
      )}
    </>
  );
}

export default ProductAttributes;
