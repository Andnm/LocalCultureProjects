export interface ProjectType {
  id?: number;
  responsible_person?:
    | {
        position?: string;
        address?: string;
        email?: string;
        avatar_url?: string;
        fullname?: string;
        link_web?: string;
        phone_number?: string;
        address_detail?: string;
        business_sector?: string;
        business_description?: string;
        other_contact?: string;
      }
    | undefined;
  business?:
    | {
        address?: string;
        email?: string;
        avatar_url?: string;
        fullname?: string;
        link_web?: string;
        phone_number?: string;
        address_detail?: string;
        business_sector?: string;
        business_description?: string;
      }
    | undefined;
  fullname: string;
  position: string;
  email_responsible_person: string;
  phone_number: string;
  name_project: string;
  business_sector: string;
  specialized_field: string;
  purpose?: string;
  description_project: string;
  request: string;
  note: string;
  document_related_link: string;
  project_registration_expired_date?: string;
  project_start_date?: string;
  project_expected_end_date?: string;
  project_status?: string;
  business_type?: string;
  business_model?: string;
  createdAt?: string;
  project_implement_time?: string;
  target_object?: string;
  expected_budget?: number;
}

export interface CreateProjectType {
  is_created_by_admin: boolean
  businessName: string
  businessEmail: string
  link_web: string
  business_description: string
  business_sector: string
  address: string
  address_detail: string
  is_change_business_info: boolean
  fullname: string
  phone_number: string
  position: string
  email_responsible_person: string
  other_contact: string
  is_change_responsible_info: boolean
  name_project: string
  business_type: string
  purpose: string
  target_object: string
  note: string
  document_related_link: string[]
  request: string
  project_implement_time: string
  project_start_date: string
  is_extent: boolean
  project_expected_end_date: string
  expected_budget: string
  is_first_project: boolean
}
