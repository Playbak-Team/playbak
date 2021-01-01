import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Home from '../components/Home/Home';
import Navbar from '../components/Navbar/Navbar';
import Loader from '../components/Loader/Loader';
import {
  getName,
  setCourses,
  setProfile,
} from '../features/profile/profileSlice';

import { Settings } from '../interfaces';

const { ipcRenderer } = window.require('electron');

export default function HomePage() {
  const [isLoading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const name = useSelector(getName);
  // const workspace = useSelector(getCurrentTerm);

  useEffect(() => {
    ipcRenderer.on('return-courses', (_, courses: string[]) => {
      dispatch(setCourses(Object.values(courses)));
      setLoading(false);
    });

    ipcRenderer.on('return-settings', (_event, settings: Settings) => {
      dispatch(
        setProfile({
          name: settings.name,
          selectedWorkspace: settings.LST,
          availableWorkspaces: Object.values(settings.AWKS),
          courses: settings.courses,
          links: [],
        })
      );

      if (settings.LST !== '') {
        ipcRenderer.send('get-courses', settings.LST);
      } else {
        setLoading(false);
      }
    });
    return () => {
      ipcRenderer.removeAllListeners('return-courses');
      ipcRenderer.removeAllListeners('return-settings');
    };
  }, [dispatch]);

  useEffect(() => {
    ipcRenderer.send('init');
  }, []);

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Navbar />
          <Home name={name} />
        </div>
      )}
    </div>
  );
}
