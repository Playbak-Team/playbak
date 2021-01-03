import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ipcRenderer } from 'electron';
import ScrollContainer from 'react-indiana-drag-scroll';
import { getCurrentTerm } from '../features/profile/profileSlice';
import { setColumns, setEntries } from '../features/kanban/kanbanSlice';
import Kanban from '../features/kanban/Kanban';
import Loader from '../components/Loader/Loader';

const EmptyPage = () => {
  return (
    <div
      style={{
        minWidth: '100vw',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        color: 'white',
        overflow: 'hidden',
      }}
    >
      Please select a workspace before using this feature
    </div>
  );
};

export default function KanbanPage() {
  const [isLoading, setLoading] = useState(true);
  const workspace = useSelector(getCurrentTerm);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoading && workspace !== '') {
      ipcRenderer.send('load-kanban', workspace);
    }
    ipcRenderer.on('kanban-data', (_event, res: [string[], string[]]) => {
      dispatch(setColumns([res[0], false]));
      dispatch(setEntries([res[1], false]));
      setLoading(false);
    });
    return () => {
      ipcRenderer.removeAllListeners('kanban-data');
    };
  }, [isLoading, workspace, dispatch]);

  return (
    <div>
      {isLoading ? (
        <div>{workspace !== '' ? <Loader /> : <EmptyPage />}</div>
      ) : (
        <div style={{ overflow: 'hidden' }}>
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
