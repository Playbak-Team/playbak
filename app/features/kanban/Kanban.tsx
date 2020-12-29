/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type {
  DroppableProvided,
  DroppableStateSnapshot,
} from 'react-beautiful-dnd';
import AddIcon from '@material-ui/icons/Add';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import ScheduleIcon from '@material-ui/icons/Schedule';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { ipcRenderer } from 'electron';
import { ColumnDivProps, EntryCardProps, DragProgs } from '../../types';
import {
  getColumnNames,
  getEntries,
  addEntry,
  addColumn,
  removeColumn,
  setColumns,
} from './kanbanSlice';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: 'rgb(38, 132, 255)',
      display: 'flex',
      flexDirection: 'row',
    },
    page: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'rgb(38, 132, 255)',
    },
    col: {
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '60vh',
      backgroundColor: 'rgb(235,236,240)',
      margin: '20px',
      borderRadius: '5px',
      minWidth: '15vw',
    },
    coltitle: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: '12px',
      borderRadius: '5px 5px 5px 5px',
      color: '#171D20',
      maxHeight: 'max-content',
    },
    containerparent: {
      minWidth: '87%',
      minHeight: '60vh',
      maxHeight: '60vh',
      overflow: 'hidden',
      position: 'relative',
      padding: '10px',
      backgroundColor: 'rgb(235,236,240)',
      borderRadius: '0px 0px 5px 5px',
    },
    container: {
      overflowY: 'scroll',
      backgroundColor: 'rgb(235,236,240)',
      position: 'absolute',
      top: '0px',
      bottom: '0px',
      left: '0px',
      right: '-17px',
      color: '#171D20',
      borderRadius: '3px',
    },
    entriescontainer: {
      minWidth: '87%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '0px 0px 5px 5px',
    },
    entry: {
      backgroundColor: 'white',
      maxWidth: '85%',
      minHeight: '50px',
      maxHeight: 'max-content',
      margin: '10px',
      padding: '10px',
      borderRadius: '3px',
      boxShadow: '2px 2px 1px #ccc',
    },
    entryInner: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    cardEntryTitle: {
      color: 'black',
      margin: '0',
    },
  })
);

const getColStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',

  backgroundColor: isDragging ? 'green' : '#FFCF99',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',

  // change background colour if dragging
  background: isDragging ? '#97CBFF' : 'white',

  border: isDragging ? '2px solid black' : 'none',

  // styles we need to apply on draggables
  ...draggableStyle,
});

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

const EntryCard = (props: EntryCardProps) => {
  const {
    og,
    id,
    title,
    subtitle,
    description,
    label,
    duedate,
    belongsto,
    index,
    openCardInfo,
  } = props;
  const classes = useStyles();
  const [urgent, setUrgent] = useState(false);

  useEffect(() => {
    const today = new Date();
    const due = new Date(duedate);

    if ((due.getTime() - today.getTime()) / 3600000 <= 24) {
      setUrgent(true);
    }
  }, []);

  return (
    <div>
      <Draggable key={id} draggableId={id.toString()} index={index}>
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={classes.entry}
            style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style
            )}
          >
            <div className={classes.entryInner}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <h3 className={classes.cardEntryTitle}>{title}</h3>
                <IconButton
                  onClick={() => openCardInfo(og)}
                  style={{ marginTop: '-10px', marginRight: '-10px' }}
                >
                  <EditIcon color="secondary" />
                </IconButton>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: '10px',
                  backgroundColor: urgent ? '#FF8484' : 'transparent',
                  maxWidth: 'max-content',
                  padding: '3px',
                  borderRadius: '3px',
                }}
              >
                <ScheduleIcon style={{ marginRight: '5px' }} />
                {duedate}
              </div>
            </div>
          </div>
        )}
      </Draggable>
    </div>
  );
};

// const grid = 8;

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : 'rgb(235,236,240)',
});

const ColumnCard = (props: ColumnDivProps) => {
  const { name, entries, addE, removeC, index, openCardInfo } = props;
  const classes = useStyles();

  return (
    <Draggable draggableId={`${name}`} index={index}>
      {(p2, s2) => (
        <div
          ref={p2.innerRef}
          {...p2.draggableProps}
          {...p2.dragHandleProps}
          className={classes.col}
          style={getColStyle(s2.isDraggingOver, p2.draggableProps.style)}
        >
          <div className={classes.coltitle}>
            <h3>{name}</h3>
            <IconButton onClick={() => removeC(name)}>
              <DeleteForeverIcon />
            </IconButton>
          </div>
          <Droppable key={name} droppableId={`${name}`} type="ENTRY">
            {(
              provided: DroppableProvided,
              snapshot: DroppableStateSnapshot
            ) => (
              <div className={classes.containerparent}>
                <div
                  className={classes.container}
                  style={getListStyle(snapshot.isDraggingOver)}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <div className={classes.entriescontainer}>
                    {entries !== undefined ? (
                      entries
                        .filter((ob) => ob.split(',')[6] === name)
                        .map((ob, i2) => (
                          <div key={ob.split(',')[0]}>
                            <EntryCard
                              og={ob}
                              id={parseInt(ob.split(',')[0], 10)}
                              title={ob.split(',')[1]}
                              subtitle={ob.split(',')[2]}
                              description={ob.split(',')[3]}
                              label={ob.split(',')[4]}
                              duedate={ob.split(',')[5]}
                              belongsto={ob.split(',')[6]}
                              index={i2}
                              openCardInfo={openCardInfo}
                            />
                          </div>
                        ))
                    ) : (
                      <div />
                    )}
                  </div>
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
          <Button
            variant="contained"
            color="primary"
            style={{
              margin: '10px',
              minWidth: '90%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
            }}
            onClick={() => addE(name)}
          >
            <AddIcon style={{ marginRight: '5px' }} />
            Add another card
          </Button>
        </div>
      )}
    </Draggable>
  );
};

export default function KanBan() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [items, setItems] = useState<Map<string, string[] | undefined>>(
    new Map()
  );
  const [remountCount, setRemountCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [colName, setColName] = useState('');

  const classes = useStyles();
  const dispatch = useDispatch();
  const columns = useSelector(getColumnNames);
  const entries = useSelector(getEntries);

  function addE(name: string) {
    const nextId = entries.length + 1;
    const toAdd = `${nextId},tt,tt,tt,tt,Dec 30 2020,${name}`;
    setItems(new Map(items.set(name, items.get(name)?.concat([toAdd]))));
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
    console.log(info);
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
    ipcRenderer.on('save-cols-done', (_event: any, res: any) => {
      console.log(res);
    });
  }, []);

  function onDragEnd(result: DragProgs) {
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

        setItems(new Map(items.set(sInd, res[sInd])));
        setItems(new Map(items.set(dInd, res[dInd])));
      }
    } else if (type === 'COLS') {
      const s: any = reorder(columns, source.index, destination.index);

      dispatch(setColumns(s));
    }
  }

  return (
    <div>
      {isLoading ? (
        <div />
      ) : (
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
              {(provided, snapshot) => (
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
        </div>
      )}
    </div>
  );
}
