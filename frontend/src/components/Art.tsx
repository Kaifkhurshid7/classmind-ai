/**
 * Original inline-SVG artwork: hero illustration, subject covers for courses and
 * illustrated portraits for faculty. No external images are loaded.
 */

/* ------------------------------------------------------------------ */
/* Faculty avatar                                                      */
/* ------------------------------------------------------------------ */

export function initials(name: string): string {
  const words = name
    .replace(/\b(dr|prof|mr|mrs|ms)\.?\s/gi, '')
    .split(/\s+/)
    .filter(Boolean);
  return ((words[0]?.[0] || '') + (words.length > 1 ? words[words.length - 1][0] : '')).toUpperCase() || 'T';
}

const SKIN = ['#f3d2b5', '#e8b98f', '#d19a6c', '#b87a4b', '#8d5a36', '#6b4226'];
const HAIR = ['#1b1b1f', '#2c1b12', '#4a3020', '#6b6b73', '#a8741f'];
const CLOTHES = ['#0b3d91', '#0e7c66', '#7a3fc4', '#c2570c', '#b4234f', '#334155', '#1f7a8c', '#7c2d12'];
const BACKDROP = ['#dbe9ff', '#d8f1e8', '#ece0fb', '#fde6d2', '#fbdbe6', '#dfe7f3'];

