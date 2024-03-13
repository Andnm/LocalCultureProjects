export interface CostType {
  id: string;
  expected_cost: string;
  actual_cost?: string;
  cost_status?: string;
  createdAt?: string;
  category?: {
    category_name: string;
    detail: string;
  };
}
