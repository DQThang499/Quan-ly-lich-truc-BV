import React, { createRef } from 'react';
import { Row, Col, Input, Label, CardBody, CardHeader } from 'reactstrap';
import Fade from 'react-reveal/Fade';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import JqxRadioButton from 'jqwidgets-scripts/jqwidgets-react/react_jqxradiobutton.js';
import 'app/modules/danhmuc/nhanvien.scss';
import 'app/shared/layout/theme/darkyellowlis.scss';
import { getDSTenPhongBanDG } from 'app/shared/reducers/danhmuc/danhgia';
import {IDanhGiaProp} from "app/modules/danhmuc/danhgia";

export interface IThongTinProp extends StateProps, DispatchProps {}
export interface IThongTinState {
  dsDanhGiaInfo: any;
  phongBan: any;
  dstenPBSelect: any;
  disabledField: any;
  disabledThem: any;
  disabledXoa: any;
  disabledSua: any;
  disabledHuy: any;
  disabledLuu: any;
}

class Thongtinchitiet extends React.Component<IThongTinProp, IThongTinState> {
  private refDat = createRef<JqxRadioButton>();
  private refChuaDat = createRef<JqxRadioButton>();
  constructor(props) {
    super(props);
    this.state = {
      dsDanhGiaInfo: {
        maDanhGia: '',
        maNhanVien: '',
        tenPhongBan: '',
        Thang: '',
        Nam: '',
        ngayTruc: '',
        moTa: '',
        nhanXet: '',
        chuThich: '',
        maPhongBan: ''
      },
      dstenPBSelect: [],
      phongBan: '',
      disabledField: true,
      disabledThem: false,
      disabledLuu: true,
      disabledSua: true,
      disabledXoa: true,
      disabledHuy: true,
    };
    // this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentWillMount() {
  }
  componentDidMount() {
    this.props.getDSTenPhongBanDG();
  }

  componentWillReceiveProps(nextProps: Readonly<IDanhGiaProp>, nextContext: any) {
    if (this.props.danhgia.danhSachPhongBan !== nextProps.danhgia.danhSachPhongBan && nextProps.danhgia.danhSachPhongBan) {
      this.setState({ dstenPBSelect: nextProps.danhgia.danhSachPhongBan });
      // const log = nextProps.danhgia.danhSachPhongBan;
      // console.log(log);
    }
  }

  render() {
    const thongtinchitiet = (
      <div className = "pt-2 pb-2 pl-5 ">
        <Row>
          <Label className="small" style={{ width: 120 }}>
            Mã Phiếu Đánh Giá
          </Label>
          <Input
            className="input-dmnv"
            name="maDanhGia"
            id="maDanhGia"
            style={{ width: 100 }}
            // onChange={this.handleInputChange}
            value={this.state.dsDanhGiaInfo.maDanhGia}
            disabled={this.state.disabledField}
          />
          <Label className="small" style={{ width: 100, textAlign: 'center' }}>
            Mã Nhân Viên
          </Label>
          <Input
            className="input-dmnv"
            name="maNhanVien"
            id="maNhanVien"
            style={{ width: 100 }}
            // onChange={this.handleInputChange}
            value={this.state.dsDanhGiaInfo.maNhanVien}
            disabled={this.state.disabledField}
          />
          <Label className = "small">
            Tên Phòng Ban
          </Label>
          <Input
            type="select"
            name="maPhongBan"
            style={{ width : 220 }}
            // onChange={this.handleInputChange}
            className="select-input-hovk"
            value={this.state.dsDanhGiaInfo.maPhongBan}
          >
            <option key={-1} value={''}>
              -- Tất cả --
            </option>
            {this.props.danhgia.danhSachPhongBan
              ? this.props.danhgia.danhSachPhongBan.map(c => (
                <option key={c.maPhongBan} value={c.maPhongBan} selected={this.state.phongBan === c.maPhongBan}>
                  {c.tenPhongBan}
                </option>
              ))
              : ''}
          </Input>
          <JqxRadioButton ref={this.refDat} width={100} height={25} theme="darkyellowlis">
            Đạt
          </JqxRadioButton>
          <JqxRadioButton ref={this.refChuaDat} width={100} height={25} theme="darkyellowlis">
            Chưa Đạt
          </JqxRadioButton>
        </Row>
        <Row>
          <Label className="small" style={{ width: 100 }}>
            Mô Tả
          </Label>
          <Input
            className="input-dmnv"
            name="moTa"
            id="moTa"
            style={{ width: 350 }}
            // onChange={this.handleInputChange}
            value={this.state.dsDanhGiaInfo.moTa}
            disabled={this.state.disabledField}
          />
          <Label className="small" style={{ width: 100 }}>
            Ghi chú
          </Label>
          <Input
            className="input-dmnv"
            name="ghiChu"
            id="ghiChu"
            style={{ width: 350 }}
            // onChange={this.handleInputChange}
            value={this.state.dsDanhGiaInfo.chuThich}
            disabled={this.state.disabledField}
          />
        </Row>
      </div>
    );
    return (
      <Fade right duration={700}>
        <div id="dmthongtintaikhoan">
          {thongtinchitiet}
          <hr/>
        </div>
      </Fade>
    );
  }
}

const mapStateToProps = (iRootState: IRootState) => ({
  iRootState,
  danhgia : iRootState.danhgia
});

const mapDispatchToProps = {
  getDSTenPhongBanDG
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Thongtinchitiet);
