import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { Alert, Button, Icon, List, message, Select, Spin, Tag } from 'antd';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import responseMessage from 'app/shared/reducers/responseMessage';
import { inDS, duyetDS, initPhongBan, resetState, taoDSTruc } from 'app/shared/reducers/dstruc';
import { toggleModal } from 'app/shared/reducers/dstruc/themnvtruc';
import { toggleModal as toggleModalXoa } from 'app/shared/reducers/dstruc/xoanvtruc';
import ThemNVTruc from './themnvtruc';
import ChiTietDS from './ctds';
import { EHRSessionStorage } from 'app/modules/ehr/sessionStorage/ehrStorageService';
import XoaNVTruc from 'app/modules/dstruc/xoanvtruc';
import LichSuDS from 'app/modules/dstruc/lichsuds';
import { getLichSuDS, toggleLichSuModal } from 'app/shared/reducers/dstruc/lichsuds';
import { trangThaiDuyetContants } from 'app/modules/constants/trangthai';
import NhapVangTruc from 'app/modules/dstruc/nhapvangtruc';
import { toggleDMVangTruc } from 'app/shared/reducers/dstruc/dmvangtruc';
import DMVangTruc from 'app/modules/dstruc/dmvangtruc';
import Fade from 'react-reveal/Fade';
import { IRole, ROLES } from 'app/shared/util/auth-utils';
import RoleBase from 'app/modules/component/rolebase';

export interface IDSTrucProps extends StateProps, DispatchProps {}

export interface IDSTrucState {
  maPhongBan: string;
  tenDangNhap: string;
}

const coQuyenDSLanhDao: IRole[] = [ROLES.ADMIN, ROLES.GIAM_DOC_DV, ROLES.TRUONG_PHONG_KHTH, ROLES.CAN_BO_PHONG_KHTH];
const coQuyenDieuChinhDS: IRole[] = [
  ROLES.ADMIN,
  ROLES.GIAM_DOC_DV,
  ROLES.TRUONG_PHONG_KHTH,
  ROLES.TRUONG_PHONG_BAN,
  ROLES.DIEU_DUONG_TRUONG
];
const coQuyenDuyetDS: IRole[] = [ROLES.ADMIN, ROLES.GIAM_DOC_DV, ROLES.LANH_DAO_DV];
const coQuyenXemDMVang: IRole[] = [ROLES.ADMIN, ROLES.GIAM_DOC_DV, ROLES.TRUONG_PHONG_KHTH,ROLES.TRUONG_PHONG_BAN, ROLES.LANH_DAO_DV];

class DSTruc extends Component<IDSTrucProps, IDSTrucState> {
  private dsPhongBan: any = JSON.parse(EHRSessionStorage.get('dsPhongBan'));
  private chiCo1PhongBan: boolean = this.dsPhongBan.length === 1;

  constructor(props) {
    super(props);
    this.state = {
      maPhongBan: this.dsPhongBan[0].maPhongBan,
      tenDangNhap: EHRSessionStorage.get('tenNhanVien')
    };
    this.IN = this.IN.bind(this);
    // thêm trực lãnh đạo vào cbb
    // if (hasAnyRole(coQuyenDSLanhDao)) {
    //   this.dsPhongBan.push({
    //     maPhongBan: '',
    //     tenPhongBan: 'Trực lãnh đạo'
    //   });
    // }
  }

  private btnXoaClick = () => {
    const { xoanvtruc } = this.props;
    if (xoanvtruc.selectedRows.length === 0) {
      message.error('Phải chọn ít nhất 1 nhân viên để xóa');
    } else {
      this.props.toggleModalXoa(true);
    }
  };

  private btnLichSuClick = async () => {
    await this.props.toggleLichSuModal(true);
  };
  IN() {
    this.props.inDS(this.state.tenDangNhap);
  }
  componentWillUnmount(): void {
    if (this.props.dsTruc.error || this.props.dsTruc.dsChuaTao) {
      this.props.resetState();
    }
  }

  componentDidMount(): void {
    if (this.chiCo1PhongBan && this.props.dsTruc.dsChuaTao) {
      this.props.initPhongBan(this.state.maPhongBan);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.dsTruc.thongTinDS !== nextProps.dsTruc.thongTinDS && nextProps.dsTruc.thongTinDS) {
      const dsthongtin = nextProps.dsTruc.thongTinDS;
      // tslint:disable-next-line:no-console
      console.log('dsthongtin', dsthongtin);
    }
  }

