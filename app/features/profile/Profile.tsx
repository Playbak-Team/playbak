import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  createStyles,
  Theme,
  withStyles,
} from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import Collapse from '@material-ui/core/Collapse';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import {
  getCurrentTerm,
  setName,
  getName,
  getAllWorkspaces,
  addWorkspace,
  setWorkspace,
  addCourse,
  getCurrentCourses,
  setCourses,
} from './profileSlice';
import { WorkspaceEntryProps, CourseEntryProps } from '../../types';

const { ipcRenderer } = window.require('electron');

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      overflowX: 'hidden',
      overflowY: 'hidden',
      backgroundColor: '#0B1E38',
      height: '100vh',
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: 'white',
      minHeight: '90vh',
      display: 'flex',
      flexDirection: 'column',
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    namerow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '3px solid #7FC5DC',
    },
    termrow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginTop: '3vh',
      borderBottom: '3px solid #7FC5DC',
      paddingBottom: '3vh',
    },
    workspacesdivparent: {
      minHeight: '50vh',
      maxHeight: '50vh',
      width: '100%',
      overflow: 'hidden',
      height: '100%',
      position: 'relative',
      border: '2px solid #4888C8',
    },
    workspacesdiv: {
      position: 'absolute',
      top: '0px',
      bottom: '0px',
      left: '0px',
      right: '-17px',
      overflowY: 'scroll',
    },
    workspacestitle: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: '2vh',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    workspaceentry: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alginItems: 'center',
      paddingTop: '1vh',
      paddingBottom: '1vh',
      paddingLeft: '1vw',
      border: '1px solid #173679',
      textAlign: 'center',
    },
    workspacearea: {
      margin: '2em 2em 2em 2em',
      padding: '2em, 2em, 2em, 2em',
      minHeight: '80vh',
    },
    workspaceareatitle: {
      margin: '0.5em 0.5em 0.5em 0.5em',
      padding: '2em, 2em, 2em, 2em',
      fontSize: '3em',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    whitetext: {
      color: 'white',
    },
    buttonstyle: {
      marginBottom: '10px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      color: 'white',
    },
  })
);

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'white',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'white',
    },
    '& .MuiInputBase-input': {
      color: 'white',
    },
    '& .MuiFormLabel-root': {
      color: 'white',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',
      },
    },
    color: 'white',
  },
})(TextField);

function WorkspaceEntry(props: WorkspaceEntryProps) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { name } = props;
  return (
    <div className={classes.workspaceentry}>
      {name}
      <IconButton
        style={{ color: 'blue' }}
        onClick={() => {
          dispatch(setWorkspace(name));
        }}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    </div>
  );
}

function CourseEntry(props: CourseEntryProps) {
  const classes = useStyles();
  const { name } = props;
  return <div className={classes.workspaceentry}>{name}</div>;
}

