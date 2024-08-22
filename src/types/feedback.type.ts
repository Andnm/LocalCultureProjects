export interface PostFeedbackType {
  projectId: number;
  coordination_work: string;
  compare_results: string;
  comment: string;
  suggest_improvement: string;
  general_assessment: number;
  conclusion: string;
}

export type UpdateFeedbackType = Omit<PostFeedbackType, 'projectId'>;

export type FeedbackType = UpdateFeedbackType;
