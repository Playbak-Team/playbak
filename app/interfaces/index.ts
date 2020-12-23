interface VideoStateInterface {
  videoURLS: string[];
  currentVideo: string;
  snackbarActive: boolean;
  snackbarMessage: string;
  snackbarSeverity: 'success' | 'info' | 'warning' | 'error' | undefined;
}

interface ProfileStateInterface {
  selectedWorkspace: string;
  availableWorkspaces: string[];
  courses: string[];
  links: string[];
}

interface UserInfoInterace {
  name: string;
  LST: string;
  LL: string;
}

// eslint-disable-next-line import/prefer-default-export
export { VideoStateInterface, ProfileStateInterface, UserInfoInterace };
