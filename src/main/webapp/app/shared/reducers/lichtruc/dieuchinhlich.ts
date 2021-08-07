import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import responseMessage from 'app/shared/reducers/responseMessage';
import { APIurl, callAPI, headersJson } from 'app/shared/util/axios-util';
import axios from 'axios';
import moment from 'moment';
import { capNhatSauKhiDieuChinh, capNhatSauKhiXoa } from 'app/shared/reducers/lichtruc/index';
import { message } from 'antd';

export const ACTION_TYPES = {
  TOGGLE_MODAL: 'dieuchinhlich/toggle_modal',
  FORWARD_DATA: 'dieuchinhlich/forward_data',
  GET_DS_TRUC_THEO_NGAY: 'dieuchinhlich/getds_theo_ngay',
  DIEU_CHINH: 'dieuchinhlich/thay_doi_nguoi_truc',
  XOA_NV_TRUC: 'dieuchinhlich/xoa_nguoi_truc',
  CAP_NHAT_SAU_XOA: 'dieuchinhlich/cap_nhat_sau_khi_xoa',
  THEO_DOI_TRUC: 'dieuchinhlich/theo_doi_truc',
  GET_SO_THEO_DOI: 'dieuchinhlich/get_so_theo_doi',
  XOA_THEO_DOI: 'dieuchinhlich/xoa_theo_doi'
};

const initialState = {
  modal: false,
  cell: null,
  chucDanhTruc: null,
  maPhanCong: null,
  caTruc: null,
  gettingDS: false,
  dsPhanCong: [],
  saving: false,
  deleting: false,
  monitoring: false,
  gettingSoTheoDoi: false,
  soTheoDoi: [],
  deleting_theoDoi: false
};

export type DieuChinhLichState = Readonly<typeof initialState>;

export default (state: DieuChinhLichState = initialState, action): DieuChinhLichState => {
  switch (action.type) {
    case ACTION_TYPES.TOGGLE_MODAL:
      return {
        ...state,
        modal: action.modal
      };
    case ACTION_TYPES.FORWARD_DATA:
      return {
        ...state,
        cell: action.cell
      };
    case REQUEST(ACTION_TYPES.GET_DS_TRUC_THEO_NGAY):
      return {
        ...state,
        gettingDS: true
      };
    case FAILURE(ACTION_TYPES.GET_DS_TRUC_THEO_NGAY):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state,
        gettingDS: false
      };
    case SUCCESS(ACTION_TYPES.GET_DS_TRUC_THEO_NGAY):
      return {
        ...state,
        gettingDS: false,
        dsPhanCong: action.payload.data.chiTietDS
      };
    case REQUEST(ACTION_TYPES.DIEU_CHINH):
      return {
        ...state,
        saving: true
      };
    case FAILURE(ACTION_TYPES.DIEU_CHINH):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state,
        saving: false
      };
    case SUCCESS(ACTION_TYPES.DIEU_CHINH):
      message.success(responseMessage.THANH_CONG);
      const res = action.payload.data;
      const { data } = state.cell;
      const idxTmp = data.findIndex(value => value.chucDanhTruc === res.chucDanhTruc && value.caTruc === res.caTruc);
      if (idxTmp === -1) data.push(res);
      else data[idxTmp] = res;
      const cell = { ...state.cell, data };
      return {
        ...state,
        cell,
        saving: false
      };
    case REQUEST(ACTION_TYPES.XOA_NV_TRUC):
      return {
        ...state,
        deleting: true
      };
    case FAILURE(ACTION_TYPES.XOA_NV_TRUC):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state,
        deleting: false
      };
    case SUCCESS(ACTION_TYPES.XOA_NV_TRUC):
      message.success(responseMessage.THANH_CONG);
      return {
        ...state,
        deleting: false
      };
    case ACTION_TYPES.CAP_NHAT_SAU_XOA:
      return {
        ...state,
        cell: {
          ...state.cell,
          data: state.cell.data.filter(value => value.maChiTiet !== action.maCTLT)
        }
      };
    case REQUEST(ACTION_TYPES.THEO_DOI_TRUC):
      return {
        ...state,
        monitoring: true
      };
    case FAILURE(ACTION_TYPES.THEO_DOI_TRUC):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state,
        monitoring: false
      };
    case SUCCESS(ACTION_TYPES.THEO_DOI_TRUC):
      message.success(responseMessage.THANH_CONG);
      const { soTheoDoi } = state;
      const idx = soTheoDoi.findIndex(row => row.maChiTiet === action.payload.data.maChiTiet);
      if (idx === -1) soTheoDoi.push(action.payload.data);
      else soTheoDoi[idx] = action.payload.data;
      return {
        ...state,
        monitoring: false,
        soTheoDoi
      };
    case REQUEST(ACTION_TYPES.GET_SO_THEO_DOI):
      return {
        ...state,
        gettingSoTheoDoi: true
      };
    case FAILURE(ACTION_TYPES.GET_SO_THEO_DOI):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state,
        gettingSoTheoDoi: false
      };
    case SUCCESS(ACTION_TYPES.GET_SO_THEO_DOI):
      return {
        ...state,
        gettingSoTheoDoi: false,
        soTheoDoi: action.payload.data
      };
    case REQUEST(ACTION_TYPES.XOA_THEO_DOI):
      return {
        ...state,
        deleting_theoDoi: true
      };
    case FAILURE(ACTION_TYPES.XOA_THEO_DOI):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state,
        deleting_theoDoi: false
      };
    case SUCCESS(ACTION_TYPES.XOA_THEO_DOI):
      message.success(responseMessage.THANH_CONG);
      return {
        ...state,
        deleting_theoDoi: false,
        soTheoDoi: state.soTheoDoi.filter(row => row.maChiTiet !== action.payload.config.params.maCTLT)
      };
    default:
      return state;
  }
};

