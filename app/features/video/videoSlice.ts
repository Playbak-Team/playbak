import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../store';
import {
  VideoData,
  VideoStateInterface,
  emptyVideoData,
} from '../../interfaces';

const initialState: VideoStateInterface = {
  videoURLS: [],
  currentVideo: emptyVideoData(),
  snackbarActive: false,
  snackbarMessage: '',
  snackbarSeverity: undefined,
};

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
    setVideo: (state, action: PayloadAction<VideoData>) => {
      state.currentVideo = action.payload;
      state.snackbarActive = true;
      state.snackbarMessage = `Video set to ${action.payload.name}`;
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
