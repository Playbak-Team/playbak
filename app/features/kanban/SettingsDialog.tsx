import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { HuePicker } from 'react-color';
import { getCurrentCourses } from '../profile/profileSlice';
import { InnerDialogTitle, SettingsLabelRow } from './styledComponents';
import useLocalStorage from '../../utils/hooks';

const SettingsLblRow = (props) => {
  const { course } = props;
  const [color, setColor] = useLocalStorage<string>(course, '');

  const handleColor = (c) => {
    setColor(c.hex);
  };

  return (
    <SettingsLabelRow>
      {course}
      <HuePicker color={color} onChangeComplete={handleColor} />
    </SettingsLabelRow>
  );
};

const SettingsDialog = (props) => {
  const { handleSettingsClose, showSettings } = props;
  const courses = useSelector(getCurrentCourses);
  const handleCancel = () => {
    handleSettingsClose();
  };

  return (
    <Dialog
      onClose={handleCancel}
      aria-labelledby="customized-dialog-title"
      open={showSettings}
      maxWidth="xl"
    >
      <DialogTitle id="customized-dialog-title">
        <div style={{ color: 'black', margin: '0', padding: '0' }}>
          Settings
        </div>
      </DialogTitle>
      <DialogContent>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: '50vw',
            minHeight: '30vh',
          }}
        >
          <InnerDialogTitle>Labels</InnerDialogTitle>
          {courses.map((course) => (
            <SettingsLblRow key={course} course={course} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;

SettingsDialog.propTypes = {
  handleSettingsClose: PropTypes.func.isRequired,
  showSettings: PropTypes.bool,
};

SettingsDialog.defaultProps = {
  showSettings: false,
};

SettingsLblRow.propTypes = {
  course: PropTypes.string.isRequired,
};
