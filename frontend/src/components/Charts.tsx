/** Small dependency-free SVG charts for the analytics dashboard. */

const W = 620;
const H = 230;
const PAD = { l: 34, r: 10, t: 12, b: 26 };

function Axis({ max, ticks, unit = '' }: { max: number; ticks: number[]; unit?: string }) {
  const h = H - PAD.t - PAD.b;
  return (
    <g>
      {ticks.map((t) => {
        const y = PAD.t + h - (t / max) * h;
        return (
          <g key={t}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y} y2={y} stroke="#e8edf5" strokeWidth="1" />
            <text x={PAD.l - 6} y={y + 4} textAnchor="end" fontSize="11" fill="#7a8696">
              {t}
              {unit}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function XLabels({ labels, every }: { labels: string[]; every: number }) {
  const w = W - PAD.l - PAD.r;
  const step = w / labels.length;
  return (
    <g>
      {labels.map((l, i) =>
        i % every === 0 ? (
          <text key={i} x={PAD.l + step * i + step / 2} y={H - 8} textAnchor="middle" fontSize="11" fill="#7a8696">
            {l}
          </text>
        ) : null,
      )}
    </g>
  );
}

export interface StackSeries {
  key: string;
  label: string;
  color: string;
}

/** Stacked daily bars (e.g. lectures, quizzes, questions per day). */
export function StackedBars<T extends { day: string; date?: string }>({ data, series }: { data: T[]; series: StackSeries[] }) {
  const totals = data.map((d) => series.reduce((a, s) => a + ((d as Record<string, unknown>)[s.key] as number), 0));
  const max = Math.max(4, Math.ceil(Math.max(...totals) / 4) * 4);
  const h = H - PAD.t - PAD.b;
  const step = (W - PAD.l - PAD.r) / data.length;
  const bw = Math.max(4, step * 0.62);
  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Daily activity">
      <Axis max={max} ticks={[0, max / 4, max / 2, (max * 3) / 4, max]} />
      {data.map((d, i) => {
        let y = PAD.t + h;
        const x = PAD.l + step * i + (step - bw) / 2;
        return (
          <g key={i}>
            <title>{`${d.date || d.day}: ${series.map((s) => `${(d as Record<string, unknown>)[s.key]} ${s.label.toLowerCase()}`).join(', ')}`}</title>
            {series.map((s) => {
              const v = (d as Record<string, unknown>)[s.key] as number;
              const bh = (v / max) * h;
              y -= bh;
              return v ? <rect key={s.key} x={x} y={y} width={bw} height={bh} fill={s.color} rx={i === 0 ? 0 : 1.5} /> : null;
            })}
          </g>
        );
      })}
      <XLabels labels={data.map((d) => d.day)} every={4} />
    </svg>
  );
}

/** Line chart with an area fill; gaps (null) are skipped. */
export function LineChart({ data }: { data: { day: string; avg: number | null; attempts: number }[] }) {
  const h = H - PAD.t - PAD.b;
  const w = W - PAD.l - PAD.r;
  const step = w / data.length;
  const pts = data.map((d, i) => (d.avg === null ? null : { x: PAD.l + step * i + step / 2, y: PAD.t + h - (d.avg / 100) * h, d })).filter(Boolean) as { x: number; y: number; d: (typeof data)[number] }[];
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const area = pts.length ? `${line} L${pts[pts.length - 1].x.toFixed(1)} ${PAD.t + h} L${pts[0].x.toFixed(1)} ${PAD.t + h} Z` : '';
  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Average quiz score over time">
      <defs>
        <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0056d2" stopOpacity=".22" />
          <stop offset="1" stopColor="#0056d2" stopOpacity="0" />
        </linearGradient>
      </defs>
      <Axis max={100} ticks={[0, 25, 50, 75, 100]} unit="%" />
      {area && <path d={area} fill="url(#trend-fill)" />}
      {line && <path d={line} fill="none" stroke="#0056d2" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />}
      {pts.map((p, i) => (
        <g key={i}>
          <title>{`${p.d.day}: ${p.d.avg}% average (${p.d.attempts} ${p.d.attempts === 1 ? 'attempt' : 'attempts'})`}</title>
          <circle cx={p.x} cy={p.y} r="4" fill="#fff" stroke="#0056d2" strokeWidth="2.2" />
        </g>
      ))}
      <XLabels labels={data.map((d) => d.day)} every={4} />
    </svg>
  );
}

/** Donut chart with a centre label. */
export function Donut({ parts, center, sub }: { parts: { label: string; value: number; color: string }[]; center: string; sub: string }) {
  const total = parts.reduce((a, p) => a + p.value, 0) || 1;
  const r = 52;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg className="donut" viewBox="0 0 140 140" role="img" aria-label="Score distribution">
      <circle cx="70" cy="70" r={r} fill="none" stroke="#eef2f8" strokeWidth="18" />
      {parts.map((p) => {
        const len = (p.value / total) * c;
        const el = (
          <circle key={p.label} cx="70" cy="70" r={r} fill="none" stroke={p.color} strokeWidth="18" strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset} transform="rotate(-90 70 70)">
            <title>{`${p.label}: ${p.value}`}</title>
          </circle>
        );
        offset += len;
        return el;
      })}
      <text x="70" y="68" textAnchor="middle" fontSize="24" fontWeight="800" fill="#0f1114">
        {center}
      </text>
      <text x="70" y="86" textAnchor="middle" fontSize="11" fill="#7a8696">
        {sub}
      </text>
    </svg>
  );
}
