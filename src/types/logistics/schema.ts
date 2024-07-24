import { FileObject } from "@/components/atoms/UploadDocumentButton/UploadDocumentButton";
import { DocumentCompleteType } from "./certificate/certificate";

export interface IListData {
  id: any;
  data: Data;
  status: number;
  statusText: string;
  headers: WelcomeHeaders;
  config: Config;
  request: Request;
}

export interface ICreateRegister {
  data: WelcomeData;
  status: number;
  statusText: string;
  headers: WelcomeHeaders;
  config: Config;
  request: Request;
}

export interface Config {
  transitional: Transitional;
  adapter: string[];
  transformRequest: null[];
  transformResponse: null[];
  timeout: number;
  xsrfCookieName: string;
  xsrfHeaderName: string;
  maxContentLength: number;
  maxBodyLength: number;
  env: Request;
  headers: ConfigHeaders;
  method: string;
  url: string;
}

export interface Request {}

export interface ConfigHeaders {
  Accept: string;
  Authorization: string;
}

export interface Transitional {
  silentJSONParsing: boolean;
  forcedJSONParsing: boolean;
  clarifyTimeoutError: boolean;
}

export interface Data {
  status: number;
  message: string;
  data: any[];
}

export interface WelcomeHeaders {
  "content-type": string;
}

export interface WelcomeData {
  status: number;
  message: string;
  data: DataData;
}

export interface DataData {
  project_description: string;
  rgb_config: string;
  logo: string;
  nit: string;
  email: string;
  contact: string;
  phone: string;
  address: string;
  country_id: string;
  currency: Currency[];
  user: User;
  uuid: string;
  id: number;
}

export interface Currency {
  id: string;
  currency_name: string;
}

export interface User {
  iss: string;
  aud: string;
  auth_time: number;
  user_id: string;
  sub: string;
  iat: number;
  exp: number;
  email: string;
  email_verified: boolean;
  firebase: Firebase;
  uid: string;
}

export interface Firebase {
  identities: Identities;
  sign_in_provider: string;
}

export interface Identities {
  email: string[];
}

export interface IOrderPslCostCenter {
  key: number;
  idpslcostcenter: number;
  descpslcostcenter: string;
  percent: number;
}

export interface IOrderPsl {
  key: number;
  idpsl: number;
  descpsl: string;
  percent: number;
  costcenters: IOrderPslCostCenter[];
}

/* BD SCHEMA */
/**
 * Exposes all fields present in aditional_by_location as a typescript
 * interface.
 */
export interface IAditionalByLocation {
  id: number;
  id_location: number;
  entity_type: number;
  id_vehicle_type: number;
  description: string;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}

/**
 * Exposes the same fields as AditionalByLocation,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface IAditionalByLocationWithDefaults {
  id?: number;
  id_location: number;
  entity_type: number;
  id_vehicle_type: number;
  description: string;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}
/**
 * Exposes all fields present in aditional_by_material as a typescript
 * interface.
 */
export interface IAditionalByMaterial {
  key: number;
  id: number;
  id_material: number;
  entity_type: number;
  id_vehicle_type: number;
  description: string;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
  quantity: number;
}

/**
 * Exposes the same fields as AditionalByMaterial,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface IAditionalByMaterialWithDefaults {
  id?: number;
  id_material: number;
  entity_type: number;
  id_vehicle_type: number;
  description: string;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}
/**
 * Exposes all fields present in carrier_by_group as a typescript
 * interface.
 */
export interface ICarrierByGroup {
  id: number;
  id_grouplocation: number;
  id_carrier: number;
  status?: string | null;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}

/**
 * Exposes the same fields as CarrierByGroup,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ICarrierByGroupWithDefaults {
  id?: number;
  id_grouplocation: number;
  id_carrier: number;
  status?: string | null;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}
/**
 * Exposes all fields present in carrier_drivers as a typescript
 * interface.
 */
export interface ICarrierDrivers {
  id: number;
  id_carrier: number;
  id_driver: number;
  start_date: Date;
  end_date: Date;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}

/**
 * Exposes the same fields as CarrierDrivers,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ICarrierDriversWithDefaults {
  id?: number;
  id_carrier: number;
  id_driver: number;
  start_date: Date;
  end_date: Date;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}
/**
 * Exposes all fields present in carrier_pricing_dynamic as a typescript
 * interface.
 */
