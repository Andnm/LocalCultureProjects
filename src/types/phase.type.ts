export interface PhaseType {
  id: number;
  phase_status: string;
  phase_state_date?: string;
  phase_expected_end_date?: string;
  phase_actual_end_date?: string;
  cost_total?: number;
  phase_number: number
}
