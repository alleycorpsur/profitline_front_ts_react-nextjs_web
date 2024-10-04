export interface InvoiceData {
  id: string;
  key: string;
  payments?: number;
  date?: string;
  amount?: number;
  adjustmentId?: number;
  appliedAmount: number;
  adjustmentType?: string;
  invoices?: number;
  balance: number;
  adjustment?: number;
  payment?: number;
  invoice?: number;
}

export interface SectionData {
  statusName: string;
  statusId: number;
  color: string;
  invoices: InvoiceData[];
  total: number;
  count: number;
}
