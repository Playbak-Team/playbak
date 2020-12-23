import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { RootState } from './store';

import { UserInfoInterace } from './interfaces';

import udata from '../db/stores/settings.json';

const writeJsonFile = require('write-json-file');

const initialState: UserInfoInterace = udata;

const dbSlice = createSlice({
  name: 'dbinfo',
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
      udata.name = action.payload;
      writeJsonFile('./db/stores/newsettings.json', udata);
    },
    setLST: (state, action: PayloadAction<string>) => {
      state.LST = action.payload;
    },
  },
});

export const { setName, setLST } = dbSlice.actions;

export default dbSlice.reducer;

export const getName = (state: RootState) => state.dbinfo.name;

export const getLST = (state: RootState) => state.dbinfo.LST;
