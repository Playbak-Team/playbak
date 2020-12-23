import React, { useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import EditIcon from '@material-ui/icons/Edit';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { getName, setName } from '../../dbSlice';

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
      alignItems: 'center',
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
    },
  })
);

export default function Profile() {
  const [editingName, setEditingName] = useState(false);
  const classes = useStyles();
  const name = useSelector(getName);
  const [nameChange, setNameChange] = useState('');
  // const wkspace = useSelector(getCurrentTerm);
  const dispatch = useDispatch();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <div className={classes.paper}>
            <AccountBoxIcon style={{ fontSize: 100 }} />
            <div className={classes.row}>
              {editingName ? (
                <div>
                  <TextField
                    id="new-name-field"
                    label="Enter new name"
                    defaultValue={name}
                    variant="outlined"
                    color="primary"
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
          </div>
        </Grid>
        <Grid item xs={9}>
          <Paper className={classes.paper}>potato</Paper>
        </Grid>
      </Grid>
    </div>
  );
}
