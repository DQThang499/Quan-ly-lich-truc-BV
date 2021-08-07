import React from 'react';
import Header from 'app/modules/header/header';
import PublicRoute from 'app/modules/route/PublicRoute';

const LoginLayout = ({ children }) => (
  <div className="bg bg-light">
    <Header />
    <div className="content">{children}</div>
  </div>
);

const LoginLayoutRoute = ({ component: Component, ...rest }) => (
  <LoginLayout>
    <PublicRoute component={Component} restricted {...rest} />
  </LoginLayout>
);

export default LoginLayoutRoute;
