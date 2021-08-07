import { APIurl, callAPI, headersJson } from 'app/shared/util/axios-util';
import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import responseMessage from 'app/shared/reducers/responseMessage';
import { message } from 'antd';
import Axios from 'axios';
import { saveAs } from 'file-saver';

export const ACTION_TYPES = {
  TOGGLE_NHAP: 'xinvang/toggle_nhap',
  TOGGLE_IN: 'xinvang/toggle_in',
  TOGGLE_LS: 'xinvang/toggle_lich_su',
  SUBMIT_NHAP: 'xinvang/submit_nhap',
  SUBMIT_IN: 'xinvang/submit_in',
  GET_LS: 'xinvang/get_lich_su'
};

const initialState = {
  modalNhap: false,
  modalIn: false,
  modalLS: false,
  loading: false,
  lichsu: [],
  tongSoDong: 0
};

export type XinVangState = Readonly<typeof initialState>;

export default (state: XinVangState = initialState, action): XinVangState => {
  switch (action.type) {
    case ACTION_TYPES.TOGGLE_NHAP:
      return {
        ...state,
        modalNhap: action.modal
      };
    case ACTION_TYPES.TOGGLE_IN:
      return {
        ...state,
        modalIn: action.modal
      };
    case ACTION_TYPES.TOGGLE_LS:
      return {
        ...state,
        modalLS: action.modal
      };
    case REQUEST(ACTION_TYPES.SUBMIT_IN):
    case REQUEST(ACTION_TYPES.SUBMIT_NHAP):
      return {
        ...state,
        loading: true
      };
    case FAILURE(ACTION_TYPES.SUBMIT_IN):
    case FAILURE(ACTION_TYPES.SUBMIT_NHAP):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state,
        loading: false
      };
    case SUCCESS(ACTION_TYPES.SUBMIT_NHAP):
    case SUCCESS(ACTION_TYPES.SUBMIT_IN):
      message.success(responseMessage.THANH_CONG);
      return {
        ...state,
        loading: false
      };
    case REQUEST(ACTION_TYPES.GET_LS):
      return {
        ...state,
        lichsu: [],
        tongSoDong: 0,
        loading: true
      };
    case FAILURE(ACTION_TYPES.GET_LS):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state,
        lichsu: [],
        tongSoDong: 0,
        loading: false
      };
    case SUCCESS(ACTION_TYPES.GET_LS):
      const { duLieu, tongSoDong } = action.payload.data;
      return {
        ...state,
        loading: false,
        lichsu: duLieu,
        tongSoDong
      };
    default:
      return {
        ...state
      };
  }
};

export const toggleModalNhap = modal => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.TOGGLE_NHAP,
    modal
  });
};

export const toggleModalIn = modal => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.TOGGLE_IN,
    modal
  });
};

export const toggleModaLS = modal => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.TOGGLE_LS,
    modal
  });
};

export const submitXinVangTruc = (ngayBD, ngayKT, lyDo) => async (dispatch, getState) => {
  const url = `${APIurl}/api/vangtruc/xinvang`;
  await dispatch({
    type: ACTION_TYPES.SUBMIT_NHAP,
    payload: callAPI(url, 'post', headersJson, { maNV: null, ngayBD, ngayKT, lyDo })
  });
  await dispatch(toggleModalNhap(false));
};

export const submitIn = (thang, nam, lyDo) => async (dispatch, getState) => {
  const url = `${APIurl}/api/report/don-vang-lanh-dao`;
  const params = { thang, nam, lyDo };
  const res = await dispatch({
    type: ACTION_TYPES.SUBMIT_IN,
    payload: Axios.get(url, { params, responseType: 'blob' })
  });
  await saveAs(res.value.data, `don_vang_lanh_dao.pdf`);
  await dispatch(toggleModalIn(false));
};

export const getLSVangTruc = (trang, soDong) => async (dispatch, getState) => {
  const url = `${APIurl}/api/vangtruc/xinvang/lichsu`;
  const params = { trang, soDong };
  await dispatch({
    type: ACTION_TYPES.GET_LS,
    payload: Axios.get(url, { params })
  });
};
