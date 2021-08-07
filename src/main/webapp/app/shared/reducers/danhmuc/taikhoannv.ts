import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { message } from 'antd';
import responseMessage from 'app/shared/reducers/responseMessage';
import { EHRSessionStorage } from 'app/modules/ehr/sessionStorage/ehrStorageService';
import axios from 'axios';
export const ACTION_TYPES = {
  GET_DS_TAIKHOAN: 'danhmuc/GET_DS_TAIKHOAN',
  TOGGLE_DMTAIKHOAN: 'danhmuc/TOGGLE_DMTAIKHOAN',
  FORWARD_NHANVIEN: 'danhmuc/FORWARD_NHANVIEN',
  SAVE_TAIKHOAN: 'danhmuc/SAVE_TAIKHOAN',
  TAO_TK: 'danhmuc/TAO_TK'
};

const initialState = {
  loadingNV: null,
  errorMessage: null,
  successMessage: null,
  danhSachTaiKhoan: [],
  maNhanVien: null,
  tenNhanVien: null,
  creating: false,
  modal: false,
  updateSuccess: false
};

export type TaiKhoannvState = Readonly<typeof initialState>;

export default (state: TaiKhoannvState = initialState, action): TaiKhoannvState => {
  switch (action.type) {
    case ACTION_TYPES.TOGGLE_DMTAIKHOAN:
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
    case REQUEST(ACTION_TYPES.GET_DS_TAIKHOAN):
      return {
        ...state,
        errorMessage: null,
        loadingNV: true
      };
    case REQUEST(ACTION_TYPES.SAVE_TAIKHOAN):
      return {
        ...state,
        creating: true
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
    case FAILURE(ACTION_TYPES.SAVE_TAIKHOAN):
      message.error(responseMessage.CLICK_TAO);
      return {
        ...state,
        creating: false
      };
    case SUCCESS(ACTION_TYPES.GET_DS_TAIKHOAN):
      return {
        ...state,
        loadingNV: false,
        successMessage: 'GET_DS_TAIKHOAN',
        danhSachTaiKhoan: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.SAVE_TAIKHOAN):
      message.success(responseMessage.TAO_TAIKHOAN);
      return {
        ...state,
        creating: false
      };
    case SUCCESS(ACTION_TYPES.TAO_TK):
      return {
        ...state
      };
    default:
      return state;
  }
};
export const toggleDmtaotaikhoan = (modal: boolean) => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.TOGGLE_DMTAIKHOAN,
    modal
  });
};

export const forwardNhanVienTK = (maNhanVien, tenNhanVien) => async (dispatch, getState) => {
  await dispatch({ // khởi tạo theo biến tsx phải giống
    type: ACTION_TYPES.FORWARD_NHANVIEN,
    maNhanVien,
    tenNhanVien
  });
};

export const APITaiKhoanurl = '/taikhoan';

export const luutaikhoan = (maNhanVien, tenDangNhap, matKhau) => async (dispatch, getState) => {
  const { maDonVi } = JSON.parse(EHRSessionStorage.get('donVi'));
  const result = await dispatch({
    type: ACTION_TYPES.SAVE_TAIKHOAN,
    payload: axios.post(`${APITaiKhoanurl}/api/taikhoanbv/luu-taikhoannv/${maNhanVien}?dvtt=${maDonVi}&tenDangNhap=${tenDangNhap}&matKhau=${matKhau}`)
  });
  return result;
};
