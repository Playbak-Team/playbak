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
import IconButton from '@material-ui/core/IconButton';
import {
  getColumnNames,
  getEntries,
  addEntry,
  addColumn,
  removeColumn,
} from './kanbanSlice';
import { ColumnDivProps, EntryCardProps, DragProgs } from '../../types';

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
    },
    coltitle: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: '10px',
    },
    containerparent: {
      minWidth: '15vw',
      maxWidth: '15vw',
      minHeight: '60vh',
      maxHeight: '60vh',
      overflow: 'hidden',
      position: 'relative',
      margin: '10px',
      borderRadius: '3px',
      backgroundColor: 'rgb(235,236,240)',
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
      minWidth: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    entry: {
      backgroundColor: 'white',
      width: '85%',
      minHeight: '100px',
      margin: '10px',
      padding: '10px',
      borderRadius: '3px',
      boxShadow: '10px 10px 5px #ccc',
    },
    entryInner: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
  })
);

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
    id,
    title,
    subtitle,
    description,
    label,
    duedate,
    belongsto,
    index,
  } = props;
  const classes = useStyles();

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
            {title}
            <div className={classes.entryInner}>{id}</div>
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
  const { name, entries, addE, removeC } = props;
  const classes = useStyles();

  return (
    <Droppable key={name} droppableId={`${name}`}>
      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
        <div className={classes.col}>
          <div className={classes.coltitle}>
            <h3>{name}</h3>
            <IconButton onClick={() => removeC(name)}>
              <DeleteForeverIcon />
            </IconButton>
          </div>
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
                    .map((ob, index) => (
                      <div key={ob.split(',')[0]}>
                        <EntryCard
                          id={parseInt(ob.split(',')[0], 10)}
                          title={ob.split(',')[1]}
                          subtitle={ob.split(',')[2]}
                          description={ob.split(',')[3]}
                          label={ob.split(',')[4]}
                          duedate={ob.split(',')[5]}
                          belongsto={ob.split(',')[6]}
                          index={index}
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
    </Droppable>
  );
};

export default function KanBan() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [items, setItems] = useState<Map<string, string[] | undefined>>(
    new Map()
  );
  const [remountCount, setRemountCount] = useState(0);
  const classes = useStyles();
  const dispatch = useDispatch();
  const columns = useSelector(getColumnNames);
  const entries = useSelector(getEntries);

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
  }, []);

  function onDragEnd(result: DragProgs) {
    const { source, destination } = result;

    if (!destination) return;

    const sInd: any = source.droppableId;
    const dInd: any = destination.droppableId;

    if (sInd === dInd) {
      const i: any = reorder(items.get(sInd), source.index, destination.index);
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
  }

  function addE(name: string) {
    const nextId = entries.length + 1;
    const toAdd = `${nextId},tt,tt,tt,tt,tt,${name}`;
    setItems(new Map(items.set(name, items.get(name)?.concat([toAdd]))));
    dispatch(addEntry(toAdd));
  }

  function addC(name: string) {
    setItems(new Map(items.set(name, [])));
    dispatch(addColumn(name));
  }

  function removeC(name: string) {
    items.delete(name);
    setItems(new Map(items));
    dispatch(removeColumn(name));
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
            onClick={() => addC('elmo')}
          >
            <AddCircleIcon style={{ marginRight: '10px' }} />
            Add another column
          </Button>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className={classes.root}>
              {columns.map((c) => (
                <div key={c}>
                  <ColumnCard
                    name={c}
                    entries={items.get(c)}
                    addE={addE}
                    removeC={removeC}
                  />
                </div>
              ))}
            </div>
          </DragDropContext>
        </div>
      )}
    </div>
  );
}
