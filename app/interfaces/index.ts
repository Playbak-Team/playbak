interface VideoStateInterface {
  videoURLS: string[];
  currentVideo: string;
  snackbarActive: boolean;
  snackbarMessage: string;
  snackbarSeverity: 'success' | 'info' | 'warning' | 'error' | undefined;
}

// eslint-disable-next-line import/prefer-default-export
export { VideoStateInterface };