export interface ICarrierPricingDynamic {
  id: number;
  id_contract: number;
  id_carrier: number;
  id_vehicle_type: number;
  price: number;
  start_date: Date;
  end_date: Date;
  /**  Defaults to: 0. */
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
  unit_type: number;
  from_units: number;
  to_units: number;
  price_unit_aditional: number;
  id_carrier_vehicle_contract: number;
}

/**
 * Exposes the same fields as CarrierPricingDynamic,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ICarrierPricingDynamicWithDefaults {
  id?: number;
  id_contract: number;
  id_carrier: number;
  id_vehicle_type: number;
  price: number;
  start_date: Date;
  end_date: Date;
  /**  Defaults to: 0. */
  active?: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
  unit_type: number;
  from_units: number;
  to_units: number;
  price_unit_aditional: number;
  id_carrier_vehicle_contract: number;
}
/**
 * Exposes all fields present in carrier_pricing_trips as a typescript
 * interface.
 */
export interface ICarrierPricingTrips {
  id: number;
  id_contract: number;
  id_carrier: number;
  id_vehicle_type: number;
  valid_from: Date;
  valid_to: Date;
  price: number;
  to_location?: any | null;
  /**  Defaults to: 0. */
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
  from_location?: any | null;
  id_carrier_vehicle_contract: number;
}

/**
 * Exposes the same fields as CarrierPricingTrips,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ICarrierPricingTripsWithDefaults {
  id?: number;
  id_contract: number;
  id_carrier: number;
  id_vehicle_type: number;
  valid_from: Date;
  valid_to: Date;
  price: number;
  to_location?: any | null;
  /**  Defaults to: 0. */
  active?: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
  from_location?: any | null;
  id_carrier_vehicle_contract: number;
}
/**
 * Exposes all fields present in carrier_request as a typescript
 * interface.
 */
export interface ICarrierRequest {
  id: number;
  id_transfer_request: number;
  date_sended: string;
  id_request: number;
  id_carrier: number;
  id_vehicle_type: number;
  id_vehicle: number;
  response: string;
  date_response: string;
  start_date_flexible: number;
  fare: number;
  status: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}

/**
 * Exposes the same fields as CarrierRequest,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ICarrierRequestWithDefaults {
  id?: number;
  id_transfer_request: number;
  date_sended: string;
  id_request: number;
  id_carrier: number;
  id_vehicle_type: number;
  id_vehicle: number;
  response: string;
  date_response: string;
  start_date_flexible: number;
  fare: number;
  status: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}
/**
 * Exposes all fields present in carrier_vehicles_contracts as a typescript
 * interface.
 */
export interface ICarrierVehiclesContracts {
  id: number;
  id_contract: number;
  id_carrier: number;
  id_vehicle: number;
  start_date: Date;
  end_date: Date;
  periodicyty: string;
  contract_type: number;
  price_unit: number;
  current_location_lat?: number | null;
  /**  Defaults to: 0. */
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
  current_location_lng?: number | null;
}

/**
 * Exposes the same fields as CarrierVehiclesContracts,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ICarrierVehiclesContractsWithDefaults {
  id?: number;
  id_contract: number;
  id_carrier: number;
  id_vehicle: number;
  start_date: Date;
  end_date: Date;
  periodicyty: string;
  contract_type: number;
  price_unit: number;
  current_location_lat?: number | null;
  /**  Defaults to: 0. */
  active?: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
  current_location_lng?: number | null;
}
/**
 * Exposes all fields present in carriers as a typescript
 * interface.
 */
export interface ICarriers {
  id: number;
  description: string;
  nit: string;
  icon: string;
  active: string;
  created_at: Date;
  created_by: Date;
  modified_at?: Date | null;
  modified_by?: string | null;
}

/**
 * Exposes the same fields as Carriers,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ICarriersWithDefaults {
  id?: number;
  description: string;
  nit: string;
  icon: string;
  active: string;
  created_at: Date;
  created_by: Date;
  modified_at?: Date | null;
  modified_by?: string | null;
}
/**
 * Exposes all fields present in certificates as a typescript
 * interface.
 */
export interface ICertificates {
  id: number;
  entity_type: number;
  id_entity: number;
  url_archive: string;
  start_date: Date;
  expiration_date: Date;
  upload_date: Date;
  status: string;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
  id_document_type: number;
}

