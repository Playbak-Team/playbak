import { VideoData } from '../interfaces';

type CollapsibleProps = {
  course: string;
};

type CollapsibleCardProps = {
  video: VideoData;
};

type VideoPlayerProps = {
  filepath: string;
};

type HomeProps = {
  name: string;
};

type WorkspaceEntryProps = {
  name: string;
};

type CourseEntryProps = {
  name: string;
};

export {
  CollapsibleProps,
  CollapsibleCardProps,
  VideoPlayerProps,
  HomeProps,
  WorkspaceEntryProps,
  CourseEntryProps,
};
