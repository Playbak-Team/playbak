import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../store';
import { ProfileStateInterface } from '../../interfaces';

const initialState: ProfileStateInterface = {
  selectedWorkspace: '',
  availableWorkspaces: [],
  courses: [],
  links: [],
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setWorkspace: (state, action: PayloadAction<string>) => {
      state.selectedWorkspace = action.payload;
    },
    setAvailableWorkspaces: (state, action: PayloadAction<string[]>) => {
      state.availableWorkspaces = action.payload;
    },
    addCourse: (state, action: PayloadAction<string[]>) => {
      state.courses.push(action.payload[0]);
      state.links.push(action.payload[1]);
      // workSpacesDB.update(
      //   { term: state.selectedWorkspace },
      //   { $set: { courses: state.courses, links: state.links } }
      // );
    },
  },
});

export const {
  addCourse,
  setAvailableWorkspaces,
  setWorkspace,
} = profileSlice.actions;

export default profileSlice.reducer;

export const getCurrentTerm = (state: RootState) =>
  state.profile.selectedWorkspace;

export const getCurrentCourses = (state: RootState) => state.profile.courses;

export const getCurrentCoursesLinks = (state: RootState) => state.profile.links;

export const getAllWorkspaces = (state: RootState) =>
  state.profile.availableWorkspaces;
