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
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    addToURLS: (state, action: PayloadAction<string>) => {
      state.videoURLS.push(action.payload);
    },
    setVideo: (state, action: PayloadAction<string>) => {
      state.currentVideo = action.payload;
    },
  },
});

export const { addToURLS, setVideo } = videoSlice.actions;

// export const incrementIfOdd = (): AppThunk => {
//   return (dispatch, getState) => {
//     const state = getState();
//     if (state.counter.value % 2 === 0) {
//       return;
//     }
//     dispatch(increment());
//   };
// };

// export const incrementAsync = (delay = 1000): AppThunk => (dispatch) => {
//   setTimeout(() => {
//     dispatch(increment());
//   }, delay);
// };

export default videoSlice.reducer;

export const getPathURLS = (state: RootState) => state.video.videoURLS;

export const getCurrentVideo = (state: RootState) => state.video.currentVideo;
