import dayjs from "dayjs";

interface TriggerSettingsForm {
  days?: string[];
  actions?: ISelectStringType[];
  subActions?: ISelectStringType[];
  event_type?: ISelectStringType;
  noticeDaysEvent?: string;
}

interface TriggerForm {
  type: 1 | 2 | 3;
  settings: TriggerSettingsForm;
}

interface ITemplateForm {
  via: ISelectStringType;
  send_to: ISelectStringType[];
  copy_to: ISelectStringType[] | undefined;
  tags: ISelectStringType[];
  time: string;
  message: string;
  title?: string;
  subject: string;
  files: ISelectStringType[];
}

export interface ICommunicationForm {
  name: string;
  description: string;
  trigger: TriggerForm;
  template: ITemplateForm;
}

export interface ISelectStringType {
  value: string;
  label: string;
}

export interface IPeriodicityModalForm {
  init_date: Date | undefined | dayjs.Dayjs;
  frequency_number: number | undefined;
  frequency: ISelectStringType;
  days: ISelectStringType[];
  end_date: Date | undefined | dayjs.Dayjs;
}

export interface ICreateCommunication {
  project_id: number;
  name: string;
  description: string;
  subject: string;
  message: string;
  via: "email" | string;
  user_roles: number[];
  contact_roles: number[];
  client_group_ids: number[];
  communication_type: 1 | 2 | 3; // Enforce valid communication types //1 frecuency, 2 event, 3 action

  // Frequency-specific properties (optional)
  json_frequency?: {
    start_date: string;
    repeat: {
      interval: number;
      frequency: "mensual" | "semanal" | string;
      day: string;
    };
    end_date: string;
  };

  // Action-specific properties (optional)
  action_type_ids?: number[];
  sub_action_type_ids?: number[];

  // Event-specific properties (optional, can be added if needed)
  id_event_type?: number;
  delay_event?: number;
}

interface ISelect {
  id: number;
  name: string;
}

interface Frequency {
  repeat: Repeat;
  endDate: string;
  startDate: string;
}

interface Repeat {
  day: string;
  interval: number;
  frequency: "Semanal" | "Mensual";
}
export interface ICommunication {
  id: number;
  idProject: number;
  name: string;
  description: string;
  userRoles: ISelect[];
  contactRoles: ISelect[];
  actionTypeIds: number[];
  subActionTypeIds: number[];
  clientGroupId: ISelect[];
  idCommunicationType: ISelect;
  comunicacionState: number;
  via: string;
  subject: string;
  message: string;
  JSON_frecuency: Frequency;
}

export interface ISingleCommunication {
  id: number;
  via: string;
  reason: string;
  frequency: string;
  clients: number;
  projectId: number;
  rules: {
    channel: number[];
    line: number[];
    subline: number[];
    zone: number[];
    groups_id: number[];
  };
  created_at: string;
  updated_at: string;
  IS_DELETED: number;
  COMUNICATION_NAME: string;
  ID: number; // redundant with id?
  TITLE: string;
  BODY: string;
  TEMPLATE_TYPE: string;
  TEMPLATE_SUBJECT: string;
  FILES: string | null;
  CREATED_AT: string;
  UPDATED_AT: string;
  action_type: null | object;
  tags: string[];
  project_id: null | number;
  type: string;
  template_id: number;
  period: null | object;
  date_init_frequency: string;
  date_end_frequency: string;
  frequency_days: string[];
  event_days_before: null | number;
  last_send: null | string;
  event_invoice_id: null | number;
  invoice_event_type_id: null | number;
  repeats: number | undefined;
  copy_to: string[] | null;
  send_to: string[];
  EVENT_TYPE: string;
}
