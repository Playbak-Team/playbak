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
import { getCurrentVideo, getPathURLS, setVideo } from './videoSlice';
import routes from '../../constants/routes.json';

import styles from './Video.css';

import {
  CollapsibleProps,
  CollapsibleCardProps,
  VideoPlayerProps,
} from '../../types';

// const fileRead = fs.readFileSync('C:\\Users\\kevin\\Videos\\L01P2.mp4');

// eslint-disable-next-line no-console
// console.log(fileRead.toString());

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      overflowX: 'hidden',
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
    },
    selectiontop: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    selection: {
      justifyContent: 'center',
    },
  })
);

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
        onClick={() => dispatch(setVideo(`${dir}\\${filepath}`))}
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
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    fs.readdir(dir, (err, found) => {
      found.forEach((f) => setFiles((old) => [...old, f]));
    });
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
            <CollapsibleCard dir={dir} filepath={file} key={file} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Video() {
  const paths = useSelector(getPathURLS);
  const curVideo = useSelector(getCurrentVideo);
  const classes = useStyles();
  const [menuExpanded, setMenuExpanded] = useState<boolean>(true);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Link to={routes.HOME}>
              <div className={classes.previous}>&#8249;</div>
            </Link>
          </Paper>
        </Grid>
        <Grid item xs={menuExpanded ? 3 : 1}>
          <Paper className={`${classes.paper} ${classes.selection}`}>
            {menuExpanded ? (
              <div>
                <div className={classes.selectiontop}>
                  <IconButton color="primary" aria-label="Select">
                    <AddCircleOutlineIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    aria-label="Select"
                    onClick={() => setMenuExpanded(false)}
                  >
                    <ChevronLeftIcon />
                  </IconButton>
                </div>
                {paths.map((dir: string) => (
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
            <VideoPlayer filepath={curVideo} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
