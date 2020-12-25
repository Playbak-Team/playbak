import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Home from '../components/Home/Home';
import Navbar from '../components/Navbar/Navbar';
import Loader from '../components/Loader/Loader';
import {
  getName,
  setCourses,
  getCurrentTerm,
  saveSettings,
} from '../features/profile/profileSlice';

const { ipcRenderer } = window.require('electron');

export default function HomePage() {
  const [isLoading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const name = useSelector(getName);
  const workspace = useSelector(getCurrentTerm);

  useEffect(() => {
    if (workspace !== '') {
      ipcRenderer.send('get-courses', workspace);
    } else {
      setLoading(false);
    }
  }, [workspace]);

  useEffect(() => {
    ipcRenderer.on('return-courses', (_event: any, courses: string[]) => {
      dispatch(setCourses(Object.values(courses)));
      setLoading(false);
    });
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
