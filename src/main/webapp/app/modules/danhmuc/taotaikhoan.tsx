import React, { createRef } from 'react';
import { Row, Col, Input, Label, Form, FormGroup } from 'reactstrap';
import { Icon, Modal, Button } from 'antd';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import 'app/modules/danhmuc/nhanvien.scss';
import {
  toggleDmtaotaikhoan,
  forwardNhanVienTK,
  luutaikhoan
} from 'app/shared/reducers/danhmuc/taikhoannv';
import JqxValidator from 'jqwidgets-scripts/jqwidgets-react/react_jqxvalidator';

export interface IDsTaiKhoanProp extends StateProps, DispatchProps {}
export interface IDsTaiKhoanState {
  thongTinTaiKhoan: any;
  disabledLuu: any;
  disabledTDN: any;
  disabledMK: any;
  disabledTaoTK: any;
}
class Taotaikhoan extends React.Component<IDsTaiKhoanProp, IDsTaiKhoanState> {
  private refRules = createRef<JqxValidator>();
  private rules;
  constructor(props) {
    super(props);
    this.state = {
      thongTinTaiKhoan: {
        maNguoiDung: '',
        maNhanVien: '',
        tenNhanVien: '',
        tenDangNhap: '',
        tenVaiTro: '',
        matKhau: ''
      },
      disabledMK: true,
      disabledTDN: true,
      disabledLuu: true,
      disabledTaoTK: false
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.luuTK = this.luuTK.bind(this);
    this.TaoTK = this.TaoTK.bind(this);
  }
  TaoTK() {
    this.setState({
      disabledTDN: false,
      disabledMK: false,
      disabledLuu: false
    });
  }
  luuTK() {
    const { thongTinTaiKhoan } = this.state;
    const { taikhoannv } = this.props;
    this.refRules.current.validate(document.getElementById('frmDMLoaiXN'));
    if (confirm(' Bạn có muốn lưu tên đăng nhập ' + thongTinTaiKhoan.tenDangNhap + ' với tên nhân viên ' + taikhoannv.tenNhanVien + '?')) {
      this.props.luutaikhoan(
        taikhoannv.maNhanVien,
        this.state.thongTinTaiKhoan.tenDangNhap,
        this.state.thongTinTaiKhoan.matKhau
      );
    }
  }
  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    const temp = this.state.thongTinTaiKhoan;
    temp[name] = value;

    // tslint:disable-next-line:switch-default
    switch (name) {
      case 'tenDangNhap': {
        this.setState({ thongTinTaiKhoan : value });
        break;
      }
      case 'matkhau': {
        this.setState({ thongTinTaiKhoan : value });
        break;
      }
    }
    this.setState({ thongTinTaiKhoan: temp });
  }
  componentWillMount() {
    this.initDataAdapter();
  }

  public initDataAdapter() {
    this.rules = [
      { input: '.hoTenRules', message: 'Không được để trống vui lòng nhập Tài khoản!', action: 'keyup, blur', rule: 'required' },
      { input: '.passRules', message: 'Không được để trống vui lòng nhập Mật khẩu!', action: 'keyup, blur', rule: 'required' }
    ];
  }
  render() {
    const { taikhoannv } = this.props; // viết sự kiện cho mở from tk
    return (
      <Modal
        title="Tạo Tài Khoản"
        visible={taikhoannv.modal}
        style={{ top: '20px' }}
        width="800px"
        footer={
          <div>
            <Button onClick={() => this.props.toggleDmtaotaikhoan(false)}>Đóng</Button>
          </div>
        }
        onCancel={() => this.props.toggleDmtaotaikhoan(false)}
      >
        <div id="dmtaikhoannv">
          <JqxValidator
            ref={this.refRules}
            rules={this.rules}
            animationDuration={500}
            hintType={'label'}
            position={'right'}
            className="style-validator"
          >
            <Form id="frmDMLoaiXN">
              <FormGroup>
                <Row>
                  <Col md="4">
                    <Label className="label-chitiet">
                      Tên Đăng Nhập <span className="text-danger">*</span>
                    </Label>
                  </Col>
                  <Col md="8">
                    <Input
                      type="text"
                      className="p-ttbndv border-listhem hoTenRules"
                      name="tenDangNhap"
                      id="tenDangNhap"
                      onChange={this.handleInputChange}
                      disabled={this.state.disabledTDN}
                      placeholder="Nhập tên đăng nhập"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col md="4">
                    <Label className="label-chitiet input-mr">Tên Nhân Viên</Label>
                  </Col>
                  <Col md="8">
                    <h3>{taikhoannv.tenNhanVien}</h3>
                  </Col>
                </Row>
                <Row>
                  <Col md="4">
                    <Label className="label-chitiet input-mr">Mật Khẩu</Label>
                  </Col>
                  <Col md="8">
                    <Input
                      id="matKhau"
                      type="password"
                      className="input-chitiet passwordInputUpdate input-mr p-ttbndv border-listhem passRules"
                      name="matKhau"
                      placeholder="Mật khẩu"
                      disabled={this.state.disabledMK}
                      onChange={this.handleInputChange}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col md="4">
                    <Label className="label-chitiet input-mr">Xác Nhận</Label>
                  </Col>
                  <Col md="8">
                    <Button
                      type="primary"
                      disabled={this.state.disabledTaoTK}
                      className="bg-vnpt input-mr"
                      onClick={this.TaoTK}
                    >
                      Tạo tài khoản
                    </Button>
                    <Button
                      type="primary"
                      disabled={this.state.disabledLuu}
                      className="bg-vnpt input-mr"
                      onClick={this.luuTK}
                      loading={taikhoannv.creating}
                    >
                      Lưu
                      <Icon type="save"/>
                    </Button>
                  </Col>
                </Row>
              </FormGroup>
            </Form>
          </JqxValidator>
        </div>
      </Modal>
    );
  }
}
const mapStateToProps = ({ taikhoannv }: IRootState) => ({
  taikhoannv
});
const mapDispatchToProps = {
  toggleDmtaotaikhoan, // hàm sử dụng mở form
  forwardNhanVienTK, // hàm sử dụng cho load dữ liệu lên from
  luutaikhoan
  // savetaikhoan
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Taotaikhoan);
