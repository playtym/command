import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Share2, Sparkles } from 'lucide-react'

/* ═══════ STORY CIRCLE — Boxy Instagram-style ring with emoji ═══════ */
export function StoryCircle({ emoji, title, subtitle, gradient, image, onClick, seen = false, size = 70 }) {
  return (
    <div onClick={onClick} style={{ cursor: 'pointer', textAlign: 'center', flex: 'none' }}>
      <div style={{
        width: size, height: size, borderRadius: 0, padding: 2,
        background: seen
          ? '#E5E5E5'
          : (gradient || '#000'), // Use the gradient as the border color effectively
      }}>
        <div style={{
          width: '100%', height: '100%', borderRadius: 0, background: 'var(--card)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.44,
          border: '3px solid var(--card)', // Inner gap
          position: 'relative', overflow: 'hidden'
        }}>
          {image ? (
            <>
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center',
                filter: 'grayscale(0.3)'
              }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />
              <span style={{ position: 'relative', zIndex: 2, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{emoji}</span>
            </>
          ) : (
            emoji
          )}
        </div>
      </div>
      <span style={{ 
        fontSize: 10, fontWeight: 700, marginTop: 6, display: 'block', 
        color: 'var(--text)', lineHeight: 1.2, textTransform: 'uppercase', letterSpacing: 0.5 
      }}>
        {title}
      </span>
      {subtitle && (
        <span style={{ fontSize: 9, color: 'var(--text-2)', display: 'block', marginTop: 2, fontFamily: 'var(--mono)' }}>
          {subtitle}
        </span>
      )}
    </div>
  )
}

/* ═══════ STORY ROW — horizontal scroll of circles ═══════ */
export function StoryRow({ stories, onOpen }) {
  return (
    <div className="hide-scroll" style={{
      display: 'flex', gap: 16, overflowX: 'auto', padding: '0 18px',
      margin: '0 -18px', scrollSnapType: 'x mandatory',
    }}>
      {stories.map((s, i) => (
        <StoryCircle
          key={i}
          emoji={s.emoji}
          title={s.title}
          subtitle={s.subtitle}
          gradient={s.gradient}
          image={s.image}
          seen={s.seen}
          onClick={() => onOpen(i)}
        />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   DATA VISUAL RENDERERS — charts, bars, tables for investor stories
   ═══════════════════════════════════════════════════════════════ */

/* ─── Horizontal Comparison Bars ─── */
function StoryBars({ data, label }) {
  const maxVal = Math.max(...data.map(d => d.value))
  return (
    <div style={{ width: '100%', maxWidth: 300, margin: '0 auto' }}>
      {label && <div style={{ fontSize: 9, opacity: 0.5, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700 }}>{label}</div>}
      {data.map((d, i) => (
        <div key={i} style={{ marginBottom: i < data.length - 1 ? 9 : 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 }}>
            <span style={{ fontSize: 11, fontWeight: d.highlight ? 700 : 500, opacity: d.highlight ? 1 : 0.6 }}>
              {d.label}
              {d.flag && <span style={{ fontSize: 8, padding: '1px 5px', background: 'rgba(255,255,255,0.2)', borderRadius: 4, marginLeft: 5, fontWeight: 700 }}>{d.flag}</span>}
            </span>
            <span style={{ fontSize: 12, fontWeight: 800, fontFamily: 'var(--mono)', letterSpacing: -0.5 }}>
              {d.prefix || ''}{typeof d.value === 'number' ? d.value.toLocaleString('en-IN') : d.value}{d.suffix || ''}
            </span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.12)', borderRadius: 100, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(d.value / maxVal) * 100}%` }}
              transition={{ duration: 0.8, delay: 0.5 + i * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ height: '100%', borderRadius: 100, background: d.highlight ? '#fff' : 'rgba(255,255,255,0.3)' }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Big Number Callout Row ─── */
function StoryMetrics({ data }) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', maxWidth: 320, margin: '0 auto' }}>
      {data.map((d, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + i * 0.1 }}
          style={{
            flex: 1, padding: '10px 6px',
            background: d.highlight ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.08)',
            borderRadius: 12, textAlign: 'center',
            border: d.highlight ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(255,255,255,0.06)',
          }}>
          <div style={{ fontSize: 8, opacity: 0.5, marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.3, fontWeight: 600 }}>{d.label}</div>
          <div style={{ fontSize: 16, fontWeight: 800, fontFamily: 'var(--mono)', letterSpacing: -0.5 }}>{d.value}</div>
          {d.sub && <div style={{ fontSize: 8, opacity: 0.45, marginTop: 2 }}>{d.sub}</div>}
        </motion.div>
      ))}
    </div>
  )
}

/* ─── Comparison Table (e.g., Current vs Recommended) ─── */
function StoryTable({ headers, rows }) {
  return (
    <div style={{ width: '100%', maxWidth: 300, margin: '0 auto', background: 'rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
      {headers && (
        <div style={{ display: 'flex', padding: '7px 12px', background: 'rgba(255,255,255,0.06)', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, opacity: 0.6 }}>
          {headers.map((h, i) => <span key={i} style={{ flex: 1, textAlign: i > 0 ? 'center' : 'left' }}>{h}</span>)}
        </div>
      )}
      {rows.map((row, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + i * 0.06 }}
          style={{ display: 'flex', padding: '7px 12px', borderTop: i > 0 ? '1px solid rgba(255,255,255,0.06)' : 'none', fontSize: 11, alignItems: 'center' }}>
          <span style={{ flex: 1, fontWeight: 500, opacity: 0.75 }}>{row.label}</span>
          {row.values.map((v, j) => (
            <span key={j} style={{
              flex: 1, textAlign: 'center', fontWeight: 700, fontFamily: 'var(--mono)', fontSize: 11,
              color: row.highlight === j ? '#4ADE80' : 'inherit',
            }}>{v}</span>
          ))}
        </motion.div>
      ))}
    </div>
  )
}

/* ─── Progress Bar with Labels ─── */
function StoryProgressBar({ percent, label, leftLabel, rightLabel, color, note }) {
  return (
    <div style={{ width: '100%', maxWidth: 300, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12, fontWeight: 600 }}>
        <span style={{ opacity: 0.8 }}>{label}</span>
        <span style={{ fontFamily: 'var(--mono)', fontWeight: 800 }}>{percent}%</span>
      </div>
      <div style={{ height: 12, background: 'rgba(255,255,255,0.12)', borderRadius: 100, overflow: 'hidden', position: 'relative' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ height: '100%', borderRadius: 100, background: color || '#fff' }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, fontFamily: 'var(--mono)', opacity: 0.6 }}>
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
      {note && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
          style={{ textAlign: 'center', marginTop: 8, fontSize: 10, opacity: 0.55, fontStyle: 'italic', lineHeight: 1.4 }}>
          {note}
        </motion.div>
      )}
    </div>
  )
}

/* ─── Stacked Segment Bar with Target Comparison ─── */
function StoryBreakdown({ data, label, showTarget }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  const tTotal = showTarget ? data.reduce((s, d) => s + (d.target || d.value), 0) : total
  return (
    <div style={{ width: '100%', maxWidth: 300, margin: '0 auto' }}>
      {label && <div style={{ fontSize: 9, opacity: 0.5, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700 }}>{label}</div>}
      <div style={{ fontSize: 8, opacity: 0.4, marginBottom: 3, fontWeight: 600 }}>CURRENT</div>
      <div style={{ display: 'flex', height: 12, borderRadius: 100, overflow: 'hidden', gap: 2 }}>
        {data.map((d, i) => (
          <motion.div key={i}
            initial={{ width: 0 }}
            animate={{ width: `${(d.value / total) * 100}%` }}
            transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
            style={{ height: '100%', background: d.color || 'rgba(255,255,255,0.4)', borderRadius: 100 }}
          />
        ))}
      </div>
      {showTarget && (
        <>
          <div style={{ fontSize: 8, opacity: 0.4, marginTop: 8, marginBottom: 3, fontWeight: 600 }}>TARGET</div>
          <div style={{ display: 'flex', height: 8, borderRadius: 100, overflow: 'hidden', gap: 2, opacity: 0.4 }}>
            {data.map((d, i) => (
              <div key={i} style={{ width: `${((d.target || d.value) / tTotal) * 100}%`, height: '100%', background: d.color, borderRadius: 100 }} />
            ))}
          </div>
        </>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px 12px', marginTop: 10 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 7, height: 7, borderRadius: 2, background: d.color || 'rgba(255,255,255,0.4)' }} />
            <span style={{ fontSize: 10, opacity: 0.75 }}>{d.label}</span>
            <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'var(--mono)' }}>{d.value}%</span>
            {d.target != null && d.target !== d.value && (
              <span style={{ fontSize: 9, opacity: 0.4 }}>→{d.target}%</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Visual Dispatcher ─── */
function StoryVisual({ visual }) {
  if (!visual) return null
  const { type, ...props } = visual
  switch (type) {
    case 'bars': return <StoryBars {...props} />
    case 'metrics': return <StoryMetrics {...props} />
    case 'table': return <StoryTable {...props} />
    case 'progress': return <StoryProgressBar {...props} />
    case 'breakdown': return <StoryBreakdown {...props} />
    default: return null
  }
}

/* ═══════ STORY VIEWER — full-screen immersive overlay with data visuals ═══════ */
export function StoryViewer({ stories, activeIndex, onClose, onNext, onPrev }) {
  const story = stories[activeIndex]
  const [progress, setProgress] = useState(0)
  const timerRef = useRef(null)
  const navigate = useNavigate()
  const [reactions, setReactions] = useState({})

  // More time for data-rich stories
  useEffect(() => {
    const dur = story.visual ? 10000 : 6000
    setProgress(0)
    const start = Date.now()
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - start
      setProgress(Math.min(elapsed / dur, 1))
      if (elapsed >= dur) {
        clearInterval(timerRef.current)
        onNext()
      }
    }, 30)
    return () => clearInterval(timerRef.current)
  }, [activeIndex])

  // Tap zones: left 30% = prev, right 70% = next
  const handleTap = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    if (x < rect.width * 0.3) {
      onPrev?.()
    } else {
      clearInterval(timerRef.current)
      onNext()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.6 }}
      onDragEnd={(e, info) => {
        if (info.offset.y > 100) onClose()
      }}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: '#000',
        display: 'flex', flexDirection: 'column', color: '#fff',
        userSelect: 'none',
        touchAction: 'none',
        overflow: 'hidden'
      }}
    >
      {/* Background Image Layer */}
      {story.image ? (
        <>
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "linear" }}
            style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${story.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: -2,
            }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: story.overlayColor || 'rgba(0,0,0,0.6)',
            zIndex: -1,
            backdropFilter: 'blur(2px)'
          }} />
        </>
      ) : (
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(160deg, ${story.bg1}, ${story.bg2})`,
          zIndex: -1
        }} />
      )}

      {/* Swipe hint */}
      <div style={{ position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)', width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.3)', zIndex: 1 }} />
      {/* ─── Progress Bars ─── */}
      <div style={{ padding: '14px 10px 0', display: 'flex', gap: 4, zIndex: 1 }}>
        {stories.map((s, i) => (
          <div key={i} style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.25)', borderRadius: 10, overflow: 'hidden' }}>
            <motion.div
              style={{
                height: '100%', borderRadius: 10, background: '#fff',
                width: i < activeIndex ? '100%' : i === activeIndex ? `${progress * 100}%` : '0%',
              }}
            />
          </div>
        ))}
      </div>

      {/* ─── Header (close + label) ─── */}
      <div style={{ padding: '12px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
            {story.emoji}
          </div>
          <div>
            <span style={{ fontSize: 13, fontWeight: 700 }}>{story.title}</span>
            <span style={{ fontSize: 10, opacity: 0.7, display: 'block' }}>{story.label || 'Just now'}</span>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onClose() }}
          style={{ background: 'rgba(0,0,0,0.2)', color: '#fff', border: 'none', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <X size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* ─── Tap Zone + Scrollable Content ─── */}
      <div onClick={handleTap} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 1 }}>
        <div className="hide-scroll" style={{ flex: 1, overflowY: 'auto', padding: '12px 28px 8px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
            >
              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                style={{ fontSize: 24, fontWeight: 900, marginBottom: 8, letterSpacing: -0.5, lineHeight: 1.2 }}
              >
                "{story.storyTitle}"
              </motion.h2>

              {/* Short insight text */}
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
                style={{ fontSize: 13, lineHeight: 1.55, fontWeight: 500, opacity: 0.9, maxWidth: 320, marginBottom: 16 }}
              >
                {story.storyText}
              </motion.p>

              {/* ── DATA VISUAL (charts/bars/tables) ── */}
              {story.visual && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  style={{ width: '100%', marginBottom: 14 }}
                >
                  <StoryVisual visual={story.visual} />
                </motion.div>
              )}

              {/* Save callout */}
              {story.save && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: story.visual ? 0.9 : 0.5 }}
                  style={{
                    padding: '8px 18px', background: 'rgba(255,255,255,0.18)', borderRadius: 100,
                    fontSize: 13, fontWeight: 600, border: '1px solid rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}
                >
                  <span style={{ opacity: 0.7, fontSize: 11 }}>{story.saveLabel || 'Potential'}:</span>
                  <strong style={{ fontFamily: 'var(--mono)', letterSpacing: -0.3 }}>{story.save}</strong>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ─── Bottom: CTA + AI + Reactions ─── */}
      <div style={{ padding: '0 24px 36px' }}>
        {/* Social proof */}
        <div style={{ textAlign: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>
            127 Command users acted on this insight this week
          </span>
        </div>

        {/* Main CTA */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={(e) => { e.stopPropagation() }}
          style={{
            width: '100%', padding: 16, background: '#fff', color: story.bg2,
            border: 'none', borderRadius: 16, fontSize: 16, fontWeight: 800,
            cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          }}
        >
          {story.cta}
        </motion.button>

        {/* AI deeplink + Share */}
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); onClose(); navigate('/advisor') }}
            style={{
              flex: 1, padding: '12px 16px', background: 'rgba(255,255,255,0.15)',
              color: '#fff', border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            <Sparkles size={16} fill="white" strokeWidth={0} /> Ask AI about this
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation() }}
            style={{
              padding: '12px 14px', background: 'rgba(255,255,255,0.15)',
              color: '#fff', border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}
          >
            <Share2 size={18} />
          </motion.button>
        </div>

        {/* Emoji reactions */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12 }}>
          {[
            { emoji: '🤯', count: 47 },
            { emoji: '💡', count: 128 },
            { emoji: '😱', count: 23 },
            { emoji: '👏', count: 89 },
          ].map(r => {
            const selected = reactions[activeIndex] === r.emoji
            return (
              <motion.button key={r.emoji} whileTap={{ scale: 1.2 }}
                onClick={(e) => {
                  e.stopPropagation()
                  setReactions(prev => ({ ...prev, [activeIndex]: prev[activeIndex] === r.emoji ? null : r.emoji }))
                }}
                style={{
                  background: selected ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                  border: selected ? '1.5px solid rgba(255,255,255,0.5)' : '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 20, padding: '6px 12px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 4, color: '#fff',
                }}
              >
                <span style={{ fontSize: 16 }}>{r.emoji}</span>
                <span style={{ fontSize: 10, fontWeight: 600, opacity: 0.8 }}>{selected ? r.count + 1 : r.count}</span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
