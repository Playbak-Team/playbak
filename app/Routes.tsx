/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './containers/App';
// import HomePage from './containers/HomePage';
// import ProfilePage from './containers/ProfilePage';
// import KanbanPage from './containers/KanbanPage';

const HomePage = React.lazy(() => import('./containers/HomePage'));
const VideoPage = React.lazy(() => import('./containers/VideoPage'));
const KanbanPage = React.lazy(() => import('./containers/KanbanPage'));
const ProfilePage = React.lazy(() => import('./containers/ProfilePage'));

export default function Routes() {
  return (
    <App>
      <React.Suspense fallback={<h1>Loading...</h1>}>
        <Switch>
          <Route path={routes.VIDEO} component={VideoPage} />
          <Route path={routes.PROFILE} component={ProfilePage} />
          <Route path={routes.KANBAN} component={KanbanPage} />
          <Route path={routes.HOME} component={HomePage} />
        </Switch>
      </React.Suspense>
    </App>
  );
}
