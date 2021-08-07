import { ILichTruc } from 'app/modules/lichtruc/model/lichtruc';
import { EHRSessionStorage } from 'app/modules/ehr/sessionStorage/ehrStorageService';
import { APIurl, callAPI, headersJson } from 'app/shared/util/axios-util';
import axios from 'axios';
import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import responseMessage from 'app/shared/reducers/responseMessage';
import { message } from 'antd';
import moment from 'moment';
import { weekDays } from 'app/modules/lichtruc/lichthang';
import { saveAs } from 'file-saver';

export const ACTION_TYPES = {
  RESET: 'lichtruc/reset_state',
  INIT: 'lichtruc/init',
  GET_LICH_TRUC: 'lichtruc/get_lich_truc',
  DRAW_LICH_TRUC: 'lichtruc/draw_lich_truc',
  LAP_LICH: 'lichtruc/lap_lich',
  DUYET_LICH: 'lichtruc/duyet',
  TU_XEP_LICH: 'lichtruc/tu_xep_lich',
  CAP_NHAT_SAU_DIEU_CHINH: 'lichtruc/cap_nhat_sau_khi_dieu_chinh',
  CAP_NHAT_SAU_XOA: 'lichtruc/cap_nhat_sau_khi_xoa',
  IN_LICH: 'lichtruc/in_lich',
  TOGGLE_XEM_THAY_DOI: 'lichtruc/toggle_xem_thay_doi',
  GET_DS_THAY_DOI: 'lichtruc/get_ds_thay_doi',
  XOA_LICH: 'lichtric/xoa_lich'
};

const initialState = {
  cells: new Array(54), // DS cell để vẽ lịch
  thang: null,
  nam: null,
  maPhongBan: null,
  tenPhongBan: null,
  maDonVi: null,
  errorMessage: null,
  loading: false,
  creating: false,
  approving: false,
  thongTinLichTruc: null as ILichTruc,
  chiTietLT: [],
  scheduling: false,
  printing: false,
  deleting: false,
  modalXemThayDoi: false,
  dsThayDoi: [],
  tongSoDongDSThayDoi: 0,
  gettingDSThayDoi: false
};

export type LichTrucState = Readonly<typeof initialState>;

