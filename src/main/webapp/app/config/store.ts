import reducer, { IRootState } from 'app/shared/reducers';
import { loadingBarMiddleware } from 'react-redux-loading-bar';
import { applyMiddleware, compose, createStore } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import thunkMiddleware from 'redux-thunk';
import errorMiddleware from './error-middleware';
import loggerMiddleware from './logger-middleware';
import notificationMiddleware from './notification-middleware';
import * as process from 'process';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const defaultMiddlewares = [
  thunkMiddleware,
  errorMiddleware,
  notificationMiddleware,
  promiseMiddleware(),
  loadingBarMiddleware(),
  loggerMiddleware
];
const composedMiddlewares = middlewares =>
  process.env.NODE_ENV === 'development'
    ? composeEnhancers(
        applyMiddleware(...defaultMiddlewares, ...middlewares)
        // DevTools.instrument()
      )
    : compose(applyMiddleware(...defaultMiddlewares, ...middlewares));

const initialize = (initialState?: IRootState, middlewares = []) => createStore(reducer, initialState, composedMiddlewares(middlewares));

export default initialize;
