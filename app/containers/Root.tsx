import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { hot } from 'react-hot-loader/root';
import { History } from 'history';
import { Store } from '../store';
import Routes from '../Routes';
import Navbar from '../components/Navbar/Navbar';
import SnackBar from '../components/Snackbar/SnackBar';

type Props = {
  store: Store;
  history: History;
};

const Root = ({ store, history }: Props) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Navbar />
      <Routes />
      <SnackBar />
    </ConnectedRouter>
  </Provider>
);

export default hot(Root);
