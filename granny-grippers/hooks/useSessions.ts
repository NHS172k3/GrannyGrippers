import { useEffect } from 'react';
import { useSessionStore } from '../stores/sessionStore';
import { loadSessions } from '../utils/sessionStorage';

export function useSessions() {
  const sessions = useSessionStore((s) => s.sessions);
  const activeSession = useSessionStore((s) => s.activeSession);
  const elapsedSeconds = useSessionStore((s) => s.elapsedSeconds);
  const startSession = useSessionStore((s) => s.startSession);
  const endSession = useSessionStore((s) => s.endSession);

  useEffect(() => {
    loadSessions().then((saved) => {
      if (saved.length > 0) {
        useSessionStore.getState().loadSessions(saved);
      }
    });
  }, []);

  return {
    sessions,
    activeSession,
    elapsedSeconds,
    startSession,
    endSession,
  };
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function getRelativeDateLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
