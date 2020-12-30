import { Columns, Events } from '../interfaces';

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

export { getColumns, getEvents, mapEntries };
