export interface NotificationType {
  id?: number;
  notification_type: string;
  information: number;
  is_new: boolean;
  createdAt: string;
  receiver: any;
  sender: any;
}
