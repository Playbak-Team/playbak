/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import installExtension, {
  REDUX_DEVTOOLS,
  REACT_DEVELOPER_TOOLS,
} from 'electron-devtools-installer';
import writeJsonFile from 'write-json-file';
import MenuBuilder from './menu';
import { emptySettings, ProfileStateInterface } from './interfaces';

const fs = require('fs');
const sqlite3 = require('sqlite3');
const folders = require('./utils/playbakFolders');

let globalWorkspace = '';

interface Columns {
  name: string;
}

interface Events {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  label: string;
  duedate: string;
  belongsto: string;
}

const getColumns = (db) => {
  return new Promise<Columns[]>((resolve) => {
    db.all('SELECT name FROM columns', (_err: Error | null, data) => {
      resolve(data);
    });
  });
};

const getEvents = (db) => {
  return new Promise<Events[]>((resolve) => {
    db.all('SELECT * FROM entry', (_err: Error | null, data) => {
      resolve(data);
    });
  });
};

const mapEntries = async (entries) => {
  return Promise.all(
    entries.map(
      (v) =>
        `(?,"${v.split(',')[1]}","${v.split(',')[2]}","${v.split(',')[3]}","${
          v.split(',')[4]
        }","${v.split(',')[5]}","${v.split(',')[6]}")`
    )
  );
};

ipcMain.on('save-columns', async (_event, columns: string[]) => {
  const db = await new sqlite3.Database(
    folders.getWorkspaceKanbandb(globalWorkspace),
    (err: Error | null) => {
      if (err) throw folders.getWorkspaceKanbandb(globalWorkspace);
    }
  );

  await db.serialize(async () => {
    db.run('DELETE FROM columns');
    if (columns.length !== 0) {
      db.run(
        `INSERT INTO columns VALUES ${columns.map((v) => `("${v}")`).join()}`
      );
    }
  });

  db.close();
});

ipcMain.on('remove-columns', async (_event, column: string) => {
  const db = await new sqlite3.Database(
    folders.getWorkspaceKanbandb(globalWorkspace),
    (err: Error | null) => {
      if (err) throw folders.getWorkspaceKanbandb(globalWorkspace);
    }
  );
  await db.serialize(async () => {
    db.run(`DELETE FROM columns WHERE name = "${column}"`);
  });
  db.close();
});

ipcMain.on('add-entry', async (_event, entry: string) => {
  const db = await new sqlite3.Database(
    folders.getWorkspaceKanbandb(globalWorkspace),
    (err: Error | null) => {
      if (err) throw folders.getWorkspaceKanbandb(globalWorkspace);
    }
  );
  await db.serialize(async () => {
    const v = entry.split(',');
    db.run(
      `INSERT INTO entry VALUES (${v[0]},"${v[1]}","${v[2]}","${v[3]}","${v[4]}","${v[5]}","${v[6]}")`
    );
  });
  db.close();
});

ipcMain.on('save-entries', async (_event, entries: string[]) => {
  const mapped = await mapEntries(entries);

  const db = await new sqlite3.Database(
    folders.getWorkspaceKanbandb(globalWorkspace),
    (err: Error | null) => {
      if (err) throw folders.getWorkspaceKanbandb(globalWorkspace);
    }
  );

  await db.serialize(async () => {
    await db.run('DELETE FROM entry');

    // await db.run('DELETE FROM sqlite_sequence');

    await db.run(`INSERT INTO entry VALUES ${mapped}`);
  });

  db.close();
});

ipcMain.on('delete-entry', async (_event, entry: string) => {
  const db = await new sqlite3.Database(
    folders.getWorkspaceKanbandb(globalWorkspace),
    (err: Error | null) => {
      if (err) throw folders.getWorkspaceKanbandb(globalWorkspace);
    }
  );
  db.serialize(async () => {
    db.run(`DELETE FROM entry WHERE id=${entry.split(',')[0]}`);
  });

  db.close();
});

ipcMain.on('replace-entry', async (event, entry: string) => {
  const db = await new sqlite3.Database(
    folders.getWorkspaceKanbandb(globalWorkspace),
    (err: Error | null) => {
      if (err) throw folders.getWorkspaceKanbandb(globalWorkspace);
    }
  );
  const v = entry.split(',');
  await db.serialize(() => {
    db.run(
      `UPDATE entry SET title= "${v[1]}", subtitle="${v[2]}", description="${v[3]}", label="${v[4]}", duedate="${v[5]}", belongsto="${v[6]}" WHERE id=${v[0]}`
    );
  });
  db.close();
  event.reply(
    'yikes',
    `UPDATE entry SET title= "${v[1]}", subtitle="${v[2]}", description="${v[3]}", label="${v[4]}", duedate="${v[5]}", belongsto="${v[6]}" WHERE id=${v[0]}`
  );
});

ipcMain.on('load-kanban', async (event, workspace: string) => {
  const db = await new sqlite3.Database(
    folders.getWorkspaceKanbandb(workspace),
    (err: Error | null) => {
      if (err) throw folders.getWorkspaceKanbandb(workspace);
    }
  );

  await db.serialize(async () => {
    const cols = await getColumns(db);
    const events = await getEvents(db);

    const c = cols.map((ob) => ob.name);
    const e = events.map(
      (ob) =>
        `${ob.id},${ob.title},${ob.subtitle},${ob.description},${ob.label},${ob.duedate},${ob.belongsto}`
    );

    event.reply('kanban-data', [c, e]);

    db.close();
    // const events = await getEvents(db);
  });
});

