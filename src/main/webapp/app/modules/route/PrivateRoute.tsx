import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { isLogged, hasAnyRole } from 'app/shared/util/auth-utils';

const PrivateRoute = ({ roles, component: Component, ...rest }) => (
  // Show the component only when the user is logged in
  // Otherwise, redirect the user to /login page
  <Route
    {...rest}
    render={props => (!isLogged() ? <Redirect to="/login" /> : !hasAnyRole(roles) ? <Redirect to="/403" /> : <Component {...props} />)}
  />
);

export default PrivateRoute;
