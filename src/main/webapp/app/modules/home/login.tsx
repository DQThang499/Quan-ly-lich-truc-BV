// @ts-ignore
import logo from 'app/modules/image/banner.png';
// import logovnpt from 'app/modules/image/VNPT_Logo.svg';
import React, { Component } from 'react';
import { Button, Form, Icon, Input } from 'antd';
import { Row } from 'reactstrap';
import { logIn } from 'app/shared/reducers/authentication';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { IRootState } from 'app/shared/reducers';
import { WrappedFormUtils } from 'antd/es/form/Form';
import Zoom from 'react-reveal/Zoom';

export interface ILoginProps extends StateProps, DispatchProps, RouteComponentProps {
  form: WrappedFormUtils;
}

class LogIn extends Component<ILoginProps> {
  constructor(props) {
    super(props);
    // this.tên sự kiện = this.tên sự kiện.bind(this);
  }

  componentDidUpdate(prevProps: ILoginProps): void {
    const { auth, history } = this.props;
   if (auth.loginSuccess) history.push('/');
  }

  private handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      const { username, password } = values;
      if (!err) {
        this.props.logIn(username, password);
      }
    });
  };
  public render() {
    const { getFieldDecorator } = this.props.form;
    const LoginForm = (
      <div className="col-6 pt-5 pb-5">
        <div className="card-body">
          <h3 className={'p-2 text-center'}>Đăng nhập</h3>
          <Form onSubmit={this.handleSubmit}>
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: 'Vui lòng nhập tên tài khoản!' }]
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Tài khoản" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Vui lòng nhập mật khẩu!' }]
              })(
                <Input.Password prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Mật khẩu" />)}
            </Form.Item>
            <Form.Item>
              <div className="d-flex justify-content-center">
                <Button type="primary" loading={this.props.auth.loading} htmlType="submit" className="login-form-button bg-vnpt">
                  Đăng nhập
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
    return (
      <Row className="h-100 align-items-center">
        <div className="w-100 d-flex justify-content-center" style={{ height: 'auto' }}>
          <div className="col-6">
            <Zoom bottom duration={500}>
              <div className="card border-0 shadow">
                <div className="d-flex p-0">
                  {LoginForm}
                  <HomeIcon />
                </div>
              </div>
            </Zoom>
          </div>
        </div>
      </Row>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  auth: storeState.authentication
});

const mapDispatchToProps = {
  logIn
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

const HomeIcon = () => (
  <div className="col-6 bg-vnpt">
    <div className="d-flex align-items-center h-100">
      <div className={''}>
        <img src={logo} className="w-100 d-block" alt="bg" />
      </div>
    </div>
  </div>
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Form.create({ name: 'form_dang_nhap' })(LogIn) as any));