ipcMain.on('init', async (event) => {
  if (!fs.existsSync(folders.settingFile)) {
    fs.writeFileSync(folders.settingFile, JSON.stringify(emptySettings()));
  }
  fs.readFile(folders.settingFile, async (err: Error | null, data: string) => {
    if (err) throw err;

    const settings = JSON.parse(data);

    event.reply('return-settings', settings);
  });
});

ipcMain.on('save-settings', async (_event, settings: ProfileStateInterface) => {
  globalWorkspace = settings.selectedWorkspace;
  fs.writeFileSync(
    folders.settingFile,
    JSON.stringify({
      name: settings.name,
      LST: settings.selectedWorkspace,
      LL: '',
      AWKS: Object.values(settings.availableWorkspaces),
      courses: Object.values(settings.courses),
    })
  );
});

ipcMain.on('get-courses', async (event, wkspace: string) => {
  globalWorkspace = wkspace;
  fs.readFile(
    folders.getWorkspaceSettingFile(wkspace),
    async (err: Error | null, data: string) => {
      if (err) throw err;

      const settings = JSON.parse(data);

      event.reply('return-courses', settings.courses);
    }
  );
});

ipcMain.on('create-new-workspace', async (event, name: string) => {
  if (!fs.existsSync(folders.workspaceRootDir)) {
    await fs.mkdir(folders.workspaceRootDir, (err: Error | null) => {
      if (err) throw err;
    });
  }

  if (!fs.existsSync(folders.getWorkspaceDir(name))) {
    await fs.mkdir(folders.getWorkspaceDir(name), (err: Error | null) => {
      if (err) throw err;
    });

    await writeJsonFile(folders.getWorkspaceSettingFile(name), {
      courses: [],
    });

    // eslint-disable-next-line prefer-const
    const db = new sqlite3.Database(
      folders.getWorkspaceKanbandb(name),
      (err: Error | null) => {
        if (err) throw err;
      }
    );

    db.serialize(() => {
      db.run('CREATE TABLE columns (name TEXT NOT NULL PRIMARY KEY)');
      db.run(
        'CREATE TABLE entry (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, subtitle TEXT, description TEXT, label TEXT, duedate TEXT, belongsto TEXT)'
      );
    });

    db.close();

    event.reply('created-workspace', name);
  }
});

ipcMain.on(
  'create-new-course',
  async (event, wkspace: string, coursename: string) => {
    if (!fs.existsSync(folders.getCourseRootDir(wkspace, coursename))) {
      fs.mkdir(
        folders.getCourseRootDir(wkspace, coursename),
        (err: Error | null) => {
          if (err) throw err;
        }
      );
      folders.courseSubDirs.forEach((subDir) => {
        if (!fs.existsSync(subDir(wkspace, coursename)))
          fs.mkdir(subDir(wkspace, coursename), (err: Error | null) => {
            if (err) throw err;
          });
      });

      fs.readFile(
        folders.getWorkspaceSettingFile(wkspace),
        async (err: Error | null, data: string) => {
          if (err) throw err;

          const settings = JSON.parse(data);

          const newSettings = {
            courses: Object.values(settings.courses),
          };

          newSettings.courses.push(coursename);

          await writeJsonFile(
            folders.getWorkspaceSettingFile(wkspace),
            newSettings
          );
        }
      );

      event.reply('created-course', coursename);
    }
  }
);

ipcMain.on('get-videos', async (event, wkspace: string, course: string) => {
  const videoDir = folders.getCourseVideoDir(wkspace, course);
  if (fs.existsSync(videoDir) && fs.lstatSync(videoDir).isDirectory()) {
    event.reply(
      'return-videos',
      fs
        .readdirSync(videoDir, {
          withFileTypes: true,
        })
        .filter(
          (dirent: typeof fs.Dirent) =>
            dirent.isFile() && path.extname(dirent.name) === '.mp4'
        )
        .map((dirent: typeof fs.Dirent) => {
          return {
            name: dirent.name,
            videoPath: `${videoDir}/${dirent.name}`,
            pbsPath: '',
            watched: false,
          };
        })
    );
  } else {
    event.reply('return-videos', []);
  }
});

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map((name) => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'resources')
    : path.join(__dirname, '../resources');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    minWidth: 1024,
    minHeight: 728,
    backgroundColor: '#202225',
    darkTheme: true,
    icon: getAssetPath('icon.png'),
    webPreferences:
      (process.env.NODE_ENV === 'development' ||
        process.env.E2E_BUILD === 'true') &&
      process.env.ERB_SECURE !== 'true'
        ? {
            nodeIntegration: true,
            enableRemoteModule: true,
          }
        : {
            preload: path.join(__dirname, 'dist/renderer.prod.js'),
            nodeIntegration: true,
            enableRemoteModule: true,
          },
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  mainWindow.removeMenu();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

if (process.env.E2E_BUILD === 'true') {
  // eslint-disable-next-line promise/catch-or-return
  app.whenReady().then(async () => {
    // eslint-disable-next-line promise/no-nesting
    await installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS]);

    return createWindow();
  });
} else {
  app.on('ready', createWindow);
}

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});
