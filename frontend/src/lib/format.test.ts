import { describe, expect, it } from 'vitest';
import { fmtClock, fmtDur, pct, plural } from './format';

describe('format helpers', () => {
  it('formats clock times', () => {
    expect(fmtClock(0)).toBe('00:00');
    expect(fmtClock(75.9)).toBe('01:15');
    expect(fmtClock(3725)).toBe('1:02:05');
    expect(fmtClock(null)).toBe('00:00');
  });

  it('formats durations', () => {
    expect(fmtDur(0)).toBe('0 min');
    expect(fmtDur(30)).toBe('30 sec');
    expect(fmtDur(600)).toBe('10 min');
    expect(fmtDur(5400)).toBe('1 h 30 min');
  });

  it('pluralises and computes percentages', () => {
    expect(plural(1, 'lecture')).toBe('1 lecture');
    expect(plural(3, 'lecture')).toBe('3 lectures');
    expect(pct(3, 4)).toBe(75);
  });
});
