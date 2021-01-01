/* eslint-disable jsx-a11y/media-has-caption */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import {
  getCurrentVideo,
  setVideo,
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
import { PBSData, VideoData, emptyPBSData } from '../../interfaces';

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
      // justifyContent: 'space-between',
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
  const { video } = props;

  return (
    <div className={classes.videobutton}>
      <IconButton
        color="primary"
        aria-label="Select"
        onClick={() => dispatch(setVideo(video))}
      >
        <PlayCircleOutlineIcon />
      </IconButton>
      {video.name}
      {!video.pbsPath && (
        <div title="No Playback speed data found.">
          <ErrorOutlineIcon />
        </div>
      )}
    </div>
  );
}

function VideoPlayer(props: VideoPlayerProps): JSX.Element {
  const { video, pbsData } = props;
  const videoPlayerRef = React.createRef<HTMLVideoElement>();

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoPlayerRef.current && pbsData.chunkSize !== -1) {
        const newSpeed =
          pbsData.speeds[
            Math.floor(videoPlayerRef.current.currentTime / pbsData.chunkSize)
          ];
        if (videoPlayerRef.current.playbackRate !== newSpeed) {
          videoPlayerRef.current.playbackRate = newSpeed;
        }
      }
    }, 100);
    return () => clearInterval(interval);
  }, [pbsData, videoPlayerRef]);
  return (
    <video
      key={video.videoPath}
      controls
      width="100%"
      height="100%"
      ref={videoPlayerRef}
    >
      <source src={video.videoPath} type="video/mp4" />
    </video>
  );
}

function MyCollapsible(props: CollapsibleProps): JSX.Element {
  const { course } = props;

  const wkspace = useSelector(getCurrentTerm);
  const [files, setFiles] = useState<VideoData[]>([]);

  useEffect(() => {
    ipcRenderer.on('return-videos', (_event, targetCourse, videos) => {
      if (targetCourse === course) {
        setFiles(videos);
      }
    });
    return () => {
      ipcRenderer.removeAllListeners('return-videos');
    };
  }, []);

  useEffect(() => {
    ipcRenderer.send('get-videos', wkspace, course);
  }, [course, wkspace]);

  return (
    <div className={styles.wrapcollabsible}>
      <input
        key={Math.random()}
        id={`${course.toString()}-collapsible`}
        className={styles.toggle}
        type="checkbox"
      />
      <label
        htmlFor={`${course.toString()}-collapsible`}
        className={styles.lbltoggle}
      >
        {course}
      </label>
      <div className={styles.collapsiblecontent}>
        <div className={styles.contentinner}>
          {files.map((file) => (
            <CollapsibleCard video={file} key={Math.random()} />
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
  const [pbsData, setPBSData] = useState<PBSData>(emptyPBSData());

  const currentCourses = useSelector(getCurrentCourses);

  useEffect(() => {
    ipcRenderer.on('return-pbs', (_event, data) => {
      setPBSData(data);
    });
    return () => {
      ipcRenderer.removeAllListeners('return-pbs');
    };
  }, []);
  useEffect(() => {
    if (curVideo.pbsPath) {
      ipcRenderer.send('read-pbs', curVideo.pbsPath);
    }
  }, [curVideo]);

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
                  <IconButton
                    color="primary"
                    aria-label="Select"
                    onClick={() => setMenuExpanded(false)}
                  >
                    <ChevronLeftIcon />
                  </IconButton>
                </div>
                {currentCourses.map((dir: string) => (
                  <MyCollapsible key={dir} course={dir} />
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
            {curVideo.name}
            <VideoPlayer video={curVideo} pbsData={pbsData} />
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
