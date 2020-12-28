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
import { Settings, emptySettings, ProfileStateInterface } from './interfaces';

const fs = require('fs');
const folders = require('./utils/playbakFolders');

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
    await fs.mkdir(
      folders.workspaceRootDir,
      (err: Error | null, _data: any) => {
        if (err) throw err;
      }
    );
  }

  if (!fs.existsSync(folders.getWorkspaceDir(name))) {
    await fs.mkdir(
      folders.getWorkspaceDir(name),
      (err: Error | null, _data: any) => {
        if (err) throw err;
      }
    );
    await writeJsonFile(folders.getWorkspaceSettingFile(name), {
      courses: [],
    });
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
