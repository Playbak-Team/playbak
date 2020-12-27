interface VideoStateInterface {
  videoURLS: string[];
  currentVideo: string;
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

interface KanbanStateInterface {
  columns: string[];
  entries: string[];
}

// eslint-disable-next-line import/prefer-default-export
export { VideoStateInterface, ProfileStateInterface, KanbanStateInterface };
