import { IBusinessRules } from "./IUser";

export interface IUsers {
  status: number;
  message: string;
  data: IUserSingle[];
  pagination: Pagination;
}

export interface IUserSingle {
  ACTIVE: number;
  BUSSINESS_RULES: IBusinessRules[];
  EMAIL: string;
  ID: number;
  IS_DELETED: number;
  NOTIFICATION_CONFIG: null | string;
  PHONE: string;
  PHOTO: string;
  POSITION: string;
  PROJECT_DESCRIPTION: string;
  PROJECT_ID: number;
  ROL_ID: number;
  ROL_NAME: string;
  USER_NAME: string;
  USER_PERMISSIONS: IUserPermissions;
  USER_ZONES: IUserZones[];
  UUID: string;
  is_super_admin: number;
}

interface IUserPermissions {
  COMPONENT_ID: number;
  PERMISSIONS: IPermissions;
}

interface IPermissions {
  CREATE: boolean;
  DELETE: boolean;
  READ: boolean;
  UPDATE: boolean;
}
export interface Pagination {
  page: number;
  total: number;
}

interface IUserZones {
  ZONE_ID: number;
  ZONE_DESCRIPTION: string;
}