function hash(name: string): number {
  let h = 7;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

/**
 * Original illustrated portrait, generated from the name so every person looks
 * different but stays the same everywhere. Purely decorative; the features are
 * not derived from the name's meaning.
 */
export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const h = hash(name);
  const pick = <T,>(list: T[], shift: number): T => list[(h >>> shift) % list.length];
  const skin = pick(SKIN, 0);
  const hair = pick(HAIR, 3);
  const clothes = pick(CLOTHES, 6);
  const backdrop = pick(BACKDROP, 9);
  const style = (h >>> 12) % 5; // 0 short, 1 long, 2 bun, 3 curly, 4 cropped
  const glasses = ((h >>> 15) & 1) === 1;
  const uid = 'av' + h.toString(36);
  return (
    <svg className="avatar-portrait" width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={`Portrait of ${name}`}>
      <defs>
        <clipPath id={uid}>
          <circle cx="50" cy="50" r="50" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${uid})`}>
        <rect width="100" height="100" fill={backdrop} />
        {/* hair behind the head */}
        {style === 1 && <path d="M28 46c-2-22 8-34 22-34s24 12 22 34c1 12 3 24 8 32H20c5-8 7-20 8-32z" fill={hair} />}
        {style === 3 && (
          <g fill={hair}>
            {[[33, 30], [42, 22], [54, 21], [64, 28], [31, 41], [69, 41], [50, 18]].map(([cx, cy]) => (
              <circle key={`${cx}${cy}`} cx={cx} cy={cy} r="10" />
            ))}
          </g>
        )}
        {/* shoulders and neck */}
        <path d="M10 104c0-24 17-35 40-35s40 11 40 35z" fill={clothes} />
        <path d="M38 70l12 14 12-14" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="3" strokeLinejoin="round" />
        <rect x="42" y="52" width="16" height="20" rx="7" fill={skin} />
        <rect x="42" y="60" width="16" height="9" fill="#000" opacity=".08" />
        {/* head */}
        <circle cx="33" cy="46" r="4.2" fill={skin} />
        <circle cx="67" cy="46" r="4.2" fill={skin} />
        <ellipse cx="50" cy="44" rx="17" ry="20" fill={skin} />
        {/* hair on top */}
        {style === 0 && <path d="M32 42c-2-17 7-26 18-26s20 9 18 26c-3-8-9-12-18-12s-15 4-18 12z" fill={hair} />}
        {style === 1 && <path d="M32 40c1-14 8-22 18-22s17 8 18 22c-5-6-9-9-18-9s-13 3-18 9z" fill={hair} />}
        {style === 2 && (
          <>
            <circle cx="50" cy="15" r="8" fill={hair} />
            <path d="M32 42c-2-17 7-26 18-26s20 9 18 26c-3-8-9-12-18-12s-15 4-18 12z" fill={hair} />
          </>
        )}
        {style === 3 && <path d="M34 36c4-8 10-10 16-10s12 2 16 10c-5-3-10-4-16-4s-11 1-16 4z" fill={hair} />}
        {style === 4 && <path d="M33 38c2-13 9-19 17-19s15 6 17 19c-4-5-9-7-17-7s-13 2-17 7z" fill={hair} opacity=".92" />}
        {/* face */}
        <circle cx="43.5" cy="45" r="1.9" fill="#1b1f27" />
        <circle cx="56.5" cy="45" r="1.9" fill="#1b1f27" />
        <path d="M38.5 39.5q5-3 10 0M51.5 39.5q5-3 10 0" fill="none" stroke={hair} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M44 54q6 5 12 0" fill="none" stroke="#7a3b2e" strokeWidth="2" strokeLinecap="round" />
        {glasses && (
          <g fill="none" stroke="#1f2937" strokeWidth="1.8">
            <circle cx="43.5" cy="45" r="6" />
            <circle cx="56.5" cy="45" r="6" />
            <path d="M49.5 45h1" />
          </g>
        )}
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Subject covers                                                      */
/* ------------------------------------------------------------------ */
export type Subject = 'biology' | 'physics' | 'code' | 'history' | 'economics' | 'chemistry' | 'maths' | 'language' | 'general';

export function subjectOf(name: string | null | undefined): Subject {
  const n = (name || '').toLowerCase();
  if (/bio|cell|life|botany|zoology|genetic/.test(n)) return 'biology';
  if (/phys|mechanic|motion|energy/.test(n)) return 'physics';
  if (/python|program|code|computer|software|algorithm/.test(n)) return 'code';
  if (/histor|civics|freedom|politic/.test(n)) return 'history';
  if (/econom|commerce|business|finance/.test(n)) return 'economics';
  if (/chem|atom|molecul/.test(n)) return 'chemistry';
  if (/math|algebra|calculus|geometry|statistic/.test(n)) return 'maths';
  if (/english|communicat|language|writing|literature/.test(n)) return 'language';
  return 'general';
}

const stroke = { fill: 'none', stroke: '#fff', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

function SubjectGlyph({ subject }: { subject: Subject }) {
  switch (subject) {
    case 'biology':
      return (
        <g {...stroke}>
          <circle cx="78" cy="46" r="30" opacity=".9" />
          <circle cx="86" cy="40" r="11" fill="#fff" fillOpacity=".35" />
          <circle cx="66" cy="58" r="5" fill="#fff" fillOpacity=".6" />
          <circle cx="92" cy="62" r="4" fill="#fff" fillOpacity=".6" />
          <path d="M20 88c2-22 18-30 38-30-1 20-14 32-38 30z" opacity=".9" />
          <path d="M22 86c10-10 20-17 32-24" opacity=".8" />
        </g>
      );
    case 'physics':
      return (
        <g {...stroke}>
          <ellipse cx="72" cy="52" rx="38" ry="14" transform="rotate(-25 72 52)" opacity=".85" />
          <ellipse cx="72" cy="52" rx="38" ry="14" transform="rotate(35 72 52)" opacity=".85" />
          <ellipse cx="72" cy="52" rx="38" ry="14" transform="rotate(95 72 52)" opacity=".85" />
          <circle cx="72" cy="52" r="7" fill="#fff" />
          <circle cx="104" cy="34" r="3.5" fill="#fff" />
        </g>
      );
    case 'code':
      return (
        <g {...stroke}>
          <rect x="30" y="20" width="84" height="60" rx="8" opacity=".9" />
          <path d="M30 34h84" opacity=".8" />
          <path d="M52 52l-9 8 9 8M92 52l9 8-9 8" />
          <path d="M66 70l12-20" opacity=".9" />
          <circle cx="40" cy="27" r="1.8" fill="#fff" stroke="none" />
          <circle cx="47" cy="27" r="1.8" fill="#fff" stroke="none" />
        </g>
      );
    case 'history':
      return (
        <g {...stroke}>
          <path d="M28 88h88M34 88V50M52 88V50M92 88V50M110 88V50" opacity=".9" />
          <path d="M26 50h92M72 18l46 26H26z" />
          <path d="M72 30v8" opacity=".8" />
        </g>
      );
    case 'economics':
      return (
        <g {...stroke}>
          <path d="M28 88h92" opacity=".9" />
          <rect x="38" y="62" width="14" height="26" rx="2" fill="#fff" fillOpacity=".35" />
          <rect x="62" y="44" width="14" height="44" rx="2" fill="#fff" fillOpacity=".5" />
          <rect x="86" y="26" width="14" height="62" rx="2" fill="#fff" fillOpacity=".65" />
          <path d="M34 50l28-18 20 6 28-20" />
          <path d="M104 18h10v10" />
        </g>
      );
    case 'chemistry':
      return (
        <g {...stroke}>
          <path d="M62 18h20" />
          <path d="M65 18v24L42 78q-4 9 5 10h50q9-1 5-10L79 42V18" opacity=".95" />
          <path d="M50 66h44" opacity=".8" />
          <circle cx="68" cy="56" r="3.2" fill="#fff" stroke="none" />
          <circle cx="81" cy="49" r="2.6" fill="#fff" stroke="none" />
          <circle cx="75" cy="76" r="3.4" fill="#fff" stroke="none" />
          <circle cx="104" cy="30" r="5" opacity=".7" />
          <circle cx="112" cy="46" r="3" opacity=".7" />
        </g>
      );
    case 'maths':
      return (
        <g {...stroke}>
          <path d="M34 18v66h78" opacity=".9" />
          <path d="M42 76L106 26" />
          <circle cx="58" cy="63" r="4.5" fill="#fff" />
          <circle cx="90" cy="38" r="4.5" fill="#fff" />
          <path d="M52 84v-4M72 84v-4M92 84v-4M30 66h4M30 46h4M30 26h4" opacity=".7" />
          <path d="M92 70h16M100 62v16" opacity=".85" />
        </g>
      );
    case 'language':
      return (
        <g {...stroke}>
          <path d="M34 22h58a8 8 0 0 1 8 8v26a8 8 0 0 1-8 8H66L50 78V64H34a8 8 0 0 1-8-8V30a8 8 0 0 1 8-8z" opacity=".95" />
          <path d="M40 38h40M40 50h24" opacity=".85" />
          <rect x="92" y="52" width="30" height="24" rx="7" fill="#fff" fillOpacity=".3" />
          <path d="M100 62h14M100 69h8" opacity=".9" />
        </g>
      );
    default:
      return (
        <g {...stroke}>
          <path d="M30 28c14-5 28-3 42 6v46c-14-9-28-11-42-6z" opacity=".9" />
          <path d="M114 28c-14-5-28-3-42 6v46c14-9 28-11 42-6z" opacity=".75" />
        </g>
      );
  }
}

/** Decorative artwork for course thumbnails; sits in the thumbnail's top-right. */
export function CourseArt({ subject }: { subject: Subject }) {
  return (
    <svg className="thumb-art" viewBox="0 0 144 100" preserveAspectRatio="xMaxYMid meet" aria-hidden="true">
      <SubjectGlyph subject={subject} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Hero illustration                                                   */
/* ------------------------------------------------------------------ */
export function HeroArt() {
  const bars = [10, 22, 14, 30, 18, 34, 12, 26, 16, 28, 10, 20, 32, 14];
  return (
    <svg className="hero-illustration" viewBox="0 0 560 420" role="img" aria-label="A lecture turning into a transcript, notes and a quiz">
      <defs>
        <linearGradient id="ha-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#dbe9ff" />
          <stop offset="1" stopColor="#c7dcff" />
        </linearGradient>
        <linearGradient id="ha-rec" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2f80ff" />
          <stop offset="1" stopColor="#0043b3" />
        </linearGradient>
        <filter id="ha-sh" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#0b2a4a" floodOpacity=".16" />
        </filter>
      </defs>

      <rect x="30" y="26" width="500" height="368" rx="36" fill="url(#ha-bg)" />
      <circle cx="505" cy="52" r="46" fill="#fff" opacity=".35" />
      <circle cx="58" cy="372" r="60" fill="#fff" opacity=".3" />

      {/* Live transcript window */}
      <g filter="url(#ha-sh)">
        <rect x="62" y="70" width="256" height="214" rx="18" fill="#fff" />
        <rect x="62" y="70" width="256" height="38" rx="18" fill="#f2f6fc" />
        <rect x="62" y="92" width="256" height="16" fill="#f2f6fc" />
        <circle cx="84" cy="89" r="5" fill="#ff6b6b" />
        <circle cx="102" cy="89" r="5" fill="#ffc94d" />
        <circle cx="120" cy="89" r="5" fill="#3ddc97" />
        <text x="196" y="94" fontSize="13" fontWeight="700" fill="#0f1114">Live transcript</text>
        <circle cx="296" cy="89" r="5" fill="#e5484d" />
      </g>
      <g transform="translate(84 128)">
        {bars.map((h, i) => (
          <rect key={i} x={i * 14} y={34 - h / 2} width="7" height={h} rx="3.5" fill="url(#ha-rec)" opacity={0.45 + (i % 4) * 0.15} />
        ))}
      </g>
      {[
        [84, 188, 36, 120],
        [84, 214, 36, 150],
        [84, 240, 36, 96],
      ].map(([x, y, w1, w2], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w1} height="12" rx="6" fill="#dbe9ff" />
          <rect x={x + w1 + 10} y={y} width={w2} height="12" rx="6" fill="#e6ecf5" />
        </g>
      ))}

      {/* AI notes card */}
      <g filter="url(#ha-sh)">
        <rect x="318" y="46" width="200" height="148" rx="18" fill="#fff" />
      </g>
      <rect x="338" y="66" width="28" height="28" rx="8" fill="#e3eeff" />
      <path d="M352 70l2.2 6.3 6.3 2.2-6.3 2.2L352 87l-2.2-6.3-6.3-2.2 6.3-2.2z" fill="#0056d2" />
      <text x="376" y="85" fontSize="14" fontWeight="800" fill="#0f1114">AI notes</text>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(338 ${112 + i * 26})`}>
          <circle cx="8" cy="8" r="8" fill="#e6f5ee" />
          <path d="M4.5 8.2l2.4 2.4 4.6-4.8" fill="none" stroke="#0f7b4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="24" y="3" width={[118, 96, 108][i]} height="10" rx="5" fill="#e6ecf5" />
        </g>
      ))}

      {/* Quiz score */}
      <g filter="url(#ha-sh)">
        <rect x="352" y="226" width="166" height="136" rx="18" fill="#fff" />
      </g>
      <circle cx="412" cy="294" r="34" fill="none" stroke="#eaeef5" strokeWidth="10" />
      <circle cx="412" cy="294" r="34" fill="none" stroke="#1fa971" strokeWidth="10" strokeLinecap="round" strokeDasharray="196 214" transform="rotate(-90 412 294)" />
      <text x="412" y="299" textAnchor="middle" fontSize="16" fontWeight="800" fill="#0f1114">92%</text>
      <text x="456" y="282" fontSize="13" fontWeight="800" fill="#0f1114">Quiz</text>
      <text x="456" y="300" fontSize="12" fill="#5b6573">score</text>
      <rect x="456" y="312" width="48" height="8" rx="4" fill="#e6f5ee" />

      {/* Tutor chat */}
      <g filter="url(#ha-sh)">
        <rect x="62" y="304" width="262" height="70" rx="16" fill="#fff" />
      </g>
      <circle cx="92" cy="339" r="16" fill="url(#ha-rec)" />
      <text x="92" y="344" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff">AI</text>
      <text x="120" y="332" fontSize="13" fontWeight="800" fill="#0f1114">Ask the AI tutor</text>
      <text x="120" y="352" fontSize="12" fill="#5b6573">Answers from your lecture only</text>

      {/* Sparkles */}
      <path d="M498 214l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#0056d2" opacity=".75" />
      <path d="M50 238l2 5.5 5.5 2-5.5 2-2 5.5-2-5.5-5.5-2 5.5-2z" fill="#fff" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Recording studio illustration                                       */
