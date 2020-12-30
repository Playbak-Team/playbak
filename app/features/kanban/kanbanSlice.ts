import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { ipcRenderer } from 'electron';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../store';

import { KanbanStateInterface } from '../../interfaces';

const initialState: KanbanStateInterface = {
  columns: [],
  entries: [],
};

const kanbanSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    addColumn: (state, action: PayloadAction<string>) => {
      state.columns.push(action.payload);
      ipcRenderer.send('save-columns', Object.values(state.columns));
    },
    setColumns: (state, action: PayloadAction<[string[], boolean]>) => {
      const [newValue, toSave] = action.payload;
      state.columns = newValue;
      if (toSave) ipcRenderer.send('save-columns', newValue);
    },
    removeColumn: (state, action: PayloadAction<string>) => {
      if (state.columns.includes(action.payload)) {
        state.columns.splice(state.columns.indexOf(action.payload), 1);
      }
      state.entries = state.entries.filter(
        (e) => e.split(',')[6] !== action.payload
      );
      ipcRenderer.send('remove-columns', action.payload);
      ipcRenderer.send(
        'save-entries',
        state.entries.filter((e) => e.split(',')[6] !== action.payload)
      );
    },
    addEntry: (state, action: PayloadAction<string>) => {
      state.entries.push(action.payload);
      ipcRenderer.send('add-entry', action.payload);
    },
    setEntries: (state, action: PayloadAction<[string[], boolean]>) => {
      const [newValue, toSave] = action.payload;
      state.entries = newValue;
      if (toSave) ipcRenderer.send('save-entries', newValue);
    },
    replaceEntry: (state, action: PayloadAction<[number, string]>) => {
      const [a, b]: [number, string] = action.payload;
      state.entries[a] = b;
      ipcRenderer.send('replace-entry', b);
    },
    removeEntry: (state, action: PayloadAction<string>) => {
      state.entries.splice(state.entries.indexOf(action.payload), 1);
      ipcRenderer.send('delete-entry', action.payload);
    },
  },
});

export const {
  setColumns,
  addColumn,
  removeColumn,
  addEntry,
  setEntries,
  replaceEntry,
  removeEntry,
} = kanbanSlice.actions;

export default kanbanSlice.reducer;

export const getColumnNames = (state: RootState) => state.kanban.columns;

export const getEntries = (state: RootState) => state.kanban.entries;
