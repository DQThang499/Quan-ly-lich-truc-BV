import React, { createRef } from 'react';
import {
  getDSChucVu,
  getDSNhanVienFull,
  getDSTenPhongBan,
  luudsNV,
  deletedsNV,
  updateNV,
  inDSNhanVien,
  setLanhDao
} from 'app/shared/reducers/danhmuc/nhanvien';
import { getDSDanhGia } from 'app/shared/reducers/danhmuc/danhgia';
import { Row, Col, Input, Label, Button } from 'reactstrap';
import WindowDanhGia from 'app/modules/danhmuc/danhgia';
import Fade from 'react-reveal/Fade';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import JqxGrid, { jqx } from 'jqwidgets-scripts/jqwidgets-react/react_jqxgrid';
import JqxWindow from 'jqwidgets-scripts/jqwidgets-react/react_jqxwindow';
import { toggleDmtaotaikhoan, forwardNhanVienTK } from 'app/shared/reducers/danhmuc/taikhoannv';
import 'app/modules/danhmuc/nhanvien.scss';
import TaoTaiKhoan from 'app/modules/danhmuc/taotaikhoan';
import RoleBase from 'app/modules/component/rolebase';
import { IRole, ROLES } from 'app/shared/util/auth-utils';
import 'app/shared/layout/theme/darkyellowlis.scss';
import { faSearch, faPlus, faBroom, faEdit, faPrint, faSave, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface IDsNhanVienProp extends StateProps, DispatchProps {}
export interface IDsNhanVienState {
  dsNhanVienInfo: any;
  opendsDG: any;
  chucVu: any;
  phongBan: any;
  disabledThem: any;
  disabledXem: any;
  disabledLuu: any;
  disabledSua: any;
  disabledSetLD: any;
  disabledIn: any;
  disabledXoa: any;
  disabledHuy: any;
  disabledTaoTK: any;
  disabledField: any;
  dsChucVuSelect: any;
  dstenPhongBanselect: any;
  value: any;
  isInputValid: any;
  errorMessage: any;
}
function FormError(props) {
  if (props.isHidden) { return null; }
  return (
    <div className="form-warning">
      {props.errorMessage}
    </div>
  );
}

const validateInput = checkingText => {

  const regexp = /^\d{10}$/;
  // regular expression - checking if phone number contains only 10 numbers

  if (regexp.exec(checkingText) !== null) {
    return {
      isInputValid: true,
      errorMessage: ''
    };
  } else {
    return {
      isInputValid: false,
      errorMessage: 'Số điện thoại phải có 10 chữ số.'
    };
  }
};
const coQuyenTaoTaiKhoan: IRole[] = [ROLES.ADMIN];

class Nhanvien extends React.Component<IDsNhanVienProp, IDsNhanVienState> {
  private refGridDanhMucNhanVien = createRef<JqxGrid>(); // khai báo lưới
  private refWindow = createRef<JqxWindow>();
  private dataAdapter; // chọn dữ liệu
  private source; // lấy source
  private flag;
  private columns; // tạo dòng
  private index;
  private tempDanhMucNhanVien = {
    maNhanVien: '',
    tenNhanVien: '',
    maPhongBan: '',
    tenPhongBan: '',
    sdtNhanVien: '',
    dsChucVuSelect: [],
    dstenPhongBanselect: []
  };
  constructor(props) { // tạo constructor gán các giá trị cho biến this.state đã được khai báo trên interface
    super(props);
    this.state = {
      dsNhanVienInfo: {
        maNhanVien: '',
        tenNhanVien: '',
        maPhongBan: '',
        tenPhongBan: '',
        sdtNhanVien: '',
        tenDangNhap: '',
        chucDanhNhanVien: ''
      },
      opendsDG: 0,
      dsChucVuSelect: [],
      chucVu: '',
      phongBan: '',
      dstenPhongBanselect: [],
      value: '',
      isInputValid: true,
      errorMessage: '',
      disabledThem: false,
      disabledLuu: true,
      disabledSua: true,
      disabledXem: false,
      disabledXoa: true,
      disabledHuy: true,
      disabledTaoTK: false,
      disabledField: true,
      disabledSetLD: true,
      disabledIn: false
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.XemNV = this.XemNV.bind(this);
    this.themNV = this.themNV.bind(this);
    this.xoaNV = this.xoaNV.bind(this);
    this.luuNV = this.luuNV.bind(this);
    this.HuyNV = this.HuyNV.bind(this);
    this.suaNV = this.suaNV.bind(this);
    this.INDS = this.INDS.bind(this);
    this.setLD = this.setLD.bind(this);
  }
  private btnTaoTaiKhoanClick = (maNhanVien, tenNhanVien) => { // hàm gọi từ ts
    this.props.toggleDmtaotaikhoan(true);
    this.props.forwardNhanVienTK(maNhanVien, tenNhanVien);
  };
  componentWillMount() {
    this.initDataAdapter();
  }// để thực hiện load dữ liệu

  componentDidMount() { // sử dụng cho việc lấy dữ liệu từ ứng dụng bên ngoài vd như reducer và API
    this.props.getDSChucVu();
    this.props.getDSTenPhongBan();
    this.props.getDSNhanVienFull(this.state.dsNhanVienInfo.maPhongBan);
    this.refGridDanhMucNhanVien.current.on('rowdoubleclick', this.onRowDoubleClick);
  }
  componentWillReceiveProps(nextProps) { // chỉ đc gọi nếu component nhận đc từ 1 prop xem trước
    if (this.props.danhSachChucVu !== nextProps.danhSachChucVu && nextProps.danhSachChucVu) {
      this.setState({ dsChucVuSelect: nextProps.danhSachChucVu });
    } // nếu prop DSCV là giá trị xem trước của prop mà CPN chuẩn bị render
    if (this.props.danhSachPhongBan !== nextProps.danhSachPhongBan && nextProps.danhSachPhongBan) {
      this.setState({ dstenPhongBanselect: nextProps.danhSachPhongBan });
    }
    if (this.props.danhSachNhanVien !== nextProps.danhSachNhanVien) {
      this.source.localdata = nextProps.danhSachNhanVien;
      this.dataAdapter.dataBind();
      }
  }
  handleInputValidation = event => {
    const { isInputValid, errorMessage } = validateInput(this.state.value);
    this.setState({
      isInputValid,
      errorMessage
    });
  }
  // shouldComponentUpdate(nextProps: Readonly<IDsNhanVienProp>, nextState: Readonly<IDsNhanVienState>, nextContext: any): boolean {
  // }
  // componentWillUpdate(nextProps, nextState) { tương tác với 1 kiến trúc bên ngoài tương tác với 1 API tương tụ CPNdidmount
  //   if (nextProps.updateSuccess !== this.props.updateSuccess && nextProps.updateSuccess) {
  //     this.showPopup(nextProps.updateSuccess);
  //     // this.handleClose();
  //   }
  // }
  public componentWillUnmount() {}

  public onRowDoubleClick = event => {
    this.index = event.args.rowindex;
    const row = this.refGridDanhMucNhanVien.current.getrowdata(this.index);
    const entity = {
      ...row
    };
    this.props.getDSNhanVienFull(this.state.dsNhanVienInfo.maPhongBan);

    const temp = { ...this.state.opendsDG + 1 };
    temp['maNhanVien'] = entity.maNhanVien;
    temp['tenNhanVien'] = entity.tenNhanVien;
    temp['maPhongBan'] = entity.maPhongBan;
    temp['tenPhongBan'] = entity.tenPhongBan;
    temp['sdtNhanVien'] = entity.sdtNhanVien;
    temp['tenDangNhap'] = entity.tenDangNhap;
    temp['chucDanhNhanVien'] = entity.chucDanhNhanVien;
    this.setState({ opendsDG: temp });
    if ( temp > 1 ) this.refWindow.current.open();
    this.setState({
      dsNhanVienInfo: { ...temp },
      disabledThem: false,
      disabledLuu: true,
      disabledSua: false,
      disabledXoa: false,
      disabledHuy: true,
      disabledTaoTK: false,
      disabledField: true
    });
  };

  INDS() {
    const { dsNhanVienInfo } = this.state;
    this.props.inDSNhanVien(dsNhanVienInfo.maPhongBan);
  }

  luuNV() {
    const { dsNhanVienInfo } = this.state;
    if (this.flag === 'them') {
      this.props.luudsNV(dsNhanVienInfo, dsNhanVienInfo.maPhongBan);
    } else {
      this.props.updateNV(dsNhanVienInfo.maNhanVien,
        dsNhanVienInfo.tenNhanVien,
        dsNhanVienInfo.maPhongBan,
        dsNhanVienInfo.sdtNhanVien,
        dsNhanVienInfo.chucDanhNhanVien);
    }
    this.setState({
      disabledField: true,
      disabledXoa: false,
      disabledThem: false,
      disabledXem: false,
      disabledSua: false,
      disabledHuy: true,
      disabledLuu: true
    });
    this.props.getDSNhanVienFull(this.state.dsNhanVienInfo.maPhongBan);
  }

  suaNV() {
    this.flag = 'sua';
    this.setState({
      disabledField: false,
      disabledSua: true,
      disabledHuy: false,
      disabledThem: true,
      disabledXoa: true,
      disabledLuu: false,
      disabledXem: true
    });
  }

  setLD() {
    const { dsNhanVienInfo } = this.state;
    this.props.setLanhDao(dsNhanVienInfo.maNhanVien);
    this.props.getDSNhanVienFull(this.state.dsNhanVienInfo.maPhongBan);
  }

  themNV() {
    this.flag = 'them';
    const index = this.refGridDanhMucNhanVien.current.getselectedrowindex();
    if (index > -1) {
      this.refGridDanhMucNhanVien.current.unselectrow(index);
    }
    this.tempDanhMucNhanVien = {
      maNhanVien: '',
      tenNhanVien: '',
      maPhongBan: '',
      tenPhongBan: '',
      sdtNhanVien: '',
      dsChucVuSelect: [],
      dstenPhongBanselect: []
    };
    this.setState({
      dsNhanVienInfo: { ...this.tempDanhMucNhanVien },
      disabledThem: true,
      disabledLuu: false,
      disabledXem: true,
      disabledSua: true,
      disabledXoa: true,
      disabledHuy: false,
      disabledField: false
    });
  }

  XemNV() {
    this.props.getDSNhanVienFull(this.state.dsNhanVienInfo.maPhongBan);
  }

  HuyNV() {
    this.setState({
      dsNhanVienInfo: { ...this.tempDanhMucNhanVien },
      disabledHuy: true,
      disabledField: true,
      disabledXem: false,
      disabledSua: true,
      disabledThem: false,
      disabledLuu: true,
      disabledXoa: true
    });
  }

  xoaNV() {
    const { dsNhanVienInfo } = this.state;
    if (confirm('Bạn có muốn xóa Nhân Viên ' + dsNhanVienInfo.maNhanVien + 'với tên Nhân viên' + dsNhanVienInfo.tenNhanVien + '?')) {
      this.props.deletedsNV(dsNhanVienInfo.maNhanVien, dsNhanVienInfo.maPhongBan);
      this.setState({
        dsNhanVienInfo: { ...this.tempDanhMucNhanVien },
        disabledThem: false,
        disabledLuu: true,
        disabledXem: false,
        disabledSua: true,
        disabledXoa: true,
        disabledHuy: false,
        disabledField: true
      });
      this.props.getDSNhanVienFull(this.state.dsNhanVienInfo.maPhongBan);
    }
  }

  handleInputChange (event) { // target cho từng ô input
    const target = event.target;
    const name = target.name; // mỗi ô input đc phân biệt dựa vào name
    const value = target.value; // mỗi ô input đc phân biệt dựa vào value
    const temp = this.state.dsNhanVienInfo;
    temp[name] = value;
    this.setState({ dsNhanVienInfo: temp });
    this.setState({ value });
  }

  handleSelectChange (value) {
    const temp = this.state.dsNhanVienInfo;
    let tempChucVuSelected = '';
    if (value && value.length > 0) {
        tempChucVuSelected = value;
    }
    temp['dsChucVuSelect'] = tempChucVuSelected;
    this.setState({ dsNhanVienInfo: { ...temp }, chucVu: value });

  }

  public initDataAdapter() { // khai báo giống sql
    const datafields = [
      { name: 'maNhanVien', type: 'integer' },
      { name: 'tenNhanVien', type: 'string' },
      { name: 'maPhongBan', type: 'string' },
      { name: 'tenPhongBan', type: 'string' },
      { name: 'sdtNhanVien', type: 'integer' },
      { name: 'tenDangNhap', type: 'string' },
      { name: 'chucDanhNhanVien', type: 'string' }
    ];
    this.source = {
      datatype: 'json',
      datafields,
      localdata: {}
    };
    this.dataAdapter = new jqx.dataAdapter(this.source);

    this.columns = [ // tạo dòng
      {
        text: 'Mã Nhân Viên',
        datafield: 'maNhanVien',
        align: 'center',
        className: 'font-weight-bold',
        width: '12%'
      },
      {
        text: 'Tên Nhân Viên',
        datafield: 'tenNhanVien',
        align: 'center',
        className: 'font-weight-bold',
        width: '20%',
        aggregates: [
          {
            'Tổng số dòng'(aggregatedValue, currentValue) {
              if (currentValue) {
                return aggregatedValue + 1;
              }
              return aggregatedValue;
            }
          }
        ]
      },
      {
        text: 'Mã Phòng Ban',
        datafield: 'maPhongBan',
        align: 'center',
        className: 'font-weight-bold',
        width: '12%'
      },
      {
        text: 'Tên Phòng Ban',
        datafield: 'tenPhongBan',
        align: 'center',
        className: 'font-weight-bold',
        width: '23%'
      },
      {
        text: 'Số Điện Thoại',
        datafield: 'sdtNhanVien',
        align: 'center',
        className: 'font-weight-bold',
        width: '12%'
      },
      {
        text: 'Chức Danh Nhân Viên',
        datafield: 'chucDanhNhanVien',
        align: 'center',
        className: 'font-weight-bold',
        width: '25%'
      },
      {
        text: 'Tài Khoản',
        datafield: 'tenDangNhap',
        align: 'center',
        className: 'font-weight-bold',
        columntype: 'checkbox',
        width: '10%'
      }
    ];
  }
  render() {
    const { nhanvien } = this.props;
    return (
      <Fade bottom duration={500}>
        <div className="pt-2 pb-2 pl-5 ">
          <h5 className="text-uppercase text-center" >
            <strong>DANH MỤC THÔNG TIN NHÂN VIÊN </strong>
          </h5>
        </div>
        <hr/>
        <Col>
          <Row>
            <Label className="small" style={{ width: 120, textAlign: 'center' }}>
              Mã Nhân Viên
            </Label>
            <Input
              className="input-dmnv"
              name="maNhanVien"
              id="maNhanVien"
              style={{ width: 110 }}
              onChange={this.handleInputChange}
              value={this.state.dsNhanVienInfo.maNhanVien}
              disabled={this.state.disabledField}
            />
            <Label className="small" style={{ width: 120, textAlign: 'center' }}>
              Tên Nhân Viên
            </Label>
            <Input
              className="input-dmnv"
              name="tenNhanVien" id="tenNhanVien"
              style={{ width: 230 }}
              onChange={this.handleInputChange}
              value={this.state.dsNhanVienInfo.tenNhanVien}
              disabled={this.state.disabledField}
            />
            <Label className="small" style={{ width: 120, textAlign: 'center' }}>
              Số Điện Thoại
            </Label>
            <Input
              type="text"
              className="input-dmnv"
              name="sdtNhanVien"
              style={{ width: 230 }}
              onChange={this.handleInputChange}
              onBlur={this.handleInputValidation}
              value={this.state.dsNhanVienInfo.sdtNhanVien}
              disabled={this.state.disabledField}
            />
            <FormError
              isHidden={this.state.isInputValid}
              errorMessage={this.state.errorMessage}
            />
          </Row>
          <Row>
            <Label className="small" style={{ width: 120, textAlign: 'center' }}>
              Mã Phòng Ban
            </Label>
            <Input
              type="select"
              name="PhongBan"
              style={{ width: 110 }}
              onChange={this.handleInputChange}
              className="select-input-hovk"
              value={this.state.dsNhanVienInfo.maPhongBan}
              disabled={this.state.disabledField}
            >
              <option key={-1} value={''}>
                --- Tất cả ---
              </option>
              {this.state.dstenPhongBanselect
                ? this.state.dstenPhongBanselect.map(c => (
                  <option key={c.maPhongBan} value={c.maPhongBan} selected={this.state.phongBan === c.maPhongBan}>
                    {c.maPhongBan}
                  </option>
                ))
                : ''}
            </Input>
            <Label className="small" style={{ width: 120, textAlign: 'center' }}>
              Tên Phòng Ban
            </Label>
            <Input
              type="select"
              name="maPhongBan"
              style={{ width: 230 }}
              onChange={this.handleInputChange}
              className="select-input-hovk"
              value={this.state.dsNhanVienInfo.maPhongBan}
            >
              <option key={-1} value={''}>
                --- Tất cả ---
              </option>
              {this.props.danhSachPhongBan
                ? this.props.danhSachPhongBan.map(c => (
                  <option key={c.maPhongBan} value={c.maPhongBan} selected={this.state.phongBan === c.maPhongBan}>
                    {c.tenPhongBan}
                  </option>
                ))
                : ''}
            </Input>
            <Label className="small" style={{ width: 120, textAlign: 'center' }}>
              Chức vụ
            </Label>
            <Input
              type="select"
              name="chucDanhNhanVien"
              style={{ width: 230 }}
              onChange={this.handleInputChange}
              className="select-input-hovk"
              value={this.state.dsNhanVienInfo.chucDanhNhanVien}
            >
              <option key={-1} value={''}>
                --- Tất cả ---
              </option>
              {this.props.danhSachChucVu
                ? this.props.danhSachChucVu.map(c => (
                  <option key={c.tenChucDanh} value={c.tenChucDanh} selected={this.state.chucVu === c.tenChucDanh}>
                    {c.tenChucDanh}
                  </option>
                ))
                : ''}
            </Input>
          </Row>
          <Row className="mb-2" style={{ marginTop: 10, marginLeft: 97 }}>
            <RoleBase roles={coQuyenTaoTaiKhoan}>
              <Button
                onClick={this.themNV}
                disabled={this.state.disabledThem}
                className="btn-dmnv ml-2"
                color={this.state.disabledThem ? '' : 'primary'} name="them" id="them"
              >
                <FontAwesomeIcon icon={faPlus} /> Thêm
              </Button>
              <Button
                onClick={this.luuNV}
                disabled={this.state.disabledLuu}
                className="btn-dmnv ml-2"
                color={this.state.disabledLuu ? '' : 'danger'}
                loading={ nhanvien.savving } name="luu" id="luu"
              >
                <FontAwesomeIcon icon={faSave} /> Lưu
              </Button>
              <Button
                onClick={this.suaNV}
                disabled={this.state.disabledSua}
                className="btn-dmnv ml-2"
                color={this.state.disabledSua ? '' : 'info'} name="sua" id="sua"
              >
                <FontAwesomeIcon icon={faEdit} /> Sửa
              </Button>
              <Button
                onClick={this.xoaNV}
                disabled={this.state.disabledXoa}
                className="btn-dmnv ml-2"
                color={this.state.disabledXoa ? '' : 'warning'} name="xoa" id="xoa"
                loading={nhanvien.deleteing}
              >
                 <FontAwesomeIcon icon={faTrashAlt} /> Xóa
              </Button>
              <Button
                onClick={this.HuyNV}
                disabled={this.state.disabledHuy}
                className="btn-dmnv ml-2"
                color={this.state.disabledHuy ? '' : 'danger'} name="huy" id="huy"
              >
                <FontAwesomeIcon icon={faBroom} /> Hủy
              </Button>
            </RoleBase>
          </Row>
          <Row className="mb-2" style={{ marginTop: 10, marginLeft: 97 }}>
            <Button
              onClick={this.XemNV}
              disabled={this.state.disabledXem}
              className="btn-dmnv ml-2 btn btn-outline-primary"
              color={this.state.disabledXem} name="xem" id="xem"
            >
              <FontAwesomeIcon icon={faSearch} /> Xem
            </Button>
            <Button
              className="btn-dmnv ml-2 btn btn-outline-danger"
              onClick={this.INDS}
              disabled={this.state.disabledIn}
              loading={nhanvien.printting}
              color={this.state.disabledIn} name="in" id="in"
            >
              <FontAwesomeIcon icon={faPrint} /> In
            </Button>
            <RoleBase roles={coQuyenTaoTaiKhoan}>
              {/*<Button*/}
              {/*  className="btn-dmnv ml-2"*/}
              {/*  color={this.state.disabledTaoTK ? '' : 'success'}*/}
              {/*  onClick={async () => {*/}
              {/*    await this.props.toggleDmtaotaikhoan(true);*/}
              {/*  }}*/}
              {/*>*/}
              {/*  Tạo tài khoản*/}
              {/*</Button>*/}
              <Button
                className="btn-dmnv ml-2 btn btn-outline-success"
                color={this.state.disabledSetLD} name="setLD" id="setLD"
                onClick={() => this.btnTaoTaiKhoanClick(this.state.dsNhanVienInfo.maNhanVien, this.state.dsNhanVienInfo.tenNhanVien)}
                // loading={nhanvien.emptiing}
              >
                Tạo Tài Khoản
              </Button>
            </RoleBase>
          </Row>
        </Col>
        <div>
          <Row>
            <JqxGrid
              ref={this.refGridDanhMucNhanVien}
              // showtoolbar={true}
              filterable
              showfilterrow
              source={this.dataAdapter}
              columns={this.columns}
              width={'100%'}
              height={window.screen.width < 1280 ? window.screen.width - 100 : window.screen.height - 275}
              theme="darkyellowlis"
              showgroupaggregates
              showstatusbar
              showaggregates
              statusbarheight={22}
              rowsheight={25}
              columnsheight={20}
              filterrowheight={30}
              enablebrowserselection
              columnsresize
              clipboard={false}
              // keyboardnavigation={false}
              // handlekeyboardnavigation={this.handlekeyboardnavigation}
              sortable
              // pageable
              // autorowheight
              // autoheight
              enabletooltips
            />
            {this.state.opendsDG > 0 ? (
              <div id="windowCapNhatDMXN">
                <JqxWindow
                  ref={this.refWindow}
                  width={window.screen.width}
                  title="Đánh giá nhân viên trực"
                  showCollapseButton
                  // autoOpen={false}
                  position={{ x: window.screen.width * 0.05, y: window.screen.height * 0.1 }}
                  theme="darkyellowlis"
                >
                  <WindowDanhGia />
                </JqxWindow>
              </div>
            ) : (
              ''
            )}
          </Row>
          <TaoTaiKhoan/>
        </div>
      </Fade>
    );
  }
}

const mapStateToProps = ({ nhanvien }: IRootState) => ({
  nhanvien,
  danhSachChucVu: nhanvien.danhSachChucVu,
  danhSachNhanVien: nhanvien.danhSachNhanVien,
  danhSachPhongBan: nhanvien.danhSachPhongBan
});

const mapDispatchToProps = {
  getDSChucVu,
  getDSNhanVienFull,
  getDSTenPhongBan,
  getDSDanhGia,
  luudsNV,
  deletedsNV,
  updateNV,
  toggleDmtaotaikhoan,
  forwardNhanVienTK,
  inDSNhanVien,
  setLanhDao
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Nhanvien);
