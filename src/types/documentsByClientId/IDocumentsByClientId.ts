export interface IDocumentsByClientId {
  status: number;
  message: string;
  data: Datum[];
}

export interface Datum {
  id: number;
  format_document: string;
  required: number;
  client_type_id: number;
  is_deleted: number;
}
