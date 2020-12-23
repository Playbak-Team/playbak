import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
// eslint-disable-next-line import/no-cycle
import counterReducer from './features/counter/counterSlice';
// eslint-disable-next-line import/no-cycle
import videoReducer from './features/video/videoSlice';
// eslint-disable-next-line import/no-cycle
import profileReducer from './features/profile/profileSlice';
// eslint-disable-next-line import/no-cycle
import dbReducer from './dbSlice';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    video: videoReducer,
    profile: profileReducer,
    counter: counterReducer,
    dbinfo: dbReducer,
  });
}
