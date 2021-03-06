import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
// eslint-disable-next-line import/no-cycle
import profileReducer from './features/profile/profileSlice';
// eslint-disable-next-line import/no-cycle
import kanbanReducer from './features/kanban/kanbanSlice';
// eslint-disable-next-line import/no-cycle
import snackbarReducer from './components/Snackbar/snackBarSlice';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    profile: profileReducer,
    kanban: kanbanReducer,
    snackbar: snackbarReducer,
  });
}
