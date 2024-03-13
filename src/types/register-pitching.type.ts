export interface RegisterPitchingType {
  id: number;
  register_pitching_status: string;
  createdAt: string;
  project: {
    id: number;
    name_project: string;
    business_sector: string;
    specialized_field: string;
    purpose: string;
    description_project: string;
    request: string;
    note: string;
    document_related_link: string;
    project_registration_expired_date: string;
    project_start_date: string;
    project_expected_end_date: string;
    project_actual_end_date?: string;
    project_status: string;
    createdAt: string;
  };
  group: {
    id: number;
    group_name: string;
    group_quantity: string;
    group_status: string;
    createdAt: string;
  };
}
