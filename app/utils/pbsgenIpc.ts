import { ipcMain } from 'electron';
import { emptySettings, PBSData, emptyPBSData } from '../interfaces';

const fs = require('fs');
const readline = require('readline');
const { exec } = require('child_process');
const folders = require('./playbakFolders');

ipcMain.on('generate-pbs', async (event, filename: string) => {
  exec(
    `${folders.pbsgenPath} ${folders.ffmpegPath} ${filename}`,
    (error: Error, stdout: string, stderr: string) => {
      if (error || stderr) {
        event.reply('return-pbsgen', '');
      } else if (stdout) {
        event.reply('return-pbsgen', stdout);
      }
    }
  );
});

ipcMain.on('read-pbs', async (event, filename: string) => {
  if (fs.existsSync(filename)) {
    const data = emptyPBSData();
    data.name = filename;
    const fileStream = fs.createReadStream(filename);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });
    let firstLine = true;
    rl.on('line', (input) => {
      if (firstLine) {
        data.chunkSize = parseInt(input, 10) / 1000;
        firstLine = false;
      } else {
        let [s, i] = input.split(' ');
        i = parseInt(i, 10);
        s = parseFloat(s);
        for (; i > 0; i -= 1) {
          data.speeds.push(s);
        }
      }
    });

    rl.on('close', (_) => {
      event.reply('return-pbs', data);
    });
  }
});
