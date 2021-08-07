import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { message } from 'antd';
import responseMessage from 'app/shared/reducers/responseMessage';
import axios from 'axios';
import { APITaiKhoanurl , getDanhSach } from 'app/shared/reducers/taikhoanbv/taikhoan';

export const ACTION_TYPES = {
  TOGGLE_CHINHSUATAIKHOAN: 'danhmuc/TOGGLE_CHINHSUATAIKHOAN',
  FORWARD_TAIKHOAN: 'danhmuc/FORWARD_TAIKHOAN',
  UPDATE_TAIKHOAN: 'danhmuc/UPDATE_TAIKHOAN',
  DELETE_TAIKHOAN: 'danhmuc/DELETE_TAIKHOAN',
  CHECK_TK: 'danhmuc/CHECK_TK'
};

const initialState = {
  loadingNV: null,
  errorMessage: null,
  successMessage: null,
  creating: false,
  check: false,
  fail: false,
  deleteing: false,
  maNhanVien: null,
  tenNhanVien: null,
  tenDangNhap: null,
  matKhau: null,
  maNguoiDung: null,
  modal: false,
  updateSuccess: false
};

export type EDitTKState = Readonly<typeof initialState>;

export default (state: EDitTKState = initialState, action): EDitTKState => {
  switch (action.type) {
    case ACTION_TYPES.TOGGLE_CHINHSUATAIKHOAN:
      return {
        ...state,
        modal: action.modal
      };
    case ACTION_TYPES.FORWARD_TAIKHOAN:
      return {
        ...state,
        maNhanVien: action.maNhanVien,
        tenNhanVien: action.tenNhanVien,
        tenDangNhap: action.tenDangNhap,
        maNguoiDung: action.maNguoiDung
      };
    case REQUEST(ACTION_TYPES.UPDATE_TAIKHOAN):
      return {
        ...state,
        creating: true
      };
    case REQUEST(ACTION_TYPES.DELETE_TAIKHOAN):
      return {
        ...state,
        deleteing: true
      };
    case FAILURE(ACTION_TYPES.DELETE_TAIKHOAN):
      message.error(responseMessage.XOA_TK);
      return {
        ...state,
        deleteing: true
      };
    case FAILURE(ACTION_TYPES.UPDATE_TAIKHOAN):
      message.error(responseMessage.CHECK_TKMK);
      return {
        ...state,
        creating: false
      };
    case FAILURE(ACTION_TYPES.CHECK_TK):
      message.error(responseMessage.CHECK_TKMK);
      return {
        ...state,
        check: false
      };
    case SUCCESS(ACTION_TYPES.DELETE_TAIKHOAN):
      message.success(responseMessage.THANH_CONG);
      return {
        ...state,
        deleteing: false
      };
    case SUCCESS(ACTION_TYPES.UPDATE_TAIKHOAN):
      message.success(responseMessage.THAO_TAC_THANH_CONG);
      return {
        ...state,
        creating: false
      };
    case SUCCESS(ACTION_TYPES.CHECK_TK):
      message.success(responseMessage.CHECK_THANHCONG);
      return {
        ...state,
        check: false
      };
    default:
      return state;
  }
};
export const toggleDmtaotaikhoan = (modal: boolean) => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.TOGGLE_CHINHSUATAIKHOAN,
    modal
  });
};

export const forwardNhanVienTK = (maNhanVien, tenNhanVien, tenDangNhap, maNguoiDung) => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.FORWARD_TAIKHOAN,
    maNhanVien,
    tenNhanVien,
    tenDangNhap,
    maNguoiDung
  });
};

export const thayDoiTaiKhoan = (maNguoiDung, tenDangNhap, matKhau) => async (dispatch, getState) => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TAIKHOAN,
    payload: axios.put(`${APITaiKhoanurl}/api/taikhoanbv/thaydoi-tk/${maNguoiDung}?tenDangNhap=${tenDangNhap}&matKhau=${matKhau}`)
  });
  await dispatch(getDanhSach());
  return result;
};

export const deleteTaiKhoan = maNguoiDung => async (dispatch, getState) => {
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TAIKHOAN,
    payload: axios.delete(`${APITaiKhoanurl}/api/taikhoanbv/xoa-tk/${maNguoiDung}`)
  });
  await dispatch(getDanhSach());
  return result;
};
