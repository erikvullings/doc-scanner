import { stat, Stats } from 'fs';
import { extname, basename, dirname, sep } from 'path';
import { watch } from 'chokidar';
import { IDocument } from './models/document';
import { db } from 'rest-easy-loki';
import { collectionName } from './serve';
import hash from 'object-hash';

/** Have we found a file we are interested in */
const fileFilter = (file: string) => /(\.docx?$)|(\.pptx?$)|(\.pdf$)|(\.xlsx?$)|(\.md$)/.test(file);

/** Create a document description from the file */
const formatDocument = (file: string, stats: Stats) => {
  const doc = { file } as IDocument;
  doc.extension = extname(file);
  doc.folders = dirname(file).split(sep);
  doc.title = basename(file).replace(doc.extension, '');
  doc.size = stats.size;
  doc.modified = stats.mtime.toISOString();
  doc.hash = hash(doc);
  return doc;
};

const createOrUpdateDb = (doc: IDocument) => {
  const found = db.findOne(collectionName, { file: doc.file }) as IDocument | undefined;
  if (found) {
    if (found.hash !== doc.hash) {
      db.update(collectionName, found.$loki, doc);
    }
  } else {
    db.post(collectionName, doc);
  }
};

/** Process the input file, converting it to a document and updating the database */
const processFile = (file: string) => {
  stat(file, (err, stats) => {
    if (err) {
      return console.error(err);
    }
    if (stats.isDirectory()) {
      return;
    }
    const doc = formatDocument(file, stats);
    createOrUpdateDb(doc);
  });
};

export const startWatcher = (folders: string | string[], persistent: boolean) => {
  if (!folders || (folders instanceof Array && folders.length === 0)) {
    console.error('No folders to watch specified! Exiting...');
    process.exit(1);
  }
  console.info(`Started watching ${folders}...`);
  const watcher = watch(folders, {
    ignored: /(^|[\/\\])\../,
    persistent,
    followSymlinks: false,
  });

  watcher
    .on('add', path => {
      if (!fileFilter(path)) {
        return;
      }
      processFile(path);
    })
    .on('change', path => console.log(`File ${path} has been changed`))
    .on('unlink', path => console.log(`File ${path} has been removed`));
};
