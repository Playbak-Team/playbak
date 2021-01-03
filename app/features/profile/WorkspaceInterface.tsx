import React, { useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { WorkspaceInterfaceProps } from '../../types';
import { getCurrentCourses } from './profileSlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    noworkspace: {
      color: 'black',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      display: 'flex',
      flexDirection: 'row',
      color: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: '100%',
      borderBottom: '2px solid white',
    },
  })
);

const NoWorkspacePrompt = () => {
  const classes = useStyles();
  return <div className={classes.noworkspace}>Please activate a workspace</div>;
};

const WorkspaceInfo = (props: { title: string }) => {
  const { title } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const courses = useSelector(getCurrentCourses);

  return (
    <div className={classes.title}>
      <h2>{title}</h2>
      <Button variant="outlined" color="secondary">
        Add a course
      </Button>
    </div>
  );
};

export default function WorkspaceInterface(props: WorkspaceInterfaceProps) {
  const { workspace } = props;
  return (
    <div>
      {workspace === '' ? (
        <NoWorkspacePrompt />
      ) : (
        <WorkspaceInfo title={workspace} />
      )}
    </div>
  );
}
