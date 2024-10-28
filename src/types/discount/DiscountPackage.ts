export interface DiscountPackage {
  id: number;
  project_id: number;
  name: string;
  definitions: string;
  start_date: string;
  end_date?: string;
  id_client: any;
  status: number;
}
