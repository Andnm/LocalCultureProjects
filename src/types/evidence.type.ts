export interface EvidenceType {
  id: string;
  description: string;
  evidence_url: string;
  costId: number;
}

export interface CreateEvidenceType {
  evidence_url: string;
  costId: number;
}

export interface UpdateEvidenceType {
  evidence_url: string[];
  costId: number;
}

