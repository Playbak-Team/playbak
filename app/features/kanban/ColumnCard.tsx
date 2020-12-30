/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import type {
  DroppableProvided,
  DroppableStateSnapshot,
} from 'react-beautiful-dnd';
import AddIcon from '@material-ui/icons/Add';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import IconButton from '@material-ui/core/IconButton';
import { ColumnDivProps } from '../../types';
import ItemCard from './ItemCard';

const useStyles = makeStyles(() =>
  createStyles({
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
  })
);

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : 'rgb(235,236,240)',
});

const getColStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',

  backgroundColor: isDragging ? 'green' : '#FFCF99',

  // styles we need to apply on draggables
  ...draggableStyle,
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
                            <ItemCard
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

export default ColumnCard;
