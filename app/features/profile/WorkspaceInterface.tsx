/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  makeStyles,
  withStyles,
  createStyles,
  Theme,
} from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { WorkspaceInterfaceProps } from '../../types';
import { getCurrentCourses, addCourse } from './profileSlice';
import { showSuccess, showError } from '../video/videoSlice';

interface TabPanelProps {
  // eslint-disable-next-line react/require-default-props
  children?: React.ReactNode;
  index: any;
  value: any;
}

interface StyledTabsProps {
  value: number;
  onChange: (event, newValue: number) => void;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-prevent-tabpanel-${index}`}
      aria-labelledby={`scrollable-prevent-tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}

const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > span': {
      maxWidth: 60,
      width: '100%',
      backgroundColor: 'white',
    },
  },
})((props: StyledTabsProps) => (
  <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />
));

interface StyledTabProps {
  label: string;
}

const StyledTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      textTransform: 'none',
      color: '#fff',
      fontWeight: theme.typography.fontWeightRegular,
      fontSize: theme.typography.pxToRem(15),
      marginRight: theme.spacing(1),
      '&:focus': {
        opacity: 1,
      },
    },
  })
)((props: StyledTabProps) => <Tab disableRipple {...props} />);

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
      width: '100%',
      backgroundColor: '#2e1534',
    },
    noworkspace: {
      color: 'black',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      display: 'flex',
      flexDirection: 'row',
      color: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: '100%',
      marginBottom: '20px',
      paddingBottom: '20px',
    },
  })
);

const NoWorkspacePrompt = () => {
  const classes = useStyles();
  return <div className={classes.noworkspace}>Please activate a workspace</div>;
};

const CourseUI = () => {
  const courses = useSelector(getCurrentCourses);
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (_event, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <StyledTabs
        value={value}
        onChange={handleChange}
        aria-label="styled tabs"
      >
        {courses.map((v) => (
          <StyledTab key={v} label={v}>
            <div>x foking d</div>
          </StyledTab>
        ))}
      </StyledTabs>

      {courses.map((v, k) => (
        <TabPanel value={value} key={v} index={k}>
          <div style={{ margin: '15px' }}>{v}</div>
        </TabPanel>
      ))}
    </div>
  );
};

const WorkspaceInfo = (props: { title: string }) => {
  const { title } = props;
  const [open, setOpen] = useState(false);
  const [courseName, setCourseName] = useState('');
  const classes = useStyles();
  const dispatch = useDispatch();
  const courses = useSelector(getCurrentCourses);

  function handleClose(value: string) {
    if (value !== '' && !courses.includes(value)) {
      dispatch(showSuccess(`Added course ${value} to the current workspace`));
      dispatch(addCourse(value));
    } else {
      dispatch(showError(`course ${value} already exists`));
    }
    setOpen(false);
  }

  return (
    <div>
      <div className={classes.title}>
        <h2 style={{ alignSelf: 'center', marginLeft: 'auto' }}>{title}</h2>
        <Button
          variant="outlined"
          color="secondary"
          style={{
            alignSelf: 'flex-end',
            marginLeft: 'auto',
            marginRight: '15px',
          }}
          onClick={() => setOpen(true)}
        >
          Add a course
        </Button>
        <Dialog open={open} aria-labelledby="form-dialog-title">
          <DialogContent>
            <DialogContentText>Enter a name for this course</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Workspace"
              fullWidth
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleClose(courseName)} color="primary">
              Create
            </Button>
            <Button onClick={() => handleClose('')} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <CourseUI />
      </div>
    </div>
  );
};

export default function WorkspaceInterface(props: WorkspaceInterfaceProps) {
  const { workspace } = props;
  return (
    <div style={{ padding: '20px 20px 20px 10px' }}>
      {workspace === '' ? (
        <NoWorkspacePrompt />
      ) : (
        <WorkspaceInfo title={workspace} />
      )}
    </div>
  );
}