/**
 * Exposes the same fields as Certificates,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ICertificatesWithDefaults {
  id?: number;
  entity_type: number;
  id_entity: number;
  url_archive: string;
  start_date: Date;
  expiration_date: Date;
  upload_date: Date;
  status: string;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}
/**
 * Exposes all fields present in contracts as a typescript
 * interface.
 */
export interface IContracts {
  id: number;
  description: string;
  url_archive: string;
  id_carrier: number;
  total_amount: number;
  start_date: Date;
  end_date: Date;
  status: string;
  /**  Defaults to: curdate(). */
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
  standby_hours: number;
  id_contract_type: number;
}

/**
 * Exposes the same fields as Contracts,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface IContractsWithDefaults {
  id?: number;
  description: string;
  url_archive: string;
  id_carrier: number;
  total_amount: number;
  start_date: Date;
  end_date: Date;
  status: string;
  /**  Defaults to: curdate(). */
  created_at?: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
  standby_hours: number;
  id_contract_type: number;
}
/**
 * Exposes all fields present in contracts_extension as a typescript
 * interface.
 */
export interface IContractsExtension {
  id: number;
  id_contract: number;
  url_archive: string;
  id_carrier: number;
  total_amount: number;
  current_amount: number;
  status: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}

/**
 * Exposes the same fields as ContractsExtension,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface IContractsExtensionWithDefaults {
  id?: number;
  id_contract: number;
  url_archive: string;
  id_carrier: number;
  total_amount: number;
  current_amount: number;
  status: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}
/**
 * Exposes all fields present in contracts_types as a typescript
 * interface.
 */
export interface IContractsTypes {
  id: number;
  description: string;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}

/**
 * Exposes the same fields as ContractsTypes,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface IContractsTypesWithDefaults {
  id?: number;
  description: string;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}
/**
 * Exposes all fields present in driver_by_carrier_request as a typescript
 * interface.
 */
export interface IDriverByCarrierRequest {
  id: number;
  id_driver: number;
  id_vehicle: number;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}

/**
 * Exposes the same fields as DriverByCarrierRequest,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface IDriverByCarrierRequestWithDefaults {
  id?: number;
  id_driver: number;
  id_vehicle: number;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}
/**
 * Exposes all fields present in drivers as a typescript
 * interface.
 */
export interface IDrivers {
  id: number;
  name: string;
  last_name: string;
  document_type: number;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
  phone: string;
  document: string;
  licence: string;
  licence_category?: string | null;
  licence_expiration: Date;
  emergency_number: number;
  emergency_contact: string;
}

/**
 * Exposes the same fields as Drivers,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface IDriversWithDefaults {
  id?: number;
  name: string;
  last_name: string;
  document_type: number;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
  phone: string;
  document: string;
  licence: string;
  licence_category?: string | null;
  licence_expiration: Date;
  emergency_number: number;
  emergency_contact: string;
}
/**
 * Exposes all fields present in group_by_location as a typescript
 * interface.
 */
export interface IGroupByLocation {
  id: number;
  description: string;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
  city_id: number;
  geojson?: string | null;
}

/**
 * Exposes the same fields as GroupByLocation,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface IGroupByLocationWithDefaults {
  id?: number;
  description: string;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
  city_id: number;
  geojson?: string | null;
}
/**
 * Exposes all fields present in incidents as a typescript
 * interface.
 */
export interface IIncidents {
  id: number;
  id_trip: number;
  incident_type: number;
  url_archive: string;
  description: string;
  incident_date: Date;
  status: string;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}

/**
 * Exposes the same fields as Incidents,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface IIncidentsWithDefaults {
  id?: number;
  id_trip: number;
  incident_type: number;
  url_archive: string;
  description: string;
  incident_date: Date;
  status: string;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}
/**
 * Exposes all fields present in location as a typescript
 * interface.
 */
export interface ILocation {
  id: number;
  description: string;
  city_id: number;
  postal_code: string;
  url_location: string;
  latitude: number;
  longitude: number;
  location_type: number;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}
/**
 * Exposes all fields present in driver as a typescript
 * interface.
 */
export interface IDriver {
  id: number;
  phone: number;
  email: string;
  document_type: number;
  vehicle_type: number[];
  document: string;
  license: string;
  license_category: string;
  licence_category?: string;
  license_expiration: Date;
  name: string;
  last_name: string;
  emergency_number: number;
  emergency_contact: string;
  firebaseguid?: string;
  active: any;
  status?: any;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
  company: string;
  rh: string;
  glasses: any;
  birth_date: Date;
  photo?: string;
  company_id?: string;
}
/**
 * Exposes all fields present in vehicle as a typescript
 * interface.
 */
