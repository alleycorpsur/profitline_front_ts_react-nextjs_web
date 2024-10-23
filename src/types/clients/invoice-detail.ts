export interface InvoiceDetail {
  data: {
    results: IData[];
    totals: {
      total_general: number;
      total_discount: number;
      total_creditNotes: number;
      total_debitNotes: number;
      total_initial: number;
    };
  };
}

export interface IData {
  id: number;
  id_invoice: number;
  comments: string;
  files: string[];
  create_at: string;
  event_date: string;
  invoice_event_type_id: number;
  user_id: number | null;
  is_deleted: number;
  ammount: number | null;
  financial_discount_id: number | null;
  previous_status_id: number | null;
  incident_id: number;
  email_id: number | null;
  radication_type_id: number | null;
  status: number;
  incident_status: number;
  user_name: string | null;
  is_rejected: number | null;
  event_type_name: string;
  status_name: string;
  previous_status: string | null;
  project_id: number;
  client_id: number;
  is_legalized: number;
  type_incident: string | null;
  sequence: number | null;
}
