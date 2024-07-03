export interface UserType {
  email: string;
  responsiblePerson?: any;
  avatar_url?: string;
  fullname?: string | undefined;
  dob?: Date;
  gender?: string;
  address?: string;
  phone_number?: string;
  roll_number?: string;
  description?: string;
  link_web?: string;
  create_at?: Date;
  role_name: string;
  status?: boolean;
  business_sector?: string;
  business_description?: string;
  address_detail?: string;
}

export interface CheckBusinessInfoType {
  businessName: string
  businessEmail: string
  business_description: string
  business_sector: string
  address: string
  address_detail: string
}

export interface CheckResponsibleInfoType {
  fullname: string
  phone_number: string
  position: string
  email_responsible_person: string
}