export interface IVehicle {
  id: string;
  id_carrier: string;
  id_vehicle_type: string;
  vehicle_type: string;
  plate_number: string;
  brand: string;
  line: string;
  model: string;
  year: Number;
  color: string;
  country: string;
  aditional_info: string;
  gps_link: string;
  gps_user: string;
  gps_password: string;
  active: any;
  status?: any;
  created_at: Date;
  created_by: string;
  modified_at: Date;
  modified_by: string;
  company: string;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  IS_ACTIVE: boolean;
}
/**
 * Exposes all fields present in carrier as a typescript
 * interface.
 */
export interface ICarrier {
  id: number;
  description: string;
  nit: string;
  icon: string;
  active: any;
  status?: any;
  vehicles: any;
  drivers: any;
  carrier_type: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
  photo?: string;
}
/**
 * Exposes the same fields as Location,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ILocationWithDefaults {
  id?: number;
  description: string;
  city_id: number;
  postal_code: string;
  url_location: string;
  latitude: number;
  longitude: number;
  location_type: number;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}
/**
 * Exposes all fields present in location_by_grouplocation as a typescript
 * interface.
 */
export interface ILocationByGrouplocation {
  id: number;
  id_location: number;
  id_grouplocation: number;
  status?: string | null;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}

/**
 * Exposes the same fields as LocationByGrouplocation,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ILocationByGrouplocationWithDefaults {
  id?: number;
  id_location: number;
  id_grouplocation: number;
  status?: string | null;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}
/**
 * Exposes all fields present in material as a typescript
 * interface.
 */
export interface IMaterial {
  key: number;
  id: number;
  description: string;
  id_type_material: number;
  kg_weight: number;
  mt_height: number;
  mt_width: number;
  mt_length?: number | null;
  m3_volume: number;
  rotation: string;
  can_stack: string;
  image: string;
  aditional_info?: string | null;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
  icon: string;
  restriction?: string | null;
  type_description: string;
  quantity: number;
}

/**
 * Exposes the same fields as Material,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface IMaterialWithDefaults {
  id?: number;
  description: string;
  id_type_material: number;
  kg_weight: number;
  mt_height: number;
  mt_width: number;
  mt_length?: number | null;
  m3_volume: number;
  rotation: string;
  can_stack: string;
  image: string;
  aditional_info?: string | null;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
  icon: string;
  restriction?: string | null;
}
/**
 * Exposes all fields present in material_type as a typescript
 * interface.
 */
export interface IMaterialType {
  id: number;
  description: string;
  line: string;
  subline: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}

/**
 * Exposes the same fields as MaterialType,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface IMaterialTypeWithDefaults {
  id?: number;
  description: string;
  line: string;
  subline: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}

export interface IOtherRequirements {
  id: number;
  description: string;
  is_incident: string;
  active: Boolean;
  created_at: Date;
  created_by: string;
  modified_at: Date;
  modified_by: string;
}

export interface ITransferOrderOtherRequirements {
  key: number;
  id: number;
  id_transfer_order: number;
  id_other_requeriments: number;
  quantity: number;
  created_at: Date;
  created_by: string;
  modified_at: Date;
  modified_by: string;
  other_requirement_desc: string;  
}

export interface ITransferOrderVehicle {
  id: number;
  id_transfer_order: number;
  id_vehicle_type: number;
  quantity: number;
  created_at: Date;
  created_by: string | null | undefined;
  modified_at: Date;
  modified_by: string;
  vehicle_type_desc: string;  
}

export interface ITransferOrderMaterial {
  id: number;
  id_transfer_order: number;
  id_material: number;
  quantity: number;
  created_at: Date;
  created_by: string | null | undefined;
  modified_at: Date;
  modified_by: string;
  material? : IMaterial[];
}

export interface ISubsidiary {
  id: number;
  description: string;
  active: Boolean;
  created_at: Date;
  created_by: string;
  modified_at: Date;
  modified_by: string;
}

export interface IPsl {
  id: number;
  descpsl: string;
  idcc: number;
  desccc: string;
}

/**
 * Exposes all fields present in transfer_order as a typescript
 * interface.
 */
