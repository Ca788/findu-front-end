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
  levelBars?: number;
}

const PREFERRED_MIME_TYPES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/ogg;codecs=opus',
  'audio/mp4',
];

const LEVEL_BARS_DEFAULT = 28;

function pickSupportedMimeType(): string | undefined {
  if (typeof MediaRecorder === 'undefined') return undefined;
  for (const mime of PREFERRED_MIME_TYPES) {
    if (MediaRecorder.isTypeSupported(mime)) return mime;
  }
  return undefined;
}

function emptyLevels(count: number): number[] {
  return Array.from({ length: count }, () => 0.12);
}

export function useAudioRecorder({
  maxDurationMs = 5 * 60_000,
  levelBars = LEVEL_BARS_DEFAULT,
}: UseAudioRecorderOptions = {}) {
  const [status, setStatus] = useState<AudioRecorderStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [recorded, setRecorded] = useState<RecordedAudio | null>(null);
  const [levels, setLevels] = useState<number[]>(() => emptyLevels(levelBars));

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const startedAtRef = useRef<number>(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const maxTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const levelBarsRef = useRef(levelBars);

  useEffect(() => {
    levelBarsRef.current = levelBars;
  }, [levelBars]);

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

  const stopAnalyser = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    analyserRef.current = null;
    if (audioContextRef.current) {
      void audioContextRef.current.close().catch(() => undefined);
      audioContextRef.current = null;
    }
  }, []);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const startAnalyser = useCallback(
    (stream: MediaStream) => {
      stopAnalyser();
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (!AudioCtx) return;

        const ctx = new AudioCtx();
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        analyser.smoothingTimeConstant = 0.72;
        source.connect(analyser);
        audioContextRef.current = ctx;
        analyserRef.current = analyser;

        const data = new Uint8Array(analyser.frequencyBinCount);

        const tick = () => {
          const node = analyserRef.current;
          if (!node) return;
          node.getByteFrequencyData(data);
          const bars = levelBarsRef.current;
          const step = Math.max(1, Math.floor(data.length / bars));
          const next: number[] = [];
          for (let i = 0; i < bars; i += 1) {
            let sum = 0;
            for (let j = 0; j < step; j += 1) {
              sum += data[i * step + j] ?? 0;
            }
            const avg = sum / step / 255;
            next.push(Math.min(1, 0.12 + avg * 1.35));
          }
          setLevels(next);
          rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
      } catch {
      }
    },
    [stopAnalyser],
  );

  const reset = useCallback(() => {
    clearTimers();
    stopAnalyser();
    stopStream();
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    setElapsedMs(0);
    setError(null);
    setLevels(emptyLevels(levelBarsRef.current));
    setStatus('idle');
    setRecorded((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });
  }, [clearTimers, stopAnalyser, stopStream]);

  useEffect(() => {
    return () => {
      clearTimers();
      stopAnalyser();
      stopStream();
      if (recorded?.url) URL.revokeObjectURL(recorded.url);
    };
  }, [clearTimers, stopAnalyser, stopStream, recorded?.url]);

  const stop = useCallback(async (): Promise<RecordedAudio | null> => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === 'inactive') return null;

    setStatus('stopping');
    stopAnalyser();
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
  }, [clearTimers, stopAnalyser, stopStream]);

  const start = useCallback(async (): Promise<string | null> => {
    if (status === 'recording' || status === 'requesting') return null;
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      const message = 'Gravação de áudio não suportada neste dispositivo.';
      setStatus('error');
      setError(message);
      return message;
    }

    setError(null);
    setStatus('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
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
      startAnalyser(stream);

      tickRef.current = setInterval(() => {
        setElapsedMs(Date.now() - startedAtRef.current);
      }, 200);

      maxTimeoutRef.current = setTimeout(() => {
        void stop();
      }, maxDurationMs);
      return null;
    } catch (err) {
      stopAnalyser();
      stopStream();
      setStatus('error');
      const message =
        err instanceof Error && err.name === 'NotAllowedError'
          ? 'Permissão de microfone negada. Ative o microfone nas configurações do app.'
          : 'Não foi possível acessar o microfone.';
      setError(message);
      return message;
    }
  }, [maxDurationMs, startAnalyser, status, stop, stopAnalyser, stopStream]);

  const cancel = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      try {
        recorder.stop();
      } catch {
      }
    }
    clearTimers();
    stopAnalyser();
    stopStream();
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    setElapsedMs(0);
    setLevels(emptyLevels(levelBarsRef.current));
    setRecorded((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });
    setStatus('idle');
  }, [clearTimers, stopAnalyser, stopStream]);

  return {
    status,
    error,
    elapsedMs,
    recorded,
    levels,
    isRecording: status === 'recording',
    isReady: status === 'ready',
    start,
    stop,
    cancel,
    reset,
  };
}
