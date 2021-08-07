import React from 'react';
import { DatePicker, Form, Modal, Select } from 'antd';
import { EHRSessionStorage } from 'app/modules/ehr/sessionStorage/ehrStorageService';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { submitIn, toggleModalIn } from 'app/shared/reducers/xinvang';

export interface IFormInProps extends StateProps, DispatchProps {
  form: WrappedFormUtils;
}

class FormIn extends React.Component<IFormInProps> {
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
        const { thoiGian, lyDo } = values;
        this.props.submitIn(thoiGian.toDate().getMonth() + 1, thoiGian.toDate().getFullYear(), lyDo.join(', '));
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { xinvang } = this.props;
    return (
      <Modal
        title="In đơn xin vắng trực lãnh đạo"
        style={{ top: 20 }}
        visible={xinvang.modalIn}
        onCancel={() => this.props.toggleModalIn(false)}
        cancelText="Hủy"
        onOk={this.handleSubmit}
        okText="In đơn"
        okButtonProps={{ loading: xinvang.loading }}
      >
        {xinvang.modalIn ? (
          <Form {...this.formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label="Cán bộ vắng trực">
              <strong>{EHRSessionStorage.get('tenNhanVien').toUpperCase()}</strong>
            </Form.Item>
            <Form.Item label="Thời gian">
              {getFieldDecorator('thoiGian', {
                rules: [{ required: true, message: 'Vui lòng chọn thời gian' }]
              })(<DatePicker.MonthPicker format="MM/YYYY" placeholder="Chọn tháng" />)}
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
  toggleModalIn,
  submitIn
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create({ name: 'form_in' })(FormIn));
