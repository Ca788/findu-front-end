import authorizedApiClient from '@/infrastructure/authorized-api.client';
import type { SuccessResponse } from '@/infrastructure/AppResponse';
import type {
  Artifact,
  UploadArtifactInput,
} from '@/features/artifacts/models/artifact.model';

const BASE_PATH = '/artifacts';

export async function uploadArtifact(input: UploadArtifactInput): Promise<Artifact> {
  const formData = new FormData();
  formData.append('file', input.file);
  formData.append('artifact_type', input.artifact_type);
  if (input.source) formData.append('source', input.source);

  const response = await authorizedApiClient.post<SuccessResponse<Artifact>>(
    BASE_PATH,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return response.data.data;
}
