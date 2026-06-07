import { useMutation } from '@tanstack/react-query';
import { uploadArtifact } from '@/features/artifacts/gateway/artifacts.gateway';

export function useUploadArtifact() {
  return useMutation({
    mutationFn: uploadArtifact,
  });
}
