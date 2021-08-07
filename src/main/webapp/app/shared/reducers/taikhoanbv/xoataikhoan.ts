import { APIurl, callAPI, headersJson } from 'app/shared/util/axios-util';
import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import { message, Modal } from 'antd';
import responseMessage from 'app/shared/reducers/responseMessage';

export const ACTION_TYPES = {
  SHOW_MODAL: 'xoanvtruc/show_modal',
  ADD_TO_DELETE_LIST: 'xoanvtruc/add_nv_to_delete_list',
  XOA_NV: 'xoanvtruc/xoa_nv'
};

const initialState = {
  modal: false,
  selectedRows: [],
  deleteing: false
};

export type XoaTaiKhoanState = Readonly<typeof initialState>;

export default (state: XoaTaiKhoanState = initialState, action): XoaTaiKhoanState => {
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
