const path = require('path');

const { app } = require('electron');

const userdataDir = app.getPath('userData');
const documentsDir = app.getPath('documents');
const workspaceRootDir = path.resolve(`${documentsDir}/Playbak`);

exports.settingFile = path.resolve(`${userdataDir}/settings.json`);

exports.workspaceRootDir = workspaceRootDir;
exports.getWorkspaceSettingFile = (wkspace: string) =>
  path.resolve(`${workspaceRootDir}/${wkspace}/${wkspace}-settings.json`);
exports.getWorkspaceDir = (wkspace: string) =>
  path.resolve(`${workspaceRootDir}/${wkspace}`);
exports.getWorkspaceKanbandb = (wkspace: string) =>
  path.resolve(`${workspaceRootDir}/${wkspace}/kanban.db`);

exports.getCourseRootDir = (wkspace: string, course: string) =>
  path.resolve(`./workspaces/${wkspace}/${course}`);
const getCoursePDFDir = (wkspace: string, course: string) =>
  path.resolve(`./workspaces/${wkspace}/${course}/pdfs`);
exports.getCoursePDFDir = getCoursePDFDir;
const getCourseVideoDir = (wkspace: string, course: string) =>
  path.resolve(`./workspaces/${wkspace}/${course}/videos`);
exports.getCourseVideoDir = getCourseVideoDir;
const getCourseAsgmtDir = (wkspace: string, course: string) =>
  path.resolve(`./workspaces/${wkspace}/${course}/assignments`);
exports.getCourseAsgmtDir = getCourseAsgmtDir;

exports.courseSubDirs = [getCoursePDFDir, getCourseVideoDir, getCourseAsgmtDir];
