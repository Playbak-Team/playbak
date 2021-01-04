import { ipcMain } from 'electron';
import { SnackbarSeverity, emptySettings } from '../interfaces';
import { getColumns, getEvents, mapEntries } from './mainPromises';

const fs = require('fs');
const sqlite3 = require('sqlite3');
const folders = require('./playbakFolders');

let globalWorkspace = '';

ipcMain.on('save-columns', async (event, columns: string[]) => {
  const db = await new sqlite3.Database(
    folders.getWorkspaceKanbandb(globalWorkspace),
    (err: Error | null) => {
      if (err) {
        event.reply(
          'show-snackbar',
          `Failed to get courses: ${err}`,
          SnackbarSeverity.error
        );
        throw folders.getWorkspaceKanbandb(globalWorkspace);
      }
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

ipcMain.on('remove-columns', async (event, column: string) => {
  const db = await new sqlite3.Database(
    folders.getWorkspaceKanbandb(globalWorkspace),
    (err: Error | null) => {
      if (err) {
        event.reply(
          'show-snackbar',
          `Failed to remove columns: ${err}`,
          SnackbarSeverity.error
        );
        throw folders.getWorkspaceKanbandb(globalWorkspace);
      }
    }
  );
  await db.serialize(async () => {
    db.run(`DELETE FROM columns WHERE name = "${column}"`);
  });
  db.close();
});

ipcMain.on('add-entry', async (event, entry: string) => {
  const db = await new sqlite3.Database(
    folders.getWorkspaceKanbandb(globalWorkspace),
    (err: Error | null) => {
      if (err) {
        event.reply(
          'show-snackbar',
          `Failed to add entry: ${err}`,
          SnackbarSeverity.error
        );
        throw folders.getWorkspaceKanbandb(globalWorkspace);
      }
    }
  );
  await db.serialize(async () => {
    const v = entry.split(',');
    db.run(
      `INSERT INTO entry VALUES (?,"${v[1]}","${v[2]}","${v[3]}","${v[4]}","${v[5]}","${v[6]}")`
    );
  });
  db.close();
});

ipcMain.on('save-entries', async (event, entries: string[]) => {
  const mapped = await mapEntries(entries);

  const db = await new sqlite3.Database(
    folders.getWorkspaceKanbandb(globalWorkspace),
    (err: Error | null) => {
      if (err) {
        event.reply(
          'show-snackbar',
          `Failed to save entries: ${err}`,
          SnackbarSeverity.error
        );
        throw folders.getWorkspaceKanbandb(globalWorkspace);
      }
    }
  );

  await db.run('DELETE FROM entry');

  if (entries.length === 0) return;

  await db.run('DELETE FROM sqlite_sequence WHERE name="entry"');

  await db.run(`INSERT INTO entry VALUES ${mapped}`);

  await db.close();
});

ipcMain.on('delete-entry', async (event, entry: string) => {
  const db = await new sqlite3.Database(
    folders.getWorkspaceKanbandb(globalWorkspace),
    (err: Error | null) => {
      if (err) {
        event.reply(
          'show-snackbar',
          `Failed to delete entry: ${err}`,
          SnackbarSeverity.error
        );
        throw folders.getWorkspaceKanbandb(globalWorkspace);
      }
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
      if (err) {
        event.reply(
          'show-snackbar',
          `Failed to replace entry: ${err}`,
          SnackbarSeverity.error
        );
        throw folders.getWorkspaceKanbandb(globalWorkspace);
      }
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
      if (err) {
        event.reply(
          'show-snackbar',
          `Failed to load kanban: ${err}`,
          SnackbarSeverity.error
        );
        throw folders.getWorkspaceKanbandb(globalWorkspace);
      }
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
  });
});

ipcMain.on('save-settings', async (_event, settingsString: string) => {
  const settings = JSON.parse(settingsString);
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

ipcMain.on('init', async (event) => {
  if (!fs.existsSync(folders.settingFile)) {
    fs.writeFileSync(folders.settingFile, JSON.stringify(emptySettings()));
  }
  fs.readFile(folders.settingFile, async (err: Error | null, data: string) => {
    if (err) {
      event.reply(
        'show-snackbar',
        `Failed to read settings file: ${err}`,
        SnackbarSeverity.error
      );
      throw err;
    }

    const settings = JSON.parse(data);

    globalWorkspace = settings.LST;

    event.reply('return-settings', settings);
  });
});

ipcMain.on('create-new-workspace', async (event, name: string) => {
  if (!fs.existsSync(folders.workspaceRootDir)) {
    await fs.mkdir(folders.workspaceRootDir, (err: Error | null) => {
      if (err) {
        event.reply(
          'show-snackbar',
          `Failed to make workspace root dir: ${err}`,
          SnackbarSeverity.error
        );
        throw err;
      }
    });
  }
  if (!fs.existsSync(folders.getWorkspaceSettingFile(name))) {
    fs.writeFileSync(
      folders.getWorkspaceSettingFile(name),
      JSON.stringify({
        courses: [],
      })
    );
  }

  if (!fs.existsSync(folders.getWorkspaceDir(name))) {
    await fs.mkdir(folders.getWorkspaceDir(name), (err: Error | null) => {
      if (err) {
        event.reply(
          'show-snackbar',
          `Failed to make workspace dir: ${err}`,
          SnackbarSeverity.error
        );
        throw err;
      }
    });

    // eslint-disable-next-line prefer-const
    const db = new sqlite3.Database(
      folders.getWorkspaceKanbandb(name),
      (err: Error | null) => {
        if (err) {
          event.reply(
            'show-snackbar',
            `Failed to create new database: ${err}`,
            SnackbarSeverity.error
          );
          throw err;
        }
      }
    );

    db.serialize(() => {
      db.run('CREATE TABLE columns (name TEXT NOT NULL PRIMARY KEY)');
      db.run(
        'CREATE TABLE entry (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, subtitle TEXT, description TEXT, label TEXT, duedate TEXT, belongsto TEXT)'
      );
    });

    db.close();
  }
  event.reply('created-workspace', name);
});
