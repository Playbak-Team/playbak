import { ipcRenderer } from 'electron';

import { VideoData } from '../../interfaces';

interface CourseData {
  video: VideoData[];
  assign: VideoData[];
  pdf: VideoData[];
}

const emptyCourseData = (): CourseData => ({
  video: [],
  assign: [],
  pdf: [],
});

let wkspace = '';
let courseData: { [name: string]: CourseData } = {};

const FileList = {
  init: (wkspaceName: string): void => {
    wkspace = wkspaceName;
    courseData = {};
    console.log(`FileList init: ${wkspaceName}`);
  },
  addCourse: (courseName: string): void => {
    console.log(`FileList addCourse: ${courseName}`);
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
    console.log(`FileList readVideoFiles: ${courseName}`);
    ipcRenderer.send('get-videos', wkspace, courseName);
  },
  setVideoFiles: (courseName: string, newVideoFiles: VideoData[]): void => {
    console.log(
      `FileList setVideoFiles: ${courseName} files: ${newVideoFiles}`
    );

    if (!(courseName in courseData)) {
      FileList.addCourse(courseName);
    }
    courseData[courseName].video = newVideoFiles;
  },
  getVideoFiles: (courseName: string): VideoData[] => {
    return FileList.getCourseData(courseName).video;
  },
};

ipcRenderer.on('return-videos', (_event, targetCourse, videos) => {
  console.log(targetCourse, videos);
  FileList.setVideoFiles(targetCourse, videos);
});

ipcRenderer.on('return-pbsgen', (_event, courseName, filename, result) => {
  console.log(`FileList return-pbsgen: ${courseName} ${filename} ${result}`);

  const videoFiles = FileList.getVideoFiles(courseName);
  const videoIndex = videoFiles.findIndex((vid) => vid.videoPath === filename);
  if (videoIndex >= 0) {
    Object.assign(videoFiles[videoIndex], { pbsPath: result });
  }
  console.log(videoFiles[videoIndex]);
});

Object.freeze(FileList);

export default FileList;
