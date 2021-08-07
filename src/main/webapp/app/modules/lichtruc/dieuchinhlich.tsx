import React, { Component } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { Button, Icon, List, message, Modal, Popconfirm, Select, Spin, Table, Tag } from 'antd';
import { Col, Row } from 'reactstrap';
import dieuchinhlich, {
  getDSTheoNgay,
  getSoTheoDoi,
  thayDoiNguoiTruc,
  theoDoiTruc,
  toggleModalDieuChinh,
  xoaNhanVienTruc,
  xoaTheoDoi
} from 'app/shared/reducers/lichtruc/dieuchinhlich';
import { chucDanh as chucDanhConstant } from 'app/modules/constants/chucdanh';
import moment from 'moment';
import Fade from 'react-reveal/Fade';
import { IRole, ROLES } from 'app/shared/util/auth-utils';
import RoleBase from 'app/modules/component/rolebase';

export interface IDieuchinhlichProps extends StateProps, DispatchProps {}

export interface IDieuchinhlichState {
  dieuChinh: boolean;
  theodoi: boolean;
  maNhanVien_theoDoi: string;
  maChiTiet_theoDoi: string;
  dsTrucTheoChucDanh: any[];
  chucDanh: string;
  maPhanCongDaChon: string;
  caTruc: string;
  nhanVienTrucTT: any;
  chucDanhTT: any;
}
const coQuyenTheoDoiLich: IRole[] = [
  ROLES.ADMIN,
  ROLES.GIAM_DOC_DV,
  ROLES.DIEU_DUONG_TRUONG,
  ROLES.TRUONG_PHONG_KHTH,
  ROLES.TRUONG_PHONG_BAN
];
const coQuyenDieuChinhLich: IRole[] = [
  ROLES.ADMIN,
  ROLES.GIAM_DOC_DV,
  ROLES.DIEU_DUONG_TRUONG,
  ROLES.TRUONG_PHONG_BAN,
  ROLES.TRUONG_PHONG_KHTH,
  ROLES.CAN_BO_PHONG_KHTH
];

class DieuChinhLich extends Component<IDieuchinhlichProps, IDieuchinhlichState> {
  private initState: IDieuchinhlichState = {
    dieuChinh: false,
    theodoi: false,
    maNhanVien_theoDoi: '',
    maChiTiet_theoDoi: '',
    dsTrucTheoChucDanh: [],
    chucDanh: '',
    maPhanCongDaChon: '',
    caTruc: '',
    nhanVienTrucTT: '',
    chucDanhTT: ''
  };

  private CaTruc = {
    NGAY: 'Ngày',
    DEM: 'Đêm',
    FULL: 'Cả ngày'
  };

  private soTheoDoi_columns = [
    {
      title: 'Ca trực',
      dataIndex: 'caTruc',
      render: caTruc => <span>{this.CaTruc[caTruc]}</span>
    },
    {
      title: 'Chức danh',
      dataIndex: 'chucDanhTruc',
      render: chucDanhTruc => <span>{chucDanhConstant[chucDanhTruc].title}</span>
    },
    {
      title: 'Nhân viên',
      dataIndex: 'nhanVienThucTe.tenNhanVien'
    },
    {
      title: '',
      dataIndex: 'maChiTiet',
      render: maChiTiet =>
        this.props.dieuchinhlich.deleting_theoDoi ? (
          <Spin />
        ) : (
          <Tag onClick={() => this.props.xoaTheoDoi(maChiTiet)} color="red" style={{ cursor: 'pointer' }}>
            Xóa
          </Tag>
        )
    }
  ];

  constructor(props) {
    super(props);
    this.state = this.initState;
  }

