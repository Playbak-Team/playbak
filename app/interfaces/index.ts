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

interface VideoStateInterface {
  videoURLS: string[];
  currentVideo: VideoData;
  snackbarActive: boolean;
  snackbarMessage: string;
  snackbarSeverity: 'success' | 'info' | 'warning' | 'error' | undefined;
}

interface ProfileStateInterface {
  name: string;
  selectedWorkspace: string;
  availableWorkspaces: string[];
  courses: string[];
  links: string[];
}

// eslint-disable-next-line import/prefer-default-export
export {
  VideoStateInterface,
  ProfileStateInterface,
  VideoData,
  emptyVideoData,
};
