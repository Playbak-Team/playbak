import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

import {
  isSnackBarActive,
  getSnackBarMessage,
  disableSnackbar,
  getSnackBarSeverity,
} from './snackBarSlice';

function Alert(props: AlertProps) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function SnackBar() {
  const dispatch = useDispatch();
  const snackbarActive = useSelector(isSnackBarActive);
  const snackbarMessage = useSelector(getSnackBarMessage);
  const severity = useSelector(getSnackBarSeverity);
  return (
    <Snackbar
      open={snackbarActive}
      autoHideDuration={1000}
      onClose={() => {
        dispatch(disableSnackbar());
      }}
      key={`${snackbarMessage}-bar`}
    >
      <Alert
        key={`${snackbarMessage}-alert`}
        onClose={() => dispatch(disableSnackbar())}
        severity={severity}
      >
        {snackbarMessage}
      </Alert>
    </Snackbar>
  );
}
