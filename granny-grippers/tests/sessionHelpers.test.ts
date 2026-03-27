import { afterEach, describe, expect, it, vi } from 'vitest';
import { formatDuration, getRelativeDateLabel } from '../hooks/useSessions';

describe('session helpers', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('formats mm:ss durations', () => {
    expect(formatDuration(0)).toBe('00:00');
    expect(formatDuration(65)).toBe('01:05');
    expect(formatDuration(3599)).toBe('59:59');
  });

  it('formats relative dates for today and yesterday', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-28T10:00:00.000Z'));

    expect(getRelativeDateLabel('2026-03-28T05:00:00')).toBe('Today');
    expect(getRelativeDateLabel('2026-03-27T10:00:00')).toBe('Yesterday');
  });
});
