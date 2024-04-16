export interface IProjectById {
  status: number;
  message: string;
  data: IProject[];
}

export interface IProject {
  ID: number;
  UUID: string;
  PROJECT_DESCRIPTION: string;
  RGB_CONFIG: string;
  LOGO: string;
  NIT: string;
  CONTACT: string;
  PHONE: string;
  ADDRESS: string;
  COUNTRY_ID: number;
  CURRENCY: Currency[];
  EMAIL: string;
  IS_ACTIVE: boolean;
  COUNTRY_NAME: string;
  ADDRESS_FORMAT: string;
  is_deleted: number;
  NUMBER_USERS: number;
}
export interface IProject {
  ID: number;
  UUID: string;
  PROJECT_DESCRIPTION: string;
  RGB_CONFIG: string;
  LOGO: string;
  NIT: string;
  CONTACT: string;
  PHONE: string;
  ADDRESS: string;
  BILLING_PERIOD: Date;
  COUNTRY_ID: number;
  CURRENCY: Currency[];
  EMAIL: string;
  IS_ACTIVE: boolean;
  COUNTRY_NAME: string;
  ADDRESS_FORMAT: string;
  is_deleted: number;
  NUMBER_USERS: number;
}

export interface Currency {
  id: string;
  currency_name: string;
}

export interface Currency {
  id: string;
  CURRENCY_NAME: string;
  currency_name: string;
}
