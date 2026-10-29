import { useEffect, useMemo, useState } from 'react';
import { EmptyState } from '../../components/Common';
import { Icon } from '../../components/Icon';
import { storage } from '../../lib/storage';
import type { TabProps } from './types';

interface Card {
  key: string;
  tag: string;
  front: string;
  back: string;
  big: boolean;
}

function loadKnown(id: string): Set<string> {
  try {
    return new Set<string>(JSON.parse(storage.get('fc_' + id, '[]')));
  } catch {
    return new Set();
  }
}

export function FlashcardsTab({ id, detail, active }: TabProps & { active: boolean }) {
  const notes = detail.lecture.notes || {};
  const cards = useMemo<Card[]>(() => {
    const list: Card[] = (notes.concepts || []).map((c) => ({ key: 'c:' + c.term, tag: 'CONCEPT', front: c.term, back: c.definition, big: true }));
    (notes.practice_questions || []).forEach((q) => list.push({ key: 'q:' + q.question, tag: 'QUESTION', front: q.question, back: q.answer, big: false }));
    return list;
  }, [notes.concepts, notes.practice_questions]);

  const [order, setOrder] = useState<number[]>(() => cards.map((_, i) => i));
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<string>>(() => loadKnown(id));

  // Deck changed (notes regenerated): reset the order
  useEffect(() => {
    setOrder(cards.map((_, i) => i));
    setIdx(0);
    setFlipped(false);
  }, [cards]);

  const go = (d: number) => {
    if (!cards.length) return;
    setIdx((cur) => (cur + d + cards.length) % cards.length);
    setFlipped(false);
  };
  const persist = (next: Set<string>) => {
    setKnown(next);
    storage.set('fc_' + id, JSON.stringify([...next]));
  };
  const mark = (isKnown: boolean) => {
    const c = cards[order[idx]];
    const next = new Set(known);
    if (isKnown) next.add(c.key);
    else next.delete(c.key);
    persist(next);
    go(1);
  };

  // Keyboard: arrows to move, space to flip (only while this tab is visible)
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (/INPUT|TEXTAREA|SELECT/.test((e.target as HTMLElement).tagName || '')) return;
      if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === ' ') {
        e.preventDefault();
        setFlipped((f) => !f);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  if (!cards.length)
    return (
      <div className="card">
        <EmptyState icon="layers" title="No flashcards yet" text="Generate notes to create flashcards from the key concepts." />
      </div>
    );

  const c = cards[order[idx]] ?? cards[0];
  return (
    <div>
      <div className="row spread mb-16">
        <div>
          <h3>Flashcards</h3>
          <span className="small muted">
            Card {idx + 1} of {cards.length} · {known.size} mastered
          </span>
        </div>
        <div className="row">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setOrder([...order].sort(() => Math.random() - 0.5));
              setIdx(0);
              setFlipped(false);
            }}
          >
            <Icon name="shuffle" size={14} />
            Shuffle
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              persist(new Set());
              setIdx(0);
              setFlipped(false);
            }}
          >
            Reset progress
          </button>
        </div>
      </div>
      <div className="progress green mb-24">
        <div style={{ width: (known.size / cards.length) * 100 + '%' }} />
      </div>
      <div className="fc-wrap">
        <div className={'fc' + (flipped ? ' flipped' : '')} tabIndex={0} role="button" aria-label="Flip card" onClick={() => setFlipped((f) => !f)}>
          <div className="face">
            <span className="tag">{c.tag}</span>
            <div className={c.big ? 'big' : 'txt'}>{c.front}</div>
            <span className="xs muted" style={{ position: 'absolute', bottom: 14 }}>
              Click to reveal the answer
            </span>
          </div>
          <div className="face back">
            <span className="tag">ANSWER</span>
            <div className="txt">{c.back}</div>
          </div>
        </div>
      </div>
      <div className="fc-bar">
        <button className="btn btn-ghost" onClick={() => go(-1)}>
          <Icon name="left" size={16} />
          Previous
        </button>
        <button className="btn btn-danger" onClick={() => mark(false)}>
          Still learning
        </button>
        <button className="btn btn-primary" onClick={() => mark(true)}>
          <Icon name="check" size={16} />
          Got it
        </button>
        <button className="btn btn-ghost" onClick={() => go(1)}>
          Next
          <Icon name="right" size={16} />
        </button>
      </div>
      <p className="xs muted" style={{ textAlign: 'center', marginTop: 14 }}>
        Keyboard: ← → to move, Space to flip
      </p>
    </div>
  );
}
