import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ipcRenderer } from 'electron';
import ScrollContainer from 'react-indiana-drag-scroll';
import { getCurrentTerm } from '../features/profile/profileSlice';
import { setColumns, setEntries } from '../features/kanban/kanbanSlice';
import Kanban from '../features/kanban/Kanban';
import Navbar from '../components/Navbar/Navbar';
import Loader from '../components/Loader/Loader';

export default function KanbanPage() {
  const [isLoading, setLoading] = useState(true);
  const workspace = useSelector(getCurrentTerm);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoading) {
      ipcRenderer.send('load-kanban', workspace);
    }
    ipcRenderer.on('kanban-data', (_event, res: [string[], string[]]) => {
      dispatch(setColumns([res[0], false]));
      dispatch(setEntries([res[1], false]));
      setLoading(false);
    });
  }, [isLoading, workspace, dispatch]);

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div style={{ overflow: 'hidden' }}>
          <Navbar />
          <ScrollContainer
            className="scroll-container"
            horizontal
            hideScrollbars
            vertical={false}
          >
            <Kanban />
          </ScrollContainer>
        </div>
      )}
    </div>
  );
}
