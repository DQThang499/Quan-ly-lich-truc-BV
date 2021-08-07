import React, { createRef } from 'react';
import {
  getDanhSach,
  getDSTenVaiTro,
  capnhatRole,
  inDSTaiKhoan
} from 'app/shared/reducers/taikhoanbv/taikhoan';
import {
  toggleDmtaotaikhoan,
  forwardNhanVienTK
} from 'app/shared/reducers/taikhoanbv/edittaikhoan';
import { Row, Col, Input, Label, CardBody, CardHeader } from 'reactstrap';
import { Button, Card, Dropdown, Icon, List, Tag } from 'antd';
import Fade from 'react-reveal/Fade';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import JqxGrid, { jqx } from 'jqwidgets-scripts/jqwidgets-react/react_jqxgrid';
import 'app/modules/danhmuc/nhanvien.scss';
import EditTaiKhoan from 'app/modules/taikhoan/edittaikhoan';
import 'app/shared/layout/theme/darkyellowlis.scss';

export interface IDsNhanVienProp extends StateProps, DispatchProps {}
export interface IDsNhanVienState {
  dsTaiKhoanInfo: any;
  vaiTro: any;
  tenVaiTroSelect: any;
  disabledField: any;
  disabledRole: any;
  disabledIn: any;
  disabledAcount: any;
}

class TaiKhoanBV extends React.Component<IDsNhanVienProp, IDsNhanVienState> {
  private refGridTaiKhoan = createRef<JqxGrid>();
  private dataAdapter;
  private columns;
  private source;

