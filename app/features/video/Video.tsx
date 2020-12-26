/* eslint-disable jsx-a11y/media-has-caption */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import fs from 'fs';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import Collapse from '@material-ui/core/Collapse';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import {
  getCurrentVideo,
  getPathURLS,
  setVideo,
  addToURLS,
  isSnackBarActive,
  getSnackBarMessage,
  disableSnackbar,
  getSnackBarSeverity,
} from './videoSlice';
import { getCurrentCourses, getCurrentTerm } from '../profile/profileSlice';
import routes from '../../constants/routes.json';

import styles from './Video.css';

import {
  CollapsibleProps,
  CollapsibleCardProps,
  VideoPlayerProps,
} from '../../types';

const { ipcRenderer } = require('electron');

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      overflowX: 'hidden',
      overflowY: 'hidden',
      height: '100vh',
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    videocontainer: {
      padding: theme.spacing(4),
      textAlign: 'center',
      color: theme.palette.text.secondary,
      height: '80vh',
      maxHeight: '80vh',
    },
    previous: {
      backgroundColor: '#f1f1f1',
      color: 'black',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      textAlign: 'center',
    },
    videoplayer: {
      width: '100%',
      height: '100%',
    },
    collapse: {
      width: '80%',
      minHeight: '20%',
      height: '20%',
    },
    videobutton: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      wordWrap: 'break-word',
    },
    selectiontop: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    selection: {
      justifyContent: 'center',
    },
    inputtextclosed: {
      height: '0px',
    },
    inputtextopen: {
      display: 'flex',
      justifyContent: 'space-between',
      margin: theme.spacing(1),
    },
    title: {
      flexGrow: 1,
    },
  })
);

function Alert(props: AlertProps) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function CollapsibleCard(props: CollapsibleCardProps): JSX.Element {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { dir, filepath } = props;

  return (
    <div className={classes.videobutton}>
      {filepath}
      <IconButton
        color="primary"
        aria-label="Select"
        onClick={() => dispatch(setVideo(`.${dir}\\${filepath}`))}
      >
        <PlayCircleOutlineIcon />
      </IconButton>
    </div>
  );
}

function VideoPlayer(props: VideoPlayerProps): JSX.Element {
  const { filepath } = props;
  return (
    <video key={filepath} controls width="100%" height="100%">
      <source src={filepath} type="video/mp4" />
    </video>
  );
}

function MyCollapsible(props: CollapsibleProps): JSX.Element {
  const { dir } = props;

  const wkspace = useSelector(getCurrentTerm);
  const [files, setFiles] = useState<string[]>([]);

  const videoDir = `.\\workspaces\\${wkspace}\\${dir}\\videos`;
  useEffect(() => {
    setFiles(ipcRenderer.sendSync('get-video-files', videoDir));
  }, []);

  return (
    <div className={styles.wrapcollabsible}>
      <input
        key={Math.random()}
        id={`${dir.toString()}-collapsible`}
        className={styles.toggle}
        type="checkbox"
      />
      <label
        htmlFor={`${dir.toString()}-collapsible`}
        className={styles.lbltoggle}
      >
        {dir}
      </label>
      <div className={styles.collapsiblecontent}>
        <div className={styles.contentinner}>
          {/* <p>
            QUnit is by calling one of the object that are embedded in
            JavaScript, and faster JavaScript program could also used with its
            elegant, well documented, and functional programming using JS, HTML
            pages Modernizr is a popular browsers without plug-ins. Test-Driven
            Development.
          </p> */}
          {files.map((file) => (
            <CollapsibleCard
              dir={videoDir}
              filepath={file}
              key={Math.random()}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Video() {
  const dispatch = useDispatch();
  const curVideo = useSelector(getCurrentVideo);
  const snackbar = useSelector(isSnackBarActive);
  const snackbarMessage = useSelector(getSnackBarMessage);
  const severity = useSelector(getSnackBarSeverity);
  const classes = useStyles();
  const [menuExpanded, setMenuExpanded] = useState<boolean>(true);

  const currentCourses = useSelector(getCurrentCourses);

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          {/* <Paper className={classes.paper}>
            <Link to={routes.HOME}>
              <div className={classes.previous}>&#8249;</div>
            </Link>
          </Paper> */}
          <AppBar position="static">
            <Toolbar>
              <Link to={routes.HOME}>
                <div className={classes.previous}>&#8249;</div>
              </Link>
            </Toolbar>
          </AppBar>
        </Grid>
        <Grid item xs={menuExpanded ? 3 : 1}>
          <Paper className={`${classes.paper} ${classes.selection}`}>
            {menuExpanded ? (
              <div>
                <div className={classes.selectiontop}>
                  {/* <IconButton
                    color="primary"
                    aria-label="Select"
                    onClick={() => setShowAdd(!showAdd)}
                  >
                    {showAdd ? (
                      <RemoveCircleOutlineIcon />
                    ) : (
                      <AddCircleOutlineIcon />
                    )}
                  </IconButton> */}
                  <IconButton
                    color="primary"
                    aria-label="Select"
                    onClick={() => setMenuExpanded(false)}
                  >
                    <ChevronLeftIcon />
                  </IconButton>
                </div>
                {/* <Collapse in={showAdd}>
                  <div
                    style={{
                      marginBottom: '10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <TextField
                      id="outlined-basic"
                      label="Enter path"
                      variant="outlined"
                      style={{
                        width: '100%',
                      }}
                      value={pathToAdd}
                      onChange={(e) => setPathToAdd(e.target.value)}
                    />
                    <IconButton
                      color="primary"
                      aria-label="Select"
                      onClick={() => dispatch(addToURLS(pathToAdd))}
                    >
                      <CreateNewFolderIcon />
                    </IconButton>
                  </div>
                </Collapse> */}

                {currentCourses.map((dir: string) => (
                  <MyCollapsible key={dir} dir={dir} />
                ))}
              </div>
            ) : (
              <IconButton
                color="primary"
                aria-label="Select"
                onClick={() => setMenuExpanded(true)}
              >
                <ChevronRightIcon />
              </IconButton>
            )}
          </Paper>
        </Grid>
        <Grid item xs={menuExpanded ? 9 : 11}>
          <Paper className={classes.videocontainer}>
            {curVideo}
            <VideoPlayer filepath={curVideo} />
          </Paper>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbar}
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
    </div>
  );
}
