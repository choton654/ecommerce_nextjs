import Axios from 'axios';
import { useState } from 'react';
import {
  Button,
  Form,
  Header,
  Icon,
  Image,
  Input,
  Message,
  TextArea,
} from 'semantic-ui-react';
import baseUrl from '../utils/baseUrl';
function CreateProduct() {
  const initialState = {
    name: '',
    price: '',
    mediaUrl: '',
    description: '',
  };
  const [product, setProduct] = useState(initialState);
  const [mediaPreview, setMediaPreview] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handelChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'media') {
      setProduct((prevState) => ({ ...prevState, media: files[0] }));
      setMediaPreview(window.URL.createObjectURL(files[0]));
    } else {
      setProduct((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = `${baseUrl}/api/product`;
    try {
      const { data } = await Axios.post(url, product);
      console.log(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
    setProduct(initialState);
    setSuccess(true);
  };

  return (
    <>
      <Header as='h2' block>
        <Icon name='add' color='orange' />
        Create New Product
      </Header>
      <Form loading={loading} success={success} onSubmit={handelSubmit}>
        <Message
          success
          icon='check'
          header='Success!'
          content='Tur product has been posted'
        />
        <Form.Group widths='equal'>
          <Form.Field
            control={Input}
            name='name'
            onChange={handelChange}
            value={product.name}
            type='text'
            label='Name'
            placeholder='Name'
          />
          <Form.Field
            control={Input}
            name='price'
            onChange={handelChange}
            value={product.price}
            type='number'
            label='Price'
            placeholder='Price'
            min='0.00'
            step='0.01'
          />
          <Form.Field
            control={Input}
            name='mediaUrl'
            onChange={handelChange}
            type='text'
            label='Media Url'
            content='Image Url'
          />
        </Form.Group>
        <Image src={mediaPreview} rounded centered size='small' />
        <Form.Field
          control={TextArea}
          name='description'
          onChange={handelChange}
          value={product.description}
          label='Description'
          placeholder='Description'
        />
        <Form.Field
          control={Button}
          color='blue'
          icon='pencil alternate'
          content='submit'
          type='submit'
        />
      </Form>
    </>
  );
}

export default CreateProduct;
