/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Draggable } from 'react-beautiful-dnd';
import type {
  DroppableProvided,
  DroppableStateSnapshot,
} from 'react-beautiful-dnd';
import EditIcon from '@material-ui/icons/Edit';
import ScheduleIcon from '@material-ui/icons/Schedule';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import IconButton from '@material-ui/core/IconButton';
import { EntryCardProps } from '../../types';

const useStyles = makeStyles(() =>
  createStyles({
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

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',

  // change background colour if dragging
  background: isDragging ? '#97CBFF' : 'white',

  border: isDragging ? '2px solid black' : 'none',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const ItemCard = (props: EntryCardProps) => {
  const { og, id, title, duedate, index, openCardInfo, removeE } = props;
  const classes = useStyles();
  const [urgent, setUrgent] = useState(false);

  useEffect(() => {
    const today = new Date();
    const due = new Date(duedate);

    if ((due.getTime() - today.getTime()) / 3600000 <= 24) {
      setUrgent(true);
    } else {
      setUrgent(false);
    }
  }, [duedate]);

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
                <div>
                  <IconButton
                    onClick={() => openCardInfo(og)}
                    style={{ marginTop: '-10px', marginRight: '-10px' }}
                  >
                    <EditIcon color="secondary" />
                  </IconButton>
                  <IconButton
                    onClick={() => removeE(og)}
                    style={{ marginTop: '-10px', marginRight: '-10px' }}
                  >
                    <HighlightOffIcon />
                  </IconButton>
                </div>
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

export default ItemCard;
