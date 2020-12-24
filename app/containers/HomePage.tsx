import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Home from '../components/Home/Home';
import Navbar from '../components/Navbar/Navbar';
import Loader from '../components/Loader/Loader';
import { getName } from '../features/profile/profileSlice';

export default function HomePage() {
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const name = useSelector(getName);

  // useEffect(() => {
  //   dispatch(setWorkspace(LST));
  //   setLoading(false);
  // }, [LST, dispatch]);

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
