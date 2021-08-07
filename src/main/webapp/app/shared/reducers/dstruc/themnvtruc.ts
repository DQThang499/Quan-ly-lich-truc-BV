import { message, Modal } from 'antd';
import { APIurl, callAPI, headersJson } from 'app/shared/util/axios-util';
import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import { getDSTruc, updateAfterDeleteAdd } from './index';
import responseMessage from 'app/shared/reducers/responseMessage';

export const ACTION_TYPES = {
  TOGGLE_MODAL: 'themnvtruc/TOGGLE_modal',
  GET_DS_NHANVIEN: 'themnvtruc/get_ds_nhanvien',
  THEM_NV_VAO_DS: 'themnvtruc/them_nv_vao_ds',
  SWITCH_CHUC_DANH: 'themnvtruc/switch_chuc_danh',
  TOGGLE_MODALNEW: 'themnvtruc/TOGGLE_MODALNEW'
};

const initialState = {
  dsNhanVien: [],
  chucDanhTruc: null,
  saving: false,
  loading: false,
  error: false,
  modal: false,
  modalnew: false
};

export type ThemNVTrucState = Readonly<typeof initialState>;

export default (state: ThemNVTrucState = initialState, action): ThemNVTrucState => {
  switch (action.type) {
    case ACTION_TYPES.TOGGLE_MODALNEW:
      return {
        ...state,
        modalnew: action.modalnew
      };
    case ACTION_TYPES.TOGGLE_MODAL:
      return {
        ...state,
        modal: action.modal
      };
    case ACTION_TYPES.SWITCH_CHUC_DANH:
      return {
        ...state,
        loading: false,
        chucDanhTruc: action.payload.chucDanhTruc
      };
    case REQUEST(ACTION_TYPES.GET_DS_NHANVIEN):
      return {
        ...state,
        error: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.THEM_NV_VAO_DS):
      return {
        ...state,
        saving: true
      };
    case FAILURE(ACTION_TYPES.GET_DS_NHANVIEN):
      Modal.error({
        title: 'Lỗi',
        content: responseMessage.LOI_HE_THONG
      });
      return {
        ...state,
        error: true,
        loading: false
      };
    case FAILURE(ACTION_TYPES.THEM_NV_VAO_DS):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state,
        saving: false
      };
    case SUCCESS(ACTION_TYPES.GET_DS_NHANVIEN):
      return {
        ...state,
        error: false,
        loading: false,
        dsNhanVien: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.THEM_NV_VAO_DS):
      message.success(responseMessage.THANH_CONG);
      return {
        ...state,
        saving: false
      };
    default:
      return state;
  }
};

export const getDSNhanVien = () => async (dispatch, getState) => {
  const maPhongBan = getState().dstruc.maPhongBan;
  const maDonVi = getState().header.donVi.maDonVi;
  const url = `${APIurl}/api/nhanvien/nvCTDS?maPhongBan=${maPhongBan}&maDonVi=${maDonVi}`;
  await dispatch({
    type: ACTION_TYPES.GET_DS_NHANVIEN,
    payload: callAPI(url, 'get', headersJson, {})
  });
};

export const toggleDmNVnew = (modalnew: boolean) => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.TOGGLE_MODAL,
    modalnew
  });
};

export const toggleModal = (modal: boolean) => async (dispatch, getState) => {
  if (modal) {
    await dispatch(getDSNhanVien());
    await dispatch(switchChucDanh(getState().dstruc.thongTinDS.tenPhongBan === 'Ban Giám Đốc' ? 'LANH_DAO' : 'BAC_SI'));
    await dispatch({
      type: ACTION_TYPES.TOGGLE_MODAL,
      modal
    });
  } else {
    await dispatch({
      type: ACTION_TYPES.TOGGLE_MODAL,
      modal
    });
  }
};

export const switchChucDanh = (chucDanhTruc: string) => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.SWITCH_CHUC_DANH,
    payload: { chucDanhTruc }
    /* Hiệu ứng loading 0.01s khi đổi chức danh */
    /*    payload: new Promise(resolve => {
      setTimeout(() => {
        resolve({ chucDanhTruc });
      }, 10);
    })*/
  });
};

export const themNhanVienVaoDS = dsMaNV => async (dispatch, getState) => {
  if (dsMaNV.length === 0) {
    message.error(responseMessage.PHAI_CHON_NHAN_VIEN);
    return;
  }
  const url = `${APIurl}/api/dstruc/thaydoi/themnv`;
  const data = {
    maDS: getState().dstruc.thongTinDS.maDS,
    dsMaNV,
    chucDanhTruc: getState().themnvtruc.chucDanhTruc
  };
  const res = await dispatch({
    type: ACTION_TYPES.THEM_NV_VAO_DS,
    payload: callAPI(url, 'put', headersJson, data)
  });
  const { thongTinDS, chiTietDS } = res.value.data;
  await dispatch(updateAfterDeleteAdd(thongTinDS, chiTietDS));
};
