import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Icon, Menu as AntMenu, Switch } from 'antd';
import { Col, Input } from 'reactstrap';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { ROLES, hasAnyRole, IRole } from 'app/shared/util/auth-utils';

export interface ISubMenuObj {
  title: string;
  icon: string;
  key: number;
  item: IItem[];
  roles: IRole[];
}

export interface IItem {
  key: string;
  title: string;
  roles?: IRole[];
}

export const menuPath = {
  DANH_SACH: '/danh-sach-truc',
  LICH_TRUC: '/lich-truc',
  XIN_VANG: '/xin-vang-truc',
  TAI_KHOAN: '/tai-khoan',
  TAI_KHOANBV: '/tai-khoanbv',
  NHAN_VIEN : '/nhan-vien',
  DANH_GIA : '/danh-gia',
  BAO_CAO : '/thong-ke'
};
// https://fontawesome.com/icons/plus-circle
export const subMenuObj: ISubMenuObj[] = [
  {
    title: 'Chức năng chính',
    icon: 'schedule',
    key: 1,
    item: [
      {
        key: menuPath.DANH_SACH,
        title: 'Danh sách trực',
        roles: [
          ROLES.ADMIN,
          ROLES.GIAM_DOC_DV,
          ROLES.LANH_DAO_DV,
          ROLES.TRUONG_PHONG_KHTH,
          ROLES.CAN_BO_PHONG_KHTH,
          ROLES.DIEU_DUONG_TRUONG,
          ROLES.TRUONG_PHONG_BAN
        ]
      },
      {
        key: menuPath.LICH_TRUC,
        title: 'Lịch trực'
      },
      {
        key: menuPath.XIN_VANG,
        title: 'Xin vắng trực',
        roles: [ROLES.DIEU_DUONG_TRUONG, ROLES.TRUONG_PHONG_BAN, ROLES.CAN_BO_BV ]
      }
    ],
    roles: Object.values(ROLES)
  },
  {
    title: 'Tài khoản',
    icon: 'lock',
    key: 2,
    item: [
      {
        key: menuPath.TAI_KHOANBV,
        title: 'Quản lý tài khoản BV'
      }
    ],
    roles: [ROLES.ADMIN]
  },
  {
    title: 'Danh mục',
    icon: 'user',
    key: 3,
    item: [
      {
        key: menuPath.NHAN_VIEN,
        title: 'Danh mục nhân viên'
      }
      // {
      //   key: menuPath.DANH_GIA,
      //   title: 'Đánh giá'
      // }
    ],
    roles: [ROLES.ADMIN, ROLES.GIAM_DOC_DV, ROLES.TRUONG_PHONG_KHTH, ROLES.DIEU_DUONG_TRUONG, ROLES.TRUONG_PHONG_BAN, ROLES.LANH_DAO_DV]
  },
  {
    title: 'Thống kê báo cáo',
    icon: 'calendar',
    key: 4,
    item: [
      {
        key: menuPath.BAO_CAO,
        title: 'Thống kê lịch trực'
      }
    ],
    roles: [ROLES.ADMIN, ROLES.GIAM_DOC_DV, ROLES.LANH_DAO_DV, ROLES.TRUONG_PHONG_BAN, ROLES.TRUONG_PHONG_KHTH]
  }
];

export interface IMenuProp extends StateProps, DispatchProps, RouteComponentProps {}

export interface IMenuState {
  search: boolean;
  currentSub: ISubMenuObj[];
  openKey: string[];
  theme: any;
  current: any;
}

class Menu extends Component<IMenuProp, IMenuState> {
  private readonly initialState = {
    search: false,
    currentSub: subMenuObj,
    openKey: [],
    theme: 'dark',
    current: 1
  };

  constructor(props) {
    super(props);
    this.state = this.initialState;
  }
  themechange = value => {
    this.setState({
      theme : value ? 'dark' : 'light'
    });
  };
  handleClick = e => {
    this.setState({
      current: e.key
    });
  };

  public render() {
    const { SubMenu, Item } = AntMenu;
    const { history } = this.props;
    const { openKey, currentSub } = this.state;
    const subMenu = currentSub.map(sub => {
      if (!hasAnyRole(sub.roles)) return null;
      const itemMenu = sub.item.map(item =>
        item.roles === undefined || hasAnyRole(item.roles) ? <Item key={item.key}>{item.title}</Item> : null
      );
      return (
        <SubMenu
          key={sub.key}
          title={
            <span>
              <Icon type={sub.icon} /> {sub.title}{' '}
            </span>
          }
        >
          {itemMenu}
        </SubMenu>
      );
    });
    return (
      <Col sm={2} className="h-100 shadow p-0">
        <>
          <div id="menu">
            <div>
              <div className="bg-vnpt p-2 text-white">
                <Switch
                  checked={this.state.theme === 'dark'}
                  onChange={this.themechange}
                  checkedChildren="Dark"
                  unCheckedChildren="Light"
                />
                <span className="align-middle ml-2">Bảng chức năng</span>
              </div>
              <div className="p-2">
                <Input
                  className="btn-search"
                  placeholder="Tìm chức năng"
                  // suffix={<Icon type="search" style={{ color: 'rgba(0,0,0,.45)' }} />}
                  onChange={this.handleChange}
                />
              </div>
              <div className="pr-3">
                <AntMenu
                  theme={this.state.theme}
                  onClick={e => history.push(e.key)}
                  style={{ border: 'none' }}
                  mode="inline"
                  onOpenChange={this.handleOpenChange}
                  openKeys={openKey}
                >
                  <Item key="/">
                    {' '}
                    <Icon type="home" /> Trang chủ{' '}
                  </Item>
                  {subMenu}
                </AntMenu>
              </div>
            </div>
          </div>
        </>
      </Col>
    );
  }

  private handleChange = e => {
    const { value } = e.target;
    if (value === null || value === '') {
      this.setState({ ...this.initialState });
    } else {
      let currentSub = [];
      const openKey = [];
      subMenuObj.forEach(sub => {
        currentSub.push({
          ...sub,
          item: sub.item.filter(item => item.title.toUpperCase().indexOf(value.toUpperCase()) > -1)
        });
      });
      currentSub = [...currentSub.filter(sub => sub.item.length > 0)];
      currentSub.forEach(row => openKey.push(row.key.toString()));
      this.setState({
        search: true,
        currentSub,
        openKey
      });
    }
  };

  private handleOpenChange = openKeys => {
    this.setState({
      openKey: openKeys
    });
  };
}

const mapStateToProps = (storeState: IRootState) => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Menu) as any);
