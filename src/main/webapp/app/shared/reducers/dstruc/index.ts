import { message, Modal } from 'antd';
import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import { APIurl, callAPI, headersJson } from 'app/shared/util/axios-util';
import responseMessage from 'app/shared/reducers/responseMessage';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { EHRSessionStorage } from 'app/modules/ehr/sessionStorage/ehrStorageService';
import { isLogged } from 'app/shared/util/auth-utils';

export const ACTION_TYPES = {
  RESET: 'dstruc/reset_state',
  INIT_PHONGBAN: 'dstruc/init_phong_ban',
  INIT_SESSION: 'dstruc/INIT_SESSION',
  GET_DS: 'dstruc/get_danh_sach',
  TAO_DS: 'dstruc/tao_danh_sach',
  DUYET_DS: 'dstruc/duyet_danh_sach',
  UPDATE_AFTER_DELETE_ADD: 'dstruc/capnhat_saukhi_dieuchinh',
  IN_DS: 'dstruc/in'
};

const initialState = {
  maPhongBan: null,
  loading: false,
  thongTinDS: null,
  chiTietDS: [],
  tenDangNhap: null as string,
  dsChuaTao: true,
  error: false,
  approving: false,
  printing: false
};

export type DSTrucState = Readonly<typeof initialState>;

export default (state: DSTrucState = initialState, action): DSTrucState => {
  switch (action.type) {
    case ACTION_TYPES.IN_DS:
      return !isLogged()
        ? { ...state }
        : {
          ...state,
          tenDangNhap: EHRSessionStorage.get('tenNhanVien')
        };
    case ACTION_TYPES.INIT_PHONGBAN:
      return {
        ...state,
        maPhongBan: action.maPhongBan
      };
    case REQUEST(ACTION_TYPES.DUYET_DS):
      return {
        ...state,
        approving: true
      };
    case REQUEST(ACTION_TYPES.GET_DS):
      return {
        ...state,
        loading: true,
        thongTinDS: null,
        chiTietDS: [],
        dsChuaTao: false,
        error: false
      };
    case REQUEST(ACTION_TYPES.TAO_DS):
      return {
        ...state,
        loading: true,
        error: false
      };
    case FAILURE(ACTION_TYPES.GET_DS):
      const { status } = action.payload.response;
      return {
        ...state,
        error: !(status === 422),
        loading: false,
        thongTinDS: null,
        chiTietDS: [],
        dsChuaTao: status === 422
      };
    case FAILURE(ACTION_TYPES.TAO_DS):
      return {
        ...state,
        loading: false,
        error: true
      };
    case FAILURE(ACTION_TYPES.DUYET_DS):
      Modal.error({
        title: 'Lỗi',
        content: responseMessage.LOI_HE_THONG
      });
      return {
        ...state,
        approving: false
      };
    case SUCCESS(ACTION_TYPES.GET_DS):
      const { thongTinDS, chiTietDS } = action.payload.data;
      return {
        ...state,
        loading: false,
        chiTietDS,
        thongTinDS
      };
    case SUCCESS(ACTION_TYPES.TAO_DS):
      return {
        ...state,
        loading: false,
        error: false
      };
    case SUCCESS(ACTION_TYPES.DUYET_DS):
      return {
        ...state,
        approving: false,
        thongTinDS: action.payload.data
      };
    case ACTION_TYPES.UPDATE_AFTER_DELETE_ADD:
      return {
        ...state,
        chiTietDS: action.chiTietDS,
        thongTinDS: action.thongTinDS
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    case REQUEST(ACTION_TYPES.IN_DS):
      return {
        ...state,
        printing: true
      };
    case FAILURE(ACTION_TYPES.IN_DS):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state,
        printing: false
      };
    case SUCCESS(ACTION_TYPES.IN_DS):
      message.success(responseMessage.THANH_CONG);
      return {
        ...state,
        printing: false
      };
    default:
      return state;
  }
};

export const initPhongBan = maPhongBan => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.INIT_PHONGBAN,
    maPhongBan
  });
  await dispatch(getDSTruc());
};

export const getDSTruc = () => async (dispatch, getState) => {
  const maPhongBan = getState().dstruc.maPhongBan;
  const maDonVi = getState().header.donVi.maDonVi;
  const url = `${APIurl}/api/dstruc/xemds/?maPhongBan=${maPhongBan}&maDonVi=${maDonVi}`;
  await dispatch({
    type: ACTION_TYPES.GET_DS,
    payload: callAPI(url, 'get', headersJson, {})
  });
};

export const taoDSTruc = () => async (dispatch, getState) => {
  const url = `${APIurl}/api/dstruc/thaydoi/tao`;
  const maPhongBan = getState().dstruc.maPhongBan;
  const maDonVi = getState().header.donVi.maDonVi;
  const data = {
    maPhongBan,
    maDonVi
  };
  await dispatch({
    type: ACTION_TYPES.TAO_DS,
    payload: callAPI(url, 'post', headersJson, data)
  });
  await dispatch(getDSTruc());
};

export const duyetDS = (duyet: boolean) => async (dispatch, getState) => {
  const { maDS } = getState().dstruc.thongTinDS;
  const url = `${APIurl}/api/dstruc/duyet/${duyet ? 'duyet' : 'huy'}/${maDS}`;
  await dispatch({
    type: ACTION_TYPES.DUYET_DS,
    payload: callAPI(url, 'put', headersJson, {})
  });
};

export const updateAfterDeleteAdd = (thongTinDS, chiTietDS) => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.UPDATE_AFTER_DELETE_ADD,
    thongTinDS,
    chiTietDS
  });
};

export const resetState = () => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.RESET
  });
};

export const inDS = tenDangNhap => async (dispatch, getState) => {
  const url = `${APIurl}/api/report/danh-sach-truc?tenDangNhap=${tenDangNhap}`;
  const { maPhongBan } = getState().dstruc;
  const { maDonVi } = getState().header.donVi;
  const lanhDao = maPhongBan === '';
  const params = lanhDao ? { maDonVi } : { maDonVi, maPhongBan };
  const res = await dispatch({
    type: ACTION_TYPES.IN_DS,
    payload: axios.get(url, { params, responseType: 'blob' })
  });
  await saveAs(res.value.data, `ds_truc_${lanhDao ? 'lanh_dao' : maPhongBan}.pdf`);
};
