import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { message } from 'antd';
import responseMessage from 'app/shared/reducers/responseMessage';
import { APIurl, callAPI, headersJson } from 'app/shared/util/axios-util';
import { EHRSessionStorage } from 'app/modules/ehr/sessionStorage/ehrStorageService';
import axios from 'axios';

export const ACTION_TYPES = {
  GET_DS_TAIKHOAN: 'danhmuc/GET_DS_TAIKHOAN',
  GET_TENVAITRO: 'danhmuc/GET_TENVAITRO',
  UPDATE_ROLE: 'danhmuc/UPDATE_ROLE',
  IN_DSTAIKHOAN: 'danhmuc/IN_DSTAIKHOAN'
};

const initialState = {
  loadingNV: false,
  errorMessage: null,
  successMessage: null,
  dsTenVaiTro: [],
  danhSachTaiKhoan: [],
  printting: false,
  roleeing: false,
  updateSuccess: false
};

export type TaiKhoanBVState = Readonly<typeof initialState>;

export default (state: TaiKhoanBVState = initialState, action): TaiKhoanBVState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_DS_TAIKHOAN):
      return {
        ...state,
        errorMessage: null,
        successMessage: null,
        updateSuccess: false,
        loadingNV: true
      };
    case REQUEST(ACTION_TYPES.UPDATE_ROLE):
      return {
        ...state,
        roleeing: true
      };
    case FAILURE(ACTION_TYPES.GET_DS_TAIKHOAN):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state,
        loadingNV: true,
        danhSachTaiKhoan: [],
        errorMessage: null,
        successMessage: null
      };
    case FAILURE(ACTION_TYPES.UPDATE_ROLE):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state,
        roleeing: false
      };
    case SUCCESS(ACTION_TYPES.GET_DS_TAIKHOAN):
      return {
        ...state,
        loadingNV: false,
        successMessage: 'GET_DS_TAIKHOAN',
        danhSachTaiKhoan: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.GET_TENVAITRO):
      return {
        ...state,
        loadingNV: false,
        successMessage: 'GET_TENVAITRO',
        dsTenVaiTro: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.UPDATE_ROLE):
      message.success(responseMessage.PHAN_QUYEN);
      return {
        ...state,
        roleeing: false
      };
    default:
      return state;
  }
};
export const APITaiKhoanurl = '/taikhoan';
export const getDanhSach = () => async (dispatch, getState) => {
  const { maDonVi } = JSON.parse(EHRSessionStorage.get('donVi'));
  const url = `${APITaiKhoanurl}/api/taikhoanbv/ds-taikhoan?dvtt=${maDonVi}`;
  await dispatch({
    type: ACTION_TYPES.GET_DS_TAIKHOAN,
    payload: callAPI(url, 'get', headersJson, {})
  });
};

export const getDSTenVaiTro = () => async (dispatch, getState) => {
  const url = `${APITaiKhoanurl}/api/taikhoanbv/ds-tenvaitro`;
  await dispatch({
    type: ACTION_TYPES.GET_TENVAITRO,
    payload: callAPI(url, 'get', headersJson, {})
  });
};

export const capnhatRole = (maNguoiDung, maVaiTro) => async (dispatch, getState) => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_ROLE,
    payload: axios.put(`${APITaiKhoanurl}/api/taikhoanbv/capnhat-role/${maNguoiDung}?maVaiTro=${maVaiTro}`)
  });
  await dispatch(getDanhSach());
  return result;
};

export const inDSTaiKhoan = () => async (dispatch, getState) => {
  const { maDonVi } = JSON.parse(EHRSessionStorage.get('donVi'));
  const url = `${APIurl}/api/report/inds-taikhoan?dvtt=${maDonVi}`;
  await dispatch({
    type: ACTION_TYPES.IN_DSTAIKHOAN,
    payload: callAPI(url, 'get', headersJson, {})
  });
};
