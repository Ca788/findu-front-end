'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type AudioRecorderStatus =
  | 'idle'
  | 'requesting'
  | 'recording'
  | 'stopping'
  | 'ready'
  | 'error';

export interface RecordedAudio {
  blob: Blob;
  url: string;
  mimeType: string;
  durationMs: number;
}

interface UseAudioRecorderOptions {
  maxDurationMs?: number;
}

const PREFERRED_MIME_TYPES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/ogg;codecs=opus',
  'audio/mp4',
];

function pickSupportedMimeType(): string | undefined {
  if (typeof MediaRecorder === 'undefined') return undefined;
  for (const mime of PREFERRED_MIME_TYPES) {
    if (MediaRecorder.isTypeSupported(mime)) return mime;
  }
  return undefined;
}

export function useAudioRecorder({ maxDurationMs = 5 * 60_000 }: UseAudioRecorderOptions = {}) {
  const [status, setStatus] = useState<AudioRecorderStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [recorded, setRecorded] = useState<RecordedAudio | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const startedAtRef = useRef<number>(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const maxTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    if (maxTimeoutRef.current) {
      clearTimeout(maxTimeoutRef.current);
      maxTimeoutRef.current = null;
    }
  }, []);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    stopStream();
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    setElapsedMs(0);
    setError(null);
    setStatus('idle');
    setRecorded((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });
  }, [clearTimers, stopStream]);

  useEffect(() => {
    return () => {
      clearTimers();
      stopStream();
      if (recorded?.url) URL.revokeObjectURL(recorded.url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stop = useCallback(async (): Promise<RecordedAudio | null> => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === 'inactive') return null;

    setStatus('stopping');
    return new Promise<RecordedAudio | null>((resolve) => {
      recorder.addEventListener(
        'stop',
        () => {
          clearTimers();
          stopStream();
          const mimeType = recorder.mimeType || 'audio/webm';
          const blob = new Blob(chunksRef.current, { type: mimeType });
          chunksRef.current = [];
          const durationMs = Date.now() - startedAtRef.current;
          if (blob.size === 0) {
            setStatus('error');
            setError('Áudio vazio. Tente novamente.');
            resolve(null);
            return;
          }
          const url = URL.createObjectURL(blob);
          const result: RecordedAudio = { blob, url, mimeType, durationMs };
          setRecorded((prev) => {
            if (prev?.url) URL.revokeObjectURL(prev.url);
            return result;
          });
          setStatus('ready');
          resolve(result);
        },
        { once: true },
      );
      recorder.stop();
    });
  }, [clearTimers, stopStream]);

  const start = useCallback(async () => {
    if (status === 'recording' || status === 'requesting') return;
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setStatus('error');
      setError('Gravação de áudio não suportada neste navegador.');
      return;
    }

    setError(null);
    setStatus('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = pickSupportedMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.addEventListener('dataavailable', (event) => {
        if (event.data && event.data.size > 0) chunksRef.current.push(event.data);
      });

      recorder.start(250);
      startedAtRef.current = Date.now();
      setElapsedMs(0);
      setRecorded((prev) => {
        if (prev?.url) URL.revokeObjectURL(prev.url);
        return null;
      });
      setStatus('recording');

      tickRef.current = setInterval(() => {
        setElapsedMs(Date.now() - startedAtRef.current);
      }, 200);

      maxTimeoutRef.current = setTimeout(() => {
        stop();
      }, maxDurationMs);
    } catch (err) {
      stopStream();
      setStatus('error');
      const message =
        err instanceof Error && err.name === 'NotAllowedError'
          ? 'Permissão de microfone negada.'
          : 'Não foi possível acessar o microfone.';
      setError(message);
    }
  }, [maxDurationMs, status, stop, stopStream]);

  const cancel = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      try {
        recorder.stop();
      } catch {
        // noop
      }
    }
    clearTimers();
    stopStream();
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    setElapsedMs(0);
    setRecorded((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });
    setStatus('idle');
  }, [clearTimers, stopStream]);

  return {
    status,
    error,
    elapsedMs,
    recorded,
    isRecording: status === 'recording',
    isReady: status === 'ready',
    start,
    stop,
    cancel,
    reset,
  };
}
