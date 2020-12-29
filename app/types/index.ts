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

type ColumnDivProps = {
  name: string;
  entries: string[] | undefined;
  addE: any;
  removeC: any;
  index: number;
  openCardInfo: (info: string) => any;
};

type DragProgs = {
  type: string;
  source: any;
  destination: any;
};

type EntryCardProps = {
  og: string;
  id: number;
  title: string;
  subtitle: string;
  description: string;
  label: string;
  duedate: string;
  belongsto: string;
  index: number;
  openCardInfo: (info: string) => any;
};

export {
  CollapsibleProps,
  CollapsibleCardProps,
  VideoPlayerProps,
  HomeProps,
  WorkspaceEntryProps,
  CourseEntryProps,
  ColumnDivProps,
  EntryCardProps,
  DragProgs,
};