export default (state: LichTrucState = initialState, action): LichTrucState => {
  switch (action.type) {
    case ACTION_TYPES.INIT:
      const { thang, nam, maPhongBan, maDonVi } = action;
      return {
        ...state,
        thang,
        nam,
        maPhongBan,
        maDonVi
      };
    case ACTION_TYPES.DRAW_LICH_TRUC:
      return {
        ...state,
        cells: action.cells
      };
    case REQUEST(ACTION_TYPES.GET_LICH_TRUC):
      return {
        ...state,
        loading: true,
        thongTinLichTruc: null as ILichTruc,
        chiTietLT: [],
        errorMessage: null
      };
    case FAILURE(ACTION_TYPES.GET_LICH_TRUC):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload.response.status === 422 ? responseMessage.LICH_KHONG_TIM_THAY : responseMessage.LOI_HE_THONG
      };
    case SUCCESS(ACTION_TYPES.GET_LICH_TRUC):
      return {
        ...state,
        loading: false,
        thongTinLichTruc: action.payload.data.thongTinLichTruc as ILichTruc,
        chiTietLT: action.payload.data.chiTietLT
      };
    case REQUEST(ACTION_TYPES.LAP_LICH):
      return {
        ...state,
        creating: true
      };
    case FAILURE(ACTION_TYPES.LAP_LICH):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state,
        creating: false
      };
    case SUCCESS(ACTION_TYPES.LAP_LICH):
      message.success(responseMessage.THAO_TAC_THANH_CONG);
      return {
        ...state,
        creating: false
      };
    case REQUEST(ACTION_TYPES.DUYET_LICH):
      return {
        ...state,
        approving: true
      };
    case FAILURE(ACTION_TYPES.DUYET_LICH):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state,
        approving: false
      };
    case SUCCESS(ACTION_TYPES.DUYET_LICH):
      return {
        ...state,
        approving: false,
        thongTinLichTruc: action.payload.data as ILichTruc
      };
    case REQUEST(ACTION_TYPES.TU_XEP_LICH):
      return {
        ...state,
        scheduling: true
      };
    case FAILURE(ACTION_TYPES.TU_XEP_LICH):
      if (action.payload.response.status === 409) {
        message.error(responseMessage.DANH_SACH_CHUA_DUYET);
      } else if (action.payload.response.status === 422) {
        message.error(responseMessage.DANH_SACH_KHONG_DU_DK);
      } else message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state,
        scheduling: false
      };
    case SUCCESS(ACTION_TYPES.TU_XEP_LICH):
      message.success(responseMessage.THANH_CONG);
      return {
        ...state,
        scheduling: false
      };
    case ACTION_TYPES.CAP_NHAT_SAU_DIEU_CHINH:
      const { chiTietLT } = state;
      const tmp = state.chiTietLT.findIndex(row => row.maChiTiet === action.data.maChiTiet);
      if (tmp === -1) chiTietLT.push(action.data);
      else chiTietLT[tmp] = action.data;
      return {
        ...state,
        chiTietLT
      };
    case ACTION_TYPES.CAP_NHAT_SAU_XOA:
      return {
        ...state,
        chiTietLT: state.chiTietLT.filter(value => value.maChiTiet !== action.maCTLT)
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    case REQUEST(ACTION_TYPES.IN_LICH):
      return {
        ...state,
        printing: true
      };
    case REQUEST(ACTION_TYPES.XOA_LICH):
      return {
        ...state,
        deleting: true
      };
    case FAILURE(ACTION_TYPES.IN_LICH):
      message.error(action.payload.response.status === 422 ? responseMessage.CHUA_DU_PHONG_BAN : responseMessage.LOI_HE_THONG);
      return {
        ...state,
        printing: false
      };
    case FAILURE(ACTION_TYPES.XOA_LICH):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state,
        deleting: false
      };
    case SUCCESS(ACTION_TYPES.IN_LICH):
      message.success(responseMessage.THANH_CONG);
      return {
        ...state,
        printing: false
      };
    case SUCCESS(ACTION_TYPES.XOA_LICH):
      message.success(responseMessage.THANH_CONG);
      return {
        ...state,
        deleting: false
      };
    case ACTION_TYPES.TOGGLE_XEM_THAY_DOI:
      return {
        ...state,
        modalXemThayDoi: action.modalXemThayDoi
      };
    case REQUEST(ACTION_TYPES.GET_DS_THAY_DOI):
      return {
        ...state,
        gettingDSThayDoi: true,
        dsThayDoi: []
      };
    case FAILURE(ACTION_TYPES.GET_DS_THAY_DOI):
      message.error(responseMessage.LOI_HE_THONG);
      return {
        ...state,
        gettingDSThayDoi: false
      };
    case SUCCESS(ACTION_TYPES.GET_DS_THAY_DOI):
      return {
        ...state,
        gettingDSThayDoi: false,
        dsThayDoi: action.payload.data.duLieu,
        tongSoDongDSThayDoi: action.payload.data.tongSoDong
      };
    default:
      return state;
  }
};

export const init = (thang: number, nam: number, maPhongBan: string) => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.INIT,
    thang,
    nam,
    maPhongBan,
    maDonVi: JSON.parse(EHRSessionStorage.get('donVi')).maDonVi
  });
  await dispatch(getLichTruc());
  await dispatch(getDSThaDoi(0, 20));
};

export const getLichTruc = () => async (dispatch, getState) => {
  const { thang, nam, maPhongBan, maDonVi } = getState().lichtruc;
  const url = `${APIurl}/api/lichtruc/xem/`;
  await dispatch({
    type: ACTION_TYPES.GET_LICH_TRUC,
    payload: axios.get(url, {
      headers: headersJson,
      params: { thang, nam, maPhongBan, maDonVi }
    })
  });
};

/* Vẽ lịch trực */
export const drawLichTruc = () => async (dispatch, getState) => {
  const { thang, nam } = getState().lichtruc;
  const startMonth = Number(
    moment([nam, thang - 1]) // Để có được ngày và giờ hiện tại,
      .startOf('month')
      .format('DD')
  );
  const endMonth = Number(
    moment([nam, thang - 1])
      .endOf('month')
      .format('DD')
  );
  const cells = new Array(54);
  const firstIndex = weekDays.indexOf(
    moment([nam, thang - 1])
      .startOf('month')
      .format('dddd')
  );
  const { chiTietLT } = getState().lichtruc;
  for (let day = startMonth; day <= endMonth; day++) {
    cells[firstIndex + day - 1] = {
      ngay: new Date(nam, thang - 1, day),
      data: chiTietLT.filter(chiTiet => {
        const tmp = chiTiet.ngayTruc.toString().split('-');
        const ngayTruc = new Date(tmp[0], tmp[1] - 1, tmp[2]);
        return ngayTruc.toLocaleDateString() === new Date(nam, thang - 1, day).toLocaleDateString();
      })
    };
  }
  await dispatch({
    type: ACTION_TYPES.DRAW_LICH_TRUC,
    cells
  });
};

