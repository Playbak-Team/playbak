/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import { LabelSelectorDiv, LabelRectDiv } from './styledComponents';
import { getCurrentCourses } from '../profile/profileSlice';

const LabelRect = (props) => {
  const { name, label, setLabel } = props;
  return (
    <LabelRectDiv
      bgColor={localStorage.getItem(name)}
      tabIndex={0}
      role="button"
      onClick={() => setLabel(name)}
    >
      {name}
      {name === label && <div>✓</div>}
    </LabelRectDiv>
  );
};

const LabelSelector = (props) => {
  const { label, setLabel } = props;
  const courses = useSelector(getCurrentCourses);
  return (
    <>
      <Paper
        style={{
          maxWidth: '80%',
          overflow: 'hidden',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '10px',
        }}
      >
        <div style={{ alignSelf: 'center', justifySelf: 'center' }}>Label</div>
        <LabelSelectorDiv>
          {courses.map((course) => (
            <LabelRect
              key={course}
              name={course}
              label={label}
              setLabel={setLabel}
            />
          ))}
        </LabelSelectorDiv>
      </Paper>
    </>
  );
};

export default LabelSelector;

LabelSelector.propTypes = {
  label: PropTypes.string,
  setLabel: PropTypes.func.isRequired,
};

LabelSelector.defaultProps = {
  label: 'Other',
};

LabelRect.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  setLabel: PropTypes.func.isRequired,
};

LabelRect.defaultProps = {
  name: '',
  label: 'Other',
};
