import m from 'mithril';
import { ChannelNames } from '../models/channels';
import { RestService } from './rest-service';
import { IDocument } from '../models';

class DocumentsService extends RestService<IDocument> {
  constructor() {
    super('documents', ChannelNames.DOCUMENTS);
  }

  public getDocumentUrl(id: number) {
    return `${this.baseUrl}${id}/file`;
  }

  public async loadDocument<T>(id: number) {
    const result = m
      .request<any>({
        method: 'GET',
        url: this.getDocumentUrl(id),
        withCredentials: this.withCredentials,
        extract: xhr => {
          console.log({ status: xhr.status, body: xhr.responseText });
          return xhr.responseText;
        },
      })
      .catch(reason => console.warn(reason));
    return result;
  }
}

export const DocumentsSvc = new DocumentsService();
