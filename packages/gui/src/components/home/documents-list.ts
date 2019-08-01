import m from 'mithril';
import { Collapsible, TextInput } from 'mithril-materialized';
import { DocumentsSvc } from '../../services';
import { titleAndDescriptionFilter, extensionToImageSrc } from '../../utils';
import { CircularSpinner } from '../ui/preloader';
import { DocumentMetadata } from './document-metadata';
import { DocumentPreview } from './document-preview';

export const DocumentsList = () => {
  const state = {
    filterValue: '',
  } as {
    docId?: number;
    filterValue: string;
  };

  const findId = (e: any) => +e.children[1].children[0].id;

  const style =
    'display: flex; justify-content: space-around; margin-right: 10px; flex-direction: row; flex-wrap: nowrap;';
  return {
    oninit: () => DocumentsSvc.loadList(),
    view: () => {
      const { docId } = state;
      const documents = DocumentsSvc.getList();
      const doc = docId ? documents.filter(d => d.$loki === docId).shift() : undefined;
      const query = titleAndDescriptionFilter(state.filterValue);
      const items = documents.filter(query).map(doc => ({
        header: m('ul.list-inline', [
          m('li', m('img', { src: extensionToImageSrc(doc.extension), style: 'margin-right: 10px' })),
          m('li', m('span.truncate', doc.title)),
        ]),
        // header: m('div', { style }, [
        //   m('img', { src: extensionToImageSrc(doc.extension), style: 'margin-right: 10px' }),
        //   m('span.truncate', { style: 'flex-grow: 1;' }, doc.title),
        // ]),
        // header: m(
        //   '.row',
        //   m('.col.s12', [
        //     m('img.left', { src: extensionToImageSrc(doc.extension), style: 'margin-right: 10px' }),
        //     m('.left', m('span.truncate', { style: 'width: 80%' }, doc.title)),
        //   ])
        // ),
        body: m(DocumentMetadata, { doc }),
      }));
      return m('.document-list', [
        m(
          '.row',
          m(
            '.col.s12',
            m(TextInput, {
              label: 'Filter',
              id: 'filter',
              iconName: 'filter_list',
              onkeyup: (_: KeyboardEvent, v?: string) => (state.filterValue = v ? v : ''),
              style: 'margin-right:100px',
              className: 'right',
            })
          )
        ),
        m('.row', [
          m(
            '.col.s12.m6',
            items && items.length > 0
              ? m(Collapsible, {
                  accordion: false,
                  items,
                  onOpenStart: (e: any) => {
                    state.docId = findId(e);
                    m.redraw();
                  },
                  onCloseEnd: (e: any) => {
                    state.docId = undefined;
                    m.redraw();
                  },
                })
              : m(CircularSpinner)
          ),
          m('.col.m6.show-on-medium-and-up', m(DocumentPreview, { doc })),
        ]),
      ]);
    },
  };
};
