import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { BrowserRouter as Router } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Kanban from '../../../app/features/kanban/Kanban';
import * as kanbanSlice from '../../../app/features/kanban/kanbanSlice';
import { KanbanStateInterface } from '../../../app/interfaces';

Enzyme.configure({ adapter: new Adapter() });

function setup(
  preloadedState: {
    kanban: KanbanStateInterface;
  } = {
    kanban: {
      columns: ['todo', 'inprogress', 'done'],
      entries: [
        '1,title1,subtitle1,desc1,label1,Dec 30 2020,todo',
        '2,title2,subtitle2,desc2,label2,Dec 30 2020,todo',
        '3,title3,subtitle3,desc3,label3,Dec 30 2020,todo',
      ],
    },
  }
) {
  const store = configureStore({
    reducer: { kanban: kanbanSlice.default },
    preloadedState,
  });

  const getWrapper = () =>
    mount(
      <Provider store={store}>
        <Router>
          <Kanban />
        </Router>
      </Provider>
    );
  const component = getWrapper();
  return {
    store,
    component,
    buttons: component.find('button'),
  };
}

describe('Kanban component', () => {
  it('there should be a button that creates a new column', () => {
    const { buttons } = setup();
    expect(buttons.at(0).text()).toMatch('Add another column');
  });
  it('remove todo column calls removeColumn', () => {
    const { buttons } = setup();
    const removeColSpy = jest.spyOn(kanbanSlice, 'removeColumn');

    buttons.at(1).simulate('click');
    expect(removeColSpy).toBeCalled();
    removeColSpy.mockRestore();
  });
  it('remove todo entry calls removeEntry', () => {
    const { buttons } = setup();
    const removeEntrySpy = jest.spyOn(kanbanSlice, 'removeEntry');

    buttons.at(3).simulate('click');
    expect(removeEntrySpy).toBeCalled();
    removeEntrySpy.mockRestore();
  });
  it('should match exact snapshot', () => {
    const { store } = setup();
    const tree = renderer
      .create(
        <Provider store={store}>
          <Router>
            <Kanban />
          </Router>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
