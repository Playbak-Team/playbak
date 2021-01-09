/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import { WorkspaceInterfaceProps } from '../../types';
import { getCurrentCourses, addCourse } from './profileSlice';
import {
  showSuccess,
  showError,
} from '../../components/Snackbar/snackBarSlice';
import CourseUI from './CourseUI';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
      width: '100%',
      backgroundColor: '#2e1534',
    },
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
      marginBottom: '20px',
      paddingBottom: '20px',
    },
  })
);

const NoWorkspacePrompt = React.memo(function EmptyPrompt() {
  const classes = useStyles();
  return <div className={classes.noworkspace}>Please activate a workspace</div>;
});

const WorkspaceInfo = React.memo(function WI(props: { title: string }) {
  const { title } = props;
  const [open, setOpen] = useState(false);
  const [courseName, setCourseName] = useState('');
  const classes = useStyles();
  const dispatch = useDispatch();
  const courses = useSelector(getCurrentCourses);

  function handleClose(value: string) {
    if (value !== '' && !courses.includes(value)) {
      dispatch(showSuccess(`Added course ${value} to the current workspace`));
      dispatch(addCourse(value));
    } else {
      dispatch(showError(`course ${value} already exists`));
    }
    setOpen(false);
  }

  return (
    <div>
      <div className={classes.title}>
        <h2 style={{ alignSelf: 'center', marginLeft: 'auto' }}>{title}</h2>
        <Button
          variant="contained"
          size="small"
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
              label="Course"
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
      <div>
        <CourseUI />
      </div>
    </div>
  );
});

export default function WorkspaceInterface(props: WorkspaceInterfaceProps) {
  const { workspace } = props;
  return (
    <div style={{ padding: '20px 20px 20px 10px' }}>
      {workspace === '' ? (
        <NoWorkspacePrompt />
      ) : (
        <WorkspaceInfo title={workspace} />
      )}
    </div>
  );
}
