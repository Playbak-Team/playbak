import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

import {
  isSnackBarActive,
  getSnackBarMessage,
  disableSnackbar,
  getSnackBarSeverity,
  showSuccess,
  showWarning,
  showInfo,
  showError,
} from './snackBarSlice';

import { SnackbarSeverity } from '../../interfaces';

const { ipcRenderer } = require('electron');

function Alert(props: AlertProps) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function SnackBar() {
  const dispatch = useDispatch();
  const snackbarActive = useSelector(isSnackBarActive);
  const snackbarMessage = useSelector(getSnackBarMessage);
  const severity = useSelector(getSnackBarSeverity);

  useEffect(() => {
    ipcRenderer.on(
      'show-snackbar',
      (_event, msg: string, seve: SnackbarSeverity) => {
        switch (seve) {
          case SnackbarSeverity.success:
            dispatch(showSuccess(msg));
            break;
          case SnackbarSeverity.info:
            dispatch(showInfo(msg));
            break;
          case SnackbarSeverity.warning:
            dispatch(showWarning(msg));
            break;
          case SnackbarSeverity.error:
            dispatch(showError(msg));
            break;
          default:
            dispatch(showWarning(msg));
        }
      }
    );

    return () => {
      ipcRenderer.removeAllListeners('show-snackbar');
    };
  }, [dispatch]);

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
