import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../store';
import { SnackbarStateInterface } from '../../interfaces';

const initialState: SnackbarStateInterface = {
  snackbarActive: false,
  snackbarMessage: '',
  snackbarSeverity: undefined,
};

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    disableSnackbar: (state) => {
      state.snackbarActive = false;
    },
    showError: (state, action: PayloadAction<string>) => {
      state.snackbarActive = true;
      state.snackbarMessage = action.payload;
      state.snackbarSeverity = 'error';
    },
    showSuccess: (state, action: PayloadAction<string>) => {
      state.snackbarActive = true;
      state.snackbarMessage = action.payload;
      state.snackbarSeverity = 'success';
    },
    showInfo: (state, action: PayloadAction<string>) => {
      state.snackbarActive = true;
      state.snackbarMessage = action.payload;
      state.snackbarSeverity = 'info';
    },
    showWarning: (state, action: PayloadAction<string>) => {
      state.snackbarActive = true;
      state.snackbarMessage = action.payload;
      state.snackbarSeverity = 'warning';
    },
  },
});

export const {
  disableSnackbar,
  showError,
  showSuccess,
  showInfo,
  showWarning,
} = snackbarSlice.actions;

export default snackbarSlice.reducer;

export const isSnackBarActive = (state: RootState) =>
  state.snackbar.snackbarActive;

export const getSnackBarMessage = (state: RootState) =>
  state.snackbar.snackbarMessage;

export const getSnackBarSeverity = (state: RootState) =>
  state.snackbar.snackbarSeverity;
