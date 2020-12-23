import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import { history, configuredStore } from './store';
import './app.global.css';

// const sqlite3 = require('sqlite3').verbose();

// const db = new sqlite3.Database(
//   'db/stores/main.db',
//   // eslint-disable-next-line no-bitwise
//   sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
//   (_err: Error | null) => {}
// );

// db.serialize(function () {
//   db.run('CREATE TABLE [IF NOT EXISTS] WORKSPACE (term TEXT PRIMARY KEY)');

//   db.run(
//     'CREATE TABLE [IF NOT EXISTS] COURSES (id PRIMARY KEY, name TEXT, dir TEXT, workspace TEXT) foreign key (workspace) REFERENCES WORKSPACE(workspace)'
//   );

//   // db.run('CREATE TABLE USERINFO (name TEXT)', (err: Error | null) => {
//   //   if (!err) {
//   //     const stmt = db.prepare('INSERT INTO lorem VALUES (?)');
//   //     for (let i = 0; i < 10; i += 1) {
//   //       stmt.run(`Ipsum ${i}`);
//   //     }
//   //     stmt.finalize();
//   //   } else {
//   //     console.log('table already exists');
//   //   }
//   // });

//   // eslint-disable-next-line func-names
//   // db.each('SELECT rowid AS id, info FROM lorem', function (_err, row) {
//   //   console.log(`${row.id}: ${row.info}`);
//   // });
// });

// db.close();

const store = configuredStore();

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line global-require
  const Root = require('./containers/Root').default;
  render(
    <AppContainer>
      <Root store={store} history={history} />
    </AppContainer>,
    document.getElementById('root')
  );
});
