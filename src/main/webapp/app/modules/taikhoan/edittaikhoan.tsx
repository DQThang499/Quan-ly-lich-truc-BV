import React, { createRef } from 'react';
import { Row, Col, Input, Label } from 'reactstrap';
import { Modal, Button } from 'antd';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import 'app/modules/danhmuc/nhanvien.scss';
import {
  toggleDmtaotaikhoan,
  forwardNhanVienTK,
  thayDoiTaiKhoan,
  deleteTaiKhoan
} from 'app/shared/reducers/taikhoanbv/edittaikhoan';
import JqxValidator from 'jqwidgets-scripts/jqwidgets-react/react_jqxvalidator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit, faSave, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

export interface IdsEditTKProp extends StateProps, DispatchProps {}
export interface IdsEditTkState {
  thongTinEdit: any;
  disabledTDN: any;
  disabledMK: any;
  disabledCheck: any;
  disabledLuu: any;
}
class Edittaikhoan extends React.Component<IdsEditTKProp, IdsEditTkState> {
  private flag;
  private refRules = createRef<JqxValidator>();
  private rules;
  constructor(props) {
    super(props);
    this.state = {
      thongTinEdit : {
        maNguoiDung: '',
        tenDangNhap: '',
        matKhau: ''
      },
      disabledTDN: true,
      disabledMK: true,
      disabledCheck: true,
      disabledLuu: true
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.SuaTK = this.SuaTK.bind(this);
    this.luuTK = this.luuTK.bind(this);
    this.xoaTK = this.xoaTK.bind(this);
    this.Check = this.Check.bind(this);
  }
  componentDidMount() {
    // this.props.checkTaiKhoan(this.props.chinhsuatk.maNguoiDung, this.props.chinhsuatk.maNhanVien, this.props.chinhsuatk.matKhau);
  }
  SuaTK() {
    this.flag = 'sua';
    this.setState({
      disabledTDN: false,
      disabledMK: false,
      disabledLuu: true,
      disabledCheck: false
    });
  }
  luuTK() {
    const { thongTinEdit } = this.state;
    this.props.thayDoiTaiKhoan(this.props.chinhsuatk.maNguoiDung,
      thongTinEdit.tenDangNhap,
      thongTinEdit.matKhau);
  }
  xoaTK() {
    if (confirm('Bạn có muốn xóa Tài Khoản ' + this.props.chinhsuatk.tenDangNhap + '?')) {
      this.props.deleteTaiKhoan(this.props.chinhsuatk.maNguoiDung);
    } else {
      return false;
    }
  }
  Check() {
    this.setState({
      disabledTDN: true,
      disabledMK: true,
      disabledLuu: false
    });
  }
  componentWillMount() {
    this.initDataAdapter();
  }
  public initDataAdapter() {
    this.rules = [
      { input: '.hoTenRules', message: 'vui lòng nhập Tài khoản mới!', action: 'keyup, blur', rule: 'required' },
      { input: '.passRules', message: 'vui lòng nhập Mật khẩu mới!', action: 'keyup, blur', rule: 'required' }
    ];
  }
  handleInputChange(event) {
    const target = event.target;
    const name = target.name; // mỗi ô input đc phân biệt dựa vào name
    const value = target.value; // mỗi ô input đc phân biệt dựa vào value
    const temp = this.state.thongTinEdit;
    temp[name] = value;
    this.setState({ thongTinEdit: temp });
  }
  render() {
    const { chinhsuatk } = this.props;
    return (
      <Modal
        title="Thay Đổi Tài Khoản"
        visible={chinhsuatk.modal}
        style={{ top: '10px', background: 'cyan' }}
        width="700px"
        footer={
          <div>
            <Button onClick={() => this.props.toggleDmtaotaikhoan(false)}>Đóng</Button>
          </div> // modal viết sự kiện tạo form con cho giao diện
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
            <Row>
              <Col md="3">
                <Label className="label-chitiet">Mã Người Dùng</Label>
              </Col>
              <Col md="7">
                <h3>{chinhsuatk.maNguoiDung}</h3>
              </Col>
            </Row>
            <Row>
              <Col md="3" className="input-mr">
                <Label className="label-chitiet">Tên Đăng Nhập Củ</Label>
              </Col>
              <Col md="7" className="input-mr">
                <h3>{chinhsuatk.tenDangNhap}</h3>
              </Col>
              <Col md="2" className="input-mr">
                <Button
                  type="primary"
                  className="bg-vnpt"
                  onClick={this.xoaTK}
                >
                  Xóa <FontAwesomeIcon icon={faTrashAlt} />
                </Button>
              </Col>
            </Row>
            <Row>
              <Col md="3" className="input-mr">
                <Label className="label-chitiet">Tên Đăng Nhập Mới</Label>
              </Col>
              <Col md="7" className="input-mr">
                <Input
                  type="text"
                  className="p-ttbndv border-listhem hoTenRules"
                  name="tenDangNhap"
                  id="tenDangNhap"
                  onChange={this.handleInputChange}
                  disabled={this.state.disabledTDN}
                  placeholder="Nhập tên đăng nhập mới"
                />
              </Col>
              <Col md="2" className="input-mr">
                <Button
                  type="primary"
                  className="bg-vnpt"
                  icon="faEdit"
                  onClick={this.SuaTK}
                >
                  Sửa <FontAwesomeIcon icon={faEdit} />
                </Button>
              </Col>
            </Row>
            <Row>
              <Col md="3" className="input-mr">
                <Label className="label-chitiet">Tên Nhân Viên</Label>
              </Col>
              <Col md="7" className="input-mr">
                <h3>{chinhsuatk.tenNhanVien}</h3>
              </Col>
              <Col md="2" className="input-mr">
                <Button
                  type="primary"
                  disabled={this.state.disabledCheck}
                  className="bg-vnpt"
                  onClick={this.Check}
                  loading={ chinhsuatk.check }
                >
                  Check <FontAwesomeIcon icon={faCheck} />
                </Button>
              </Col>
            </Row>
            <Row>
              <Col md="3" className="input-mr">
                <Label className="label-chitiet">Mật Khẩu</Label>
              </Col>
              <Col md="7">
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
              <Col md="2" className="input-mr">
                <Button
                  type="primary"
                  disabled={this.state.disabledLuu}
                  className="bg-vnpt"
                  onClick={this.luuTK}
                  loading={ chinhsuatk.creating }
                >
                  Lưu <FontAwesomeIcon icon={faSave} />
                </Button>
              </Col>
            </Row>
          </JqxValidator>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = ({ chinhsuatk }: IRootState) => ({
  chinhsuatk
});

const mapDispatchToProps = {
  toggleDmtaotaikhoan,
  forwardNhanVienTK,
  thayDoiTaiKhoan,
  deleteTaiKhoan
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Edittaikhoan);