export const toggleModalDieuChinh = (modal: boolean) => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.TOGGLE_MODAL,
    modal
  });
};

export const forwardData = cell => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.FORWARD_DATA,
    cell
  });
};

export const getDSTheoNgay = date => async (dispatch, getState) => {
  const { maPhongBan, maDonVi } = getState().lichtruc;
  const ngayTruc = moment(date).format('YYYY/MM/DD');
  const url = `${APIurl}/api/lichtruc/thaydoi/dsnv`;
  await dispatch({
    type: ACTION_TYPES.GET_DS_TRUC_THEO_NGAY,
    payload: axios.get(url, {
      headers: headersJson,
      params: { ngayTruc, maPhongBan, maDonVi }
    })
  });
};

export const thayDoiNguoiTruc = (ngayTruc, caTruc, maPhanCong) => async (dispatch, getState) => {
  const { maLT } = getState().lichtruc.thongTinLichTruc;
  const data = { ngayTruc, caTruc, maPhanCong, maLT };
  const url = `${APIurl}/api/lichtruc/thaydoi/them-nguoi-truc`;
  const res = await dispatch({
    type: ACTION_TYPES.DIEU_CHINH,
    payload: callAPI(url, 'put', headersJson, data)
  });
  await dispatch(capNhatSauKhiDieuChinh(res.value.data));
};

export const xoaNhanVienTruc = maCTLT => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.XOA_NV_TRUC,
    payload: axios.delete(`${APIurl}/api/lichtruc/thaydoi/xoa-nguoi-truc/${maCTLT}`, {
      headers: headersJson
    })
  });
  await dispatch({
    type: ACTION_TYPES.CAP_NHAT_SAU_XOA,
    maCTLT
  });
  await dispatch(capNhatSauKhiXoa(maCTLT));
};

export const theoDoiTruc = (maCTLT, maNhanVienTT) => async (dispatch, getState) => {
  const url = `${APIurl}/api/lichtruc/theo-doi/`;
  await dispatch({
    type: ACTION_TYPES.THEO_DOI_TRUC,
    payload: axios.put(url, null, {
      headers: headersJson,
      params: {
        maCTLT,
        maNhanVienTT
      }
    })
  });
};

export const getSoTheoDoi = (maLT, ngayTruc) => async (dispatch, getState) => {
  const url = `${APIurl}/api/lichtruc/theo-doi/`;
  await dispatch({
    type: ACTION_TYPES.GET_SO_THEO_DOI,
    payload: axios.get(url, {
      headers: headersJson,
      params: {
        maLT,
        ngayTruc: moment(ngayTruc).format('YYYY/MM/DD')
      }
    })
  });
};

export const xoaTheoDoi = maCTLT => async (dispatch, getState) => {
  const url = `${APIurl}/api/lichtruc/theo-doi/`;
  await dispatch({
    type: ACTION_TYPES.XOA_THEO_DOI,
    payload: axios.delete(url, {
      headers: headersJson,
      params: {
        maCTLT
      }
    })
  });
};
