import React, { useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import { WorkspaceInterfaceProps } from '../../types';
import { getCurrentCourses, addCourse } from './profileSlice';

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
      paddingTop: '15px',
      paddingBottom: '15px',
    },
  })
);

const NoWorkspacePrompt = () => {
  const classes = useStyles();
  return <div className={classes.noworkspace}>Please activate a workspace</div>;
};

const WorkspaceInfo = (props: { title: string }) => {
  const { title } = props;
  const [open, setOpen] = useState(false);
  const [courseName, setCourseName] = useState('');
  const classes = useStyles();
  const dispatch = useDispatch();
  const courses = useSelector(getCurrentCourses);

  function handleClose(value: string) {
    if (value !== '') dispatch(addCourse(value));
    setOpen(false);
  }

  return (
    <div className={classes.title}>
      <h2 style={{ alignSelf: 'center', marginLeft: 'auto' }}>{title}</h2>
      <Button
        variant="outlined"
        color="secondary"
        style={{
          alignSelf: 'flex-end',
          marginLeft: 'auto',
          marginRight: '15px',
        }}
        onClick={() => setOpen(true)}
      >
        Add a course
      </Button>
      <Dialog open={open} aria-labelledby="form-dialog-title">
        <DialogContent>
          <DialogContentText>Enter a name for this course</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Workspace"
            fullWidth
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(courseName)} color="primary">
            Create
          </Button>
          <Button onClick={() => handleClose('')} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
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
