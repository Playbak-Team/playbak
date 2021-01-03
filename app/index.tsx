import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import { Titlebar, Color } from 'custom-electron-titlebar';
import { history, configuredStore } from './store';
import './app.global.css';

const store = configuredStore();

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line no-new
  new Titlebar({
    backgroundColor: Color.fromHex('#323639'),
    menu: null,
    unfocusEffect: true,
    titleHorizontalAlignment: 'left',
    overflow: 'hidden',
  });
  // eslint-disable-next-line global-require
  const Root = require('./containers/Root').default;
  render(
    <AppContainer>
      <Root store={store} history={history} />
    </AppContainer>,
    document.getElementById('root')
  );
});
