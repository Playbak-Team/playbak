import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { ipcRenderer } from 'electron';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../store';
import { ProfileStateInterface } from '../../interfaces';

import udata from '../../../db/stores/settings.json';

const initialState: ProfileStateInterface = {
  name: udata.name,
  selectedWorkspace: udata.LST,
  availableWorkspaces: Object.values(udata.AWKS),
  courses: [],
  links: [],
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setWorkspace: (state, action: PayloadAction<string>) => {
      state.selectedWorkspace = action.payload;
    },
    setAvailableWorkspaces: (state, action: PayloadAction<string[]>) => {
      state.availableWorkspaces = action.payload;
    },
    addCourse: (state, action: PayloadAction<string[]>) => {
      state.courses.push(action.payload[0]);
      state.links.push(action.payload[1]);
    },
    addWorkspace: (state, action: PayloadAction<string>) => {
      state.availableWorkspaces.push(action.payload);
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
      ipcRenderer.send('save-settings', {
        name: action.payload,
        LST: state.selectedWorkspace,
        LL: '',
        AWKS: state.availableWorkspaces,
      });
    },
  },
});

export const {
  addCourse,
  setAvailableWorkspaces,
  setWorkspace,
  setName,
  addWorkspace,
} = profileSlice.actions;

export default profileSlice.reducer;

export const getCurrentTerm = (state: RootState) =>
  state.profile.selectedWorkspace;

export const getCurrentCourses = (state: RootState) => state.profile.courses;

export const getCurrentCoursesLinks = (state: RootState) => state.profile.links;

export const getAllWorkspaces = (state: RootState) =>
  state.profile.availableWorkspaces;

export const getName = (state: RootState) => state.profile.name;
