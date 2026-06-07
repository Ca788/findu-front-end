export type ArtifactStatus = 'pending' | 'processed' | 'failed' | 'needs_review';

export interface Artifact {
  id: string;
  artifact_type: string;
  status: ArtifactStatus;
  source?: string | null;
  occurred_at?: string | null;
  file_url?: string | null;
  processed_data?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
}

export interface UploadArtifactInput {
  file: File;
  artifact_type: string;
  source?: string;
}