export interface ITransferOrder {
  id: number;
  id_service_type: string;
  service_type_desc: string;
  id_user: number;
  user: string | null | undefined;
  id_start_location: number;
  id_end_location: number;
  start_date?: string;
  end_date?: string;
  start_freight_equipment: string;
  end_freight_equipment: string;
  rotation: string;
  start_date_flexible: number;
  end_date_flexible: number;
  id_route: string;
  id_company: number;
  id_client: number;
  client_desc: string;  
  status: string;
  active: string;
  created_at?: string | null | undefined;
  created_by?: string | null | undefined;
  modified_at?: string | null | undefined;
  modified_by?: string | null | undefined;
  observation: string | null | undefined;
  start_location?: ILocation[]| null | undefined;
  end_location?: ILocation[]| null | undefined;
  //geometry
  geometry: any;
  //datos de contacto
  transfer_order_contacts?: ITransferOrderContacts[] | null;
  //centros de costo
  transfer_order_cost_center?: ITransferOrderCostCenter[] | null;
  //documentos
  transfer_order_documents?: ITransferOrderDocuments[] | null;
  //material
  transfer_order_material?: ITransferOrderMaterial[] | null;
  //requerimientos adicionales
  transfer_order_other_requeriments?: ITransferOrderOtherRequirements[] | null;
  //personas -- aplica para viaje tipo persona
  transfer_order_persons?: ITransferOrderPersons[] | null;
  //productos
  transfer_order_products?: ITransferOrderProducts[] | null;
  //vehiculo sugerido
  transfer_order_vehicles?: ITransferOrderVehicle[] | null;
}

export interface IFormTransferOrder {
  body: ITransferOrder;
  files?: DocumentCompleteType[];
}

export interface ITransferOrderList {
  id: number;
  id_service_type: number;
  service_type: string;
  start_date: string;
  end_date: string;
  id_start_location: number;
  start_location: string;
  id_end_location: number;
  end_location: string;
  status: string;
  created_at: string;
  created_by: string;  
  time: string;  
  amount: string;  
}

/**
 * Exposes the same fields as TransferOrder,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ITransferOrderWithDefaults {
  id?: number;
  id_user: number;
  id_start_location: number;
  id_end_location: number;
  start_date: Date;
  end_date: Date;
  start_freight_equipment: string;
  end_freight_equipment: string;
  rotation: string;
  start_date_flexible: number;
  end_date_flexible: number;
  image: string;
  id_company: number;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}
/**
 * Exposes all fields present in transfer_order_by_transfer_request as a typescript
 * interface.
 */
export interface ITransferOrderByTransferRequest {
  id: number;
  id_transfer_order: number;
  id_transfer_request: number;
  datastamp: Date;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}

/**
 * Exposes the same fields as TransferOrderByTransferRequest,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ITransferOrderByTransferRequestWithDefaults {
  id?: number;
  id_transfer_order: number;
  id_transfer_request: number;
  datastamp: Date;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}
/**
 * Exposes all fields present in transfer_order_contacts as a typescript
 * interface.
 */
export interface ITransferOrderContacts {
  key: number;
  id: number;
  id_transfer_order: number;
  id_contact: number;
  contact_type: number;
  name: string;
  contact_number: string;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}

/**
 * Exposes the same fields as TransferOrderContacts,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ITransferOrderContactsWithDefaults {
  id?: number;
  id_transfer_order: number;
  id_contact: number;
  contact_number: number;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
  contact_type: number;
}
/**
 * Exposes all fields present in transfer_order_cost_center as a typescript
 * interface.
 */
export interface ITransferOrderCostCenter {
  id: number;
  id_transfer_order: number;
  id_psl: number;
  id_costcenter: number;
  cost_center_desc: string;  
  percentage: number;
  active: string;
  created_at: Date;
  created_by: string | null | undefined;
  modified_at?: Date | null;
  modified_by?: string | null;
}

/**
 * Exposes the same fields as TransferOrderCostCenter,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ITransferOrderCostCenterWithDefaults {
  id?: number;
  id_transfer_order: number;
  id_costcenter: number;
  percentage: number;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}
/**
 * Exposes all fields present in transfer_order_documents as a typescript
 * interface.
 */
export interface ITransferOrderDocuments {
  id: number;
  id_transfer_order: number;
  id_document_type: number;
  document_type_desc:string;  
  url_document: string;
  status: string;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}

export type TransferOrderDocumentType = ITransferOrderDocuments & { file: File | undefined } & { expirationDate: any } & { link?: string } & { description: any };

