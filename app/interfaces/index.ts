interface VideoData {
  name: string;
  videoPath: string;
  pbsPath: string;
  watched: boolean;
}

const emptyVideoData = (): VideoData => ({
  name: '',
  videoPath: '',
  pbsPath: '',
  watched: false,
});

interface Settings {
  name: string;
  LST: string;
  LL: string;
  courses: string[];
  AWKS: string[];
}

const emptySettings = (): Settings => ({
  name: '',
  LST: '',
  LL: '',
  courses: [],
  AWKS: [],
});

interface PBSData {
  name: string;
  chunkSize: number;
  speeds: number[];
}

const emptyPBSData = (): PBSData => ({
  name: '',
  chunkSize: -1,
  speeds: [],
});

interface ProfileStateInterface {
  name: string;
  selectedWorkspace: string;
  availableWorkspaces: string[];
  courses: string[];
  links: string[];
}

interface KanbanStateInterface {
  columns: string[];
  entries: string[];
}

interface Columns {
  name: string;
}

interface Events {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  label: string;
  duedate: string;
  belongsto: string;
}

enum SnackbarSeverity {
  success = 'success',
  info = 'info',
  warning = 'warning',
  error = 'error',
}

interface SnackbarStateInterface {
  snackbarActive: boolean;
  snackbarMessage: string;
  snackbarSeverity: 'success' | 'info' | 'warning' | 'error' | undefined;
}

// eslint-disable-next-line import/prefer-default-export
export {
  ProfileStateInterface,
  KanbanStateInterface,
  VideoData,
  emptyVideoData,
  Settings,
  emptySettings,
  Columns,
  Events,
  PBSData,
  emptyPBSData,
  SnackbarSeverity,
  SnackbarStateInterface,
};
