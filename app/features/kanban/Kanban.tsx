/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
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
import { DragProps } from '../../types';
import {
  getColumnNames,
  getEntries,
  addEntry,
  addColumn,
  removeColumn,
  setColumns,
  replaceEntry,
  setEntries,
} from './kanbanSlice';
import EditEntry from './EditEntry';
import ColumnCard from './ColumnCard';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: 'max-content',
      minWidth: '100%',
      height: '100vh',
      backgroundColor: 'rgb(38, 132, 255)',
      display: 'flex',
      flexDirection: 'row',
    },
    page: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'rgb(38, 132, 255)',
      width: 'max-content',
      minWidth: '100%',
    },
  })
);

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (
  sourceString,
  destinationString,
  source,
  destination,
  droppableSource,
  droppableDestination
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed]: any = sourceClone.splice(droppableSource.index, 1);

  const ind = removed.lastIndexOf(sourceString);

  const [ret] = [removed.substring(0, ind) + destinationString];

  destClone.splice(droppableDestination.index, 0, ret);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

export default function KanBan() {
  const [items, setItems] = useState<Map<string, string[]>>(new Map());
  const [open, setOpen] = useState(false);
  const [colName, setColName] = useState('');

  const [selectedEntry, setSelectedEntry] = useState(-1);
  const [showSelectedEntry, setShowSelectedEntry] = useState(false);

  const classes = useStyles();
  const dispatch = useDispatch();
  const columns = useSelector(getColumnNames);
  const entries = useSelector(getEntries);

  function addE(name: string) {
    const nextId = entries.length + 1;
    const toAdd = `${nextId},tt,tt,tt,tt,Dec 30 2020,${name}`;
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

  function openCardInfo(info: string) {
    setSelectedEntry(entries.indexOf(info));
    setShowSelectedEntry(true);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

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
      <DragDropContext onDragEnd={onDragEnd}>
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
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <EditEntry
        index={selectedEntry}
        entry={selectedEntry !== -1 ? entries[selectedEntry] : ''}
        handleEntryClose={handleEntryClose}
        showSelectedEntry={showSelectedEntry}
        handleEntrySave={handleEntrySave}
      />
    </div>
  );
}