/**
 * Exposes the same fields as TransferOrderDocuments,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ITransferOrderDocumentsWithDefaults {
  id?: number;
  id_transfer_order: number;
  id_document_type: number;
  url_document: string;
  status: string;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}
/**
 * Exposes all fields present in transfer_order_persons as a typescript
 * interface.
 */
export interface ITransferOrderPersons {
  id: number;
  id_transfer_order: number;
  id_user: number;
  id_user_line: number;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
  id_user_subline: number;
}

/**
 * Exposes the same fields as TransferOrderPersons,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ITransferOrderPersonsWithDefaults {
  id?: number;
  id_transfer_order: number;
  id_user: number;
  id_user_line: number;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
  id_user_subline: number;
}
/**
 * Exposes all fields present in transfer_order_products as a typescript
 * interface.
 */
export interface ITransferOrderProducts {
  id: number;
  id_transfer_order: number;
  id_product: number;
  units: number;
  active: string;
  created_at: Date;
  created_by: string | null | undefined;
  modified_at?: Date | null;
  modified_by?: string | null;
  product_desc: string;  
}

/**
 * Exposes the same fields as TransferOrderProducts,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ITransferOrderProductsWithDefaults {
  id?: number;
  id_transfer_order: number;
  id_product: number;
  units: number;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}
/**
 * Exposes all fields present in transfer_request as a typescript
 * interface.
 */
export interface ITransferRequest {
  id: number;
  id_trip: number;
  id_start_location: number;
  id_end_location: number;
  start_date: Date;
  end_date: Date;
  start_freight_equipment: string;
  end_freight_equipment: string;
  start_date_flexible: number;
  end_date_flexible: number;
  id_company: number;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
  id_user: number;
}

/**
 * Exposes the same fields as TransferRequest,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ITransferRequestWithDefaults {
  id?: number;
  id_trip: number;
  id_start_location: number;
  id_end_location: number;
  start_date: Date;
  end_date: Date;
  start_freight_equipment: string;
  end_freight_equipment: string;
  start_date_flexible: number;
  end_date_flexible: number;
  id_company: number;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
  id_user: number;
}
/**
 * Exposes all fields present in transfer_request_contacts as a typescript
 * interface.
 */
export interface ITransferRequestContacts {
  id: number;
  id_transfer_order: number;
  id_contact: number;
  contact_number: number;
  contact_type: number;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
  id_transfer_request: number;
}

/**
 * Exposes the same fields as TransferRequestContacts,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ITransferRequestContactsWithDefaults {
  id?: number;
  id_transfer_order: number;
  id_contact: number;
  contact_number: number;
  contact_type: number;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
  id_transfer_request: number;
}
/**
 * Exposes all fields present in transfer_request_cost_center as a typescript
 * interface.
 */
export interface ITransferRequestCostCenter {
  id: number;
  id_transfer_order: number;
  id_costcenter: number;
  percentage: number;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
  id_transfer_request: number;
}

/**
 * Exposes the same fields as TransferRequestCostCenter,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ITransferRequestCostCenterWithDefaults {
  id?: number;
  id_transfer_order: number;
  id_costcenter: number;
  percentage: number;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
  id_transfer_request: number;
}
/**
 * Exposes all fields present in transfer_request_documents as a typescript
 * interface.
 */
export interface ITransferRequestDocuments {
  id: number;
  id_transfer_order: number;
  id_document_type: number;
  url_document: string;
  status: string;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
  id_transfer_request: number;
}

/**
 * Exposes the same fields as TransferRequestDocuments,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ITransferRequestDocumentsWithDefaults {
  id?: number;
  id_transfer_order: number;
  id_document_type: number;
  url_document: string;
  status: string;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
  id_transfer_request: number;
}
/**
 * Exposes all fields present in transfer_request_persons as a typescript
 * interface.
 */
export interface ITransferRequestPersons {
  id: number;
  id_transfer_order: number;
  id_user: number;
  id_user_line: number;
  id_user_subline: number;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
  id_transfer_request: number;
}

/**
 * Exposes the same fields as TransferRequestPersons,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ITransferRequestPersonsWithDefaults {
  id?: number;
  id_transfer_order: number;
  id_user: number;
  id_user_line: number;
  id_user_subline: number;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
  id_transfer_request: number;
}
/**
 * Exposes all fields present in transfer_request_products as a typescript
 * interface.
 */
export interface ITransferRequestProducts {
  id: number;
  id_transfer_order: number;
  id_product: number;
  units: number;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
  id_transfer_request: number;
}

