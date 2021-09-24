import { Switch, Route, Router, Redirect } from 'react-router-dom';
import pageHistory from './PageHistory';
import React, { Suspense } from 'react';
import RouterConfig from './RouterConfig';
// import { FormattedMessage } from 'react-intl';

const PageLoading = () => {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '16px',
        color: '#888',
      }}>
      Loading...
    </div>
  );
};

export const RouterApp = () => {
  return (
    <Router history={pageHistory}>
      <Suspense fallback={<PageLoading />}>
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/home" push />} />
          {RouterConfig.map((router, index) => {
            return <Route key={index} path={router.path} component={router.component} />;
          })}
          <Redirect to="/404" />
        </Switch>
      </Suspense>
    </Router>
  );
};

export default RouterApp;
