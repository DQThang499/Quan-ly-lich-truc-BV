import axios from 'axios';
import { isLogged } from 'app/shared/util/auth-utils';
import { EHRSessionStorage } from 'app/modules/ehr/sessionStorage/ehrStorageService';

const TIMEOUT = 100000000; // 10000
const setupAxiosInterceptors = () => {
  const onRequestSuccess = config => {
    if (isLogged()) {
      const token = EHRSessionStorage.get('authenticationToken');
      config.headers['Custom-Authorization'] = `Bearer ${token}`;
    }
    config.timeout = TIMEOUT;
    return config;
  };

  const onResponseSuccess = response => response;

  const onResponseError = err => {
    return Promise.reject(err);
  };

  axios.interceptors.request.use(onRequestSuccess);
  axios.interceptors.response.use(onResponseSuccess, onResponseError);
};

export default setupAxiosInterceptors;
