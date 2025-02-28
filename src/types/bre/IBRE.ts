export interface channeles {
  status: number;
  message: string;
  data: channel[];
}

export interface channel {
  id: number;
  project_id: number;
  channel_description: string;
  is_deleted: number;
}
export interface IChanel {
  CHANNEL_ID: number;
  CHANNEL_NAME: string;
  PROJECT_ID: number;
  IS_DELETED: number;
  CHANNEL_LINES: Line[];
}

export interface Line {
  id: number;
  sublines: Subline[];
  description: string;
}

export interface Subline {
  id: number;
  description: string;
}

export interface ISelectedBussinessRules {
  channels: number[];
  lines: number[];
  sublines: number[];
}
