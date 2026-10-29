import { useCallback, useEffect, useRef, useState } from 'react';
import type { Segment } from '../api/types';

export type RecorderPhase = 'idle' | 'recording' | 'paused';
export type Notify = (msg: string, type?: '' | 'success' | 'error', ms?: number) => void;

export interface RecordingResult {
  segments: Segment[];
  duration: number;
  blob: Blob | null;
}

/* Web Speech API is not in the TypeScript DOM lib */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecognition = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SR: (new () => AnyRecognition) | undefined = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const speechSupported = !!SR;
export const LEVEL_BARS = 22;

const MIME_TYPES = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'];

/**
 * Live speech-to-text (browser SpeechRecognition) + audio capture (MediaRecorder)
 * + microphone level meter for the recording studio.
 */
export function useRecorder(lang: string, notify: Notify) {
  const [phase, setPhaseState] = useState<RecorderPhase>('idle');
  const [segments, setSegments] = useState<Segment[]>([]);
  const [interim, setInterim] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [level, setLevel] = useState(0);

  const phaseRef = useRef<RecorderPhase>('idle');
  const segmentsRef = useRef<Segment[]>([]);
  const langRef = useRef(lang);
  langRef.current = lang;
  const notifyRef = useRef(notify);
  notifyRef.current = notify;

  const baseRef = useRef(0);
  const resumedAtRef = useRef(0);
  const recRef = useRef<AnyRecognition | null>(null);
  const mrRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const mimeRef = useRef('');
  const streamRef = useRef<MediaStream | null>(null);
  const actxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef(0);
  const tickRef = useRef<ReturnType<typeof setInterval>>();

  const setPhase = (p: RecorderPhase) => {
    phaseRef.current = p;
    setPhaseState(p);
  };
  const elapsedNow = () => baseRef.current + (phaseRef.current === 'recording' ? (Date.now() - resumedAtRef.current) / 1000 : 0);

  /* ---- speech recognition ---- */
  const startRecognition = useCallback(() => {
    if (!SR) return;
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = langRef.current;
    rec.onresult = (e: AnyRecognition) => {
      let tmp = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const text: string = e.results[i][0].transcript.trim();
        if (e.results[i].isFinal) {
          if (!text) continue;
          const words = text.split(/\s+/).length;
          const seg: Segment = { t: Math.round(Math.max(0, elapsedNow() - words / 2.6) * 10) / 10, text: text.charAt(0).toUpperCase() + text.slice(1) };
          segmentsRef.current = [...segmentsRef.current, seg];
          setSegments(segmentsRef.current);
        } else tmp += text;
      }
      setInterim(tmp ? '… ' + tmp : '');
    };
    rec.onerror = (e: AnyRecognition) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        notifyRef.current('Microphone permission was denied. Allow it in the address bar and try again.', 'error', 6000);
        hardStop();
      } else if (e.error === 'audio-capture') {
        notifyRef.current('No microphone was found.', 'error');
        hardStop();
      } else if (e.error === 'network') notifyRef.current('Speech recognition needs an internet connection.', 'error');
    };
    // The browser ends recognition after silences; keep it running while recording
    rec.onend = () => {
      if (phaseRef.current === 'recording' && recRef.current === rec) {
        try {
          rec.start();
        } catch {
          /* already started */
        }
      }
    };
    try {
      rec.start();
      recRef.current = rec;
    } catch (e) {
      notifyRef.current('Could not start speech recognition: ' + (e as Error).message, 'error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopRecognition = useCallback(() => {
    const r = recRef.current;
    recRef.current = null;
    try {
      r?.stop();
    } catch {
      /* not running */
    }
    setInterim('');
  }, []);

  /* ---- audio capture + level meter ---- */
  const startAudio = async () => {
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      notifyRef.current(`Audio could not be captured (${(e as Error).name || 'error'}). Transcription may still work.`, 'error', 5000);
      return;
    }
    try {
      mimeRef.current = (window.MediaRecorder && MIME_TYPES.find((t) => MediaRecorder.isTypeSupported(t))) || '';
      if (window.MediaRecorder) {
        const mr = new MediaRecorder(streamRef.current, mimeRef.current ? { mimeType: mimeRef.current } : undefined);
        chunksRef.current = [];
        mr.ondataavailable = (e) => {
          if (e.data && e.data.size) chunksRef.current.push(e.data);
        };
        mr.start(1000);
        mrRef.current = mr;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AC: typeof AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const actx = new AC();
      actxRef.current = actx;
      const analyser = actx.createAnalyser();
      analyser.fftSize = 512;
      actx.createMediaStreamSource(streamRef.current).connect(analyser);
      const buf = new Uint8Array(analyser.fftSize);
      let lastOn = -1;
      const loop = () => {
        rafRef.current = requestAnimationFrame(loop);
        let on = 0;
        if (phaseRef.current === 'recording') {
          analyser.getByteTimeDomainData(buf);
          let sum = 0;
          for (let i = 0; i < buf.length; i++) {
            const v = (buf[i] - 128) / 128;
            sum += v * v;
          }
          on = Math.round(Math.min(1, Math.sqrt(sum / buf.length) * 5) * LEVEL_BARS);
        }
        if (on !== lastOn) {
          lastOn = on;
          setLevel(on);
        }
      };
      loop();
    } catch {
      /* the meter is optional */
    }
  };

  const releaseAudio = () => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    actxRef.current?.close().catch(() => undefined);
    streamRef.current = null;
    actxRef.current = null;
    mrRef.current = null;
    setLevel(0);
  };

  /* ---- controls ---- */
  const start = async (): Promise<boolean> => {
    await startAudio();
    if (!streamRef.current && !SR) {
      notifyRef.current('Nothing to record with: no microphone access and no speech recognition.', 'error', 5000);
      return false;
    }
    baseRef.current = 0;
    resumedAtRef.current = Date.now();
    segmentsRef.current = [];
    setSegments([]);
    setElapsed(0);
    setPhase('recording');
    startRecognition();
    tickRef.current = setInterval(() => setElapsed(elapsedNow()), 250);
    return true;
  };

  const pauseResume = () => {
    if (phaseRef.current === 'recording') {
      baseRef.current = elapsedNow();
      setPhase('paused');
      stopRecognition();
      try {
        if (mrRef.current?.state === 'recording') mrRef.current.pause();
      } catch {
        /* ignore */
      }
    } else if (phaseRef.current === 'paused') {
      resumedAtRef.current = Date.now();
      setPhase('recording');
      try {
        if (mrRef.current?.state === 'paused') mrRef.current.resume();
      } catch {
        /* ignore */
      }
      startRecognition();
    }
  };

  /** Stop and throw everything away (errors, leaving the page). */
  function hardStop() {
    clearInterval(tickRef.current);
    stopRecognition();
    try {
      if (mrRef.current && mrRef.current.state !== 'inactive') mrRef.current.stop();
    } catch {
      /* ignore */
    }
    releaseAudio();
    setPhase('idle');
  }

  /** Stop and return what was captured. */
  const stop = (): Promise<RecordingResult> => {
    baseRef.current = elapsedNow();
    clearInterval(tickRef.current);
    stopRecognition();
    setElapsed(baseRef.current);
    return new Promise((resolve) => {
      const done = () => {
        const blob = chunksRef.current.length ? new Blob(chunksRef.current, { type: mimeRef.current || 'audio/webm' }) : null;
        releaseAudio();
        setPhase('idle');
        resolve({ segments: segmentsRef.current, duration: Math.round(baseRef.current), blob });
      };
      const mr = mrRef.current;
      if (mr && mr.state !== 'inactive') {
        mr.onstop = done;
        try {
          mr.stop();
        } catch {
          done();
        }
      } else done();
    });
  };

  /** Restart recognition so a changed language takes effect mid-recording. */
  const restartRecognition = () => {
    if (phaseRef.current === 'recording') {
      stopRecognition();
      startRecognition();
    }
  };

  const getText = () => segmentsRef.current.map((s) => s.text).join(' ');

  // Warn before closing the tab mid-recording; discard on unmount
  useEffect(() => {
    if (phase === 'idle') return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [phase]);

  useEffect(
    () => () => {
      if (phaseRef.current !== 'idle') notifyRef.current('Recording discarded because you left the studio.', 'error', 4500);
      hardStop();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return { phase, segments, interim, elapsed, level, start, pauseResume, stop, restartRecognition, getText };
}