export default function Profile() {
  const [editingName, setEditingName] = useState(false);
  const [addToWorkspace, setAddToWorkspace] = useState(false);
  const [addCoursePrompt, setAddCoursePrompt] = useState(false);
  const [courseString, setCourseString] = useState('');
  const [workspaceString, setWorkspaceString] = useState('');
  const classes = useStyles();
  const name = useSelector(getName);
  const allWorkspaces = useSelector(getAllWorkspaces);
  const allCourses = useSelector(getCurrentCourses);
  const currentTerm = useSelector(getCurrentTerm);
  const [nameChange, setNameChange] = useState('');
  // const wkspace = useSelector(getCurrentTerm);
  const dispatch = useDispatch();

  useEffect(() => {
    ipcRenderer.on('return-courses', (_, courses: string[]) => {
      dispatch(setCourses(Object.values(courses)));
    });
  }, []);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <div className={classes.paper}>
            <div className={classes.namerow}>
              <AccountBoxIcon style={{ fontSize: 100 }} />
              {editingName ? (
                <div>
                  <CssTextField
                    id="new-name-field"
                    label="Enter new name"
                    defaultValue={name}
                    variant="outlined"
                    InputProps={{
                      className: classes.whitetext,
                    }}
                    onChange={(e) => setNameChange(e.target.value)}
                    value={nameChange}
                  />
                  <IconButton
                    style={{ fontSize: 60, color: 'green' }}
                    aria-label="edit name"
                    onClick={() => {
                      dispatch(setName(nameChange));
                      setEditingName(false);
                    }}
                  >
                    <CheckIcon />
                  </IconButton>
                </div>
              ) : (
                <div>
                  <h2>
                    {name}
                    <IconButton
                      color="secondary"
                      style={{ fontSize: 60 }}
                      aria-label="edit name"
                      onClick={() => setEditingName(true)}
                    >
                      <EditIcon />
                    </IconButton>
                  </h2>
                </div>
              )}
            </div>
            <div className={classes.termrow}>
              Current Selected Term:
              {currentTerm === '' ? (
                <div>&nbsp;NONE</div>
              ) : (
                <div>
                  &nbsp;
                  {currentTerm}
                </div>
              )}
            </div>
            <div className={classes.workspacestitle}>
              Available Workspaces
              <IconButton onClick={() => setAddToWorkspace(!addToWorkspace)}>
                {addToWorkspace ? (
                  <CancelRoundedIcon className={classes.buttonstyle} />
                ) : (
                  <AddCircleIcon className={classes.buttonstyle} />
                )}
              </IconButton>
            </div>
            <Collapse in={addToWorkspace}>
              <div
                style={{
                  marginBottom: '10px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <CssTextField
                  id="outlined-basic"
                  label="Enter workspace name"
                  variant="outlined"
                  style={{
                    width: '100%',
                  }}
                  InputProps={{
                    className: classes.whitetext,
                  }}
                  value={workspaceString}
                  onChange={(e) => setWorkspaceString(e.target.value)}
                />
                <IconButton
                  style={{
                    fontSize: 100,
                    color: 'green',
                  }}
                  aria-label="edit"
                  onClick={() => {
                    dispatch(addWorkspace(workspaceString));
                  }}
                >
                  <CheckIcon />
                </IconButton>
              </div>
            </Collapse>
            <div className={classes.workspacesdivparent}>
              <div className={classes.workspacesdiv}>
                {allWorkspaces.map((n) => (
                  <div key={n}>
                    <WorkspaceEntry key={n} name={n} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={9}>
          <div className={classes.workspacearea}>
            <div className={classes.workspaceareatitle}>
              {currentTerm === '' ? (
                <div>No workspace selected</div>
              ) : (
                <div>{currentTerm}</div>
              )}
              <IconButton onClick={() => setAddCoursePrompt(!addCoursePrompt)}>
                {addCoursePrompt ? (
                  <CancelRoundedIcon className={classes.buttonstyle} />
                ) : (
                  <AddCircleIcon className={classes.buttonstyle} />
                )}
              </IconButton>
            </div>
            <Collapse in={addCoursePrompt}>
              <div
                style={{
                  marginBottom: '10px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <CssTextField
                  id="outlined-basic"
                  label="Enter path"
                  variant="outlined"
                  style={{
                    width: '100%',
                  }}
                  InputProps={{
                    className: classes.whitetext,
                  }}
                  value={courseString}
                  onChange={(e) => setCourseString(e.target.value)}
                />
                <IconButton
                  style={{
                    fontSize: 100,
                    color: 'green',
                  }}
                  aria-label="edit"
                  onClick={() => {
                    dispatch(addCourse(courseString));
                    setAddCoursePrompt(false);
                  }}
                >
                  <CheckIcon />
                </IconButton>
              </div>
            </Collapse>
            <div className={classes.workspacesdivparent}>
              <div className={classes.workspacesdiv}>
                {allCourses.map((n) => (
                  <div key={n}>
                    <CourseEntry key={n} name={n} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
