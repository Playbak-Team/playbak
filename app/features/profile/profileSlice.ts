import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { ipcRenderer } from 'electron';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../store';
import { ProfileStateInterface } from '../../interfaces';

import FileList from '../filelist/filelist';

const initialState: ProfileStateInterface = {
  name: '',
  selectedWorkspace: '',
  availableWorkspaces: [],
  courses: [],
  links: [],
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (_, action: PayloadAction<ProfileStateInterface>) => {
      FileList.init(action.payload.selectedWorkspace);
      return action.payload;
    },
    setWorkspace: (state, action: PayloadAction<string>) => {
      state.selectedWorkspace = action.payload;
      FileList.init(action.payload);
      ipcRenderer.send('get-courses', action.payload);
    },
    setAvailableWorkspaces: (state, action: PayloadAction<string[]>) => {
      state.availableWorkspaces = action.payload;
    },
    addCourse: (state, action: PayloadAction<string>) => {
      state.courses.push(action.payload);
      FileList.addCourse(action.payload);
      ipcRenderer.send(
        'create-new-course',
        state.selectedWorkspace,
        action.payload
      );
    },
    setCourses: (state, action: PayloadAction<string[]>) => {
      state.courses = action.payload;
      action.payload.forEach((course) => {
        FileList.addCourse(course);
      });
      ipcRenderer.send('save-settings', JSON.stringify(state));
    },
    addWorkspace: (state, action: PayloadAction<string>) => {
      if (!state.availableWorkspaces.includes(action.payload)) {
        state.availableWorkspaces.push(action.payload);
        ipcRenderer.send('create-new-workspace', action.payload);
        ipcRenderer.send('save-settings', JSON.stringify(state));
      }
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
      ipcRenderer.send('save-settings', JSON.stringify(state));
    },
    saveSettings: (state) => {
      ipcRenderer.send('save-settings', JSON.stringify(state));
    },
  },
});

export const {
  setProfile,
  addCourse,
  setAvailableWorkspaces,
  setWorkspace,
  setName,
  addWorkspace,
  setCourses,
  saveSettings,
} = profileSlice.actions;

export default profileSlice.reducer;

export const getCurrentTerm = (state: RootState) =>
  state.profile.selectedWorkspace;

export const getCurrentCourses = (state: RootState) => state.profile.courses;

export const getCurrentCoursesLinks = (state: RootState) => state.profile.links;

export const getAllWorkspaces = (state: RootState) =>
  state.profile.availableWorkspaces;

export const getName = (state: RootState) => state.profile.name;
