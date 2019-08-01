import m from 'mithril';
import { Button, TextArea, TextInput, ModalPanel, NumberInput } from 'mithril-materialized';
import { DocumentsSvc } from '../../services';
import { IDocument } from '../../models';
import { deepCopy, deepEqual } from '../../utils';

const log = console.log;
const close = async (e?: UIEvent) => {
  log('closing...');
  await DocumentsSvc.unload();
  m.route.set('/');
  if (e) {
    e.preventDefault();
  }
};

export const DocumentForm = () => {
  const state = {
    document: {} as IDocument,
  };
  const onsubmit = async (e: MouseEvent) => {
    log('submitting...');
    e.preventDefault();
    if (state.document) {
      await DocumentsSvc.save(state.document);
      state.document = deepCopy(DocumentsSvc.getCurrent());
    }
  };

  return {
    oninit: () => {
      log('On INIT');
      log(state);
      const document = DocumentsSvc.getCurrent();
      state.document = deepCopy(document);
    },
    view: () => {
      const { document } = state;
      const hasChanged = !deepEqual(document, DocumentsSvc.getCurrent());
      return m('.row', [
        m('.col.s12', [
          m('h5', document.$loki ? 'Document' : 'Create new Document'),
          m(
            '.col.s6.l8',
            m(TextInput, {
              id: 'title',
              initialValue: document.title,
              onchange: (v: string) => (document.title = v),
              label: 'Title',
              iconName: 'title',
            })
          ),
          m(
            '.col.s6.l4',
            m(NumberInput, {
              id: 'id',
              initialValue: document.$loki,
              label: 'ID',
              iconName: 'label',
              disabled: true,
            })
          ),
          m(
            '.col.s12',
            m(TextArea, {
              id: 'desc',
              initialValue: document.description,
              onchange: (v: string) => (document.description = v),
              label: 'Description',
              iconName: 'description',
            })
          ),
          m(
            '.row',
            m('.col.s12.buttons', [
              m(Button, {
                label: 'Undo',
                iconName: 'undo',
                class: `green ${hasChanged ? '' : 'disabled'}`,
                onclick: () => (state.document = deepCopy(DocumentsSvc.getCurrent())),
              }),
              ' ',
              m(Button, {
                label: 'Save',
                iconName: 'save',
                class: `green ${hasChanged ? '' : 'disabled'}`,
                onclick: onsubmit,
              }),
              ' ',
              m(Button, {
                label: 'Close',
                iconName: 'close',
                onclick: (e: UIEvent) => close(e),
              }),
              ' ',
              m(Button, {
                modalId: 'delete-document',
                label: 'Delete',
                iconName: 'delete',
                class: 'red',
              }),
            ])
          ),
        ]),
        m(ModalPanel, {
          id: 'delete-document',
          title: `Delete document`,
          description: `Do you really want to delete this document - there is no way back?`,
          options: { opacity: 0.7 },
          buttons: [
            {
              label: 'Delete',
              onclick: async () => {
                DocumentsSvc.delete(document.$loki);
                close();
              },
            },
            {
              label: 'Discard',
            },
          ],
        }),
      ]);
    },
  };
};
