import React from 'react';
import Loadable from 'react-loadable';
import loadingDiv from 'app/shared/util/loading';
import { Switch } from 'react-router-dom';
import menu, { menuPath } from 'app/modules/menu/menu';
import LoginLayoutRoute from 'app/modules/layout/login-layout';
import AppLayoutRoute from 'app/modules/layout/app-layout';
import ErrorLayoutRoute, { ErrorComponent } from 'app/modules/layout/error-layout';
import { ROLES } from 'app/shared/util/auth-utils';
import { Simulate } from 'react-dom/test-utils';
import load = Simulate.load;

const Login = Loadable({
  loader: () => import('app/modules/home/login'),
  loading: loadingDiv
});

const Home = Loadable({
  loader: () => import('app/modules/home'),
  loading: loadingDiv
});

const DSTruc = Loadable({
  loader: () => import('app/modules/dstruc'),
  loading: loadingDiv
});

const LichTruc = Loadable({
  loader: () => import('app/modules/lichtruc'),
  loading: loadingDiv
});

// const TaiKhoan = Loadable({
//   loader: () => import('app/modules/taikhoan'),
//   loading: loadingDiv
// });

const TaiKhoanBV = Loadable({
  loader: () => import('app/modules/taikhoan/TaiKhoanBV'),
  loading: loadingDiv
});

const XinVang = Loadable({
  loader: () => import('app/modules/xinvang'),
  loading: loadingDiv
});

const NhanVien = Loadable({
  loader: () => import('app/modules/danhmuc/Nhanvien'),
  loading: loadingDiv
});
//
// const DanhGia = Loadable({
//   loader: () => import('app/modules/danhmuc/danhgia'),
//   loading: loadingDiv
// });

const ThongKeBaoCao = Loadable({
  loader: () => import('app/modules/baocao/thongkebaocao'),
  loading: loadingDiv
});

const Routes = () => (
  <Switch>
    <LoginLayoutRoute path="/login" exact component={Login} />
    <AppLayoutRoute path="/" exact component={Home} roles={Object.values(ROLES)} />
    <AppLayoutRoute
      path={menuPath.DANH_SACH}
      exact
      component={DSTruc}
      roles={[
        ROLES.ADMIN,
        ROLES.GIAM_DOC_DV,
        ROLES.LANH_DAO_DV,
        ROLES.TRUONG_PHONG_KHTH,
        ROLES.CAN_BO_PHONG_KHTH,
        ROLES.DIEU_DUONG_TRUONG,
        ROLES.TRUONG_PHONG_BAN
      ]}
    />
    <AppLayoutRoute path={menuPath.LICH_TRUC} exact component={LichTruc} roles={Object.values(ROLES)} />
    <AppLayoutRoute
      path={menuPath.XIN_VANG}
      exact
      component={XinVang}
      roles={[ROLES.DIEU_DUONG_TRUONG, ROLES.TRUONG_PHONG_BAN, ROLES.CAN_BO_BV]}
    />
    {/*<AppLayoutRoute path={menuPath.TAI_KHOAN} exact component={TaiKhoan} roles={[ROLES.ADMIN]} />*/}
    <AppLayoutRoute path={menuPath.TAI_KHOANBV} exact component={TaiKhoanBV} roles={[ROLES.ADMIN]} />
    <AppLayoutRoute
      path={menuPath.NHAN_VIEN} exact component={NhanVien}
      roles={[ROLES.ADMIN,
        ROLES.GIAM_DOC_DV,
        ROLES.TRUONG_PHONG_KHTH,
        ROLES.DIEU_DUONG_TRUONG,
        ROLES.TRUONG_PHONG_BAN,
        ROLES.LANH_DAO_DV]}
    />
    {/*<AppLayoutRoute*/}
    {/*  path={menuPath.DANH_GIA} exact component={DanhGia}*/}
    {/*  roles={[ROLES.ADMIN,*/}
    {/*    ROLES.GIAM_DOC_DV,*/}
    {/*    ROLES.TRUONG_PHONG_KHTH,*/}
    {/*    ROLES.DIEU_DUONG_TRUONG,*/}
    {/*    ROLES.TRUONG_PHONG_BAN,*/}
    {/*    ROLES.LANH_DAO_DV]}*/}
    {/*/>*/}
    <AppLayoutRoute
      path={menuPath.BAO_CAO} exact component={ThongKeBaoCao}
      roles={[ROLES.ADMIN,
        ROLES.GIAM_DOC_DV,
        ROLES.TRUONG_PHONG_KHTH,
        ROLES.TRUONG_PHONG_BAN,
        ROLES.LANH_DAO_DV,
        ROLES.DIEU_DUONG_TRUONG
      ]} />
    <ErrorLayoutRoute path="/403" component={() => <ErrorComponent statusCode={403} />} />
    <ErrorLayoutRoute component={() => <ErrorComponent statusCode={404} />} />
  </Switch>
);

export default Routes;
