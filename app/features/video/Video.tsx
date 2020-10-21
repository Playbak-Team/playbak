/* eslint-disable jsx-a11y/media-has-caption */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import fs from 'fs';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Collapsible from 'react-collapsible';
import { getPathURLS } from './videoSlice';
import routes from '../../constants/routes.json';

import styles from './Video.css';

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
      height: '110%',
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
  })
);

type CollapsibleProps = {
  dir: string;
};

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
            <p key={file}>{file}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Video() {
  const dispatch = useDispatch();
  const paths = useSelector(getPathURLS);
  const [videoURLS, setVideoURLS] = useState<string[]>([]);
  const classes = useStyles();

  useEffect(() => {
    paths.forEach((p) => {
      fs.readdir(p, (err, files) => {
        if (!err) {
          files.forEach((file) => setVideoURLS((vu) => [...vu, file]));
        }
      });
    });
  }, [paths]);

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
        <Grid item xs={3}>
          <Paper className={classes.paper}>
            {paths.map((dir: string) => (
              <MyCollapsible key={dir} dir={dir} />
            ))}
            {/* {videoURLS.map((vu) => (
              <div key={vu.toString()}>{vu.toString()}</div>
            ))} */}
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <Paper className={classes.videocontainer}>
            <video controls className={classes.videoplayer} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
