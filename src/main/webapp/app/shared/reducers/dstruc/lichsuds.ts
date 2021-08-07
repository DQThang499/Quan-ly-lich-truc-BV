import { APIurl, callAPI, headersJson } from 'app/shared/util/axios-util';
import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import { message } from 'antd';
import responseMessage from 'app/shared/reducers/responseMessage';

export const ACTION_TYPES = {
  GET_LICH_SU: 'lichsuds/get_lich_su',
  TOGGLE_LICH_SU: 'lichsuds/toggle_lich_su'
};

const initialState = {
  loadingLS: false,
  modalLS: false,
  tongSoDong: 0,
  duLieu: []
};

export type LichSuDSState = Readonly<typeof initialState>;

export default (state: LichSuDSState = initialState, action): LichSuDSState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_LICH_SU):
      return {
        ...state,
        loadingLS: true,
        duLieu: []
      };
    case FAILURE(ACTION_TYPES.GET_LICH_SU):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state,
        loadingLS: false,
        duLieu: []
      };
    case SUCCESS(ACTION_TYPES.GET_LICH_SU):
      const { duLieu, tongSoDong } = action.payload.data;
      return {
        ...state,
        loadingLS: false,
        duLieu,
        tongSoDong
      };
    case ACTION_TYPES.TOGGLE_LICH_SU:
      const { modalLS } = action;
      return {
        ...state,
        modalLS
      };
    default:
      return state;
  }
};

export const getLichSuDS = (trang, soDong) => async (dispatch, getState) => {
  const { maDS } = getState().dstruc.thongTinDS;
  const url = `${APIurl}/api/dstruc/duyet/lich-su-thay-doi/?maDS=${maDS}&trang=${trang}&soDong=${soDong}`;
  await dispatch({
    type: ACTION_TYPES.GET_LICH_SU,
    payload: callAPI(url, 'get', headersJson, {})
  });
};

export const toggleLichSuModal = (modalLS: boolean) => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.TOGGLE_LICH_SU,
    modalLS
  });
};
