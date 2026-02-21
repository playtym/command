import { motion } from 'framer-motion'

/* ═══════ RING CHART ═══════ */
export function Ring({ percent, value, size = 56, stroke = 4, color = 'var(--orange)', track = 'rgba(0,0,0,0.08)', children }) {
  const pct = percent ?? value ?? 0
  const r = (size - stroke) / 2, circ = 2 * Math.PI * r, off = circ - (pct / 100) * circ
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track} fill="none" strokeWidth={stroke} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} stroke={color} fill="none" strokeWidth={stroke}
          strokeDasharray={circ} initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: off }}
          transition={{ duration: 1, ease: 'easeOut' }} strokeLinecap="round" />
      </svg>
      {children && <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>{children}</div>}
    </div>
  )
}

/* ═══════ DONUT CHART ═══════ */
export function Donut({ segments = [], size = 100, stroke = 12, track = 'rgba(0,0,0,0.08)', children }) {
  const r = (size - stroke) / 2, circ = 2 * Math.PI * r
  let acc = 0
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track} fill="none" strokeWidth={stroke} />
        {segments.map((s, i) => {
          const d = (s.value / 100) * circ, o = -(acc / 100) * circ
          acc += s.value
          return <circle key={i} cx={size / 2} cy={size / 2} r={r} stroke={s.color} fill="none"
            strokeWidth={stroke} strokeDasharray={`${d} ${circ - d}`} strokeDashoffset={o} strokeLinecap="round" />
        })}
      </svg>
      {children && <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>{children}</div>}
    </div>
  )
}

/* ═══════ BAR ═══════ */
export function Bar({ value = 0, max = 100, color = 'var(--orange)', h = 5, track, delay = 0 }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div style={{ background: track || 'rgba(0,0,0,0.08)', borderRadius: 100, height: h, width: '100%', overflow: 'hidden' }}>
      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
        transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ height: '100%', background: color, borderRadius: 100 }} />
    </div>
  )
}

export function BarLight(props) {
  return <Bar {...props} track="rgba(0,0,0,0.07)" />
}

/* ═══════ SPARKLINE — animated mini trend chart ═══════ */
export function Sparkline({ data = [], width = 100, height = 28, color = 'var(--orange)', gradient = true, strokeW = 1.5, dotEnd = true }) {
  if (data.length < 2) return null
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1
  const pad = height * 0.12
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * width,
    y: pad + (1 - (v - min) / range) * (height - 2 * pad)
  }))
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const area = `${line} L${width},${height} L0,${height} Z`
  const id = `sp${Math.random().toString(36).slice(2, 7)}`
  const last = pts[pts.length - 1]
  return (
    <svg width={width} height={height} style={{ display: 'block', flexShrink: 0 }}>
      {gradient && <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
        <stop offset="100%" stopColor={color} stopOpacity={0.02} />
      </linearGradient></defs>}
      {gradient && <path d={area} fill={`url(#${id})`} />}
      <motion.path d={line} fill="none" stroke={color} strokeWidth={strokeW}
        strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }} />
      {dotEnd && <motion.circle cx={last.x} cy={last.y} r={2.5} fill={color}
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 1.3, type: 'spring', stiffness: 400 }} />}
    </svg>
  )
}

