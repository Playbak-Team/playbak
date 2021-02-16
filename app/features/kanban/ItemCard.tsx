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
import { LabelDiv, CardDiv } from './styledComponents';
import { getUrgencyColor, getItemStyle } from './utils';

const useStyles = makeStyles(() =>
  createStyles({
    entry: {
      backgroundColor: 'white',
      maxWidth: '90%',
      minHeight: '70px',
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
      marginTop: '-5px',
    },
  })
);

const ItemCard = (props: EntryCardProps) => {
  const {
    og,
    id,
    title,
    label,
    duedate,
    index,
    openCardInfo,
    removeE,
    completed,
  } = props;
  const classes = useStyles();
  const [urgent, setUrgent] = useState(false);
  const [overdue, setOverdue] = useState(false);

  useEffect(() => {
    const today = new Date();
    const due = new Date(duedate);

    setUrgent((due.getTime() - today.getTime()) / 3600000 <= 24);
    setOverdue(due.getTime() < today.getTime());
  }, [duedate]);

  return (
    <div>
      <Draggable
        id="draggable-card"
        key={id}
        draggableId={id.toString()}
        index={index}
      >
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
              <CardDiv>
                <LabelDiv
                  bgColor={
                    localStorage.getItem(label)
                      ? localStorage.getItem(label)
                      : '#000000'
                  }
                >
                  {label}
                </LabelDiv>
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
              </CardDiv>
              <h3 className={classes.cardEntryTitle}>{title}</h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: '15px',
                  backgroundColor: getUrgencyColor(urgent, overdue, completed),
                  maxWidth: 'max-content',
                  padding: '3px',
                  borderRadius: '3px',
                }}
              >
                <ScheduleIcon style={{ marginRight: '5px' }} />
                {duedate.replace('T', ' | ')}
              </div>
            </div>
          </div>
        )}
      </Draggable>
    </div>
  );
};

export default ItemCard;
