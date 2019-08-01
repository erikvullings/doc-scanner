import { db, createApi } from 'rest-easy-loki';
import Koa from 'koa';
import Router from 'koa-router';
import { options } from './cli';
import HttpStatus from 'http-status';
import { stat } from './utils';
import { lookup } from 'mime-types';
import fs from 'fs';

export const collectionName = 'documents';

const addRoutes = (api: Koa) => {
  const router = new Router();
  router.get('/documents/:id/file', async ctx => {
    const { id } = ctx.params;
    if (typeof id === 'undefined') {
      ctx.status = HttpStatus.BAD_REQUEST;
      ctx.body = { message: `Cannot find document without ID!` };
      return;
    }
    const document = db.get('documents', +id);
    if (!document) {
      ctx.status = HttpStatus.NOT_FOUND;
      ctx.body = { message: `Cannot find document with ID ${id}!` };
      return;
    }
    const { file, extension } = document;
    const fstat = await stat(file).catch(_ => {
      ctx.status = HttpStatus.NOT_FOUND;
      ctx.body = { message: `Cannot find file ${file}!` };
      return;
    });

    if (fstat && fstat.isFile()) {
      ctx.type = lookup(extension) || '';
      ctx.body = fs.createReadStream(file);
    } else {
      ctx.status = HttpStatus.UNSUPPORTED_MEDIA_TYPE;
      ctx.body = { message: `File ${file} is not supported!` };
    }
  });
  api.use(router.routes());
};

export const startService = (done: () => void) => {
  db.startDatabase('ldl.db', () => {
    const api = createApi({ cors: true, verbose: true, port: options.port });
    addRoutes(api);
    api.listen(options.port).on('listening', () => {
      const exists = db.collections().reduce((acc, cur) => acc || cur.name === collectionName, false);
      if (!exists) {
        db.createCollection(collectionName, ['documents']);
      }
      console.info(`Server running on port ${options.port}.`);
      done();
    });
  });
};
