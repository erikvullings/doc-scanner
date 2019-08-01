import m, { FactoryComponent, Attributes } from 'mithril';
import pdfjs from 'pdfjs-dist';
import { IDocument } from '../../models';
import { DocumentsSvc } from '../../services';
import { md } from '../../utils';

export interface IDocumentPreview extends Attributes {
  doc?: IDocument;
}

export const DocumentPreview: FactoryComponent<IDocumentPreview> = () => {
  const state = {} as {
    data: any;
    doc: IDocument;
  };
  if (typeof window !== 'undefined' && 'Worker' in window) {
    (pdfjs as any).GlobalWorkerOptions.workerPort = new Worker('./pdf.worker.entry.js');
  }

  return {
    view: ({ attrs: { doc } }) => {
      if (!doc) {
        state.data = undefined;
        return undefined;
      }
      if (!state.doc || doc.$loki !== state.doc.$loki) {
        state.data = undefined;
        state.doc = doc;
      }
      const { extension, $loki } = doc;
      const { data } = state;
      const extName = extension.toLowerCase();
      if (extName === '.md') {
        if (!data) {
          DocumentsSvc.loadDocument<string>($loki).then(data => {
            state.data = data;
            m.redraw();
          });
        }
        return data ? m('div', m.trust(md(data))) : undefined;
      } else if (extName === '.pdf') {
        const loadingTask = pdfjs.getDocument(DocumentsSvc.getDocumentUrl($loki));
        loadingTask.promise.then(
          pdf => {
            // Fetch the first page
            const pageNumber = 1;
            pdf.getPage(pageNumber).then(page => {
              const scale = 1.5;
              const viewport = page.getViewport(scale);

              // Prepare canvas using PDF page dimensions
              const canvas = document.getElementById('pdf-canvas') as HTMLCanvasElement;
              const context = canvas.getContext('2d') as CanvasRenderingContext2D;
              canvas.height = viewport.height;
              canvas.width = viewport.width;

              // Render PDF page into canvas context
              const renderContext = {
                canvasContext: context,
                viewport: viewport,
              };
              const renderTask = page.render(renderContext);
              renderTask.promise.then(() => {
                console.log('Page rendered');
              });
            });
          },
          reason => {
            // PDF loading error
            console.error(reason);
          }
        );
        return m('canvas[id=pdf-canvas]');
      }
      return doc ? m('p', '...') : undefined;
    },
  };
};
