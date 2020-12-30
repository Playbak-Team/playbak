import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';

import { EditEntryProps } from '../../types';

const useStyles = makeStyles(() =>
  createStyles({
    dialogContent: {
      minWidth: '30vw',
      minHeight: '50vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    dialogContentLeft: {
      minWidth: '73%',
      minHeight: '100%',
      maxWidth: '73%',
      borderRight: '1px solid black',
      paddingRight: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    dialogContentRight: {
      minWidth: '27%',
      maxWidth: '27%',
      minHeight: '100%',
    },
  })
);

export default function EditEntry(props: EditEntryProps) {
  const {
    index,
    entry,
    handleEntryClose,
    showSelectedEntry,
    handleEntrySave,
  } = props;
  const [t, setTitle] = useState('');
  const [st, setSubTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [l, setLabel] = useState('');
  const [d, setDate] = useState('');
  const classes = useStyles();

  const handleButtonEffect = () => {
    handleEntrySave(
      index,
      `${entry.split(',')[0]},${t},${st},${desc},${l},${d},${
        entry.split(',')[6]
      }`
    );
  };

  useEffect(() => {
    if (entry !== '') {
      setTitle(entry.split(',')[1]);
      setSubTitle(entry.split(',')[2]);
      setDesc(entry.split(',')[3]);
      setLabel(entry.split(',')[4]);
      setDate(entry.split(',')[5]);
    }
  }, [entry]);

  return (
    <Dialog
      onClose={handleEntryClose}
      aria-labelledby="customized-dialog-title"
      open={showSelectedEntry}
    >
      <DialogTitle id="customized-dialog-title" onClick={handleEntryClose}>
        <div style={{ color: 'black', margin: '0', padding: '0' }}>
          Edit Entry
        </div>
      </DialogTitle>
      <DialogContent dividers>
        {index === -1 ? (
          <div />
        ) : (
          <div className={classes.dialogContent}>
            <div className={classes.dialogContentLeft}>
              <TextField
                label="Title"
                id="filled-margin-normal"
                margin="none"
                variant="filled"
                fullWidth
                value={t}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextField
                label="SubTitle"
                id="filled-margin-normal"
                margin="none"
                variant="filled"
                fullWidth
                value={st}
                onChange={(e) => setSubTitle(e.target.value)}
              />
              <TextField
                label="Description"
                id="filled-margin-normal"
                margin="none"
                variant="filled"
                fullWidth
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
              <TextField
                label="Label"
                id="filled-margin-normal"
                margin="none"
                variant="filled"
                fullWidth
                value={l}
                onChange={(e) => setLabel(e.target.value)}
              />
              <TextField
                label="Date"
                id="filled-margin-normal"
                margin="none"
                variant="filled"
                fullWidth
                value={d}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className={classes.dialogContentRight} />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleButtonEffect} color="primary">
          Save changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
