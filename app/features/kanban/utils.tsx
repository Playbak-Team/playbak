export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const move = (
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

  const [ret] = [
    `${removed.substring(0, ind)}${destinationString},${removed.substring(
      removed.length - 1
    )}`,
  ];

  destClone.splice(droppableDestination.index, 0, ret);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

export const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : 'rgb(235,236,240)',
});

export const getColStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',

  backgroundColor: isDragging ? 'green' : '#FFCF99',

  // styles we need to apply on draggables
  ...draggableStyle,
});

export const getUrgencyColor = (
  urgent: boolean,
  overdue: boolean,
  completed: string
) => {
  if (parseInt(completed, 10)) return '#66bb6a';
  if (overdue) return '#FF8484';
  if (urgent) return '#f2d600';
  return 'transparent';
};

export const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',

  // change background colour if dragging
  background: isDragging ? '#97CBFF' : 'white',

  border: isDragging ? '2px solid black' : 'none',

  // styles we need to apply on draggables
  ...draggableStyle,
});
export const colors = {
  green: '#66bb6a',
};