  constructor(props) {
    super(props);
    this.state = {
      dsTaiKhoanInfo: {
        maNguoiDung: '',
        maNhanVien: '',
        tenNhanVien: '',
        tenDangNhap: '',
        matKhau: '',
        maVaiTro: ''
      },
      tenVaiTroSelect: [],
      vaiTro: '',
      disabledField: true,
      disabledRole: false,
      disabledAcount: false,
      disabledIn: false
    };
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.capNhatRole = this.capNhatRole.bind(this);
    this.INDS = this.INDS.bind(this);
  }
  private btnChinhSuaTaiKhoanClick = (maNhanVien, tenNhanVien, tenDangNhap, maNguoiDung) => { // hàm gọi từ ts
    this.props.toggleDmtaotaikhoan(true);
    this.props.forwardNhanVienTK(maNhanVien, tenNhanVien, tenDangNhap, maNguoiDung);
  };
  componentWillMount() {
    this.initDataAdapter();
  }
  componentDidMount() {
    this.props.getDanhSach();
    this.props.getDSTenVaiTro();
    this.refGridTaiKhoan.current.on('rowselect', this.onRowSelect);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.taikhoanbv.dsTenVaiTro !== nextProps.taikhoanbv.dsTenVaiTro && nextProps.taikhoanbv.dsTenVaiTro) {
      this.setState({ tenVaiTroSelect: nextProps.taikhoanbv.dsTenVaiTro });
    }
    if (this.props.taikhoanbv.danhSachTaiKhoan !== nextProps.taikhoanbv.danhSachTaiKhoan) {
      this.source.localdata = nextProps.taikhoanbv.danhSachTaiKhoan;
      this.refGridTaiKhoan.current.updatebounddata('cells'); // review từ list vào thẻ có values
      const index = this.refGridTaiKhoan.current.getselectedrowindex();
      if (index > -1) {
        this.refGridTaiKhoan.current.unselectrow(index);
      }
    }
  }
  onRowSelect = event => {
    const index = event.args.rowindex;
    const row = this.refGridTaiKhoan.current.getrowdata(index);
    const entity = {
      ...row
    };
    const temp = { ...this.state.dsTaiKhoanInfo };
    temp['maNguoiDung'] = entity.maNguoiDung;
    temp['tenNhanVien'] = entity.tenNhanVien;
    temp['maNhanVien'] = entity.maNhanVien;
    temp['tenDangNhap'] = entity.tenDangNhap;
    temp['maVaiTro'] = entity.maVaiTro;

    this.setState({
      dsTaiKhoanInfo: { ...temp },
      disabledField: true
    });
  };
  INDS() {
    this.props.inDSTaiKhoan();
  }
  capNhatRole() {
    this.props.capnhatRole(this.state.dsTaiKhoanInfo.maNguoiDung,
      this.state.dsTaiKhoanInfo.maVaiTro);
    this.setState({
      dsTaiKhoanInfo: true
    });
    this.props.getDanhSach();
  }

  handleSelectChange (event) {
    const target = event.target;
    const name = target.name; // mỗi ô input đc phân biệt dựa vào name
    const value = target.value; // mỗi ô input đc phân biệt dựa vào value
    const temp = this.state.dsTaiKhoanInfo;
    temp[name] = value;
    this.setState({ dsTaiKhoanInfo: temp });
  }
  public initDataAdapter() {
    const datafields = [
      { name: 'maNguoiDung', type: 'integer' },
      { name: 'maNhanVien', type: 'integer' },
      { name: 'tenNhanVien', type: 'string' },
      { name: 'tenDangNhap', type: 'string' },
      { name: 'maVaiTro', type: 'integer' },
      { name: 'tenVaiTro', type: 'string' }
    ];
    this.source = {
      datatype: 'json',
      datafields,
      localdata: {}
    };
    this.dataAdapter = new jqx.dataAdapter(this.source);
    this.columns = [
      {
        text: 'Mã Dùng ',
        datafield: 'maNguoiDung',
        align: 'center',
        className: 'font-weight-bold',
        width: '8%'
      },
      {
        text: 'Mã Nhân Viên',
        datafield: 'maNhanVien',
        align: 'center',
        className: 'font-weight-bold',
        width: '13%'
      },
      {
        text: 'Tên Nhân Viên',
        datafield: 'tenNhanVien',
        align: 'center',
        className: 'font-weight-bold',
        width: '25%',
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
        text: 'Tên Đăng Nhập',
        datafield: 'tenDangNhap',
        align: 'center',
        className: 'font-weight-bold',
        width: '20%'
      },
      {
        text: 'Mã Vai Trò',
        datafield: 'maVaiTro',
        align: 'center',
        className: 'font-weight-bold',
        width: '10%'
      },
      {
        text: 'Tên Vai Trò',
        datafield: 'tenVaiTro',
        align: 'center',
        className: 'font-weight-bold',
        width: '25%'
      }
    ];
  }

  render() {
    const { header } = this.props;
    const { taikhoanbv } = this.props;
    const info = (
      <Row>
        <div className="pt-2 pb-2 pl-5 ">
          <h5 className="text-uppercase text-center" >
            DANH MỤC CÁN BỘ ĐÃ CÓ TÀI KHOẢN ĐƠN VỊ
          </h5>
        </div>
      </Row>
    );
    const chucnang = (
      <div>
        <Row className="justify-content-center p-2" >
          <Col sm={8}>
            <div>
              <Row>
                <Label className="normal" style={{ fontSize: 14, textAlign: 'center' }}>
                  <strong>Tên vai trò</strong>
                </Label>
                <Input
                  type="select"
                  name="maVaiTro"
                  id="maVaiTro"
                  style={{ width: 230 }}
                  onChange={this.handleSelectChange}
                  className="btn-dmnv ml-2"
                  value={this.state.dsTaiKhoanInfo.maVaiTro ? this.state.dsTaiKhoanInfo.maVaiTro : ''}
                >
                  {this.state.tenVaiTroSelect.length > 0 ? (
                    <option key={-1} value={''}>
                      --- Tất cả ---
                    </option>)
                    : (
                      ''
                    )}
                    {this.state.tenVaiTroSelect ? this.state.tenVaiTroSelect.map(c => (
                      <option key={c.maVaiTro} value={c.maVaiTro} selected={this.state.vaiTro === c.maVaiTro}>
                        {c.tenVaiTro}
                      </option>
                      ))
                      : ''}
                  </Input>
                    <Button
                      onClick={this.capNhatRole}
                      className="bg-vnpt"
                      loading={ taikhoanbv.roleeing }
                    >
                      Phân quyền tài khoản
                    </Button>
                    <Button
                      onClick={() => this.btnChinhSuaTaiKhoanClick(this.state.dsTaiKhoanInfo.maNhanVien,
                        this.state.dsTaiKhoanInfo.tenNhanVien,
                        this.state.dsTaiKhoanInfo.tenDangNhap,
                        this.state.dsTaiKhoanInfo.maNguoiDung)}
                      className="bg-success-light"
                    >
                      Chỉnh sửa tài khoản
                    </Button>
              </Row>
              <JqxGrid
                ref={this.refGridTaiKhoan}
                filterable
                showfilterrow
                source={this.dataAdapter}
                columns={this.columns}
                width={'100%'}
                height={window.screen.height * 0.55}
                theme="darkyellowlis"
                showgroupaggregates
                showstatusbar
                showaggregates
                statusbarheight={22}
                enablebrowserselection
                sortable
                columnsheight={20}
                rowsheight={20}
                filterrowheight={30}
                columnsresize
                clipboard={false}
              />
              <EditTaiKhoan/>
            </div>
          </Col>
          <Col sm={4}>
            <div className="pt-2">
              <Card className="shadow-sm">
                <CardHeader>
                  <div className="text-center font-weight-bold">Hiển thị thông tin</div>
                </CardHeader>
                <CardBody>
                  <List>
                    <List.Item>
                      <Row>
                        <Label className="normal" style={{ fontSize: 12 }}>
                          <strong>Mã người dùng</strong>
                        </Label>
                      </Row>
                      <Input
                        className="input-dmnv"
                        name="maNguoiDung"
                        id="maNguoiDung"
                        style={{ width: 120 }}
                        // onChange={this.handleInputChange}
                        value={this.state.dsTaiKhoanInfo.maNguoiDung}
                        disabled={this.state.disabledField}
                      />
                    </List.Item>
                    <List.Item>
                      <Row>
                        <Label className="normal" style={{ fontSize: 12 }}>
                          <strong>Mã nhân viên</strong>
                        </Label>
                      </Row>
                      <Input
                        className="input-dmnv"
                        name="maNhanVien"
                        id="maNhanVien"
                        style={{ width: 120 }}
                        // onChange={this.handleInputChange}
                        value={this.state.dsTaiKhoanInfo.maNhanVien}
                        disabled={this.state.disabledField}
                      />
                    </List.Item>
                    <Label className="normal" style={{ fontSize: 12 }}>
                      <strong>Tên nhân viên</strong>
                    </Label>
                    <Input
                      className="input-dmnv"
                      name="tenNhanVien"
                      style={{ width: 200 }}
                      // onChange={this.handleInputChange}
                      value={this.state.dsTaiKhoanInfo.tenNhanVien}
                      disabled={this.state.disabledField}
                    />
                    <Label className="normal" style={{ fontSize: 12 }}>
                      <strong>Tên đăng nhập</strong>
                    </Label>
                    <Input
                      className="input-dmnv"
                      name="tenDangNhap"
                      style={{ width: 200 }}
                      // onChange={this.handleInputChange}
                      value={this.state.dsTaiKhoanInfo.tenDangNhap}
                      disabled={this.state.disabledField}
                    />
                    <List.Item>
                      <Icon type="user-add" className="align-middle pr-2" />
                      <Tag color="red">
                        <Icon className="align-middle" />
                        <span className="align-middle ml-2"><strong>Được tạo bởi: { header.tenDangNhap }</strong></span>
                      </Tag>
                    </List.Item>
                  </List>
                </CardBody>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    );
    return (
      <Fade right duration={700}>
        <div id="dmthongtintaikhoan">
          <div>
            {info}
          </div>
          <hr/>
          <div>
            {chucnang}
          </div>
        </div>
      </Fade>
    );
  }
}

const mapStateToProps = (iRootState: IRootState) => ({
  iRootState,
  taikhoanbv: iRootState.taikhoanbv,
  header: iRootState.header
});

const mapDispatchToProps = {
  getDanhSach,
  getDSTenVaiTro,
  capnhatRole,
  toggleDmtaotaikhoan,
  forwardNhanVienTK,
  inDSTaiKhoan
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaiKhoanBV);
