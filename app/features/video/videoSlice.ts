import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../store';
import {
  VideoData,
  VideoStateInterface,
  emptyVideoData,
} from '../../interfaces';

const initialState: VideoStateInterface = {
  // videoURLS: [],
  currentVideo: emptyVideoData(),
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    // addToURLS: (state, action: PayloadAction<string>) => {
    //   if (!state.videoURLS.includes(action.payload) && action.payload !== '') {
    //     state.videoURLS.push(action.payload);
    //     state.snackbarMessage = `Added ${action.payload} to paths`;
    //     state.snackbarSeverity = 'success';
    //   } else if (state.videoURLS.includes(action.payload)) {
    //     state.snackbarMessage = 'Path already exists';
    //     state.snackbarSeverity = 'error';
    //   } else if (action.payload === '') {
    //     state.snackbarMessage = 'Cannot add an empty path';
    //     state.snackbarSeverity = 'error';
    //   }
    //   state.snackbarActive = true;
    // },
    setVideo: (state, action: PayloadAction<VideoData>) => {
      state.currentVideo = action.payload;
      // state.snackbarActive = true;
      // state.snackbarMessage = `Video set to ${action.payload.name}`;
      // state.snackbarSeverity = 'success';
    },
  },
});

export const { setVideo } = videoSlice.actions;

export default videoSlice.reducer;

export const getCurrentVideo = (state: RootState) => state.video.currentVideo;
