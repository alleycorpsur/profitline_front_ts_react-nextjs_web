export interface IClients {
  status: number;
  message: string;
  data: IClient[];
}

export interface IClient {
  nit: number;
  uuid: string;
  project_id: number;
  client_name: string;
  business_name: string;
  cliet_type_id: number;
  phone: string;
  risk: string;
  condition_payment: string;
  email: string;
  billing_period: Date;
  radication_type: string;
  holding_id: number | null;
  document_type: string;
  locations: Location[];
  clien_status: string;
  is_deleted: number;
  documents: Document[];
}

export interface Document {
  URL: string;
}

export interface Location {
  id?: number;
  nit?: string;
  city?: string;
  address?: string;
  position?: Position;
}

export interface Position {
  lat: string;
  lon: string;
}
