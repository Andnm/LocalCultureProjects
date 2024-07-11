export interface EvidenceType {
  id: string;
  description: string;
  evidence_url: string;
  costId: number;
}

export interface CreateEvidenceType {
  description: string;
  evidence_url: string;
  costId: number;
}
