import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { isLogged } from 'app/shared/util/auth-utils';

const PublicRoute = ({ component: Component, restricted, ...rest }) => (
  // restricted = false meaning public route
  // restricted = true meaning restricted route (if logged, can not access this (ex: login page))
  <Route {...rest} render={props => (isLogged() && restricted ? <Redirect to="/" /> : <Component {...props} />)} />
);

export default PublicRoute;
