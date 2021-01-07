import { Dialog } from '@material-ui/core';
import Button from '@material-ui/core/Button/Button';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText/DialogContentText';
import TextField from '@material-ui/core/TextField/TextField';
import React, { useState } from 'react';
import { NewPlaylistDialogProps } from '../../types';

export default function NewPlayListDialog(props: NewPlaylistDialogProps) {
  const { playlistOpen, setPlaylistOpen } = props;
  const [enteredValue, setEnteredValue] = useState(() => {
    const savedValue = window.localStorage.getItem('playlist');

    return savedValue !== null ? savedValue : '';
  });

  function handleClose(value: string) {
    if (value !== '') window.localStorage.setItem('playlist', value);
    setPlaylistOpen(false);
  }

  return (
    <Dialog open={playlistOpen} aria-labelledby="form-dialog-title">
      <DialogContent>
        <DialogContentText>Enter playlist ID</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Playlist"
          fullWidth
          value={enteredValue}
          onChange={(e) => setEnteredValue(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(enteredValue)} color="primary">
          Create
        </Button>
        <Button onClick={() => handleClose('')} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
