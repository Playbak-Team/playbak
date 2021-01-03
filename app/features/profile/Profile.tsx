import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  createStyles,
  Theme,
  withStyles,
} from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { ipcRenderer } from 'electron';
import NewWorkspaceDialog from './NewWorkspaceDialog';
import WorkspaceInterface from './WorkspaceInterface';
import {
  getCurrentTerm,
  setName,
  getName,
  getAllWorkspaces,
  addWorkspace,
  setWorkspace,
  setCourses,
} from './profileSlice';
import { WorkspaceEntryProps, CourseEntryProps } from '../../types';

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
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#06170e',
      boxShadow:
        '8px 0px 0px 0px #DCD0C0, 0px 8px 0px 0px #B1938B, -8px 0px 0px 0px #4E4E56, 0px 0px 0px 8px #DA635D, 5px 5px 15px 5px rgba(0,0,0,0)',
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    namerow: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '3px solid #7FC5DC',
      paddingBottom: '10px',
    },
    termrow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
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
      marginBottom: '2vh',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    workspaceentry: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alginItems: 'center',
      margin: '15px',
      padding: '10px',
      backgroundColor: '#3f2f4f',
      boxShadow: '0px 10px 13px -7px #000000, 5px 5px 15px 5px rgba(0,0,0,0)',
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
      <p>{name}</p>
      <IconButton
        style={{ color: 'yellow' }}
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
  const [addCoursePrompt, setAddCoursePrompt] = useState(false);
  const [courseString, setCourseString] = useState('');
  const [isWkOpen, setIsWkOpen] = useState(false);
  const classes = useStyles();
  const name = useSelector(getName);
  const allWorkspaces = useSelector(getAllWorkspaces);
  const currentTerm = useSelector(getCurrentTerm);
  const [nameChange, setNameChange] = useState('');
  // const wkspace = useSelector(getCurrentTerm);
  const dispatch = useDispatch();

  function handleWkClose(value: string) {
    if (value !== '') {
      dispatch(addWorkspace(value));
    }
    setIsWkOpen(false);
  }

  useEffect(() => {
    ipcRenderer.on('return-courses', (_, courses: string[]) => {
      dispatch(setCourses(Object.values(courses)));
    });
    return () => {
      ipcRenderer.removeAllListeners('return-courses');
    };
  }, [dispatch]);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <div className={classes.paper}>
            <div className={classes.namerow}>
              <AccountBoxIcon style={{ fontSize: 150 }} />
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
                    aria-label="edit name confirm"
                    id="edit-name-confirm"
                    onClick={() => {
                      dispatch(setName(nameChange));
                      setEditingName(false);
                    }}
                  >
                    <CheckIcon />
                  </IconButton>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <h2 id="user-name">{name}</h2>
                  <IconButton
                    color="secondary"
                    style={{ fontSize: 60 }}
                    aria-label="edit name"
                    id="edit-name"
                    onClick={() => setEditingName(true)}
                  >
                    <EditIcon />
                  </IconButton>
                </div>
              )}
            </div>
            <div className={classes.termrow}>
              <div>Current Selected Term:</div>
              {currentTerm === '' ? (
                <div>&nbsp;NONE</div>
              ) : (
                <div id="current-term">{currentTerm}</div>
              )}
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setIsWkOpen(true)}
              >
                Add a new workspace
              </Button>
            </div>
            <NewWorkspaceDialog
              isWkOpen={isWkOpen}
              handleWkClose={handleWkClose}
            />
            <div className={classes.workspacestitle}>Available Workspaces</div>
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
          <WorkspaceInterface workspace={currentTerm} />
        </Grid>
      </Grid>
    </div>
  );
}
