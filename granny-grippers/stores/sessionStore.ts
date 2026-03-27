import { create } from 'zustand';
import type { Session } from '../types';
import { saveSessions } from '../utils/sessionStorage';

let timerInterval: ReturnType<typeof setInterval> | null = null;

interface SessionState {
  sessions: Session[];
  activeSession: Partial<Session> | null;
  elapsedSeconds: number;
  startSession: () => void;
  updateActiveSession: (data: Partial<Session>) => void;
  endSession: () => void;
  loadSessions: (sessions: Session[]) => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  sessions: [],
  activeSession: null,
  elapsedSeconds: 0,

  startSession: () => {
    if (timerInterval) clearInterval(timerInterval);

    set({
      activeSession: {
        id: Date.now().toString(),
        startedAt: new Date().toISOString(),
        pumpUsed: false,
      },
      elapsedSeconds: 0,
    });

    timerInterval = setInterval(() => {
      set((s) => ({ elapsedSeconds: s.elapsedSeconds + 1 }));
    }, 1000);
  },

  updateActiveSession: (data) =>
    set((s) => ({
      activeSession: s.activeSession ? { ...s.activeSession, ...data } : null,
    })),

  endSession: () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    const { activeSession, elapsedSeconds, sessions } = get();
    if (!activeSession) return;

    const completed: Session = {
      id: activeSession.id ?? Date.now().toString(),
      startedAt: activeSession.startedAt ?? new Date().toISOString(),
      durationSeconds: elapsedSeconds,
      mode: activeSession.mode ?? null,
      speed: activeSession.speed ?? null,
      pumpUsed: activeSession.pumpUsed ?? false,
    };

    const updated = [completed, ...sessions];
    set({ sessions: updated, activeSession: null, elapsedSeconds: 0 });
    saveSessions(updated);
  },

  loadSessions: (sessions) => set({ sessions }),
}));
