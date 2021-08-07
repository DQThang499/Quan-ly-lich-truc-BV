import React from 'react';
import { Col, Row } from 'reactstrap';
import Header from 'app/modules/header/header';
import MainMenu from 'app/modules/menu/menu';
import PrivateRoute from 'app/modules/route/PrivateRoute';

const AppLayout = ({ children, ...rest }) => (
  <div className="bg bg-light">
    <Header />
    <div className="container-fluid">
      <Row className="content">
        <MainMenu />
        <Col sm={10}
             className="h-100" style={{ overflowX: 'hidden', overflowY: 'auto' }}>
          <div className="bg-white pl-5 pr-5 pt-3 pb-3 min-height-100">{children}</div>
        </Col>
      </Row>
    </div>
  </div>
);

const AppLayoutRoute = ({ roles, component: Component, ...rest }) => (
  <AppLayout>
    <PrivateRoute {...rest} roles={roles} component={Component} />
  </AppLayout>
);

export default AppLayoutRoute;
