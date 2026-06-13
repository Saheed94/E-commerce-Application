import axios from 'axios';

const ORDER_API =
  'http://localhost:3102';

export const checkoutOrder =
  async data => {
    return axios.post(
      `${ORDER_API}/api/orders/checkout`,
      data
    );
  };