import m, { FactoryComponent, Attributes } from 'mithril';
import { TextArea, Chips, FlatButton } from 'mithril-materialized';
import { IDocument } from '../../models';
import { DocumentsSvc } from '../../services';
import { debounce } from '../../utils';

export interface IDocumentMetadata extends Attributes {
  doc: IDocument;
}

export const DocumentMetadata: FactoryComponent<IDocumentMetadata> = () => {
  const save = debounce((doc: IDocument) => DocumentsSvc.save(doc), 5000);
  return {
    view: ({ attrs: { doc } }) => {
      const { $loki, comment, tags } = doc;
      const data = tags ? tags.map(tag => ({ tag })) : [];
      return [m('.row.metadata', { id: $loki }, [
        m('.col.s12', m(TextArea, { label: 'Comment', initialValue: comment, onchange: v => {
          doc.comment = v;
          save(doc);
        } })),
        m('.col.s12', m(Chips, { label: 'Tags', data, onchange: chips => {
          doc.tags = (chips || []).map(c => c.tag);
          save(doc);
        } })),
      ]),
      m('.row.buttons', [
        m(FlatButton, { iconName: 'cloud_download', onclick: async () => {
          if (doc.extension.toLowerCase() === '.md') {
            const d = await DocumentsSvc.loadDocument(doc.$loki);
            
          }

        } }),
      ])
    ];
    },
  };
};
