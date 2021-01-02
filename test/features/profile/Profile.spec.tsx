/* eslint react/jsx-props-no-spreading: off, @typescript-eslint/ban-ts-comment: off */
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { BrowserRouter as Router } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Profile from '../../../app/features/profile/Profile';
import * as profileSlice from '../../../app/features/profile/profileSlice';

Enzyme.configure({ adapter: new Adapter() });
jest.useFakeTimers();

function setup(
  preloadedState: {
    profile: {
      name: string;
      selectedWorkspace: string;
      availableWorkspaces: string[];
      courses: string[];
      links: string[];
    };
  } = {
    profile: {
      name: 'bob',
      selectedWorkspace: 'F20',
      availableWorkspaces: ['F20', 'W21', 'S21', 'F21'],
      courses: ['CS341', 'CS350'],
      links: [],
    },
  }
) {
  const store = configureStore({
    reducer: { profile: profileSlice.default },
    preloadedState,
  });

  const getWrapper = () =>
    mount(
      <Provider store={store}>
        <Router>
          <Profile />
        </Router>
      </Provider>
    );
  const component = getWrapper();
  return {
    store,
    component,
    buttons: component.find('button'),
    name: component.find('#user-name'),
    currentTerm: component.find('#current-term'),
    currentTermTop: component.find('#display-selected-term'),
  };
}

describe('Profile component', () => {
  it('name should be correct', () => {
    const { name } = setup();
    expect(name.text()).toMatch(/^bob$/);
  });
  it('current selected term should be correct', () => {
    const { currentTerm } = setup();
    expect(currentTerm.text()).toMatch(/^F20$/);
  });
  it('current selected term title should be correct', () => {
    const { currentTermTop } = setup();
    expect(currentTermTop.text()).toMatch(/^F20$/);
  });
  it('should match exact snapshot', () => {
    const { store } = setup();
    const tree = renderer
      .create(
        <Provider store={store}>
          <Router>
            <Profile />
          </Router>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
