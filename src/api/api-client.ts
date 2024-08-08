import axios from 'axios';

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: 'https://api.hikerdo.com',
  headers: {
    'Content-Type': 'application/vnd.api+json',
    Accept: 'application/vnd.api+json',
  },
  // params: {
  //   key: 'e53bba19d7914970889f528d70c8e06d',
  // },
});

export default axiosInstance;
