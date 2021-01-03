import { Dialog } from '@material-ui/core';
import Button from '@material-ui/core/Button/Button';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import TextField from '@material-ui/core/TextField/TextField';
import React, { useState } from 'react';
import { NewWorkspaceDialogProps } from '../../types';

export default function NewWorkspaceDialog(props: NewWorkspaceDialogProps) {
  const { isWkOpen, handleWkClose } = props;
  const [enteredName, setEnteredName] = useState('');

  function handleClose() {
    setEnteredName('');
    handleWkClose(enteredName);
  }
  return (
    <Dialog open={isWkOpen} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">New Workspace</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter a name for this new workspace
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Workspace"
          fullWidth
          value={enteredName}
          onChange={(e) => setEnteredName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleClose} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