/**
 * Exposes the same fields as TransferRequestProducts,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ITransferRequestProductsWithDefaults {
  id?: number;
  id_transfer_order: number;
  id_product: number;
  units: number;
  active: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
  id_transfer_request: number;
}
/**
 * Exposes all fields present in traveling_restrictions_by_locations as a typescript
 * interface.
 */
export interface ITravelingRestrictionsByLocations {
  id: number;
  id_location: number;
  id_location_dest: number;
  status?: string | null;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}

/**
 * Exposes the same fields as TravelingRestrictionsByLocations,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ITravelingRestrictionsByLocationsWithDefaults {
  id?: number;
  id_location: number;
  id_location_dest: number;
  status?: string | null;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}
/**
 * Exposes all fields present in traveling_restrictions_by_material as a typescript
 * interface.
 */
export interface ITravelingRestrictionsByMaterial {
  id: number;
  id_type_material: number;
  id_material: number;
  status?: string | null;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}

/**
 * Exposes the same fields as TravelingRestrictionsByMaterial,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ITravelingRestrictionsByMaterialWithDefaults {
  id?: number;
  id_type_material: number;
  id_material: number;
  status?: string | null;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}
/**
 * Exposes all fields present in trip as a typescript
 * interface.
 */
export interface ITrip {
  id: number;
  id_start_location: number;
  id_end_location: number;
  start_time: Date;
  end_time?: Date | null;
  fare: number;
  status: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}

/**
 * Exposes the same fields as Trip,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ITripWithDefaults {
  id?: number;
  id_start_location: number;
  id_end_location: number;
  start_time: Date;
  end_time?: Date | null;
  fare: number;
  status: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}
/**
 * Exposes all fields present in trip_costcenter as a typescript
 * interface.
 */
export interface ITripCostcenter {
  id: number;
  id_trip: number;
  id_costcenter: number;
  percentage: number;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}

/**
 * Exposes the same fields as TripCostcenter,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ITripCostcenterWithDefaults {
  id?: number;
  id_trip: number;
  id_costcenter: number;
  percentage: number;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}
/**
 * Exposes all fields present in trip_events as a typescript
 * interface.
 */
export interface ITripEvents {
  id: number;
  id_trip: number;
  id_status: number;
  location: string;
  date: Date;
  url_image: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}

/**
 * Exposes the same fields as TripEvents,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ITripEventsWithDefaults {
  id?: number;
  id_trip: number;
  id_status: number;
  location: string;
  date: Date;
  url_image: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}
/**
 * Exposes all fields present in trip_incidents as a typescript
 * interface.
 */
export interface ITripIncidents {
  id: number;
  id_trip: number;
  id_driver: number;
  id_incident_type: number;
  description: string;
  url_image: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
  date: Date;
}

/**
 * Exposes the same fields as TripIncidents,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ITripIncidentsWithDefaults {
  id?: number;
  id_trip: number;
  id_driver: number;
  id_incident_type: number;
  description: string;
  url_image: string;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
  date: Date;
}
/**
 * Exposes all fields present in trip_material as a typescript
 * interface.
 */
export interface ITripMaterial {
  id: number;
  id_trip: number;
  id_request: number;
  id_vehicle: number;
  id_material: number;
  units: number;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}

/**
 * Exposes the same fields as TripMaterial,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ITripMaterialWithDefaults {
  id?: number;
  id_trip: number;
  id_request: number;
  id_vehicle: number;
  id_material: number;
  units: number;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}
/**
 * Exposes all fields present in trip_request as a typescript
 * interface.
 */
export interface ITripRequest {
  id: number;
  id_trip: number;
  id_request: number;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}

/**
 * Exposes the same fields as TripRequest,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ITripRequestWithDefaults {
  id?: number;
  id_trip: number;
  id_request: number;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}
/**
 * Exposes all fields present in trip_vehicle as a typescript
 * interface.
 */
export interface ITripVehicle {
  id: number;
  id_trip: number;
  id_carrier_request_id: number;
  id_vehicle: number;
  id_contract: number;
  id_driver: number;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}

/**
 * Exposes the same fields as TripVehicle,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ITripVehicleWithDefaults {
  id?: number;
  id_trip: number;
  id_carrier_request_id: number;
  id_vehicle: number;
  id_contract: number;
  id_driver: number;
  created_at: Date;
  created_by: string;
  modified_at?: Date | null;
  modified_by?: string | null;
}
/**
 * Exposes all fields present in vehicle_type as a typescript
 * interface.
 */
