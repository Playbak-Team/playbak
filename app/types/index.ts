import type { DraggableLocation } from 'react-beautiful-dnd';
import { PBSData, VideoData } from '../interfaces';

type CollapsibleProps = {
  course: string;
  setVideo: React.Dispatch<React.SetStateAction<VideoData>>;
};

type CollapsibleCardProps = {
  course: string;
  video: VideoData;
  setVideo: React.Dispatch<React.SetStateAction<VideoData>>;
};

type VideoPlayerProps = {
  video: VideoData;
  pbsData: PBSData;
};

type HomeProps = {
  name: string;
  quote: string;
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
  removeE: (name: string) => void;
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
  completed: string;
  openCardInfo: (info: string) => void;
  removeE: (name: string) => void;
};

type EditEntryProps = {
  index: number;
  entry: string;
  handleEntryClose: () => void;
  showSelectedEntry: boolean;
  handleEntrySave: (index: number, newEntry: string) => void;
};

type NewWorkspaceDialogProps = {
  isWkOpen: boolean;
  handleWkClose: (value: string) => void;
};

type WorkspaceInterfaceProps = {
  workspace: string;
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
  NewWorkspaceDialogProps,
  WorkspaceInterfaceProps,
};
