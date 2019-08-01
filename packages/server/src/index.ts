import { startService } from './serve';
import { startWatcher } from './watch';
import { options } from './cli';


process.on('uncaughtException', err => {
  console.error('Caught exception: ' + err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  if ((reason as any).stack) {
    console.error((reason as any).stack);
  }
});

startService(() => startWatcher(options.folder, options.watch));
