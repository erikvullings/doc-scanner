import { api } from 'rest-easy-loki';
import { options } from './cli';

export const startService = () => {
  api.listen(options.port);
  console.info(`Server running on port ${options.port}.`);
};
