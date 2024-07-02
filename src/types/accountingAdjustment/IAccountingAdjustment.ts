export interface DiscountRequestBody {
  type: number; //1 nota debito, 2 nota credito, 3 descuento
  motive: number;
  ammount: number; //amount
  percentage: number;
  date_of_issue: string;
  expiration_date: string;
  validity_range: {
    start: string;
    end: string;
  };
  users_aproved: number[]; // users_approved
  project_id: number;
  client_id: number;
}
