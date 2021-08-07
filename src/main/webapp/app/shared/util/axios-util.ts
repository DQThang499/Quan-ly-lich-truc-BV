import axios from 'axios';

export const APIurl = '/lichtruc';
export const APITaiKhoanurl = '/taikhoan';

export const headersJson = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
};

export const callAPI = async (url, method, headers, data) => axios({ url, method, headers, data });