export interface IVehicleType {
  key: number;
  id: number;
  description: string;
  vehicle_subtype: number;
  actyvity_type: number;
  kg_capacity: number;
  m3_volume: number;
  width: number;
  height: number;
  aditional_info?: string | null;
  length?: number | null;
  passenger_capacity: number;
  speed_multiple: number;
  active: string;
  created_at: Date;
  created_by: string | null;
  modified_at?: Date | null;
  modified_by?: string | null;
  icon: string;
  image: string;
  quantity: number;
}

/**
 * Exposes the same fields as VehicleType,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface IVehicleTypeWithDefaults {
  id?: number;
  description: string;
  vehicle_subtype: number;
  actyvity_type: number;
  kg_capacity: number;
  m3_volume: number;
  width: number;
  height: number;
  aditional_info?: string | null;
  length?: number | null;
  passenger_capacity: number;
  speed_multiple: number;
  active: string;
  created_at: Date;
  created_by: Date;
  modified_at?: Date | null;
  modified_by?: string | null;
  icon: string;
  image: string;
}
/**
 * Exposes all fields present in vehicles as a typescript
 * interface.
 */
export interface IVehicles {
  id: number;
  plate_number: string;
  brand: string;
  line: string;
  active: string;
  created_at: Date;
  created_by: Date;
  modified_at?: Date | null;
  modified_by?: string | null;
  id_carrier: number;
  id_vehicle_type: number;
  model: string;
  year: number;
  color: string;
  country: number;
  aditional_info?: string | null;
  gps_link?: string | null;
  gps_user?: string | null;
  gps_password?: string | null;
}

/**
 * Exposes the same fields as Vehicles,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface IVehiclesWithDefaults {
  id?: number;
  plate_number: string;
  brand: string;
  line: string;
  active: string;
  created_at: Date;
  created_by: Date;
  modified_at?: Date | null;
  modified_by?: string | null;
  id_carrier: number;
  id_vehicle_type: number;
  model: string;
  year: number;
  color: string;
  country: number;
  aditional_info?: string | null;
  gps_link?: string | null;
  gps_user?: string | null;
  gps_password?: string | null;
}

export interface IFormDriver {
  general: IDriver;
  logo?: FileObject[];
  files?: DocumentCompleteType[];
}
export interface IFormVehicle {
  general: IVehicle;
  image1?: FileObject[];
  image2?: FileObject[];
  image3?: FileObject[];
  image4?: FileObject[];
  image5?: FileObject[];
  files?:  DocumentCompleteType[];
  IS_ACTIVE: boolean;
}
export interface IFormCarrier {
  general: ICarrier;
}

export interface VehicleType {
  id: number;
  description: string;
  vehicle_subtype: number;
  actyvity_type: number;
  kg_capacity: number;
  m3_volume: number;
  width: number;
  height: number;
  aditional_info: string;
  length: number;
  passenger_capacity: number;
  speed_multiple: number;
  active: ActiveVehicleType;
  created_at: Date;
  created_by: string;
  modified_at: Date;
  modified_by: string;
  icon: string;
  image: string;
  available: number;
  price: number;
}

export interface ActiveVehicleType {
  type: string;
  data: number[];
}

export interface IListDataVehiche {
  id: any;
  data: DataVihicleType;
  status: number;
  statusText: string;
  headers: WelcomeHeaders;
  config: Config;
  request: Request;
}
export interface IListDataVehicheDetail {
  id: any;
  data: DataVihicleDetail;
  status: number;
  statusText: string;
  headers: WelcomeHeaders;
  config: Config;
  request: Request;
}

export interface DataVihicleType {
  status: number;
  message: string;
  data: VehicleType[];
}
export interface DataVihicleDetail {
  status: number;
  message: string;
  data: VihicleDetail;
}

export interface VihicleDetail {
  id: number;
  plate_number: string;
  brand: string;
  line: string;
  active: ActiveVehicleType;
  created_at: Date;
  created_by: string;
  modified_at: Date;
  modified_by: string;
  id_carrier: number;
  id_vehicle_type: number;
  model: string;
  year: number;
  color: string;
  country: number;
  aditional_info: string;
  gps_link: string;
  gps_user: string;
  gps_password: string;
  documents: any[];
  images: any[];
}




