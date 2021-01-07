/* eslint-disable jsx-a11y/media-has-caption */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { getCurrentCourses, getCurrentTerm } from '../profile/profileSlice';
import { showInfo } from '../../components/Snackbar/snackBarSlice';

import styles from './Video.css';

import {
  CollapsibleProps,
  CollapsibleCardProps,
  VideoPlayerProps,
} from '../../types';
import {
  PBSData,
  VideoData,
  emptyPBSData,
  emptyVideoData,
} from '../../interfaces';

import FileList from '../filelist/filelist';

// import { FaceRounded } from '@material-ui/icons';

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

function CollapsibleCard(props: CollapsibleCardProps): JSX.Element {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { video, setVideo, course } = props;

  return (
    <div className={classes.videobutton}>
      <IconButton
        color="primary"
        aria-label="Select"
        onClick={() => {
          dispatch(showInfo(`Playing ${video.name}`));
          setVideo(video);
        }}
      >
        <PlayCircleOutlineIcon />
      </IconButton>
      {video.name}
      {!video.pbsPath && (
        <IconButton
          color="primary"
          aria-label="No playbak speed data found. Click to run PBSGen."
          onClick={() => {
            ipcRenderer.send('generate-pbs', course, video.videoPath);
          }}
        >
          <ErrorOutlineIcon />
        </IconButton>
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
    }, 50);
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
  const { course, setVideo } = props;
  const files = FileList.getVideoFiles(course);

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
            <CollapsibleCard
              video={file}
              course={course}
              key={Math.random()}
              setVideo={setVideo}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Video() {
  const classes = useStyles();
  const [menuExpanded, setMenuExpanded] = useState<boolean>(true);
  const [pbsData, setPBSData] = useState<PBSData>(emptyPBSData());
  const [curVideo, setVideo] = useState<VideoData>(emptyVideoData());

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
                  <MyCollapsible key={dir} course={dir} setVideo={setVideo} />
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
    </div>
  );
}
