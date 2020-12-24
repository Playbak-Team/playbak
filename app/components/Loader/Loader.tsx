import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      '& > * + *': {
        marginLeft: theme.spacing(2),
      },
      backgroundColor: 'black',
      width: '100vw',
      height: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    },
    loadingText: {
      marginTop: '10px',
    },
  })
);

export default function Loader(): JSX.Element {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CircularProgress size={80} color="secondary" />
      <div className={classes.loadingText}>Loading...</div>
    </div>
  );
}
