interface IAgreementInvoice {
  id: number;
  amount: number;
  CREATE_AT: string;
  invoice_id: string;
  payment_date: string;
  payment_agreement_id: number;
  current_financial_record: number;
}

export interface IPaymentDetail {
  id: number;
  project_id: number;
  status: number;
  created_at: string;
  created_by: number;
  comments: string;
  files: string[];
  secuence: number;
  amount: number;
  payment_date: string;
  payment_id: number;
  status_name: string;
  single_payment_agreement_id: number;
  create_at: string;
  event_date: string;
  user_name: string;
  agreement_invoices: IAgreementInvoice[];
  count_invoices: number;
}
