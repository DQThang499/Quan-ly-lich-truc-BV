import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { message } from 'antd';
import responseMessage from 'app/shared/reducers/responseMessage';
import { APIurl, callAPI, headersJson } from 'app/shared/util/axios-util';
import { EHRSessionStorage } from 'app/modules/ehr/sessionStorage/ehrStorageService';
import axios from 'axios';

export const ACTION_TYPES = {
  GET_DS_TENPHONGBAN : ' danhmuc/GET_DS_TENPHONGBAN',
  GET_DSDANHGIA: 'danhmuc/GET_DSDANHGIA'
};

const initialState = {
  successMessage: null,
  loading: false,
  danhSachDanhGia: [],
  danhSachPhongBan: []
};

export type DanhGiaState = Readonly<typeof initialState>;

export default (state: DanhGiaState = initialState, action): DanhGiaState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_DSDANHGIA):
      return {
        ...state,
        loading: true
      };
    case FAILURE(ACTION_TYPES.GET_DSDANHGIA):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state,
        danhSachDanhGia: [],
        loading: true
      };
    case SUCCESS(ACTION_TYPES.GET_DSDANHGIA):
      return {
        ...state,
        loading: false,
        successMessage: 'GET_DSDANHGIA',
        danhSachDanhGia: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.GET_DS_TENPHONGBAN):
      return {
        ...state,
        successMessage: 'GET_DS_TENPHONGBAN',
        danhSachPhongBan: action.payload.data
      };

    default:
      return state;
  }
};

export const getDSTenPhongBanDG = () => async (dispatch, getState) => {
  const { maDonVi } = JSON.parse(EHRSessionStorage.get('donVi'));
  const url = `${APIurl}/api/lichtruc/dstenphongban?maDonVi=${maDonVi}`;
  await dispatch({
    type: ACTION_TYPES.GET_DS_TENPHONGBAN,
    payload: callAPI(url, 'get', headersJson, {})
  });
};

export const getDSDanhGia = maPhongBan => async (dispatch, getState) => {
  const { maDonVi } = JSON.parse(EHRSessionStorage.get('donVi'));
  const url = `${APIurl}/api/lichtruc/dsdanhgia?maPhongBan=${maPhongBan}&maDonVi=${maDonVi}`;
  await dispatch({
    type: ACTION_TYPES.GET_DSDANHGIA,
    payload: callAPI(url, 'get', headersJson, {})
  });
};