  render() {
    const { Option } = Select;
    const { dsTruc, themnvtruc } = this.props;

    const ChonPhongBan = (
      <div className="d-flex">
        <h5 className="p-2">DANH SÁCH TRỰC</h5>
        {this.chiCo1PhongBan ? (
          ''
        ) : (
          <Select
            defaultValue={this.state.maPhongBan}
            className="p-2"
            style={{ width: 250 }}
            onChange={maPhongBan => this.setState({ maPhongBan })}
          >
            {this.dsPhongBan.map((phongBan, index) => (
              <Option key={index} value={phongBan.maPhongBan}>
                {phongBan.tenPhongBan}
              </Option>
            ))}
          </Select>
        )}
        <div style={{ padding: '0.5rem' }}>
          <Button onClick={() => this.props.initPhongBan(this.state.maPhongBan)} icon="search" type="primary">
            {this.chiCo1PhongBan ? 'Làm mới' : 'Xem'}
          </Button>
        </div>
      </div>
    );

    const ChuaChonPhongBan = (
      <div className="pt-2 pb-2 pl-5 pr-5">
        <Alert type="info" message="Thông tin" showIcon description="Chọn phòng ban cần xem danh sách và click Xem !" />
      </div>
    );

    const Loading = (
      <Row className="p-5 justify-content-center">
        <Spin />
      </Row>
    );

    const DSChuaTao = (
      <div>
        <div className="pt-2 pb-2 pl-5 pr-5">
          <Alert showIcon message="Lỗi" description="Danh sách này chưa được tạo Click tạo để tạo danh sách" type="error" />
        </div>
        <div className="d-flex justify-content-center p-2">
          <RoleBase roles={coQuyenDieuChinhDS}>
            <Button type="primary" onClick={this.props.taoDSTruc}>
              <Icon type="plus" className="align-middle" />
              <span className="align-middle">Tạo danh sách</span>
            </Button>
          </RoleBase>
        </div>
      </div>
    );

    const ThongTinDS =
      dsTruc.thongTinDS === null ? (
        ''
      ) : (
        <div>
          <h5 className="text-uppercase text-center">
            Danh sách cán bộ tham gia trực {dsTruc.thongTinDS.tenPhongBan}
          </h5>
          <Row className="justify-content-center p-2">
            <Col sm={4}>
              <div className="pt-2">
                <Card className="shadow-sm">
                  <CardHeader>
                    <div className="text-center font-weight-bold">Thông tin chung</div>
                  </CardHeader>
                  <CardBody>
                    <List>
                      {/*<List.Item>*/}
                      {/*  <Icon type="user-add" className="align-middle pr-2" />*/}
                      {/*  Lập bởi <strong>{dsTruc.thongTinDS.tenNguoiLap}</strong>, Vào lúc:{' '}*/}
                      {/*  <strong>{new Date(dsTruc.thongTinDS.thoiGianLap).toLocaleString('vi-VN')}</strong>*/}
                      {/*</List.Item>*/}
                      <List.Item className="d-flex justify-content-center">
                        <div>
                          <div className="p-2 d-flex justify-content-center">
                            <Tag color={trangThaiDuyetContants[dsTruc.thongTinDS.trangThaiDuyet].color}>
                              {trangThaiDuyetContants[dsTruc.thongTinDS.trangThaiDuyet].title}
                            </Tag>
                          </div>
                          <RoleBase roles={coQuyenDuyetDS}>
                            <div className="p-2 d-flex justify-content-center">
                              {dsTruc.approving ? (
                                <Spin />
                              ) : (
                                <Button.Group>
                                  <Button
                                    onClick={() => this.props.duyetDS(true)}
                                    disabled={dsTruc.thongTinDS.trangThaiDuyet === 'DA_DUYET'}
                                  >
                                    <Icon type="check" className="text-success" />
                                  </Button>
                                  <Button
                                    onClick={() => this.props.duyetDS(false)}
                                    disabled={dsTruc.thongTinDS.trangThaiDuyet === 'HUY_DUYET'}
                                  >
                                    <Icon type="close" className="text-danger" />
                                  </Button>
                                </Button.Group>
                              )}
                            </div>
                          </RoleBase>
                          {dsTruc.thongTinDS.trangThaiDuyet === 'CHUA_DUYET' ? (
                            ''
                          ) : (
                            <div className="p-2">
                              <Icon type="eye" className="align-middle pr-2" />
                              {`${trangThaiDuyetContants[dsTruc.thongTinDS.trangThaiDuyet].title} bởi `}
                              <strong>{dsTruc.thongTinDS.tenNguoiDuyet}</strong>, Vào lúc:{' '}
                              <strong>{new Date(dsTruc.thongTinDS.thoiGianDuyet).toLocaleString('vi-VN')}</strong>
                            </div>
                          )}
                        </div>
                      </List.Item>
                      <List.Item className="d-block">
                        <div>
                          <Icon type="clock-circle" className="align-middle pr-2" />
                          Lần sửa đổi gần nhất: <strong>{new Date(dsTruc.thongTinDS.thoiGianCapNhat).toLocaleString('vi-VN')}</strong>
                        </div>
                        <div>
                          <Icon type="edit" className="align-middle pr-2" />
                          Người sửa đổi: <strong>{dsTruc.thongTinDS.tenNguoiCapNhat}</strong>
                        </div>
                        <RoleBase roles={coQuyenDuyetDS}>
                          <div className="d-flex justify-content-center mt-2">
                            <Button icon="history" onClick={this.btnLichSuClick} type="dashed">
                              Lịch sử chỉnh sửa
                            </Button>
                          </div>
                        </RoleBase>
                      </List.Item>
                    </List>
                  </CardBody>
                </Card>
              </div>
            </Col>
            <Col sm={8}>
              <Row>
                <Col sm={12} className="d-flex justify-content-end mb-3">
                  <RoleBase roles={coQuyenXemDMVang}>
                    <Button
                      className="mr-3"
                      onClick={async () => {
                        await this.props.toggleDMVangTruc(true);
                      }}
                    >
                      Danh mục vắng trực
                    </Button>
                  </RoleBase>
                  <RoleBase roles={coQuyenDieuChinhDS}>
                    <Button className="mr-3" type="danger" icon="delete" onClick={this.btnXoaClick}>
                      <span className="align-middle">Xóa</span>
                    </Button>
                    <Button
                      className="mr-3"
                      type="dashed"
                      icon="plus"
                      loading={themnvtruc.loading}
                      onClick={() => this.props.toggleModal(true)}
                    >
                      <span className="align-middle">Thêm</span>
                    </Button>
                    <Button className="mr-3 bg-vnpt" type="primary" icon="file" loading={dsTruc.printing} onClick={this.IN}>
                      <span className="align-middle">In</span>
                    </Button>
                  </RoleBase>
                </Col>
              </Row>
              <h6 className="text-right pr-5">Số cán bộ: {dsTruc.chiTietDS.length}</h6>
              <ChiTietDS data={dsTruc.chiTietDS} />
            </Col>
          </Row>
        </div>
      );

    const Error = <Alert type="error" message="Lỗi" description={responseMessage.LOI_HE_THONG} showIcon />;

    return (
      <Fade bottom duration={500}>
        <div>
          {ChonPhongBan}
          <hr />
          {dsTruc.maPhongBan == null ? (
            ChuaChonPhongBan
          ) : dsTruc.loading ? (
            Loading
          ) : (
            <div>
              {dsTruc.error ? (
                Error
              ) : dsTruc.dsChuaTao ? (
                DSChuaTao
              ) : (
                <Fade bottom duration={500}>
                  <div>
                    <ThemNVTruc />
                    <XoaNVTruc />
                    <LichSuDS />
                    <NhapVangTruc />
                    <DMVangTruc />
                    {ThongTinDS}
                  </div>
                </Fade>
              )}
            </div>
          )}
        </div>
      </Fade>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  dsTruc: storeState.dstruc,
  themnvtruc: storeState.themnvtruc,
  xoanvtruc: storeState.xoanvtruc,
  lichsuds: storeState.lichsuds
});

const mapDispatchToProps = {
  initPhongBan,
  taoDSTruc,
  toggleModal,
  duyetDS,
  toggleModalXoa,
  getLichSuDS,
  toggleLichSuModal,
  toggleDMVangTruc,
  resetState,
  inDS
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DSTruc);