  private renderPhanCong = chucDanh => {
    const dsPhanCong = this.props.dieuchinhlich.cell.data.filter(value => value.chucDanhTruc === chucDanh);
    return (
      <div>
        <Icon className="align-middle" type={chucDanhConstant[chucDanh].icon} />
        <strong className="ml-2">{chucDanhConstant[chucDanh].title}: </strong>
        {dsPhanCong.map((phanCong, index) => (
          <div key={index}>
            <div className="p-2">
              {this.props.lichtruc.thongTinLichTruc.trangThaiDuyet.toString() === 'DA_DUYET' ? (
                ''
              ) : (
                <RoleBase roles={coQuyenDieuChinhLich}>
                  <Popconfirm
                    placement="top"
                    title="Bạn có muốn xóa ?"
                    onConfirm={() => {
                      this.props.xoaNhanVienTruc(phanCong.maChiTiet);
                    }}
                    okText="Có"
                    cancelText="Không"
                    okType={'danger'}
                    icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                  >
                    <Button icon="delete" loading={this.props.dieuchinhlich.deleting} />
                  </Popconfirm>
                </RoleBase>
              )}
              <span className="ml-2">
                {phanCong === undefined ? '' : `${phanCong.nhanVienPhanCong.tenNhanVien} -- ${this.CaTruc[phanCong.caTruc]}`}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  private btnDieuChinhClick = async (dieuChinh: boolean) => {
    if (dieuChinh) await this.props.getDSTheoNgay(this.props.dieuchinhlich.cell.ngay);
    await this.setState({
      dieuChinh
    });
  };

  private toggleTheoDoi = async (theodoi: boolean) => {
    if (theodoi) {
      const { ngay } = this.props.dieuchinhlich.cell;
      const { maLT } = this.props.lichtruc.thongTinLichTruc;
      await this.props.getDSTheoNgay(ngay);
      await this.props.getSoTheoDoi(maLT, ngay);
    }
    await this.setState({
      theodoi
    });
  };

  private chonChucDanh = chucDanh => {
    const { dsPhanCong } = this.props.dieuchinhlich;
    const dsTrucTheoChucDanh = dsPhanCong.filter(row => row.chucDanhTruc.indexOf(chucDanh) > -1);
    this.setState({
      chucDanh,
      dsTrucTheoChucDanh,
      maPhanCongDaChon: ''
    });
  };

  private onClose = async () => {
    this.setState({
      ...this.initState
    });
    this.props.toggleModalDieuChinh(false);
  };

  private btnLuuClick = async () => {
    const { ngay } = this.props.dieuchinhlich.cell;
    const { caTruc, maPhanCongDaChon, chucDanh } = this.state;
    const ngayTruc = moment(ngay).format('YYYY-MM-DD');
    const err = [];
    if (caTruc === '') err.push('Ca trực');
    if (maPhanCongDaChon === '') err.push('Nhân viên');
    if (chucDanh === '') err.push('Chức danh');
    if (err.length > 0) {
      message.error(`Các thông tin sau chưa hợp lệ: ${err.join(', ')}`);
    } else {
      await this.props.thayDoiNguoiTruc(ngayTruc, caTruc, maPhanCongDaChon);
    }
  };

  private luuTheoDoi = async () => {
    const { maChiTiet_theoDoi, maNhanVien_theoDoi, dsTrucTheoChucDanh } = this.state;
    const err = [];
    if (maChiTiet_theoDoi === '') err.push('Ca trực - chức danh');
    if (maNhanVien_theoDoi === '' || dsTrucTheoChucDanh.findIndex(value => value.nhanVien.maNhanVien === maNhanVien_theoDoi) === -1) {
      err.push('CB thay thế');
    }
    if (err.length > 0) {
      message.error(`Các thông tin sau chưa hợp lệ: ${err.join(', ')}`);
    } else {
      await this.props.theoDoiTruc(maChiTiet_theoDoi, maNhanVien_theoDoi);
    }
  };
  // componentWillReceiveProps(nextProps) {
  //   const dsTrucTheoChucDanh1 = this.state.dsTrucTheoChucDanh;
  //   console.log('log' + dsTrucTheoChucDanh1);
  // }

  render() {
    const { lichtruc, dieuchinhlich } = this.props;
    const { Option } = Select;
    const lanhDao = lichtruc.maPhongBan === '820110' || lichtruc.maPhongBan === '890110' || lichtruc.maPhongBan === '890051'
      || lichtruc.maPhongBan === '890111' || lichtruc.maPhongBan === '910065' || lichtruc.maPhongBan === '940110';
    const dsChucDanh = lanhDao ? ['LANH_DAO'] : ['BAC_SI', 'DIEU_DUONG', 'KY_THUAT_VIEN', 'HO_LY'];
    const thuTruc = dieuchinhlich.cell !== null ? new Date(dieuchinhlich.cell.ngay).getDay() : undefined;
    const dsCaTruc = lanhDao && (thuTruc === 0 || thuTruc === 6) ? ['NGAY', 'DEM'] : ['FULL'];

    const modalFooter = (
      <div>
        {lichtruc.thongTinLichTruc.trangThaiDuyet.toString() !== 'DA_DUYET' ? (
          <RoleBase roles={coQuyenDieuChinhLich}>
            <Button
              loading={dieuchinhlich.gettingDS}
              onClick={() => this.btnDieuChinhClick(true)}
              type="dashed"
              icon="edit"
              disabled={this.state.dieuChinh}
            >
              Điều chỉnh
            </Button>
          </RoleBase>
        ) : (
          <RoleBase roles={coQuyenTheoDoiLich}>
            <Button
              type="dashed"
              icon="form"
              onClick={() => this.toggleTheoDoi(true)}
              disabled={this.state.theodoi}
              loading={dieuchinhlich.gettingDS || dieuchinhlich.gettingSoTheoDoi}
            >
              Ghi nhận thay đổi
            </Button>
          </RoleBase>
        )}
      </div>
    );

    return (
      <div>
        <Modal
          title={<span>Ngày trực: {dieuchinhlich.modal ? dieuchinhlich.cell.ngay.toLocaleDateString() : ''}</span>}
          visible={dieuchinhlich.modal}
          style={{ top: '20px' }}
          width="700px"
          footer={modalFooter}
          onCancel={this.onClose}
        >
          <div>
            {!dieuchinhlich.modal ? (
              ''
            ) : (
              <Row className="p-2">
                <Col sm={this.state.dieuChinh ? 6 : this.state.theodoi ? 5 : 12}>
                  <List>
                    {dsChucDanh.map((chucDanh, index) => (
                      <List.Item className="d-block align-middle" key={index}>
                        {this.renderPhanCong(chucDanh)}
                      </List.Item>
                    ))}
                  </List>
                </Col>
                {this.state.dieuChinh || this.state.theodoi ? (
                  <Col sm={this.state.dieuChinh ? 6 : 7} className="border-left">
                    <Fade bottom duration={500}>
                      <div className="d-block p-2">
                        {this.state.dieuChinh ? (
                          <div>
                            <h5 className="text-center mt-2">ĐIỀU CHỈNH</h5>
                            <Row className="p-2">
                              <Col sm={4}>
                                <span>Chức danh</span>
                              </Col>
                              <Col sm={8}>
                                <Select className="w-75" defaultValue={this.state.chucDanh} onChange={value => this.chonChucDanh(value)}>
                                  {dsChucDanh.map((chucDanh, index) => (
                                    <Option key={index} value={chucDanh}>
                                      {chucDanhConstant[chucDanh].title}
                                    </Option>
                                  ))}
                                </Select>
                              </Col>
                            </Row>
                            <Row className="p-2">
                              <Col sm={4}>
                                <span>Ca trực</span>
                              </Col>
                              <Col sm={8}>
                                <Select className="w-75" defaultValue={this.state.caTruc} onChange={caTruc => this.setState({ caTruc })}>
                                  {dsCaTruc.map((ca, index) => (
                                    <Option key={index} value={ca}>
                                      {this.CaTruc[ca]}
                                    </Option>
                                  ))}
                                </Select>
                              </Col>
                            </Row>
                            <Row className="p-2">
                              <Col sm={4}>
                                <span>Nhân viên</span>
                              </Col>
                              <Col sm={8}>
                                <Select
                                  defaultValue={this.state.maPhanCongDaChon}
                                  onChange={maPhanCongDaChon => this.setState({ maPhanCongDaChon })}
                                  className="w-75"
                                  showSearch
                                  showArrow={false}
                                  notFoundContent={null}
                                  filterOption={(inputValue, option) =>
                                    option.props.children
                                      .toString()
                                      .toUpperCase()
                                      .search(inputValue.toUpperCase()) > -1
                                  }
                                >
                                  {this.state.dsTrucTheoChucDanh.map((value, index) => (
                                    <Option value={value.maPhanCong[0]} key={index}>
                                      {value.nhanVien.tenNhanVien}
                                    </Option>
                                  ))}
                                </Select>
                              </Col>
                            </Row>
                            <Row className="p-2 justify-content-center">
                              <Button icon="check" className="m-2" onClick={this.btnLuuClick} type="primary" loading={dieuchinhlich.saving}>
                                Lưu
                              </Button>
                              <Button icon="arrow-left" className="m-2" onClick={() => this.btnDieuChinhClick(false)}>
                                Hủy
                              </Button>
                            </Row>
                          </div>
                        ) : (
                          <div>
                            <h5 className="text-center">THAY ĐỔI SO VỚI LỊCH ĐƯỢC DUYỆT</h5>
                            <Row className="p-2 justify-content-center">
                              <Table
                                columns={this.soTheoDoi_columns}
                                dataSource={dieuchinhlich.soTheoDoi}
                                rowKey="maChiTiet"
                                size="small"
                                pagination={false}
                              />
                            </Row>
                            <hr />
                            <Row className="pr-4 pl-4 pt-2 pb-1">
                              <Col sm={4}>
                                <span>Chức danh - Ca</span>
                              </Col>
                              <Col sm={8}>
                                <Select
                                  className="w-75"
                                  defaultValue={this.state.maChiTiet_theoDoi}
                                  onChange={value => {
                                    this.chonChucDanh(value.split('|')[1]);
                                    this.setState({
                                      maChiTiet_theoDoi: value.split('|')[0]
                                    });
                                  }}
                                >
                                  {dieuchinhlich.cell.data.map((row, index) => (
                                    <Option key={index} value={`${row.maChiTiet}|${row.chucDanhTruc}`}>
                                      {chucDanhConstant[row.chucDanhTruc].title} - {this.CaTruc[row.caTruc]}
                                    </Option>
                                  ))}
                                </Select>
                              </Col>
                            </Row>
                            <Row className="pr-4 pl-4 pt-2 pb-1">
                              <Col sm={4}>
                                <span>CB trực thay: </span>
                              </Col>
                              <Col sm={8}>
                                <Select
                                  defaultValue={this.state.maNhanVien_theoDoi}
                                  onChange={maNhanVien_theoDoi => this.setState({ maNhanVien_theoDoi })}
                                  className="w-75"
                                  showSearch
                                  showArrow={false}
                                  notFoundContent={null}
                                  filterOption={(inputValue, option) =>
                                    option.props.children
                                      .toString()
                                      .toUpperCase()
                                      .search(inputValue.toUpperCase()) > -1
                                  }
                                >
                                  {this.state.dsTrucTheoChucDanh.map((value, index) => (
                                    <Option value={value.nhanVien.maNhanVien} key={index}>
                                      {value.nhanVien.tenNhanVien}
                                    </Option>
                                  ))}
                                </Select>
                              </Col>
                            </Row>
                            <Row className="p-2 justify-content-center">
                              <Button
                                icon="check"
                                className="m-2"
                                loading={dieuchinhlich.monitoring}
                                onClick={this.luuTheoDoi}
                                type="primary"
                              >
                                Lưu
                              </Button>
                              <Button icon="arrow-left" className="m-2" onClick={() => this.toggleTheoDoi(false)}>
                                Đóng
                              </Button>
                            </Row>
                          </div>
                        )}
                      </div>
                    </Fade>
                  </Col>
                ) : (
                  ''
                )}
              </Row>
            )}
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  lichtruc: storeState.lichtruc,
  dieuchinhlich: storeState.dieuchinhlich
});

const mapDispatchToProps = {
  toggleModalDieuChinh,
  getDSTheoNgay,
  thayDoiNguoiTruc,
  xoaNhanVienTruc,
  theoDoiTruc,
  getSoTheoDoi,
  xoaTheoDoi
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DieuChinhLich);
