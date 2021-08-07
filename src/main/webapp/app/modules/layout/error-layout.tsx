import React from 'react';
import Header from 'app/modules/header/header';
import { Button, Tag } from 'antd';
import PublicRoute from 'app/modules/route/PublicRoute';
import { Link } from 'react-router-dom';

const error = {
  404: 'Không tìm thấy trang yêu cầu !',
  403: 'Bạn không có quyền truy cập trang này !'
};

export const ErrorComponent = ({ statusCode }) => (
  <div>
    <div className="d-flex justify-content-center pt-5">
      <div>
        <Tag color="red" className="p-3" style={{ fontSize: '18pt' }}>
          {' '}
          {statusCode}{' '}
        </Tag>
        <strong className="ml-3">{error[statusCode]}</strong>
      </div>
    </div>
    <div className="d-flex justify-content-center p-3">
      <Button type="dashed">
        <Link to="/">Trang chủ</Link>
      </Button>
    </div>
  </div>
);

const ErrorLayout = ({ children }) => (
  <div className="bg bg-light">
    <Header />
    <div className="content d-flex">{children}</div>
  </div>
);

const ErrorLayoutRoute = ({ component: Component, ...rest }) => (
  <ErrorLayout>
    <PublicRoute component={Component} restricted={false} {...rest} />
  </ErrorLayout>
);

export default ErrorLayoutRoute;
