import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import { Titlebar, Color } from 'custom-electron-titlebar';
import { remote } from 'electron';
import { history, configuredStore } from './store';
import './app.global.css';

const { Menu } = remote;

const store = configuredStore();

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

const templateDefault = [
  {
    label: 'Home',
    click: () => history.push('/home'),
  },
  {
    label: 'Apps',
    submenu: [
      {
        label: 'Watch',
        click: () => history.push('/video'),
      },
      {
        label: 'Kanban',
        click: () => history.push('/kanban'),
      },
      {
        label: 'Profile',
        click: () => history.push('/profile'),
      },
    ],
  },
];

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line no-new
  new Titlebar({
    backgroundColor: Color.fromHex('#1B1E2B'),
    unfocusEffect: true,
    menu: Menu.buildFromTemplate(templateDefault),
    titleHorizontalAlignment: 'left',
    overflow: 'hidden',
    icon: '../resources/icon.png',
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
