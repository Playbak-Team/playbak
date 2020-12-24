import React, { useState } from 'react';
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
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {
  getCurrentTerm,
  setName,
  getName,
  getAllWorkspaces,
} from './profileSlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      overflowX: 'hidden',
      overflowY: 'hidden',
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
      borderBottom: '3px solid black',
    },
    termrow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginTop: '3vh',
      borderBottom: '3px solid black',
      paddingBottom: '3vh',
    },
    workspacesdiv: {
      marginTop: '1vh',
      width: '100%',
      color: 'white',
      minHeight: '50vh',
      maxHeight: '50vh',
      overflowY: 'scroll',
      textAlign: 'left',
    },
    workspacestitle: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: '2vh',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  })
);

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'white',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'yellow',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'yellow',
      },
    },
    color: 'white',
  },
})(TextField);

export default function Profile() {
  const [editingName, setEditingName] = useState(false);
  const classes = useStyles();
  const name = useSelector(getName);
  const allWorkspaces = useSelector(getAllWorkspaces);
  const currentTerm = useSelector(getCurrentTerm);
  const [nameChange, setNameChange] = useState('');
  // const wkspace = useSelector(getCurrentTerm);
  const dispatch = useDispatch();

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
              <IconButton>
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
            <div className={classes.workspacesdiv}>wow no way</div>
          </div>
        </Grid>
        {/* <Grid item xs={9}>
          <Paper className={classes.paper}>potato</Paper>
        </Grid> */}
      </Grid>
    </div>
  );
}
