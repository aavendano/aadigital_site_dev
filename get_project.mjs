import https from 'node:https';
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const apiKey = "AQ.Ab8RN6KEtpHRJ8KPYYVMYhxB4hCdZzzYiakaadyiALlEMmoCYw";
const baseUrl = "https://stitch.googleapis.com/v1/projects/153726355698451722/files";

const options = {
  headers: {
    "X-Goog-Api-Key": apiKey
  }
};

https.get(baseUrl, options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(data);
  });
}).on('error', err => {
  console.error(err);
});
