import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'antd/dist/antd.css';
import './app.scss';
import 'app/modules/header/header.scss';
import 'app/modules/styles/style.scss';
import 'app/modules/styles/custom-table.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import AppComponent from './app';
import setupAxiosInterceptors from './config/axios-interceptor';
import initStore from './config/store';
import ErrorBoundary from './shared/error/error-boundary';
import * as singleSpa from 'single-spa';
import { registerAllMicroApp } from 'app/micro-app';
// const devTools = process.env.NODE_ENV === 'development' ? <DevTools /> : null;

const store = initStore();
// registerLocale(store);
setupAxiosInterceptors();

// loadIcons();

const rootEl = document.getElementById('root');

const render = Component =>
  ReactDOM.render(
    <ErrorBoundary>
      <AppContainer>
        <Provider store={store}>
          <div>
            {/* If this slows down the app in dev disable it and enable when required  */}
            {/*{devTools}*/}
            <Component />
          </div>
        </Provider>
      </AppContainer>
    </ErrorBoundary>,
    rootEl
  );

registerAllMicroApp();
singleSpa.start();

render(AppComponent);
