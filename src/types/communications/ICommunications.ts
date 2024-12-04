import dayjs from "dayjs";

interface TriggerSettingsForm {
  days?: string[];
  actions?: ISelectStringType[];
  subActions?: ISelectStringType[];
  event_type?: ISelectStringType;
  noticeDaysEvent?: string;
}

interface TriggerForm {
  type: "accion" | "frecuencia" | "evento" | string;
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
  invoice_id: number;
  project_id: number;
  data: {
    name: string;
    descripcion: string;
    trigger: {
      type: string;
      settings: {
        init_date?: string;
        end_date?: string | null;
        repeat?: number;
        frequency?: string;
        days?: string[] | number;
        values?: string[];
        event_type?: string;
      };
    };
    rules: {
      channel: number[];
      line: number[];
      subline: number[];
      zone: number[];
      groups_id: number[];
    };
    template: {
      via: string;
      send_to: string[];
      copy_to: string[] | undefined;
      tags: string[];
      time: string;
      message: string;
      title: string;
      subject: string;
      files: string[];
    };
  };
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
