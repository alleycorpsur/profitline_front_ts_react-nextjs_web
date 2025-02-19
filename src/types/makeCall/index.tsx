export interface PhonecallData {
  call_to: string;
  body: string;
  state: string | undefined;
  attachments: File[];
}

export interface UserPhoneOption {
  id: number;
  phone: string;
  name: string;
  companyPosition: string;
}
