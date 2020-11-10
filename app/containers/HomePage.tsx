import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Home from '../components/Home/Home';
import Navbar from '../components/Navbar/Navbar';
import Loader from '../components/Loader/Loader';
import { loadDBData } from '../features/profile/profileSlice';

export default function HomePage() {
  const [isLoading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadDBData());
  }, [dispatch]);

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Navbar />
          <Home />
        </div>
      )}
    </div>
  );
}
