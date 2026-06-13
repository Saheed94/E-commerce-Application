import axios from 'axios';

const AUTH_API =
  'http://localhost:3001';

export const registerUser =
  async data => {
    return axios.post(
      `${AUTH_API}/api/auth/register`,
      data
    );
  };

export const loginUser =
  async data => {
    return axios.post(
      `${AUTH_API}/api/auth/login`,
      data
    );
  };