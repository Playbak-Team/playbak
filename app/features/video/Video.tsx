/* eslint-disable jsx-a11y/media-has-caption */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { showInfo } from '../../components/Snackbar/snackBarSlice';
import { getCurrentCourses } from '../profile/profileSlice';
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
  CourseData,
  FileListUpdateType,
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
      backgroundColor: 'white',
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    videocontainer: {
      padding: theme.spacing(4),
      textAlign: 'center',
      backgroundColor: 'transparent',
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
    videotitle: {
      display: 'flex',
      flexDirection: 'row',
      color: 'black',
      alignItems: 'center',
      marginBottom: '-30px',
      marginLeft: '30px',
    },
    list: {
      width: 250,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
  })
);

function CourseCard(props: CollapsibleCardProps): JSX.Element {
  const dispatch = useDispatch();
  const { video, setVideo, course } = props;

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <ListItemIcon
        onClick={() => {
          dispatch(showInfo(`Playing ${video.name}`));
          setVideo(video);
        }}
      >
        <PlayCircleOutlineIcon />
      </ListItemIcon>
      <ListItemText primary={video.name} />
      {!video.pbsPath && (
        <ListItemIcon
          onClick={() => {
            ipcRenderer.send('generate-pbs', course, video.videoPath);
          }}
        >
          <ErrorOutlineIcon />
        </ListItemIcon>
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

function DrawerList(props: CollapsibleProps): JSX.Element {
  const classes = useStyles();
  const { course, setVideo } = props;

  const [files, setFiles] = useState<VideoData[]>(
    FileList.getVideoFiles(course)
  );
  const [open, setOpen] = React.useState(false);

  function handleClick() {
    setOpen(!open);
  }
  useEffect(() => {
    function handleCourseDataChanges(
      type: FileListUpdateType,
      data: CourseData
    ): void {
      if (type === FileListUpdateType.Video) {
        console.log('handleCourseDataChanges called');
        setFiles(data.video);
      }
    }
    FileList.subscribeToCourseDataChanges(course, handleCourseDataChanges);
    return () => {
      FileList.unsubscribeToCourseDataChanges(course, handleCourseDataChanges);
    };
  }, []);

  return (
    <div className={classes.list}>
      <ListItem button onClick={handleClick}>
        <ListItemText primary={course} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto">
        <List component="div" disablePadding>
          {files.map((file) => (
            <ListItem key={Math.random()} button className={classes.nested}>
              <CourseCard video={file} course={course} setVideo={setVideo} />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </div>
  );
}

export default function Video() {
  const classes = useStyles();
  const [menuExpanded, setMenuExpanded] = useState<boolean>(false);
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
      <div className={classes.videotitle}>
        <h1 style={{ color: 'black', fontFamily: 'Redressed, cursive' }}>
          NOW WATCHING
        </h1>
        <div
          style={{
            marginLeft: '20px',
          }}
        >
          {curVideo.name !== '' ? curVideo.name : 'Nothing..'}
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setMenuExpanded(true)}
          style={{
            alignSelf: 'flex-end',
            marginLeft: 'auto',
            marginBottom: '20px',
            marginRight: '30px',
          }}
        >
          Select a video
        </Button>
      </div>
      <div className={classes.videocontainer}>
        {curVideo.name}
        <VideoPlayer video={curVideo} pbsData={pbsData} />
      </div>
      <Drawer
        anchor="left"
        open={menuExpanded}
        onClose={() => setMenuExpanded(false)}
      >
        <div style={{ marginTop: '30px' }}>
          {currentCourses.map((dir: string) => (
            <DrawerList key={dir} course={dir} setVideo={setVideo} />
          ))}
        </div>
      </Drawer>
    </div>
  );
}
