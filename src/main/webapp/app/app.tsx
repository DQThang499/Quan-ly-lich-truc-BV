import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import AppRoutes from 'app/routes';
import ErrorBoundary from 'app/shared/error/error-boundary';

export class App extends React.Component {
  public render() {
    return (
      <Router>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </Router>
    );
  }
}

export default App;
