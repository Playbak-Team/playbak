import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { AppThunk, RootState } from '../../store';
import { VideoStateInterface } from '../../interfaces';

const initialState: VideoStateInterface = {
  videoURLS: [
    'C:\\Users\\kevin\\Desktop\\cs341lectures',
    'C:\\Users\\kevin\\Desktop\\cs349lectures',
  ],
  currentVideo: '',
  snackbarActive: false,
  snackbarMessage: '',
  snackbarSeverity: undefined,
};

// 1. Create a workspace (ie. F20, W21)
// 2. Create a course
// - Name
// - Create a directory with
// - Videos, Assignments, Notes, Others folders
// - maybe can add cache of some sort here as well
// 3. Select a workspace

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    disableSnackbar: (state) => {
      state.snackbarActive = false;
    },
    addToURLS: (state, action: PayloadAction<string>) => {
      if (!state.videoURLS.includes(action.payload) && action.payload !== '') {
        state.videoURLS.push(action.payload);
        state.snackbarMessage = `Added ${action.payload} to paths`;
        state.snackbarSeverity = 'success';
      } else if (state.videoURLS.includes(action.payload)) {
        state.snackbarMessage = 'Path already exists';
        state.snackbarSeverity = 'error';
      } else if (action.payload === '') {
        state.snackbarMessage = 'Cannot add an empty path';
        state.snackbarSeverity = 'error';
      }
      state.snackbarActive = true;
    },
    setVideo: (state, action: PayloadAction<string>) => {
      state.currentVideo = action.payload;
      state.snackbarActive = true;
      state.snackbarMessage = `Video set to ${action.payload}`;
      state.snackbarSeverity = 'success';
    },
  },
});

export const { addToURLS, setVideo, disableSnackbar } = videoSlice.actions;

export default videoSlice.reducer;

export const getPathURLS = (state: RootState) => state.video.videoURLS;

export const getCurrentVideo = (state: RootState) => state.video.currentVideo;

export const isSnackBarActive = (state: RootState) =>
  state.video.snackbarActive;

export const getSnackBarMessage = (state: RootState) =>
  state.video.snackbarMessage;

export const getSnackBarSeverity = (state: RootState) =>
  state.video.snackbarSeverity;
