// @ts-ignore
import logo from 'app/modules/image/VNPT_Logo.svg';
import React, { Component } from 'react';
import { Modal, Dropdown, Icon, Menu, Spin, Tag } from 'antd';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { clearSession, initSession, toggleModal } from 'app/shared/reducers/header';
import { getDSPhongBan } from 'app/shared/reducers/authentication';
import { Row } from 'reactstrap';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { EHRSessionStorage } from 'app/modules/ehr/sessionStorage/ehrStorageService';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import { resetState as resetStateDSTruc } from 'app/shared/reducers/dstruc';
import { resetState as resetStateLichTruc } from 'app/shared/reducers/lichtruc';
import { resetState as resetStateNhanVien } from 'app/shared/reducers/danhmuc/nhanvien';

export interface IHeaderProp extends StateProps, DispatchProps, RouteComponentProps {}

class Header extends Component<IHeaderProp> {
  constructor(props) {
    super(props);
  }

  componentDidMount(): void {
    this.props.initSession();
  }

  private chonDonVi = async donVi => {
    const { history } = this.props;
    const pre_donVi = EHRSessionStorage.get('donVi'); // EHRSessionStorage hàm hệ thống gởi yêu cầu cho sự kiện
    try {
      EHRSessionStorage.set('donVi', JSON.stringify(donVi));
      await this.props.getDSPhongBan();
      await this.props.resetStateDSTruc();
      await this.props.resetStateLichTruc();
      await this.props.resetStateNhanVien();
      await history.push('/');
      await this.props.toggleModal(false);
    } catch (e) {
      EHRSessionStorage.set('donVi', pre_donVi);
    }
  };

  private logOut = async () => {
    await EHRSessionStorage.deleteAll();
    await this.props.resetStateDSTruc();
    await this.props.resetStateLichTruc();
    await this.props.resetStateNhanVien();
    await this.props.clearSession();
    await this.props.history.push('/login');
  };

  private menu_Click = e => {
    if (e.key === 'account-0') {
      Modal.confirm({
        title: 'Xác nhận',
        content: 'Bạn có chắc chắn muốn đăng xuất ?',
        okText: 'Có',
        okType: 'primary',
        cancelText: 'Không',
        onOk: this.logOut
      });
    } else if (e.key === 'donvi-0') this.props.toggleModal(true);
  };

  render() {
    const { header, authentication } = this.props;
    const account_menu = (
      <Menu onClick={this.menu_Click}>
        <Menu.Item key="account-0">
          <Icon type="logout" className="align-middle pr-2" />
          <span className="align-middle">Đăng xuất</span>
        </Menu.Item>
      </Menu>
    );
    const donvi_menu = (
      <Menu onClick={this.menu_Click}>
        <Menu.Item key="donvi-0">
          <Icon type="setting" className="align-middle pr-2" />
          <span className="align-middle">Thiết lập đơn vị</span>
        </Menu.Item>
      </Menu>
    );
    const welcomeText = header.logged ? (
      <div>
        <Dropdown overlay={account_menu} placement="bottomCenter">
          <Tag color="red">
            <Icon type="user" className="align-middle" />
            <span className="align-middle ml-2">{header.tenDangNhap}</span>
          </Tag>
        </Dropdown>
        <Dropdown overlay={donvi_menu} placement="bottomCenter">
          <Tag color="geekblue">
            <Icon type="plus-circle" className="align-middle" />
            <span className="align-middle ml-2">{header.donVi.tenDonVi}</span>
          </Tag>
        </Dropdown>
        <Tag color="purple">
          <Icon type="desktop" className="align-middle" />
          <span className="align-middle ml-2">{header.tenVaiTro}</span>
        </Tag>
      </div>
    ) : (
      <span>
        <span>Đơn vị thực hiện:<strong> Trung tâm Giải pháp Y tế Điện tử</strong></span>
        <Tag color="red" className="ml-2">
          VNPT-IT
        </Tag>
      </span>
    );
    const columns = [
      {
        dataField: 'maDonVi',
        text: 'Mã đơn vị',
        sort: true
      },
      {
        dataField: 'tenDonVi',
        text: 'Tên đơn vị',
        sort: true
      }
    ];
    const modal_thiet_lap_dv = (
      <Modal
        title={
          <div>
            <Icon type="setting" className="align-middle" />
            <span className="align-middle pl-3">Thiếp lập đơn vị</span>
          </div>
        }
        visible={header.modal}
        footer={null}
        onCancel={() => this.props.toggleModal(false)}
        style={{ top: '20px' }}
      >
        <div className="pl-5 pr-5">
          {authentication.loadingPhongBan ? (
            <Row className="justify-content-center p-3">
              <Spin />
            </Row>
          ) : (
            <ToolkitProvider bootstrap4 keyField="maDonVi" data={header.dsDonVi} columns={columns} search>
              {props => (
                <div>
                  <Row className="justify-content-center">
                    <Search.SearchBar {...props.searchProps} placeholder="Tìm đơn vị ..." />
                  </Row>
                  <hr />
                  <Row style={{ height: '300px', overflow: 'auto' }}>
                    <BootstrapTable
                      hover
                      tabIndexCell
                      rowEvents={{
                        onDoubleClick: (e, row, rowIndex) => this.chonDonVi(row)
                      }}
                      headerClasses="bg-vnpt text-white"
                      noDataIndication="Không có đơn vị phù hợp !"
                      {...props.baseProps}
                    />
                  </Row>
                </div>
              )}
            </ToolkitProvider>
          )}
        </div>
      </Modal>
    );

    return (
      <div>
        {modal_thiet_lap_dv}
        <div id="header">
          <div id="logo-box">
            <div id="logo-link">
              <img src={logo} id="logo-img" alt="VNPT" className="bg-light" style={{ height: 35, width: 30 }} />
              <span id="logo-text">HỆ THỐNG QUẢN LÝ TRỰC BỆNH VIỆN</span>
            </div>
          </div>
        </div>
        <div id="welcome" className="bg-light shadow-sm pl-3">
          {welcomeText}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  header: storeState.header,
  authentication: storeState.authentication
});

const mapDispatchToProps = {
  initSession,
  clearSession,
  getDSPhongBan,
  toggleModal,
  resetStateDSTruc,
  resetStateLichTruc,
  resetStateNhanVien
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Header as any));
