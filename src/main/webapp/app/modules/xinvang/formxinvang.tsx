import React from 'react';
import { Button, DatePicker, Form, message, Modal, Select } from 'antd';
import { EHRSessionStorage } from 'app/modules/ehr/sessionStorage/ehrStorageService';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { submitXinVangTruc, toggleModalNhap } from 'app/shared/reducers/xinvang';

export interface IFormXinVangProps extends StateProps, DispatchProps {
  form: WrappedFormUtils;
}

class FormXinVang extends React.Component<IFormXinVangProps> {
  private formItemLayout = {
    labelCol: {
      span: 10
    },
    wrapperCol: {
      span: 10
    }
  };
  private lyDoVang = ['Đi công tác', 'Bận việc gia đình', 'Lý do sức khỏe'];

  private handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { ngayBD, ngayKT, lyDo } = values;
        if (ngayKT.isBefore(ngayBD, 'day')) {
          message.error('Ngày kết thúc và ngày bắt đầu không hợp lệ !');
        } else {
          this.props.submitXinVangTruc(ngayBD.toDate(), ngayKT.toDate(), lyDo.join(', '));
        }
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { xinvang } = this.props;
    return (
      <Modal
        title="Nhập đơn xin vắng"
        style={{ top: 20 }}
        visible={xinvang.modalNhap}
        onCancel={() => this.props.toggleModalNhap(false)}
        cancelText="Hủy"
        onOk={this.handleSubmit}
        okText="Nộp"
        okButtonProps={{ loading: xinvang.loading }}
      >
        {xinvang.modalNhap ? (
          <Form {...this.formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label="Cán bộ vắng trực">
              <strong>{EHRSessionStorage.get('tenNhanVien').toUpperCase()}</strong>
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
          </Form>
        ) : (
          ''
        )}
      </Modal>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  xinvang: storeState.xinvang
});

const mapDispatchToProps = {
  toggleModalNhap,
  submitXinVangTruc
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create({ name: 'form_xin_vang_truc' })(FormXinVang));
