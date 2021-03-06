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
      errorMessage: 'S??? ??i???n tho???i ph???i c?? 10 ch??? s???.'
    };
  }
};
const coQuyenTaoTaiKhoan: IRole[] = [ROLES.ADMIN];

class Nhanvien extends React.Component<IDsNhanVienProp, IDsNhanVienState> {
  private refGridDanhMucNhanVien = createRef<JqxGrid>(); // khai b??o l?????i
  private refWindow = createRef<JqxWindow>();
  private dataAdapter; // ch???n d??? li???u
  private source; // l???y source
  private flag;
  private columns; // t???o d??ng
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
  constructor(props) { // t???o constructor g??n c??c gi?? tr??? cho bi???n this.state ???? ???????c khai b??o tr??n interface
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
  private btnTaoTaiKhoanClick = (maNhanVien, tenNhanVien) => { // h??m g???i t??? ts
    this.props.toggleDmtaotaikhoan(true);
    this.props.forwardNhanVienTK(maNhanVien, tenNhanVien);
  };
  componentWillMount() {
    this.initDataAdapter();
  }// ????? th???c hi???n load d??? li???u

  componentDidMount() { // s??? d???ng cho vi???c l???y d??? li???u t??? ???ng d???ng b??n ngo??i vd nh?? reducer v?? API
    this.props.getDSChucVu();
    this.props.getDSTenPhongBan();
    this.props.getDSNhanVienFull(this.state.dsNhanVienInfo.maPhongBan);
    this.refGridDanhMucNhanVien.current.on('rowdoubleclick', this.onRowDoubleClick);
  }
  componentWillReceiveProps(nextProps) { // ch??? ??c g???i n???u component nh???n ??c t??? 1 prop xem tr?????c
    if (this.props.danhSachChucVu !== nextProps.danhSachChucVu && nextProps.danhSachChucVu) {
      this.setState({ dsChucVuSelect: nextProps.danhSachChucVu });
    } // n???u prop DSCV l?? gi?? tr??? xem tr?????c c???a prop m?? CPN chu???n b??? render
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
  // componentWillUpdate(nextProps, nextState) { t????ng t??c v???i 1 ki???n tr??c b??n ngo??i t????ng t??c v???i 1 API t????ng t??? CPNdidmount
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
    if (confirm('B???n c?? mu???n x??a Nh??n Vi??n ' + dsNhanVienInfo.maNhanVien + 'v???i t??n Nh??n vi??n' + dsNhanVienInfo.tenNhanVien + '?')) {
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

  handleInputChange (event) { // target cho t???ng ?? input
    const target = event.target;
    const name = target.name; // m???i ?? input ??c ph??n bi???t d???a v??o name
    const value = target.value; // m???i ?? input ??c ph??n bi???t d???a v??o value
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

  public initDataAdapter() { // khai b??o gi???ng sql
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

    this.columns = [ // t???o d??ng
      {
        text: 'M?? Nh??n Vi??n',
        datafield: 'maNhanVien',
        align: 'center',
        className: 'font-weight-bold',
        width: '12%'
      },
      {
        text: 'T??n Nh??n Vi??n',
        datafield: 'tenNhanVien',
        align: 'center',
        className: 'font-weight-bold',
        width: '20%',
        aggregates: [
          {
            'T???ng s??? d??ng'(aggregatedValue, currentValue) {
              if (currentValue) {
                return aggregatedValue + 1;
              }
              return aggregatedValue;
            }
          }
        ]
      },
      {
        text: 'M?? Ph??ng Ban',
        datafield: 'maPhongBan',
        align: 'center',
        className: 'font-weight-bold',
        width: '12%'
      },
      {
        text: 'T??n Ph??ng Ban',
        datafield: 'tenPhongBan',
        align: 'center',
        className: 'font-weight-bold',
        width: '23%'
      },
      {
        text: 'S??? ??i???n Tho???i',
        datafield: 'sdtNhanVien',
        align: 'center',
        className: 'font-weight-bold',
        width: '12%'
      },
      {
        text: 'Ch???c Danh Nh??n Vi??n',
        datafield: 'chucDanhNhanVien',
        align: 'center',
        className: 'font-weight-bold',
        width: '25%'
      },
      {
        text: 'T??i Kho???n',
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
            <strong>DANH M???C TH??NG TIN NH??N VI??N </strong>
          </h5>
        </div>
        <hr/>
        <Col>
          <Row>
            <Label className="small" style={{ width: 120, textAlign: 'center' }}>
              M?? Nh??n Vi??n
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
              T??n Nh??n Vi??n
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
              S??? ??i???n Tho???i
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
              M?? Ph??ng Ban
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
                --- T???t c??? ---
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
              T??n Ph??ng Ban
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
                --- T???t c??? ---
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
              Ch???c v???
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
                --- T???t c??? ---
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
                <FontAwesomeIcon icon={faPlus} /> Th??m
              </Button>
              <Button
                onClick={this.luuNV}
                disabled={this.state.disabledLuu}
                className="btn-dmnv ml-2"
                color={this.state.disabledLuu ? '' : 'danger'}
                loading={ nhanvien.savving } name="luu" id="luu"
              >
                <FontAwesomeIcon icon={faSave} /> L??u
              </Button>
              <Button
                onClick={this.suaNV}
                disabled={this.state.disabledSua}
                className="btn-dmnv ml-2"
                color={this.state.disabledSua ? '' : 'info'} name="sua" id="sua"
              >
                <FontAwesomeIcon icon={faEdit} /> S???a
              </Button>
              <Button
                onClick={this.xoaNV}
                disabled={this.state.disabledXoa}
                className="btn-dmnv ml-2"
                color={this.state.disabledXoa ? '' : 'warning'} name="xoa" id="xoa"
                loading={nhanvien.deleteing}
              >
                 <FontAwesomeIcon icon={faTrashAlt} /> X??a
              </Button>
              <Button
                onClick={this.HuyNV}
                disabled={this.state.disabledHuy}
                className="btn-dmnv ml-2"
                color={this.state.disabledHuy ? '' : 'danger'} name="huy" id="huy"
              >
                <FontAwesomeIcon icon={faBroom} /> H???y
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
              {/*  T???o t??i kho???n*/}
              {/*</Button>*/}
              <Button
                className="btn-dmnv ml-2 btn btn-outline-success"
                color={this.state.disabledSetLD} name="setLD" id="setLD"
                onClick={() => this.btnTaoTaiKhoanClick(this.state.dsNhanVienInfo.maNhanVien, this.state.dsNhanVienInfo.tenNhanVien)}
                // loading={nhanvien.emptiing}
              >
                T???o T??i Kho???n
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
                  title="????nh gi?? nh??n vi??n tr???c"
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
