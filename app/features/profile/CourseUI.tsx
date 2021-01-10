/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useCallback, useEffect } from 'react';
import {
  makeStyles,
  withStyles,
  createStyles,
  Theme,
} from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FolderIcon from '@material-ui/icons/Folder';
import Collapse from '@material-ui/core/Collapse';
import CheckIcon from '@material-ui/icons/Check';
import ErrorIcon from '@material-ui/icons/Error';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { ipcRenderer } from 'electron';
import FileList from '../filelist/filelist';
import {
  TabPanelProps,
  StyledTabsProps,
  VideoData,
  FileListUpdateType,
  CourseData,
} from '../../interfaces';
import { getCurrentCourses, getCurrentTerm } from './profileSlice';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
      width: '100%',
      backgroundColor: 'black',
    },
    contentBody: {
      backgroundColor: '#BCD2E8',
      maxWidth: '100%',
      overflow: 'hidden',
      minHeight: '70vh',
      padding: '10px',
    },
    folderStyle: {
      width: '100%',
      minHeight: '50px',
      border: '1px solid black',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: '20px',
      backgroundColor: '#91BAD6',
    },
    spacedIcon: {
      margin: '5px',
    },
    entry: {
      maxWidth: '100%',
      minHeight: '50px',
      maxHeight: '50px',
      backgroundColor: '#a7a457',
      border: '1px solid black',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: '10px',
      paddingRight: '10px',
    },
    divider: {
      flexGrow: 1,
    },
  })
);

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
  <Tabs
    {...props}
    variant="scrollable"
    scrollButtons="auto"
    TabIndicatorProps={{ children: <span /> }}
  />
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

const VideoEntry = (props: { file: VideoData; course: string }) => {
  const { file, course } = props;
  const classes = useStyles();
  const [generating, setGenerating] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const genPBS = useCallback(() => {
    setGenerating(true);
    setDisabled(true);
    ipcRenderer.send('generate-pbs', course, file.videoPath);
  }, [course, file.videoPath]);

  return (
    <div className={classes.entry}>
      {file.name}
      <div className={classes.divider} />
      {generating && file.pbsPath === '' ? (
        <CircularProgress color="secondary" />
      ) : (
        <div hidden />
      )}
      {file.pbsPath !== '' ? (
        <Tooltip title="PBS Generated">
          <CheckIcon style={{ color: 'green' }} />
        </Tooltip>
      ) : (
        <Tooltip title="Generate PBS">
          <IconButton disabled={disabled} onClick={genPBS}>
            <ErrorIcon style={{ color: 'red' }} />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
};

const CourseContent = (props: { name: string }) => {
  const { name } = props;
  const classes = useStyles();
  const [showPDFS, setShowPDFS] = useState<boolean>(false);
  const [showAssignments, setShowAssignments] = useState<boolean>(false);
  const [showVideos, setShowVideos] = useState<boolean>(false);
  const [files, setFiles] = useState<VideoData[]>(FileList.getVideoFiles(name));
  const wkspace = useSelector(getCurrentTerm);

  useEffect(() => {
    function handleCourseDataChanges(
      type: FileListUpdateType,
      data: CourseData
    ): void {
      if (type === FileListUpdateType.Video) {
        setFiles([...data.video]);
      }
    }
    FileList.subscribeToCourseDataChanges(name, handleCourseDataChanges);
    return () => {
      FileList.unsubscribeToCourseDataChanges(name, handleCourseDataChanges);
    };
  });

  const openVideoFolder = useCallback(
    (e) => {
      e.stopPropagation();
      ipcRenderer.send('openVideoFolder', wkspace, name);
    },
    [wkspace, name]
  );

  return (
    <div className={classes.contentBody}>
      <div
        className={classes.folderStyle}
        onClick={() => setShowPDFS(!showPDFS)}
        aria-hidden="true"
      >
        <FolderIcon className={classes.spacedIcon} />
        PDFS
      </div>
      <Collapse in={showPDFS}>pdfs go here</Collapse>
      <div
        className={classes.folderStyle}
        onClick={() => setShowAssignments(!showAssignments)}
        aria-hidden="true"
      >
        <FolderIcon className={classes.spacedIcon} />
        Assignments
      </div>
      <Collapse in={showAssignments}>assignments go here</Collapse>
      <div
        className={classes.folderStyle}
        onClick={() => setShowVideos(!showVideos)}
        aria-hidden="true"
      >
        <FolderIcon className={classes.spacedIcon} />
        Videos
        <Tooltip title="Open Folder" onClick={openVideoFolder}>
          <IconButton>
            <OpenInNewIcon />
          </IconButton>
        </Tooltip>
      </div>
      <Collapse in={showVideos}>
        <>
          {files.map((file) => (
            <VideoEntry key={file.name} file={file} course={name} />
          ))}
        </>
      </Collapse>
    </div>
  );
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
          <CourseContent name={v} />
        </TabPanel>
      ))}
    </div>
  );
};

export default CourseUI;
