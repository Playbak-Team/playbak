/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from '@material-ui/core/IconButton/IconButton';
import ScrollContainer from 'react-indiana-drag-scroll';
import { RowDiv } from './styledComponents';
import { DragProps } from '../../types';
import SettingsDialog from './SettingsDialog';
import {
  getColumnNames,
  getEntries,
  addEntry,
  addColumn,
  removeColumn,
  setColumns,
  replaceEntry,
  setEntries,
  removeEntry,
} from './kanbanSlice';
import EditEntry from './EditEntry';
import ColumnCard from './ColumnCard';
import { move, reorder } from './utils';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: 'max-content',
      minWidth: '100%',
      height: '100vh',
      backgroundColor: 'transparent',
      display: 'flex',
      flexDirection: 'row',
    },
    page: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#010203',
      backgroundImage: `radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 10px),
      radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 2px),
      radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 10px),
      radial-gradient(rgba(255,255,255,.4), rgba(255,255,255,.1) 2px, transparent 5px)`,
      backgroundSize: '550px 550px, 350px 350px, 250px 250px, 150px 150px',
      minWidth: '100%',
    },
  })
);

export default function KanBan() {
  const [items, setItems] = useState<Map<string, string[]>>(new Map());
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [colName, setColName] = useState('');

  const [selectedEntry, setSelectedEntry] = useState(-1);
  const [showSelectedEntry, setShowSelectedEntry] = useState(false);

  const classes = useStyles();
  const dispatch = useDispatch();
  const columns = useSelector(getColumnNames);
  const entries = useSelector(getEntries);

  function addE(name: string) {
    const nextId = entries.length + 1;
    const d = new Date();
    const toAdd = `${nextId},DefaultTitle,DefaultSub,DefaultDesc,Other,${d.getFullYear()}-${`${
      d.getMonth() + 1
    }`.padStart(2, '0')}-${d.getDate()}T12:00,${name},${0}`;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const tmp: string[] = items.get(name)!;
    setItems(new Map(items.set(name, tmp.concat([toAdd]))));
    dispatch(addEntry(toAdd));
  }

  function addC(name: string) {
    if (!items.has(name)) {
      setItems(new Map(items.set(name, [])));
      dispatch(addColumn(name));
    }
  }

  function removeC(name: string) {
    items.delete(name);
    setItems(new Map(items));
    dispatch(removeColumn(name));
  }

  function removeE(name: string) {
    dispatch(removeEntry(name));
  }

  function openCardInfo(info: string) {
    setSelectedEntry(entries.indexOf(info));
    setShowSelectedEntry(true);
  }

  const handleClickOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleSettingsClickOpen = useCallback(() => {
    setSettingsOpen(true);
  }, []);

  const handleSettingsClose = useCallback(() => {
    setSettingsOpen(false);
  }, []);

  const handleClose = () => {
    setColName('');
    setOpen(false);
  };

  const handleCreate = () => {
    addC(colName);
    handleClose();
  };

  const handleEntryClose = () => {
    setSelectedEntry(-1);
    setShowSelectedEntry(false);
  };

  const handleEntrySave = (index: number, newEntry: string) => {
    dispatch(replaceEntry([index, newEntry]));
    handleEntryClose();
  };

  useEffect(() => {
    columns.forEach((col) => {
      setItems(
        new Map(
          items.set(
            col,
            entries.filter((e) => e.split(',')[6] === col)
          )
        )
      );
    });
  }, [entries]);

  function onDragEnd(result: DragProps) {
    const { type, source, destination } = result;

    if (!destination) return;

    if (type === 'ENTRY') {
      const sInd: any = source.droppableId;
      const dInd: any = destination.droppableId;

      if (sInd === dInd) {
        const i: any = reorder(
          items.get(sInd),
          source.index,
          destination.index
        );
        setItems(new Map(items.set(sInd, i)));
      } else {
        const res: Record<string, string[]> = move(
          sInd,
          dInd,
          items.get(sInd),
          items.get(dInd),
          source,
          destination
        );
        const tmp = items;
        tmp.set(sInd, res[sInd]);
        tmp.set(dInd, res[dInd]);

        setItems(new Map(tmp));
      }
      dispatch(setEntries([Array.from(items.values()).flat(), true]));
    } else if (type === 'COLS') {
      const s: any = reorder(columns, source.index, destination.index);

      dispatch(setColumns([s, true]));
    }
  }

  return (
    <div className={classes.page}>
      <RowDiv style={{ color: 'white' }}>
        <Button
          variant="contained"
          color="primary"
          style={{
            margin: '10px',
            maxWidth: 'max-content',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
          onClick={handleClickOpen}
        >
          <AddCircleIcon style={{ marginRight: '10px' }} />
          Add another column
        </Button>
        <IconButton
          color="inherit"
          size="small"
          onClick={handleSettingsClickOpen}
        >
          <SettingsIcon />
        </IconButton>
      </RowDiv>
      <ScrollContainer
        className="scroll-container"
        horizontal
        hideScrollbars
        vertical={false}
      >
        <DragDropContext id="le-board" onDragEnd={onDragEnd}>
          <Droppable droppableId="board" type="COLS" direction="horizontal">
            {(provided) => (
              <div
                className={classes.root}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {columns.map((c, index) => (
                  <ColumnCard
                    key={c}
                    name={c}
                    entries={items.get(c)}
                    addE={addE}
                    removeC={removeC}
                    index={index}
                    openCardInfo={openCardInfo}
                    removeE={removeE}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </ScrollContainer>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          <DialogContentText>Add Another Column</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Column Name"
            fullWidth
            value={colName}
            onChange={(e) => setColName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreate} color="primary">
            Create
          </Button>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <EditEntry
        index={selectedEntry}
        entry={selectedEntry !== -1 ? entries[selectedEntry] : ''}
        handleEntryClose={handleEntryClose}
        showSelectedEntry={showSelectedEntry}
        handleEntrySave={handleEntrySave}
      />
      <SettingsDialog
        showSettings={settingsOpen}
        handleSettingsClose={handleSettingsClose}
      />
    </div>
  );
}
