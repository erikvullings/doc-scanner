export interface IDocument {
  /** Path to file */
  file: string;
  /** String array with folder names, used for filtering by folder */
  folders: string[];
  /** Title of the document, is automatically set but may be altered manually */
  title: string;
  /** Document type */
  extension: string;
  /** Optional description */
  description?: string;
  /** Optional comment */
  comment?: string;
  /** Optional tags */
  tags?: string[];
}
