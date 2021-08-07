import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { message } from 'antd';
import responseMessage from 'app/shared/reducers/responseMessage';
import { APIurl, callAPI, headersJson } from 'app/shared/util/axios-util';
import { EHRSessionStorage } from 'app/modules/ehr/sessionStorage/ehrStorageService';
import axios from 'axios';
import { saveAs } from 'file-saver';

export const ACTION_TYPES = {
  GET_DS_CHUCVU_SELECTED: 'danhmuc/GET_DS_CHUCVU_SELECTED',
  GET_DS_NHANVIEN: 'danhmuc/GET_DS_NHANVIEN',
  GET_DS_TENPHONGBAN: 'danhmuc/GET_DS_TENPHONGBAN',
  POST_DMNV: 'danhmuc/POST_DMNV',
  DELETE_DMNV: 'danhmuc/DELETE_DMNV',
  UPDATE_DMNV: 'danhmuc/UPDATE_DMNV',
  SAVE_DMNV: 'danhmuc/SAVE_DMNV',
  SEEN_NV: 'danhmuc/SEEN_NV',
  IN_DSNV: 'danhmuc/IN_DSNV',
  UPDATE_SETLD : 'danhmuc/UPDATE_SETLD',
  RESET: 'danhmuc/RESET'
};

const initialState = {
  loadingNV: false,
  errorMessage: null,
  successMessage: null,
  savving: false,
  deleteing: false,
  printting: false,
  danhSachNhanVien: [],
  danhSachChucVu: [],
  danhSachPhongBan: [],
  dstenphongban: null,
  updateSuccess: false
};

export type NhanVienState = Readonly<typeof initialState>;

export default (state: NhanVienState = initialState, action): NhanVienState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.IN_DSNV):
      return {
        ...state,
        printting: true
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    case REQUEST(ACTION_TYPES.SEEN_NV):
      return {
        ...state,
        loadingNV: true
      };
    case REQUEST(ACTION_TYPES.GET_DS_CHUCVU_SELECTED):
      return {
        ...state,
        successMessage: null,
        updateSuccess: false,
        loadingNV: true
      };
    case REQUEST(ACTION_TYPES.DELETE_DMNV):
      return {
        ...state,
        loadingNV: false,
        errorMessage: null,
        successMessage: null
      };
    case REQUEST(ACTION_TYPES.UPDATE_DMNV):
      return {
        ...state,
        loadingNV: false,
        errorMessage: null,
        successMessage: null,
        danhSachNhanVien: []
      };
    case REQUEST(ACTION_TYPES.UPDATE_SETLD):
      return {
        ...state,
        loadingNV: false,
        successMessage: null,
        danhSachNhanVien: []
      };
    case REQUEST(ACTION_TYPES.SAVE_DMNV):
      return {
        ...state,
        loadingNV: false,
        errorMessage: null,
        successMessage: null,
        danhSachNhanVien: []
      };
    case REQUEST(ACTION_TYPES.POST_DMNV):
      return {
        ...state,
        loadingNV: false,
        errorMessage: null,
        successMessage: null,
        danhSachNhanVien: []
      };
    case FAILURE(ACTION_TYPES.GET_DS_CHUCVU_SELECTED):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state,
        loadingNV: true,
        danhSachNhanVien: [],
        errorMessage: null,
        successMessage: null
      };
    case FAILURE(ACTION_TYPES.IN_DSNV):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state,
        printting: true
      };
    case FAILURE(ACTION_TYPES.DELETE_DMNV):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state,
        loadingNV: true,
        danhSachNhanVien: [],
        errorMessage: null,
        successMessage: null
      };
    case FAILURE(ACTION_TYPES.UPDATE_DMNV):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state,
        loadingNV: true,
        danhSachNhanVien: [],
        errorMessage: null,
        successMessage: null
      };
    case FAILURE(ACTION_TYPES.UPDATE_SETLD):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state,
        loadingNV: true,
        danhSachNhanVien: [],
        errorMessage: null,
        successMessage: null
      };
    case FAILURE(ACTION_TYPES.SAVE_DMNV):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state,
        loadingNV: true,
        danhSachNhanVien: [],
        errorMessage: null,
        successMessage: null
      };
    case FAILURE(ACTION_TYPES.POST_DMNV):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state,
        loadingNV: true,
        danhSachNhanVien: [],
        errorMessage: null,
        successMessage: null
      };
    case SUCCESS(ACTION_TYPES.GET_DS_CHUCVU_SELECTED):
      return {
        ...state,
        loadingNV: false,
        successMessage: 'GET_DS_CHUCVU_SELECTED',
        danhSachChucVu: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.IN_DSNV):
      message.success(responseMessage.THANH_CONG);
      return {
        ...state,
        printting: true
      };
    case SUCCESS(ACTION_TYPES.GET_DS_NHANVIEN):
      return {
        ...state,
        loadingNV: false,
        successMessage: 'GET_DS_NHANVIEN',
        danhSachNhanVien: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.GET_DS_TENPHONGBAN):
      return {
        ...state,
        loadingNV: false,
        successMessage: 'GET_DS_TENPHONGBAN',
        dstenphongban: action.payload.data,
        danhSachPhongBan: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.POST_DMNV):
      return {
        ...state,
        loadingNV: false,
        successMessage: 'POST_DMNV',
        danhSachNhanVien: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.SAVE_DMNV):
      message.success(responseMessage.THAO_TAC_THANH_CONG);
      return {
        ...state,
        loadingNV: false,
        savving: true,
        successMessage: 'SAVE_DMNV'
      };
    case SUCCESS(ACTION_TYPES.DELETE_DMNV):
      message.success(responseMessage.THAO_TAC_THANH_CONG);
      return {
        ...state,
        deleteing: true,
        successMessage: 'DELETE_DMNV',
        danhSachNhanVien: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.SEEN_NV):
      return {
        ...state,
        loadingNV: false,
        successMessage: 'SEEN_NV',
        danhSachNhanVien: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.UPDATE_DMNV):
      return {
        ...state,
        loadingNV: false,
        successMessage: 'UPDATE_DMNV',
        danhSachNhanVien: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.UPDATE_SETLD):
      return {
        ...state,
        loadingNV: false,
        successMessage: 'UPDATE_SETLD',
        danhSachNhanVien: action.payload.data
      };
    default:
      return state;
  }
};

