import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Home from '../components/Home/Home';
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
  const [quote, setQuote] = useState('');
  const dispatch = useDispatch();
  const name = useSelector(getName);
  // const workspace = useSelector(getCurrentTerm);

  async function getQuote() {
    const url = 'https://api.quotable.io/random';
    const response = await fetch(url);
    const data = await response.json();
    return data.content;
  }

  useEffect(() => {
    ipcRenderer.on('return-courses', async (_, courses: string[]) => {
      dispatch(setCourses(Object.values(courses)));
      const q = await getQuote();
      setQuote(q);
      setLoading(false);
    });

    ipcRenderer.on('return-settings', async (_event, settings: Settings) => {
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
        const q = await getQuote();
        setQuote(q);
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
          <Home name={name} quote={quote} />
        </div>
      )}
    </div>
  );
}