/* ------------------------------------------------------------------ */
export function StudioArt() {
  return (
    <svg className="studio-art" viewBox="0 0 420 300" role="img" aria-label="A microphone turning speech into a transcript">
      <defs>
        <linearGradient id="sa-mic" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3b8bff" />
          <stop offset="1" stopColor="#0043b3" />
        </linearGradient>
        <linearGradient id="sa-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".55" />
          <stop offset="1" stopColor="#ffffff" stopOpacity=".15" />
        </linearGradient>
        <filter id="sa-sh" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="9" floodColor="#0b2a4a" floodOpacity=".18" />
        </filter>
      </defs>
      <rect x="14" y="14" width="392" height="272" rx="30" fill="url(#sa-bg)" />
      <circle cx="96" cy="212" r="58" fill="#fff" opacity=".35" />

      {/* sound waves */}
      {[34, 52, 70].map((r, i) => (
        <path key={r} d={`M${150 - r} 112a${r} ${r} 0 0 1 0 ${r * 1.1}`} fill="none" stroke="#2f80ff" strokeWidth="3" strokeLinecap="round" opacity={0.75 - i * 0.2} transform="translate(-6 -14)" />
      ))}
      {[34, 52, 70].map((r, i) => (
        <path key={'r' + r} d={`M${150 + r} 112a${r} ${r} 0 0 0 0 ${r * 1.1}`} fill="none" stroke="#2f80ff" strokeWidth="3" strokeLinecap="round" opacity={0.75 - i * 0.2} transform="translate(26 -14)" />
      ))}

      {/* microphone */}
      <g filter="url(#sa-sh)">
        <rect x="128" y="44" width="52" height="96" rx="26" fill="url(#sa-mic)" />
      </g>
      {[62, 74, 86, 98, 110].map((y) => (
        <line key={y} x1="140" x2="168" y1={y} y2={y} stroke="#fff" strokeOpacity=".35" strokeWidth="2.5" strokeLinecap="round" />
      ))}
      <path d="M108 112v6a46 46 0 0 0 92 0v-6" fill="none" stroke="#0b2a4a" strokeWidth="5" strokeLinecap="round" />
      <line x1="154" y1="164" x2="154" y2="206" stroke="#0b2a4a" strokeWidth="5" strokeLinecap="round" />
      <rect x="126" y="206" width="56" height="9" rx="4.5" fill="#0b2a4a" />

      {/* transcript card */}
      <g filter="url(#sa-sh)">
        <rect x="232" y="44" width="160" height="104" rx="14" fill="#fff" />
      </g>
      <circle cx="248" cy="62" r="4.5" fill="#e5484d" />
      <text x="260" y="66" fontSize="11" fontWeight="800" fill="#0f1114">Live transcript</text>
      {[[78, 130], [96, 112], [114, 124], [132, 80]].map(([y, w], i) => (
        <g key={i}>
          <rect x="246" y={y} width="26" height="8" rx="4" fill="#cfe0ff" />
          <rect x="278" y={y} width={w} height="8" rx="4" fill="#e6ecf5" />
        </g>
      ))}

      {/* notes card */}
      <g filter="url(#sa-sh)">
        <rect x="262" y="168" width="130" height="88" rx="14" fill="#fff" />
      </g>
      <path d="M278 188l2 5.5 5.5 2-5.5 2-2 5.5-2-5.5-5.5-2 5.5-2z" fill="#0056d2" />
      <text x="292" y="196" fontSize="11" fontWeight="800" fill="#0f1114">AI notes</text>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(276 ${210 + i * 14})`}>
          <circle cx="5" cy="5" r="5" fill="#e6f5ee" />
          <path d="M2.8 5.2l1.6 1.6 3-3.2" fill="none" stroke="#0f7b4f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="16" y="2" width={[84, 70, 78][i]} height="6" rx="3" fill="#e6ecf5" />
        </g>
      ))}

      {/* sparkles */}
      <path d="M222 24l2.5 6.5 6.5 2.5-6.5 2.5-2.5 6.5-2.5-6.5-6.5-2.5 6.5-2.5z" fill="#0056d2" opacity=".7" />
      <path d="M40 70l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#fff" />
    </svg>
  );
}
