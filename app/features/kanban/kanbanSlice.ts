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
    setColumns: (state, action: PayloadAction<string[]>) => {
      state.columns = action.payload;
      ipcRenderer.send('save-columns', action.payload);
    },
    removeColumn: (state, action: PayloadAction<string>) => {
      if (state.columns.includes(action.payload)) {
        state.columns.splice(state.columns.indexOf(action.payload), 1);
      }
      state.entries = state.entries.filter(
        (e) => e.split(',')[6] !== action.payload
      );
      ipcRenderer.send('save-columns', state.columns);
    },
    addEntry: (state, action: PayloadAction<string>) => {
      state.entries.push(action.payload);
    },
    setEntries: (state, action: PayloadAction<string[]>) => {
      state.entries = action.payload;
    },
  },
});

export const {
  setColumns,
  addColumn,
  removeColumn,
  addEntry,
  setEntries,
} = kanbanSlice.actions;

export default kanbanSlice.reducer;

export const getColumnNames = (state: RootState) => state.kanban.columns;

export const getEntries = (state: RootState) => state.kanban.entries;
