import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import { green } from '@material-ui/core/colors';
import LabelSelector from './LabelSelector';

import { EditEntryProps } from '../../types';

const useStyles = makeStyles(() =>
  createStyles({
    dialogContent: {
      minWidth: '53vw',
      maxHeight: '55vh',
      maxWidth: '53vw',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    dialogContentLeft: {
      minWidth: '70%',
      maxHeight: '100%',
      maxWidth: '70%',
      borderRight: '1px solid black',
      paddingRight: '20px',
      display: 'flex',
      flexDirection: 'column',
    },
    dialogContentRight: {
      minWidth: '30%',
      maxWidth: '30%',
      minHeight: '100%',
      padding: '0px 20px 0px 20px',
    },
  })
);

const FatTextField = withStyles({
  root: {
    '& .MuiInputBase-root': {
      minHeight: '500px',
      display: 'block',
    },
  },
})(TextField);

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
  // eslint-disable-next-line react/jsx-props-no-spreading
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);

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
  const [l, setLabel] = useState<any>('');
  const [d, setDate] = useState('');
  const [c, setCom] = useState(0);
  const classes = useStyles();

  console.log(d);

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCom(event.target.checked ? 1 : 0);
  };

  const handleButtonEffect = () => {
    handleEntrySave(
      index,
      `${entry.split(',')[0]},${t},${st},${desc},${l},${d},${
        entry.split(',')[6]
      },${c}`
    );
  };

  useEffect(() => {
    if (entry !== '') {
      setTitle(entry.split(',')[1]);
      setSubTitle(entry.split(',')[2]);
      setDesc(entry.split(',')[3]);
      setLabel(entry.split(',')[4]);
      setDate(entry.split(',')[5]);
      setCom(parseInt(entry.split(',')[7], 10));
    }
  }, [entry]);

  return (
    <Dialog
      onClose={handleEntryClose}
      aria-labelledby="customized-dialog-title"
      open={showSelectedEntry}
      maxWidth="xl"
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
                id="standard-basic"
                required
                style={{ marginBottom: '20px' }}
                value={t}
                onChange={(e) => setTitle(e.target.value)}
              />
              <FatTextField
                label="Description"
                id="filled-margin-normal"
                multiline
                margin="none"
                variant="outlined"
                fullWidth
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                size="medium"
              />
            </div>
            <div className={classes.dialogContentRight}>
              <LabelSelector label={l} setLabel={setLabel} />
              <TextField
                id="datetime-local"
                label="Due Date"
                type="datetime-local"
                value={d}
                onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <FormControlLabel
                control={
                  <GreenCheckbox checked={c === 1} onChange={handleCheck} />
                }
                label="Completed"
                style={{
                  margin: '20px 0px 00px -10px',
                }}
              />
            </div>
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
