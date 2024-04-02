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