export const lapLich = () => async (dispatch, getState) => {
  const { thang, nam, maPhongBan, maDonVi } = getState().lichtruc;
  const url = `${APIurl}/api/lichtruc/thaydoi/tao`;
  await dispatch({
    type: ACTION_TYPES.LAP_LICH,
    payload: callAPI(url, 'post', headersJson, { thang, nam, maPhongBan, maDonVi })
  });
  await dispatch(getLichTruc());
};

export const duyetLichTruc = (duyet: boolean) => async (dispatch, getState) => {
  const { maLT } = getState().lichtruc.thongTinLichTruc;
  const url = `${APIurl}/api/lichtruc/duyet/${duyet ? 'duyet' : 'huy'}/${maLT}`;
  await dispatch({
    type: ACTION_TYPES.DUYET_LICH,
    payload: callAPI(url, 'put', headersJson, {})
  });
};

export const resetState = () => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.RESET
  });
};

export const autoScheduled = () => async (dispatch, getState) => {
  const { maLT } = getState().lichtruc.thongTinLichTruc;
  const url = `${APIurl}/api/lichtruc/thaydoi/tu-xep-lich/${maLT}`;
  await dispatch({
    type: ACTION_TYPES.TU_XEP_LICH,
    payload: axios.post(
      url,
      { headers: headersJson },
      {
        params: {
          kichTruocQuanThe: 100,
          soLanLap: 100
        }
      }
    )
  });
  await dispatch(getLichTruc());
  await dispatch(drawLichTruc());
};

export const capNhatSauKhiDieuChinh = data => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.CAP_NHAT_SAU_DIEU_CHINH,
    data: {
      ...data,
      ngayTruc: moment(data.ngayTruc).format('YYYY-MM-DD')
    }
  });
  await dispatch(drawLichTruc());
};

export const capNhatSauKhiXoa = maCTLT => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.CAP_NHAT_SAU_XOA,
    maCTLT
  });
  await dispatch(drawLichTruc());
};

export const inLichTongTruc = (weekOfMonth, thang, nam) => async (dispatch, getState) => {
  const url = `${APIurl}/api/report/lich-tong-truc`;
  const { maDonVi } = JSON.parse(EHRSessionStorage.get('donVi'));
  const params = { weekOfMonth, thang, nam, maDonVi };
  const res = await dispatch({
    type: ACTION_TYPES.IN_LICH,
    payload: axios.get(url, { params, responseType: 'blob' })
  });
  await saveAs(res.value.data, `bang_toan_truc_${weekOfMonth}_${thang}_${nam}.pdf`);
};

export const inLich = () => async (dispatch, getState) => {
  const url = `${APIurl}/api/report/lich-truc`;
  const { thang, nam, maDonVi, maPhongBan } = getState().lichtruc;
  const lanhDao = maPhongBan === '';
  const params = lanhDao ? { thang, nam, maDonVi } : { thang, nam, maDonVi, maPhongBan };
  const res = await dispatch({
    type: ACTION_TYPES.IN_LICH,
    payload: axios.get(url, { params, responseType: 'blob' })
  });
  await saveAs(res.value.data, `bang_thuong_truc_${lanhDao ? 'lanh_dao' : maPhongBan}_${thang}_${nam}.pdf`);
};

export const toggleXemThayDoi = modalXemThayDoi => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.TOGGLE_XEM_THAY_DOI,
    modalXemThayDoi
  });
};

export const getDSThaDoi = (trang, soDong) => async (dispatch, getState) => {
  const { maLT } = getState().lichtruc.thongTinLichTruc;
  const url = `${APIurl}/api/lichtruc/theo-doi/${maLT}?trang=${trang}&soDong=${soDong}`;
  await dispatch({
    type: ACTION_TYPES.GET_DS_THAY_DOI,
    payload: callAPI(url, 'get', headersJson, {})
  });
};
