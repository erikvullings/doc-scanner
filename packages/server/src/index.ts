import { startService } from './serve';
import { startWatcher } from './watch';
import { options } from './cli';

// startService();
startWatcher(options.folder);
