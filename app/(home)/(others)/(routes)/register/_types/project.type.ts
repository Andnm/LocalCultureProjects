export interface ProjectType {
  name_project: string;
  business_type: string;
  purpose: string;
  target_object: string;
  note?: string;
  request: string;
  project_implement_time: string;
  project_start_date?: string;
  project_actual_start_date?: string;
  is_extent: boolean;
  project_expected_end_date?: string;
  project_actual_end_date?: string;
  expected_budget: number;
  is_first_project: boolean;
}
