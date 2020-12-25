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
import { WorkspaceEntryProps } from '../../types';

const { ipcRenderer } = window.require('electron');

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      overflowX: 'hidden',
      overflowY: 'hidden',
      backgroundColor: '#0B1E38',
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
    workspacesdiv: {
      marginTop: '1vh',
      width: '100%',
      height: '100%',
      color: 'white',
      minHeight: '50vh',
      maxHeight: '50vh',
      textAlign: 'left',
      paddingRight: '17px',
      boxSizing: 'content-box',
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
      border: '1px solid #173679',
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
    ipcRenderer.on('return-courses', (_event: any, courses: string[]) => {
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
                <AddCircleIcon
                  style={{
                    marginTop: 0,
                    marginBottom: 0,
                    color: 'white',
                    alignSelf: 'flex-end',
                  }}
                />
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
                  label="Enter path"
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
            <div className={classes.workspacesdiv}>
              {allWorkspaces.map((n) => (
                <div key={n}>
                  <WorkspaceEntry key={n} name={n} />
                </div>
              ))}
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
                <AddCircleIcon
                  style={{
                    marginTop: 0,
                    marginBottom: 0,
                    color: 'white',
                    alignSelf: 'flex-end',
                  }}
                />
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
            {allCourses.map((n) => (
              <div key={n}>
                <WorkspaceEntry key={n} name={n} />
              </div>
            ))}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
