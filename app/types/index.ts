import type { DraggableLocation } from 'react-beautiful-dnd';
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
  addE: (name: string) => void;
  removeC: (name: string) => void;
  index: number;
  openCardInfo: (info: string) => void;
};

type DragProps = {
  type: string;
  source: DraggableLocation;
  destination: DraggableLocation | null;
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
  openCardInfo: (info: string) => void;
};

type EditEntryProps = {
  index: number;
  entry: string;
  handleEntryClose: () => void;
  showSelectedEntry: boolean;
  handleEntrySave: (index: number, newEntry: string) => void;
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
  DragProps,
  EditEntryProps,
};
