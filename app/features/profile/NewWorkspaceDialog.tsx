import { Dialog } from '@material-ui/core';
import Button from '@material-ui/core/Button/Button';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText/DialogContentText';
import TextField from '@material-ui/core/TextField/TextField';
import React, { useState } from 'react';
import { NewWorkspaceDialogProps } from '../../types';

export default function NewWorkspaceDialog(props: NewWorkspaceDialogProps) {
  const { isWkOpen, handleWkClose } = props;
  const [enteredName, setEnteredName] = useState('');

  function handleClose(value: string) {
    handleWkClose(value);
    setEnteredName('');
  }

  return (
    <Dialog open={isWkOpen} aria-labelledby="form-dialog-title">
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
        <Button onClick={() => handleClose(enteredName)} color="primary">
          Create
        </Button>
        <Button onClick={() => handleClose('')} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
