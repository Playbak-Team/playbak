/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './containers/App';
import HomePage from './containers/HomePage';
import ProfilePage from './containers/ProfilePage';
import KanbanPage from './containers/KanbanPage';

const LazyVideoPage = React.lazy(() => import('./containers/VideoPage'));

const VideoPage = (props: Record<string, any>) => (
  <React.Suspense fallback={<h1>Loading...</h1>}>
    <LazyVideoPage {...props} />
  </React.Suspense>
);

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.VIDEO} component={VideoPage} />
        <Route path={routes.PROFILE} component={ProfilePage} />
        <Route path={routes.KANBAN} component={KanbanPage} />
        <Route path={routes.HOME} component={HomePage} />
      </Switch>
    </App>
  );
}
