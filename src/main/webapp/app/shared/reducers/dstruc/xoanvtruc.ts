import { APIurl, callAPI, headersJson } from 'app/shared/util/axios-util';
import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import { message, Modal } from 'antd';
import responseMessage from 'app/shared/reducers/responseMessage';
import { updateAfterDeleteAdd } from 'app/shared/reducers/dstruc/index';
import _arr from 'lodash/array';
import Axios from 'axios';

export const ACTION_TYPES = {
  SHOW_MODAL: 'xoanvtruc/show_modal',
  ADD_TO_DELETE_LIST: 'xoanvtruc/add_nv_to_delete_list',
  XOA_NV: 'xoanvtruc/xoa_nv',
  XOA_CDTRUC_NV: 'xoanvtruc/xoa_chuc_danh'
};

const initialState = {
  modal: false,
  selectedRows: [],
  deleteing: false
};

export type XoaNVTrucState = Readonly<typeof initialState>;

export default (state: XoaNVTrucState = initialState, action): XoaNVTrucState => {
  switch (action.type) {
    case ACTION_TYPES.SHOW_MODAL:
      return {
        ...state,
        modal: action.modal
      };
    case ACTION_TYPES.ADD_TO_DELETE_LIST:
      return {
        ...state,
        selectedRows: action.selectedRows
      };
    case REQUEST(ACTION_TYPES.XOA_NV):
      return {
        ...state,
        deleteing: true
      };
    case FAILURE(ACTION_TYPES.XOA_NV):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state,
        deleteing: false
      };
    case SUCCESS(ACTION_TYPES.XOA_NV):
      message.success(responseMessage.THANH_CONG);
      return {
        ...state,
        deleteing: false
      };
    case SUCCESS(ACTION_TYPES.XOA_CDTRUC_NV):
      message.success(responseMessage.THANH_CONG);
      return {
        ...state
      };
    case FAILURE(ACTION_TYPES.XOA_CDTRUC_NV):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state
      };
    default:
      return {
        ...state
      };
  }
};

export const toggleModal = (modal: boolean) => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.SHOW_MODAL,
    modal
  });
};

export const addNVToDeleteList = selectedRows => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.ADD_TO_DELETE_LIST,
    selectedRows
  });
};

export const xoaNhanVien = () => async (dispatch, getState) => {
  const { selectedRows } = getState().xoanvtruc;
  const dsMaPhanCong = [];
  selectedRows.forEach(row => dsMaPhanCong.push(row.maPhanCong));
  const url = `${APIurl}/api/dstruc/thaydoi/xoanv`;
  const res = await dispatch({
    type: ACTION_TYPES.XOA_NV,
    payload: callAPI(url, 'put', headersJson, {
      maDS: getState().dstruc.thongTinDS.maDS,
      dsMaPhanCong: _arr.flattenDeep(dsMaPhanCong)
    })
  });
  const { thongTinDS, chiTietDS } = res.value.data;
  await dispatch(updateAfterDeleteAdd(thongTinDS, chiTietDS));
  await dispatch(addNVToDeleteList([]));
  await dispatch(toggleModal(false));
};

export const xoaChucDanhTrucNhanVien = (maNhanVien, maDS, chucDanhTruc) => async (dispatch, getState) => {
  const url = `${APIurl}/api/dstruc/thaydoi/xoanv/${maNhanVien}`;
  const res = await dispatch({
    type: ACTION_TYPES.XOA_CDTRUC_NV,
    payload: Axios.put(
      url,
      {},
      {
        headers: headersJson,
        params: {
          maDS,
          chucDanhTruc
        }
      }
    )
  });
  const { thongTinDS, chiTietDS } = res.value.data;
  await dispatch(updateAfterDeleteAdd(thongTinDS, chiTietDS));
};
