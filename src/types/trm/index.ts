export interface TRMRow {
  id: number;
  date: string;
  [key: string]: any; // Para permitir columnas dinámicas con cualquier `dataIndex`
}
