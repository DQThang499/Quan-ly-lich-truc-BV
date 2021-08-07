import { combineReducers } from 'redux';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */
import authentication, { AuthenticationState } from './authentication';
import header, { HeaderState } from 'app/shared/reducers/header';
import dstruc, { DSTrucState } from 'app/shared/reducers/dstruc';
import themnvtruc, { ThemNVTrucState } from 'app/shared/reducers/dstruc/themnvtruc';
import xoanvtruc, { XoaNVTrucState } from 'app/shared/reducers/dstruc/xoanvtruc';
import lichsuds, { LichSuDSState } from 'app/shared/reducers/dstruc/lichsuds';
import dmvangtruc, { DMVangTrucState } from 'app/shared/reducers/dstruc/dmvangtruc';
import nhapvangtruc, { NhapVangTrucState } from 'app/shared/reducers/dstruc/nhapvangtruc';
import lichtruc, { LichTrucState } from 'app/shared/reducers/lichtruc';
import dieuchinhlich, { DieuChinhLichState } from 'app/shared/reducers/lichtruc/dieuchinhlich';
import xinvang, { XinVangState } from 'app/shared/reducers/xinvang';
import nhanvien, { NhanVienState } from 'app/shared/reducers/danhmuc/nhanvien';
import danhgia, { DanhGiaState } from 'app/shared/reducers/danhmuc/danhgia';
import taikhoanbv, { TaiKhoanBVState } from 'app/shared/reducers/taikhoanbv/taikhoan';
import taikhoannv, { TaiKhoannvState } from 'app/shared/reducers/danhmuc/taikhoannv';
import chinhsuatk, { EDitTKState } from 'app/shared/reducers/taikhoanbv/edittaikhoan';
import xoataikhoan, { XoaTaiKhoanState } from 'app/shared/reducers/taikhoanbv/xoataikhoan';
import thongkebaocao, { ThongKeBaoCaoState } from 'app/shared/reducers/baocao/thongkebaocao';

export interface IRootState {
  /* jhipster-needle-add-reducer-type - JHipster will add reducer type here */
  readonly authentication: AuthenticationState;
  readonly header: HeaderState;
  readonly dstruc: DSTrucState;
  readonly themnvtruc: ThemNVTrucState;
  readonly xoanvtruc: XoaNVTrucState;
  readonly lichsuds: LichSuDSState;
  readonly dmvangtruc: DMVangTrucState;
  readonly nhapvangtruc: NhapVangTrucState;
  readonly lichtruc: LichTrucState;
  readonly dieuchinhlich: DieuChinhLichState;
  readonly xinvang: XinVangState;
  readonly nhanvien: NhanVienState;
  readonly danhgia : DanhGiaState;
  readonly taikhoanbv: TaiKhoanBVState;
  readonly taikhoannv: TaiKhoannvState;
  readonly chinhsuatk: EDitTKState;
  readonly xoataikhoan: XoaTaiKhoanState;
  readonly thongkebaocao: ThongKeBaoCaoState ;
}

const rootReducer = combineReducers<IRootState>({
  authentication,
  header,
  dstruc,
  themnvtruc,
  xoanvtruc,
  lichsuds,
  dmvangtruc,
  nhapvangtruc,
  lichtruc,
  dieuchinhlich,
  xinvang,
  nhanvien,
  danhgia,
  taikhoanbv,
  taikhoannv,
  chinhsuatk,
  xoataikhoan,
  thongkebaocao
});

export default rootReducer;
