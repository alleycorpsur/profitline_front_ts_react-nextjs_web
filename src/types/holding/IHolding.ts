export interface IHolding {
  status: number;
  message: string;
  data: Datum[];
}

export interface Datum {
  id: number;
  name: string;
}
