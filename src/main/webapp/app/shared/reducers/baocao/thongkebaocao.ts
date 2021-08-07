import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { message } from 'antd';
import responseMessage from 'app/shared/reducers/responseMessage';
import { EHRSessionStorage } from 'app/modules/ehr/sessionStorage/ehrStorageService';
import axios from 'axios';
import { APIurl, callAPI, headersJson } from 'app/shared/util/axios-util';
import { saveAs } from 'file-saver';

export const ACTION_TYPES = {
  GET_DS_TENPHONGBAN: 'danhmuc/GET_DS_TENPHONGBAN',
  GET_DS_THONGKE: 'danhmuc/GET_DS_THONGKE',
  GET_DS_THONGKETONGHOP: 'danhmuc/GET_DS_THONGKETONGHOP',
  CHANGE_DATE: 'danhmuc/CHANGE_DATE',
  IN_THONGKECT: 'danhmuc/IN_THONGKECT',
  IN_THONGKETH: 'danhmuc/IN_THONGKETH',
  INIT_PHONGBAN: 'danhmuc/INIT_PHONGBAN'
};

const initialState = {
  successMessage: null,
  maPhongBan: null,
  loading: false,
  thongKeChiTiet: [],
  thongKeTongHop: [],
  dsTenPhongBan: [],
  dsChuaTao: true,
  printting: false,
  printTH: false
};

export type ThongKeBaoCaoState = Readonly<typeof initialState>;

export default (state: ThongKeBaoCaoState = initialState, action): ThongKeBaoCaoState => {
  switch (action.type) {
    case ACTION_TYPES.CHANGE_DATE:
      return {
        ...state
      };
    case ACTION_TYPES.INIT_PHONGBAN:
      return {
        ...state,
        maPhongBan: action.maPhongBan
      };
    case REQUEST(ACTION_TYPES.GET_DS_TENPHONGBAN):
      return {
        ...state,
        successMessage: null
      };
    case REQUEST(ACTION_TYPES.IN_THONGKECT):
      return {
        ...state,
        printting: true
      };
    case REQUEST(ACTION_TYPES.IN_THONGKETH):
      return {
        ...state,
        printTH: true
      };
    case REQUEST(ACTION_TYPES.GET_DS_THONGKE):
      return {
        ...state,
        loading: true,
        thongKeChiTiet: [],
        dsChuaTao: false
      };
    case REQUEST(ACTION_TYPES.GET_DS_THONGKETONGHOP):
      return {
        ...state,
        loading: true,
        thongKeTongHop: [],
        dsChuaTao: false
      };
    case FAILURE(ACTION_TYPES.IN_THONGKECT):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state,
        printting: false
      };
    case FAILURE(ACTION_TYPES.IN_THONGKETH):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state,
        printTH: false
      };
    case FAILURE(ACTION_TYPES.GET_DS_THONGKE):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state
      };
    case FAILURE(ACTION_TYPES.GET_DS_THONGKETONGHOP):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state
      };
    case FAILURE(ACTION_TYPES.GET_DS_TENPHONGBAN):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state
      };
    case SUCCESS(ACTION_TYPES.GET_DS_THONGKE):
      return {
        ...state,
        successMessage: 'GET_DS_THONGKE',
        thongKeChiTiet: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.GET_DS_THONGKETONGHOP):
      return {
        ...state,
        successMessage: 'GET_DS_THONGKETONGHOP',
        thongKeTongHop: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.GET_DS_TENPHONGBAN):
      return {
        ...state,
        successMessage: 'GET_DS_TENPHONGBAN',
        dsTenPhongBan: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.IN_THONGKECT):
      message.success(responseMessage.THANH_CONG);
      return {
        ...state,
        printting: false
      };
    case SUCCESS(ACTION_TYPES.IN_THONGKETH):
      message.success(responseMessage.THANH_CONG);
      return {
        ...state,
        printTH: false
      };
    default:
      return state;
  }
};
export const changeDate = time => ({ type: ACTION_TYPES.CHANGE_DATE, time });

export const getDSThongKeChiTiet = (tuNgay, denNgay, maPhongBan) => async (dispatch, getState) => {
  const { maDonVi } = JSON.parse(EHRSessionStorage.get('donVi'));
  const url = `${APIurl}/api/thongke/ds-thongke-chitiet?tuNgay=${tuNgay}&denNgay=${denNgay}&maPhongBan=${maPhongBan}&maDonVi=${maDonVi}`;
  await dispatch({
    type: ACTION_TYPES.GET_DS_THONGKE,
    payload: callAPI(url, 'get', headersJson, {})
  });
};
export const getDSThongKeTongHop = (tuNgay, denNgay, maPhongBan) => async (dispatch, getState) => {
  const { maDonVi } = JSON.parse(EHRSessionStorage.get('donVi'));
  const url = `${APIurl}/api/thongke/ds-thongke-tonghop?tuNgay=${tuNgay}&denNgay=${denNgay}&maPhongBan=${maPhongBan}&maDonVi=${maDonVi}`;
  await dispatch({
    type: ACTION_TYPES.GET_DS_THONGKETONGHOP,
    payload: callAPI(url, 'get', headersJson, {})
  });
};

export const inDSThongKe = (tuNgay, denNgay, maPhongBan) => async (dispatch, getState) => {
  const { maDonVi } = JSON.parse(EHRSessionStorage.get('donVi'));
  const url = `${APIurl}/api/report/inds-thongkechitiet?tuNgay=${tuNgay}&denNgay=${denNgay}&maPhongBan=${maPhongBan}&maDonVi=${maDonVi}`;
  const res = await dispatch({
    type: ACTION_TYPES.IN_THONGKECT,
    payload: axios.get(url, { responseType: 'blob' }) // sử dụng với report
  });
  await saveAs(res.value.data, `ds_thongkechitiet ${tuNgay} ${denNgay} .pdf`);
};

export const inDSThongKeTH = (tuNgay, denNgay, maPhongBan) => async (dispatch, getState) => {
  const { maDonVi } = JSON.parse(EHRSessionStorage.get('donVi'));
  const url = `${APIurl}/api/report/inds-thongketonghop?tuNgay=${tuNgay}&denNgay=${denNgay}&maPhongBan=${maPhongBan}&maDonVi=${maDonVi}`;
  const res = await dispatch({
    type: ACTION_TYPES.IN_THONGKETH,
    payload: axios.get(url, { responseType: 'blob' }) // sử dụng với report
  });
  await saveAs(res.value.data, `ds_thongketonghop ${tuNgay} ${denNgay} .pdf`);
};
