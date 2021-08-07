import React from 'react';
import { DatePicker, Form, message, Modal, Select } from 'antd';
import { Input } from 'reactstrap';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { IRootState } from 'app/shared/reducers';
import { submitNhapVangTruc, toggleNhap, getDSNhanVienCungLoai } from 'app/shared/reducers/dstruc/nhapvangtruc';
import { connect } from 'react-redux';
import 'app/modules/danhmuc/nhanvien.scss';

export interface INhapVangTrucProps extends StateProps, DispatchProps {
  form: WrappedFormUtils;
}
export interface INhapVangTrucState {
  maNhanVien: any;
  nhanVien: any;
  tenNhanVien: any;
  chucDanh: any;
  dsNVThayThe: any;
}
class NhapVangTruc extends React.Component<INhapVangTrucProps, INhapVangTrucState> {
  private formItemLayout = {
    labelCol: {
      span: 10
    },
    wrapperCol: {
      span: 10
    }
  };
  private lyDoVang = ['Đi công tác', 'Bận việc gia đình', 'Lý do sức khỏe'];

  constructor(props) {
    super(props);
    this.state = {
      maNhanVien: '',
      tenNhanVien: '',
      chucDanh: '',
      dsNVThayThe: [],
      nhanVien: ''
    };
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.nhapvangtruc.danhSachNVThayThe !== nextProps.nhapvangtruc.danhSachNVThayThe) {
      this.setState({ dsNVThayThe: nextProps.nhapvangtruc.danhSachNVThayThe });
    }
  }

  handleSelectChange(event) {
    const target = event.target;
    const value = target.value;
    const temp = this.state.dsNVThayThe.filter(nv => nv.maNhanVien.toString() === value.toString());
    this.setState({ maNhanVien: value, tenNhanVien: temp.length > 0 ? temp[0].tenNhanVien : '' });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { ngayBD, ngayKT, lyDo } = values;
        if (ngayKT.isBefore(ngayBD, 'day')) {
          message.error('Ngày kết thúc không được trước ngày bắt đầu !');
        } else {
          this.props.submitNhapVangTruc(ngayBD.toDate(), ngayKT.toDate(), lyDo.join(', '));
        }
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { nhapvangtruc, themnvtruc } = this.props;
    const form = !nhapvangtruc.modal ? (
      ''
    ) : (
      <Form {...this.formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="Cán bộ vắng trực">
          <strong>{nhapvangtruc.tenNhanVien.toUpperCase()}</strong>
        </Form.Item>
        <Form.Item label="Ngày bắt đầu">
          {getFieldDecorator('ngayBD', {
            rules: [{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]
          })(<DatePicker format="DD-MM-YYYY" placeholder="Chọn ngày bắt đầu" />)}
        </Form.Item>
        <Form.Item label="Ngày kết thúc">
          {getFieldDecorator('ngayKT', {
            rules: [{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]
          })(<DatePicker format="DD-MM-YYYY" placeholder="Chọn ngày kết thúc" />)}
        </Form.Item>
        <Form.Item label="Lý do vắng trực">
          {getFieldDecorator('lyDo', {
            rules: [{ required: true, message: 'Vui lòng nhập lý do' }]
          })(
            <Select mode="tags" placeholder="Lý do">
              {this.lyDoVang.map((lyDo, idx) => (
                <Select.Option key={idx} value={lyDo}>
                  {lyDo}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        {/*<Form.Item label="Danh sách thụcực
        {/*  {getFieldDecorator('canBoThayThe', {*/}
        {/*    rules: [{ required: true , message: 'Vui lòng chọn cán bộ thay thế' }]*/}
        {/*  })(*/}
        {/*    <Input*/}
        {/*      type="select"*/}
        {/*      name="maNhanVien" id="maNhanVien"*/}
        {/*      style={{ width: 190 }}*/}
        {/*      onChange={this.handleSelectChange}*/}
        {/*      className="select-input-hovkvt"*/}
        {/*    >*/}
        {/*      {this.state.dsNVThayThe.length > 0 ? (*/}
        {/*        <option key={-1} value={''} >*/}
        {/*          --- Cán bộ thay thế ---*/}
        {/*        </option>*/}
        {/*      ) : (*/}
        {/*        ''*/}
        {/*      )}*/}
        {/*      {this.state.dsNVThayThe*/}
        {/*        ? this.state.dsNVThayThe.map(c => (*/}
        {/*          <option key={c.maNhanVien} value={c.maNhanVien} selected={this.state.nhanVien === c.maNhanVien}>*/}
        {/*            {c.tenNhanVien}*/}
        {/*          </option>*/}
        {/*        ))*/}
        {/*        : '' }*/}
        {/*    </Input>*/}
        {/*  )}*/}
        {/*</Form.Item>*/}
        {/*<Form.Item label="Cán bộ thay thế">*/}
        {/*  <strong>{this.state.tenNhanVien}</strong>*/}
        {/*</Form.Item>*/}
      </Form>
    );
    return (
      <Modal
        style={{ top: 20 }}
        title="THÔNG TIN VẮNG TRỰC"
        visible={nhapvangtruc.modal}
        okText="Lưu"
        okButtonProps={{
            loading: nhapvangtruc.submiting
        }}
        cancelText="Hủy"
        onOk={this.handleSubmit}
        onCancel={() => this.props.toggleNhap(false)}
      >
        <div className="p-2">{form}</div>
      </Modal>
    );
  }
}

const mapStateToProps = ({ nhapvangtruc, themnvtruc }: IRootState) => ({
  nhapvangtruc,
  themnvtruc
});

const mapDispatchToProps = {
  toggleNhap,
  submitNhapVangTruc,
  getDSNhanVienCungLoai
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default Form.create({ name: 'form_nhap_vang_truc' })(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(NhapVangTruc)
);
