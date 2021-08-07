import { APIurl, callAPI, headersJson } from 'app/shared/util/axios-util';
import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import responseMessage from 'app/shared/reducers/responseMessage';
import { message } from 'antd';
import { EHRSessionStorage } from 'app/modules/ehr/sessionStorage/ehrStorageService';

export const ACTION_TYPES = {
  TOGGLE_NHAP: 'nhapvangtruc/toggle_nhap',
  FORWARD_NHANVIEN: 'nhapvangtruc/forward_nhanvien',
  SUBMIT_VANG_TRUC: 'nhapvangtruc/submit',
  GET_NVTHAYTHE: 'nhapvangtruc/GET_NVTHAYTHE'
};

const initialState = {
  modal: false,
  maNhanVien: null,
  tenNhanVien: null,
  successMessage: null,
  danhSachNVThayThe: [],
  submiting: false
};

export type NhapVangTrucState = Readonly<typeof initialState>;

export default (state: NhapVangTrucState = initialState, action): NhapVangTrucState => {
  switch (action.type) {
    case ACTION_TYPES.TOGGLE_NHAP:
      return {
        ...state,
        modal: action.modal
      };
    case ACTION_TYPES.FORWARD_NHANVIEN:
      return {
        ...state,
        maNhanVien: action.maNhanVien,
        tenNhanVien: action.tenNhanVien
      };
    case REQUEST(ACTION_TYPES.SUBMIT_VANG_TRUC):
      return {
        ...state,
        submiting: true
      };
    case FAILURE(ACTION_TYPES.SUBMIT_VANG_TRUC):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state,
        submiting: false
      };
    case FAILURE(ACTION_TYPES.GET_NVTHAYTHE):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state,
        danhSachNVThayThe: []
      };
    case SUCCESS(ACTION_TYPES.SUBMIT_VANG_TRUC):
      message.success(responseMessage.THAO_TAC_THANH_CONG);
      return {
        ...state,
        submiting: false
      };
    case SUCCESS(ACTION_TYPES.GET_NVTHAYTHE):
      return {
        ...state,
        successMessage: 'GET_NVTHAYTHE',
        danhSachNVThayThe: action.payload.data
      };
    default:
      return state;
  }
};

export const toggleNhap = (modal: boolean) => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.TOGGLE_NHAP,
    modal
  });
};

export const forwardNhanVien = nhanVien => async (dispatch, getState) => {
  const { maNhanVien, tenNhanVien } = nhanVien;
  await dispatch({
    type: ACTION_TYPES.FORWARD_NHANVIEN,
    maNhanVien,
    tenNhanVien
  });
  await dispatch(getDSNhanVienCungLoai(maNhanVien));
};

export const getDSNhanVienCungLoai = maNhanVien => async (dispatch, getState) => {
  const { maDonVi } = JSON.parse(EHRSessionStorage.get('donVi'));
  const url = `${APIurl}/api/nhanvien/nv-thaythe?maNhanVien=${maNhanVien}&maDonVi=${maDonVi}`;
  await dispatch({
    type: ACTION_TYPES.GET_NVTHAYTHE,
    payload: callAPI(url, 'get', headersJson, {})
  });
};

export const submitNhapVangTruc = (ngayBD, ngayKT, lyDo) => async (dispatch, getState) => {
  const maNV = getState().nhapvangtruc.maNhanVien;
  const url = `${APIurl}/api/vangtruc/themvang/`;
  await dispatch({
    type: ACTION_TYPES.SUBMIT_VANG_TRUC,
    payload: callAPI(url, 'post', headersJson, { maNV, ngayBD, ngayKT, lyDo })
  });
  await dispatch(toggleNhap(false));

};
