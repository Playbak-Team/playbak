const path = require('path');

const { app } = require('electron');
const ffmpeg = require('@ffmpeg-installer/ffmpeg');

const userdataDir = app.getPath('userData');
const documentsDir = app.getPath('documents');
const workspaceRootDir = path.resolve(`${documentsDir}/Playbak`);

exports.settingFile = path.resolve(`${userdataDir}/settings.json`);

exports.workspaceRootDir = workspaceRootDir;
exports.getWorkspaceSettingFile = (wkspace: string) =>
  path.resolve(`${userdataDir}/${wkspace}-settings.json`);
exports.getWorkspaceDir = (wkspace: string) =>
  path.resolve(`${workspaceRootDir}/${wkspace}`);
exports.getWorkspaceKanbandb = (wkspace: string) =>
  path.resolve(`${workspaceRootDir}/${wkspace}/kanban.db`);

exports.getCourseRootDir = (wkspace: string, course: string) =>
  path.resolve(`${workspaceRootDir}/${wkspace}/${course}`);
const getCoursePDFDir = (wkspace: string, course: string) =>
  path.resolve(`${workspaceRootDir}/${wkspace}/${course}/pdfs`);
exports.getCoursePDFDir = getCoursePDFDir;
const getCourseVideoDir = (wkspace: string, course: string) =>
  path.resolve(`${workspaceRootDir}/${wkspace}/${course}/videos`);
exports.getCourseVideoDir = getCourseVideoDir;
const getCourseAsgmtDir = (wkspace: string, course: string) =>
  path.resolve(`${workspaceRootDir}/${wkspace}/${course}/assignments`);
exports.getCourseAsgmtDir = getCourseAsgmtDir;

exports.courseSubDirs = [getCoursePDFDir, getCourseVideoDir, getCourseAsgmtDir];

const resourcesPath = app.isPackaged
  ? path.join(process.resourcesPath, 'resources')
  : path.join(__dirname, '../../resources');
exports.resourcesPath = resourcesPath;

exports.pbsgenPath = path.resolve(`${resourcesPath}/pbsgen/pbsgen.exe`);
exports.ffmpegPath = path.resolve(
  ffmpeg.path.replace('.asar', '.asar.unpacked')
);