/* ═══════ HEATGRID — calendar-style spending heatmap ═══════ */
export function HeatGrid({ data = [], color = 'var(--orange)', cols = 7, cellSize = 14, gap = 3 }) {
  const vals = data.filter(d => !d.empty && d.value > 0).map(d => d.value)
  const max = vals.length ? Math.max(...vals) : 1
  return (
    <div style={{ display: 'inline-grid', gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`, gap }}>
      {data.map((d, i) => {
        const t = (d.empty || !d.value) ? 0 : d.value / max
        return (
          <motion.div key={i}
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.012, type: 'spring', stiffness: 300, damping: 22 }}
            title={d.label ? `${d.label}: ₹${d.value?.toLocaleString()}` : ''}
            style={{
              width: cellSize, height: cellSize, borderRadius: 3,
              background: (d.empty || !d.value) ? 'var(--card-2)' : color,
              opacity: (d.empty || !d.value) ? 0.12 : (0.2 + t * 0.8),
            }} />
        )
      })}
    </div>
  )
}

/* ═══════ SEGMENT BAR — horizontal stacked bar ═══════ */
export function SegmentBar({ segments = [], height = 10, rounded = true, gap = 2 }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0)
  return (
    <div style={{ display: 'flex', height, borderRadius: rounded ? 100 : 0, overflow: 'hidden', width: '100%', gap }}>
      {segments.map((seg, i) => (
        <motion.div key={i}
          initial={{ width: 0 }} animate={{ width: `${(seg.value / total) * 100}%` }}
          transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ height: '100%', background: seg.color, borderRadius: rounded ? 100 : 0, minWidth: seg.value > 0 ? 4 : 0 }}
        />
      ))}
    </div>
  )
}

/* ═══════ RADAR / SPIDER CHART ═══════ */
export function RadarChart({ axes = [], size = 160, color = 'var(--orange)', trackColor = 'rgba(0,0,0,0.06)' }) {
  const cx = size / 2, cy = size / 2, maxR = size / 2 - 26
  const n = axes.length, step = (2 * Math.PI) / n
  const pt = (i, r) => ({ x: cx + r * Math.cos(i * step - Math.PI / 2), y: cy + r * Math.sin(i * step - Math.PI / 2) })
  const rings = [0.25, 0.5, 0.75, 1]
  const dataPts = axes.map((a, i) => pt(i, (a.value / 100) * maxR))
  const dataPoly = dataPts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  return (
    <svg width={size} height={size} style={{ display: 'block', margin: '0 auto' }}>
      {/* Grid rings */}
      {rings.map(r => (
        <polygon key={r}
          points={Array.from({ length: n }, (_, i) => { const p = pt(i, maxR * r); return `${p.x.toFixed(1)},${p.y.toFixed(1)}` }).join(' ')}
          fill="none" stroke={trackColor} strokeWidth={0.8} />
      ))}
      {/* Axis lines */}
      {axes.map((_, i) => {
        const p = pt(i, maxR)
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={trackColor} strokeWidth={0.5} />
      })}
      {/* Data polygon — animated */}
      <motion.polygon points={dataPoly}
        fill={`${color}22`} stroke={color} strokeWidth={2} strokeLinejoin="round"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }} />
      {/* Data dots */}
      {dataPts.map((p, i) => (
        <motion.circle key={i} cx={p.x} cy={p.y} r={3.5} fill={color} stroke="var(--card)" strokeWidth={2}
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.8 + i * 0.08, type: 'spring', stiffness: 300 }} />
      ))}
      {/* Labels */}
      {axes.map((a, i) => {
        const p = pt(i, maxR + 18)
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            fill="var(--text-on-dark-2)" fontSize={9} fontWeight={600} fontFamily="var(--font)">
            {a.label}
          </text>
        )
      })}
    </svg>
  )
}

/* ═══════ GAUGE ARC — dramatic half-circle gauge ═══════ */
export function GaugeArc({ value = 0, max = 100, size = 140, stroke = 10, color = 'var(--orange)', track = 'rgba(0,0,0,0.06)', children }) {
  const r = (size - stroke) / 2
  const halfCirc = Math.PI * r
  const off = halfCirc - (value / max) * halfCirc
  const d = `M ${stroke / 2},${size / 2} A ${r},${r} 0 0,1 ${size - stroke / 2},${size / 2}`
  return (
    <div style={{ position: 'relative', width: size, height: size / 2 + 20, flexShrink: 0 }}>
      <svg width={size} height={size / 2 + 6} style={{ overflow: 'visible' }}>
        {/* Tick marks */}
        {[0, 0.25, 0.5, 0.75, 1].map(t => {
          const angle = Math.PI * (1 - t)
          const x1 = size / 2 + (r + 6) * Math.cos(angle)
          const y1 = size / 2 - (r + 6) * Math.sin(angle)
          const x2 = size / 2 + (r + 10) * Math.cos(angle)
          const y2 = size / 2 - (r + 10) * Math.sin(angle)
          return <line key={t} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(0,0,0,0.1)" strokeWidth={1.5} strokeLinecap="round" />
        })}
        <path d={d} fill="none" stroke={track} strokeWidth={stroke} strokeLinecap="round" />
        <motion.path d={d} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={halfCirc}
          initial={{ strokeDashoffset: halfCirc }}
          animate={{ strokeDashoffset: off }}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }} />
      </svg>
      {children && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, textAlign: 'center' }}>
          {children}
        </div>
      )}
    </div>
  )
}
