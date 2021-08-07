import { EHRSessionStorage } from 'app/modules/ehr/sessionStorage/ehrStorageService';
import { isLogged, getUserRoleName } from 'app/shared/util/auth-utils';

export const ACTION_TYPES = {
  INIT_SESSION: 'header/init',
  CLEAR: 'header/clear',
  TOGGLE_MODAL: 'header/toggle_modal'
};

const initialState = {
  logged: false,
  tenDangNhap: null as string,
  tenVaiTro: null as string,
  donVi: null as any,
  dsDonVi: [],
  modal: false
};

export type HeaderState = Readonly<typeof initialState>;

export default (state: HeaderState = initialState, action): HeaderState => {
  switch (action.type) {
    case ACTION_TYPES.INIT_SESSION:
      return !isLogged()
        ? { ...state }
        : {
            ...state,
            logged: true,
            tenDangNhap: EHRSessionStorage.get('tenNhanVien'),
            tenVaiTro: getUserRoleName(),
            donVi: JSON.parse(EHRSessionStorage.get('donVi')),
            dsDonVi: JSON.parse(EHRSessionStorage.get('dsDonVi'))
          };
    case ACTION_TYPES.CLEAR:
      return {
        ...initialState
      };
    case ACTION_TYPES.TOGGLE_MODAL:
      return {
        ...state,
        modal: action.modal
      };
    default:
      return {
        ...state
      };
  }
};

export const initSession = () => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.INIT_SESSION
  });
};

export const clearSession = () => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.CLEAR
  });
};

export const toggleModal = (modal: boolean) => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.TOGGLE_MODAL,
    modal
  });
};
