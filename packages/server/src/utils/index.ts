import fs from 'fs';

/** Promisified fs.stat */
export const stat = (file: string) => {
  return new Promise<fs.Stats>((resolve, reject) => {
    fs.stat(file, (err, stat) => {
      if (err) {
        reject(err);
      } else {
        resolve(stat);
      }
    });
  });
};
