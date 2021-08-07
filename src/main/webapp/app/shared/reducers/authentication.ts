import axios from 'axios';
import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import { EHRSessionStorage } from 'app/modules/ehr/sessionStorage/ehrStorageService';
import { APITaiKhoanurl, callAPI, headersJson } from 'app/shared/util/axios-util';
import { AUTH_TOKEN_KEY, ROLE_KEY } from 'app/shared/util/auth-utils';
import responseMessage from 'app/shared/reducers/responseMessage';
import { initSession } from 'app/shared/reducers/header';
import { message as msg } from 'antd';

export const ACTION_TYPES = {
  LOGIN: 'authentication/LOG_IN',
  GET_SESSION: 'authentication/GET_SESSION',
  GET_DS_PHONG_BAN: 'authentication/GET_DS_PHONG_BAN'
};

const initialState = {
  loading: false,
  loginError: false,
  message: null as string,
  loginSuccess: false,
  loadingPhongBan: false
};

export type AuthenticationState = Readonly<typeof initialState>;

// Reducer
export default (state: AuthenticationState = initialState, action): AuthenticationState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.LOGIN):
      return {
        ...state,
        loading: true,
        message: null,
        loginSuccess: false,
        loginError: false
      };
    case SUCCESS(ACTION_TYPES.LOGIN):
      return {
        ...state
      };
    case FAILURE(ACTION_TYPES.LOGIN):
      const status = action.payload.response.status;
      const message = status === 401 ? responseMessage.SAI_TAI_KHOAN : responseMessage.LOI_HE_THONG;
      msg.error(message);
      return {
        ...initialState,
        loginError: true,
        message,
        loading: false
      };
    case REQUEST(ACTION_TYPES.GET_SESSION):
    case SUCCESS(ACTION_TYPES.GET_SESSION):
      return {
        ...state
      };
    case REQUEST(ACTION_TYPES.GET_DS_PHONG_BAN):
      return {
        ...state,
        loadingPhongBan: true
      };
    case SUCCESS(ACTION_TYPES.GET_DS_PHONG_BAN): {
      return {
        ...initialState,
        loadingPhongBan: false,
        loginSuccess: true,
        loading: false
      };
    }
    case FAILURE(ACTION_TYPES.GET_SESSION):
    case FAILURE(ACTION_TYPES.GET_DS_PHONG_BAN):
      msg.error(responseMessage.LOI_HE_THONG);
      return {
        ...state,
        loginError: true,
        loadingPhongBan: false,
        message: responseMessage.LOI_HE_THONG,
        loading: false
      };
    default:
      return state;
  }
};

export const logIn = (username: string, password: string) => async (dispatch, getState) => {
  const data = {
    tenDangNhap: username,
    matKhau: password
  };
  const url = `${APITaiKhoanurl}/api/authenticate`;
  const res = await dispatch({
    type: ACTION_TYPES.LOGIN,
    payload: callAPI(url, 'post', headersJson, data)
  });
  const jwt = res.value.data.accessToken;
  EHRSessionStorage.set(AUTH_TOKEN_KEY, jwt);
  await dispatch(getSession());
};

export const getSession = () => async (dispatch, getState) => {
  const url = `${APITaiKhoanurl}/api/account`;
  const res = await dispatch({
    type: ACTION_TYPES.GET_SESSION,
    payload: axios.get(url)
  });
  const data = res.value.data;
  EHRSessionStorage.set('maNguoiDung', data.maNguoiDung);
  EHRSessionStorage.set('tenDangNhap', data.tenDangNhap);
  EHRSessionStorage.set('tenNhanVien', data.tenNhanVien);
  EHRSessionStorage.set(ROLE_KEY, data.vaiTro);
  EHRSessionStorage.set('dsDonVi', JSON.stringify(data.dsDonVi));
  EHRSessionStorage.set('donVi', JSON.stringify(data.dsDonVi[0]));

  await dispatch(getDSPhongBan());
};

export const getDSPhongBan = () => async (dispatch, getState) => {
  // Lấy danh sách phòng ban
  const donVi = JSON.parse(EHRSessionStorage.get('donVi'));
  const res_phongBan = await dispatch({
    type: ACTION_TYPES.GET_DS_PHONG_BAN,
    payload: axios.get(`${APITaiKhoanurl}/api/account/dsphongban/${donVi.maDonVi}`)
  });
  EHRSessionStorage.set('dsPhongBan', JSON.stringify(res_phongBan.value.data));
  await dispatch(initSession());
};
