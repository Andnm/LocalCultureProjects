export interface UserGroupType {
  id: number;
  createdAt: string;
  is_leader?: boolean;
  role_in_group: string;
  relationship_status: string;
  group: {
    id?: number;
    group_name: string;
    group_quantity?: number;
    createdAt: string;
    group_status: string;
  };
  user?: {
    email?: string;
    fullname?: string;
    avatar_url?: string;
    adderss?: string;
    gender?: string;
    phone_number?: string;
  };
}
