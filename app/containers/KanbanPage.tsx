import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ipcRenderer } from 'electron';
import { getCurrentTerm } from '../features/profile/profileSlice';
import { setColumns, setEntries } from '../features/kanban/kanbanSlice';
import Kanban from '../features/kanban/Kanban';
import Navbar from '../components/Navbar/Navbar';
import Loader from '../components/Loader/Loader';

export default function ProfilePage() {
  const [isLoading, setLoading] = useState(true);
  const workspace = useSelector(getCurrentTerm);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoading) {
      ipcRenderer.send('load-kanban', workspace);
    }
    ipcRenderer.on('kanban-data', (_event: any, res: any) => {
      dispatch(setColumns(res[0]));
      dispatch(setEntries(res[1]));
      setLoading(false);
    });
  }, [isLoading, workspace]);

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Navbar />
          <Kanban />
        </div>
      )}
    </div>
  );
}
