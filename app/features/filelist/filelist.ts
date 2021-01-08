import { ipcRenderer } from 'electron';

import {
  VideoData,
  CourseData,
  emptyCourseData,
  FileListUpdateType,
  UpdateCallback,
} from '../../interfaces';

let wkspace = '';
let courseData: { [name: string]: CourseData } = {};
const courseUpdateCallbacks: { [name: string]: UpdateCallback[] } = {};

const FileList = {
  init: (wkspaceName: string): void => {
    wkspace = wkspaceName;
    courseData = {};
  },
  addCourse: (courseName: string): void => {
    if (!(courseName in courseData)) {
      courseData[courseName] = emptyCourseData();
    }
    FileList.readVideoFiles(courseName);
  },
  getCourses: (): string[] => Object.keys(courseData),
  getCourseData: (courseName: string): CourseData => {
    if (courseName in courseData) {
      return courseData[courseName];
    }
    return emptyCourseData();
  },
  readVideoFiles: (courseName: string): void => {
    ipcRenderer.send('get-videos', wkspace, courseName);
  },
  setVideoFiles: (courseName: string, newVideoFiles: VideoData[]): void => {
    if (!(courseName in courseData)) {
      FileList.addCourse(courseName);
    }
    courseData[courseName].video = newVideoFiles;
    FileList.callUpdateCallbacks(courseName, FileListUpdateType.Video);
  },
  getVideoFiles: (courseName: string): VideoData[] => {
    return FileList.getCourseData(courseName).video;
  },
  callUpdateCallbacks: (courseName: string, type: FileListUpdateType): void => {
    if (courseName in courseUpdateCallbacks) {
      courseUpdateCallbacks[courseName].forEach((fn) => {
        fn(type, courseData[courseName]);
      });
    }
  },
  subscribeToCourseDataChanges: (
    courseName: string,
    fn: UpdateCallback
  ): void => {
    if (!(courseName in courseUpdateCallbacks)) {
      courseUpdateCallbacks[courseName] = [fn];
    } else {
      courseUpdateCallbacks[courseName].push(fn);
    }
  },
  unsubscribeToCourseDataChanges: (
    courseName: string,
    fn: UpdateCallback
  ): void => {
    if (courseName in courseUpdateCallbacks) {
      courseUpdateCallbacks[courseName] = courseUpdateCallbacks[
        courseName
      ].filter((cb) => cb !== fn);
    }
  },
};

ipcRenderer.on('return-videos', (_event, targetCourse, videos) => {
  FileList.setVideoFiles(targetCourse, videos);
});

ipcRenderer.on('return-pbsgen', (_event, courseName, filename, result) => {
  const videoFiles = FileList.getVideoFiles(courseName);
  const videoIndex = videoFiles.findIndex((vid) => vid.videoPath === filename);
  if (videoIndex >= 0) {
    Object.assign(videoFiles[videoIndex], { pbsPath: result });
  }

  FileList.callUpdateCallbacks(courseName, FileListUpdateType.Video);
});

Object.freeze(FileList);

export default FileList;
