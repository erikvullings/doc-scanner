export interface LokiObj {
  $loki: number;
  meta: {
    created: number; // Date().getTime()
    revision: number;
    updated: number; // Date().getTime()
    version: number;
  };
}

export interface IDocument extends LokiObj {
  /** Path to file */
  file: string;
  /** String array with folder names, used for filtering by folder */
  folders: string[];
  /** Title of the document, is automatically set but may be altered manually */
  title: string;
  /** Document type */
  extension: string;
  /** Modification date */
  modified: string;
  /** File size */
  size: number;
  /** Hash of the current object, used for change detection with exiting object */
  hash: string;
  /** Optional description */
  description?: string;
  /** Optional comment */
  comment?: string;
  /** Optional tags */
  tags?: string[];
}
