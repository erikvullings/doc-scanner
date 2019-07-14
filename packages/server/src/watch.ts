import { watch } from 'chokidar';

export const startWatcher = (folders: string | string[], glob?: string) => {
  if (!folders || (folders instanceof Array && folders.length === 0)) {
    console.error('No folders to watch specified! Exiting...');
    process.exit(1);
  }
  const watcher = watch(folders, {
    ignored: /(^|[\/\\])\../,
    persistent: true,
  });

  watcher
    .on('add', path => console.log(`File ${path} has been added`))
    .on('change', path => console.log(`File ${path} has been changed`))
    .on('unlink', path => console.log(`File ${path} has been removed`));
};
