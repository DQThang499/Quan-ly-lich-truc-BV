import { APIurl, callAPI, headersJson } from 'app/shared/util/axios-util';
import { EHRSessionStorage } from 'app/modules/ehr/sessionStorage/ehrStorageService';
import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import responseMessage from 'app/shared/reducers/responseMessage';
import { message } from 'antd';

export const ACTION_TYPES = {
  TOGGLE_DMVANG: 'dmvangtruc/toggle_modal',
  LAY_DU_LIEU: 'dmvangtruc/lay_du_lieu',
  DUYET_VANG_TRUC: 'dmvangtruc/duyet_vang_truc',
  UPDATE_AFTER_DUYET: 'dmvangtruc/update_trang_thai'
};

const initialState = {
  loadingData: false,
  duLieu: [],
  tongSoDong: 0,
  modal: false,
  approving: false
};

export type DMVangTrucState = Readonly<typeof initialState>;

export default (state: DMVangTrucState = initialState, action): DMVangTrucState => {
  switch (action.type) {
    case ACTION_TYPES.TOGGLE_DMVANG:
      return {
        ...state,
        modal: action.modal
      };
    case REQUEST(ACTION_TYPES.LAY_DU_LIEU):
      return {
        ...state,
        duLieu: [],
        tongSoDong: 0,
        loadingData: true
      };
    case FAILURE(ACTION_TYPES.LAY_DU_LIEU):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state,
        duLieu: [],
        tongSoDong: 0,
        loadingData: false
      };
    case SUCCESS(ACTION_TYPES.LAY_DU_LIEU):
      const { duLieu, tongSoDong } = action.payload.data;
      return {
        ...state,
        loadingData: false,
        duLieu,
        tongSoDong
      };
    case REQUEST(ACTION_TYPES.DUYET_VANG_TRUC):
      return {
        ...state,
        approving: true
      };
    case SUCCESS(ACTION_TYPES.DUYET_VANG_TRUC):
      return {
        ...state,
        approving: false
      };
    case FAILURE(ACTION_TYPES.DUYET_VANG_TRUC):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state,
        approving: false
      };
    case ACTION_TYPES.UPDATE_AFTER_DUYET:
      return {
        ...state,
        duLieu: action.duLieu
      };
    default:
      return {
        ...state
      };
  }
};

export const toggleDMVangTruc = (modal: boolean) => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.TOGGLE_DMVANG,
    modal
  });
};

export const getDanhMucVangTruc = (trang, soDong) => async (dispatch, getState) => {
  const { maDonVi } = JSON.parse(EHRSessionStorage.get('donVi'));
  const { maPhongBan } = getState().dstruc;
  const url = `${APIurl}/api/vangtruc/danhmuc-vt/?maPhongBan=${maPhongBan}&maDonVi=${maDonVi}&trang=${trang}&soDong=${soDong}`;
  await dispatch({
    type: ACTION_TYPES.LAY_DU_LIEU,
    payload: callAPI(url, 'get', headersJson, {})
  });
};

export const duyetVangTruc = (maVang, duyet: boolean) => async (dispatch, getState) => {
  const url = `${APIurl}/api/vangtruc/themvang/duyet/${duyet ? 'duyet' : 'huy'}/${maVang}`;
  const res = await dispatch({
    type: ACTION_TYPES.DUYET_VANG_TRUC,
    payload: callAPI(url, 'put', headersJson, {})
  });
  await dispatch(updateSauKhiDuyet(maVang, res.value.data));
};

export const updateSauKhiDuyet = (maVang, newRow) => async (dispatch, getState) => {
  const { duLieu } = getState().dmvangtruc;
  const index = duLieu.findIndex(row => row.maVang === maVang);
  duLieu[index] = newRow;
  await dispatch({
    type: ACTION_TYPES.UPDATE_AFTER_DUYET,
    duLieu
  });
};
