import 'dotenv/config';
import fileUpload from 'express-fileupload';
import { exec } from 'child_process';
import express, { response } from 'express';
import fs from 'fs';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(__filename);
console.log(__dirname);

const app = express();

app.use(
  fileUpload({
    tempFileDir: '/tmp/',
  })
);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/web/index.html');
});

app.post('/ocr', async (req, res) => {
  //get the file from the express post req
  const formFile = req.files.file;
  const newFilePath =
    __dirname + '\\upload\\' + 'file.' + formFile.name.split('.').reverse()[0];

  await fs.writeFileSync(newFilePath, formFile.data, { encoding: 'utf-8' });

  const command = 'tesseract "' + newFilePath + '" - -l eng';

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
    }
    console.log('ORC successfull');
    res.type('txt');
    res.send(stdout);
  });
});

app.listen(process.env.EXPRESS_PORT, () => {
  console.log(`Server is running on port ${process.env.EXPRESS_PORT}`);
});