export const getDSChucVu = () => async (dispatch, getState) => {
  const url = `${APIurl}/api/nhanvien/chuc-danh`;
  await dispatch({
    type: ACTION_TYPES.GET_DS_CHUCVU_SELECTED,
    payload: callAPI(url, 'get', headersJson, {})
  });
};

// export const getDSNhanVien = maPhongBan => async (dispatch, getState) => {
//   const { maDonVi } = JSON.parse(EHRSessionStorage.get('donVi'));
//   const url = `${APIurl}/api/nhanvien/ds-nhan-vien?maPhongBan=${maPhongBan}&maDonVi=${maDonVi}`;
//   await dispatch({
//     type: ACTION_TYPES.GET_DS_NHANVIEN,
//     payload: callAPI(url, 'get', headersJson, {})
//   });
// };

export const getDSNhanVienFull = maPhongBan => async (dispatch, getState) => {
  const { maDonVi } = JSON.parse(EHRSessionStorage.get('donVi'));
  const url = `${APIurl}/api/nhanvien/ds-nhan-vienfull?maPhongBan=${maPhongBan}&maDonVi=${maDonVi}`;
  await dispatch({
    type: ACTION_TYPES.GET_DS_NHANVIEN,
    payload: callAPI(url, 'get', headersJson, {})
  });
};

export const getDSTenPhongBan = () => async (dispatch, getState) => {
  const { maDonVi } = JSON.parse(EHRSessionStorage.get('donVi'));
  const url = `${APIurl}/api/nhanvien/ds-tenphongban?maDonVi=${maDonVi}`;
  await dispatch({
    type: ACTION_TYPES.GET_DS_TENPHONGBAN,
    payload: callAPI(url, 'get', headersJson, {})
  });
};

export const luudsNV = (dsNhanVienInfo, maPhongBan) => async (dispatch, getState) => {
  const result = await dispatch({
    type: ACTION_TYPES.SAVE_DMNV,
    payload: axios.post(`${APIurl}/api/nhanvien/luu-nhanvien`, dsNhanVienInfo)
});
  await dispatch(getDSNhanVienFull(maPhongBan));
  return result;
};

export const deletedsNV = (maNhanVien, maPhongBan) => async (dispatch, getState) => {
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_DMNV,
    payload: axios.delete(`${APIurl}/api/nhanvien/xoa-nhanvien/${maNhanVien}`)
  });
  await dispatch(getDSNhanVienFull(maPhongBan));
  return result;
};

export const updateNV = (maNhanVien, tenNhanVien, phongBan, sdtNhanVien, chucDanhNhanVien) => async (dispatch, getState) => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_DMNV,
    payload: axios.put(`${APIurl}/api/nhanvien/sua-nhanvien/${maNhanVien}?tenNhanVien=${tenNhanVien}&phongBan=${phongBan}&sdtNhanVien=${sdtNhanVien}&chucDanhNhanVien=${chucDanhNhanVien}`)
  });
  await dispatch(getDSNhanVienFull(phongBan));
  return result;
};

export const setLanhDao = maNhanVien => async (dispatch, getState) => {
  // const { maDonVi } = JSON.parse(EHRSessionStorage.get('donVi'));
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_SETLD,
    payload: axios.put(`${APIurl}/api/nhanvien/sua-lanhdaonull/${maNhanVien}`)
  });
  await dispatch(getDSNhanVienFull(maNhanVien));
  return result;
};

export const resetState = () => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.RESET
  });
};

export const inDSNhanVien = maPhongBan => async (dispatch, getState) => {
  const { maDonVi } = JSON.parse(EHRSessionStorage.get('donVi'));
  const url = `${APIurl}/api/report/inds-nhanvien?maPhongBan=${maPhongBan}&maDonVi=${maDonVi}`;
  const res = await dispatch({
    type: ACTION_TYPES.IN_DSNV,
    payload: axios.get(url, { responseType: 'blob' })
    // sử dụng với report
  });
  await saveAs(res.value.data, `ds_nhanvien ${ maPhongBan }.pdf`);
};
