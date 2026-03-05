import { useState, useEffect } from 'react'
import { motion, AnimatePresence, animate } from 'framer-motion'

/* ═══════ STAGGER ANIMATION VARIANTS ═══════ */
export const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } } },
  pop: { hidden: { opacity: 0, scale: 0.92 }, show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 25 } } },
}

/* ═══════ PAGE WRAPPER ═══════ */
export function Page({ children, bg = '#FFFFFF', paddingTop }) {
  return (
    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{ padding: `${paddingTop || 20}px 20px 120px`, minHeight: '100vh', background: bg }}>
      {children}
    </motion.div>
  )
}

/* ═══════ ANIMNUM — animated counting number ═══════ */
export function AnimNum({ value, prefix = '', suffix = '', duration = 1.2, decimals = 0, style }) {
  const [disp, setDisp] = useState(0)
  useEffect(() => {
    const ctrl = animate(0, value, {
      duration, ease: [0.25, 0.1, 0.25, 1],
      onUpdate: v => setDisp(v)
    })
    return () => ctrl.stop()
  }, [value, duration])
  const formatted = decimals > 0 ? disp.toFixed(decimals) : Math.round(disp).toLocaleString('en-IN')
  return <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, letterSpacing: -0.5, ...style }}>{prefix}{formatted}{suffix}</span>
}

/* ═══════ SCROLLROW — horizontal scroll with snap ═══════ */
export function ScrollRow({ children, gap = 10, pad = 18, style: extraStyle }) {
  return (
    <div className="hide-scroll" style={{
      display: 'flex', gap, overflowX: 'auto', padding: `0 ${pad}px`,
      margin: `0 -${pad}px`, scrollSnapType: 'x mandatory',
      ...extraStyle,
    }}>
      {children}
    </div>
  )
}

/* ═══════ GRADIENT CARD — animated gradient + floating orb ═══════ */
export function GradientCard({ children, from = 'var(--orange)', to = '#E88A3A', angle = 135, style }) {
  return (
    <div style={{
      background: `linear-gradient(${angle}deg, ${from}, ${to})`,
      borderRadius: 'var(--radius)', padding: 20, color: '#fff',
      position: 'relative', overflow: 'hidden', ...style,
    }}>
      <div className="float" style={{
        position: 'absolute', top: -30, right: -30, width: 100, height: 100,
        borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none',
      }} />
      <div className="float" style={{
        position: 'absolute', bottom: -20, left: -20, width: 70, height: 70,
        borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none',
        animationDelay: '2s',
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  )
}

/* ═══════ ● DOT LABEL (Boxy Square) ═══════ */
export function Dot({ color = 'var(--text)', children, light, pulse, style }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 7,
      fontSize: 13, fontWeight: 600,
      color: light ? 'var(--text-on-dark-2)' : 'var(--text)',
      ...style,
    }}>
      <span className={pulse ? 'pulse-dot' : ''} style={{ width: 6, height: 6, borderRadius: 0, background: color, flexShrink: 0 }} />
      {children}
    </span>
  )
}

/* ═══════ SECTION HEADER ═══════ */
export function SH({ title, sub, action, onAction }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', margin: '32px 0 16px', borderBottom: '2px solid var(--border)', paddingBottom: 8 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 900, letterSpacing: -0.5, textTransform: 'uppercase' }}>{title}</h2>
        {sub && <p style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2, fontFamily: 'var(--mono)' }}>{sub}</p>}
      </div>
      {action && <span onClick={onAction} style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', cursor: 'pointer', textDecoration: 'underline' }}>{action}</span>}
    </div>
  )
}

/* ═══════ GREY CARD ═══════ */
export function Card({ children, style, onClick }) {
  return (
    <motion.div whileTap={onClick ? { scale: 0.99 } : undefined} onClick={onClick}
      style={{
        background: 'var(--card)', borderRadius: 'var(--radius)',
        padding: 24, color: 'var(--text-on-dark)',
        border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)',
        ...style,
      }}>
      {children}
    </motion.div>
  )
}

/* ═══════ ORANGE CARD ═══════ */
export function OrangeCard({ children, style }) {
  return (
    <div style={{ background: 'var(--orange)', borderRadius: 'var(--radius)', padding: 24, color: '#fff', border: '1px solid rgba(0,0,0,0.1)', ...style }}>
      {children}
    </div>
  )
}

/* ═══════ BLUE CARD ═══════ */
export function BlueCard({ children, style }) {
  return (
    <div style={{ background: 'var(--blue)', borderRadius: 'var(--radius)', padding: 24, color: '#fff', border: '1px solid rgba(0,0,0,0.1)', ...style }}>
      {children}
    </div>
  )
}

/* ═══════ WHITE CARD ═══════ */
export function WhiteCard({ children, style, onClick }) {
  return (
    <motion.div whileTap={onClick ? { scale: 0.99 } : undefined} onClick={onClick}
      style={{
        background: 'var(--white-card)', borderRadius: 'var(--radius)',
        padding: 20, border: '1px solid var(--border)', ...style,
      }}>
      {children}
    </motion.div>
  )
}

/* ═══════ BIG NUMBER (mono) ═══════ */
export function Num({ children, style }) {
  return <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, letterSpacing: -1, ...style }}>{children}</span>
}

/* ═══════ DARK PILL ═══════ */
export function DarkPill({ active, children, onClick, icon }) {
  return (
    <motion.button whileTap={{ scale: 0.95 }} onClick={onClick}
      style={{
        padding: '8px 18px', borderRadius: 'var(--radius-pill)',
        fontSize: 12, fontWeight: 700, border: active ? '1px solid var(--text)' : '1px solid var(--border)', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: active ? 'var(--text)' : 'transparent',
        color: active ? '#fff' : 'var(--text-2)',
        textTransform: 'uppercase', letterSpacing: 0.5
      }}>
      {icon && <span style={{ fontSize: 14 }}>{icon}</span>}
      {children}
    </motion.button>
  )
}

/* ═══════ Y/M TOGGLE ═══════ */
export function YMToggle({ active, onChange }) {
  return (
    <div style={{ display: 'flex', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-pill)', padding: 2, gap: 0 }}>
      {['Y', 'M'].map(v => (
        <button key={v} onClick={() => onChange(v)}
          style={{
            width: 32, height: 32, borderRadius: '50%', border: 'none', fontSize: 12, fontWeight: 700,
            background: active === v ? 'var(--text)' : 'transparent',
            color: active === v ? '#fff' : 'var(--text-2)', cursor: 'pointer',
          }}>{v}</button>
      ))}
    </div>
  )
}

/* ═══════ BADGE ═══════ */
export function Badge({ color = 'var(--orange)', children, style }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 9, fontWeight: 800, padding: '4px 8px', borderRadius: 2,
      background: 'transparent', color: color, border: `1px solid ${color}`,
      textTransform: 'uppercase', letterSpacing: 0.5,
      ...style,
    }}>{children}</span>
  )
}

/* ═══════ PILL GROUP ═══════ */
export function PillGroup({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto', paddingBottom: 2 }} className="hide-scroll">
      {tabs.map(t => (
        <motion.button key={t} whileTap={{ scale: 0.95 }} onClick={() => onChange(t)}
          style={{
            padding: '8px 18px', borderRadius: 'var(--radius-pill)', fontSize: 12, fontWeight: 600,
            border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
            background: active === t ? 'var(--dark)' : 'var(--white-card)',
            color: active === t ? '#fff' : 'var(--text-2)',
            boxShadow: active === t ? 'none' : 'var(--shadow)',
          }}>
          {t}
        </motion.button>
      ))}
    </div>
  )
}

/* ═══════ URGENCY PILL ═══════ */
export function UrgencyPill({ days, label }) {
  const isUrgent = days <= 3, isWarning = days <= 7 && days > 3
  const color = isUrgent ? 'var(--red)' : isWarning ? 'var(--orange)' : 'var(--text-2)'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 100,
      background: `${color}15`, color, border: `1px solid ${color}30`,
    }}>
      {isUrgent ? '🔴' : isWarning ? '🟡' : '⏳'} {label || `${days}d left`}
    </span>
  )
}

/* ═══════ NUDGE CARD ═══════ */
export function NudgeCard({ emoji, icon: Icon, iconColor = 'var(--orange)', title, subtitle, detail, tag, tagColor = 'var(--orange)', action, save, savePeriod, saveSub, borderColor = 'var(--orange)', urgencyDays, impact10yr }) {
  const [expanded, setExpanded] = useState(false)
  
  return (
    <Card onClick={() => setExpanded(!expanded)} 
      style={{ 
        borderLeft: `3px solid ${borderColor}`, marginBottom: 10, padding: '16px 14px',
        cursor: 'pointer', transition: 'background 0.2s'
      }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        {emoji ? <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{emoji}</span>
          : Icon ? <Icon size={22} color={iconColor} style={{ flexShrink: 0, marginTop: 2 }} /> : null}
        
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Minimal Header Row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
            <div>
               <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  {tag && <span style={{ fontSize: 9, fontWeight: 700, color: tagColor, textTransform: 'uppercase' }}>{tag}</span>}
                  {urgencyDays != null && urgencyDays <= 7 && (
                    <span style={{ fontSize: 9, fontWeight: 700, color: urgencyDays <= 3 ? 'var(--red)' : 'var(--orange)' }}>
                      • {urgencyDays}d left
                    </span>
                  )}
               </div>
               <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3, display: 'block' }}>{title}</span>
               
               {/* Monetary Impact Preview (Collapsed) */}
               {!expanded && save && (
                 <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: borderColor, letterSpacing: -0.5 }}>{save}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-3)' }}>potential gain</span>
                 </div>
               )}
            </div>
            
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} style={{ color: 'var(--text-3)', marginTop: 2 }}>
               <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
            </motion.div>
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {expanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0, marginTop: 0 }} 
                animate={{ height: 'auto', opacity: 1, marginTop: 12 }} 
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                style={{ overflow: 'hidden' }}
              >
                {subtitle && <p style={{ fontSize: 13, color: 'var(--text-on-dark-2)', lineHeight: 1.5, marginBottom: 14 }}>{subtitle}</p>}
                
                {save && (
                  <div style={{
                    background: 'var(--card-2)', borderRadius: 12, padding: '14px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10
                  }}>
                    <div>
                      <span style={{ fontSize: 10, color: 'var(--text-on-dark-3)', display: 'block', marginBottom: 2 }}>Potential Gain</span>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                        <Num style={{ fontSize: 24, color: borderColor, letterSpacing: -1 }}>{save}</Num>
                        {savePeriod && <span style={{ fontSize: 12, color: 'var(--text-on-dark-3)' }}>{savePeriod}</span>}
                      </div>
                    </div>
                    {action && (
                      <motion.button whileTap={{ scale: 0.95 }} onClick={(e) => { e.stopPropagation(); /* handle action */ }}
                        style={{ 
                          background: borderColor, color: '#fff', border: 'none', borderRadius: 10, 
                          padding: '10px 18px', fontSize: 12, fontWeight: 700, cursor: 'pointer' 
                        }}>
                        {action}
                      </motion.button>
                    )}
                  </div>
                )}

                {impact10yr && (
                  <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, fontSize: 11, color: 'var(--text-2)', lineHeight: 1.4, marginBottom: 8 }}>
                    📈 <strong>Long term:</strong> {impact10yr}
                  </div>
                )}
                
                {detail && (
                  <p style={{ fontSize: 11, color: 'var(--text-3)', lineHeight: 1.5, marginTop: 8, borderTop: '1px solid var(--border)', paddingTop: 8 }}>
                    {detail}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  )
}

/* ═══════ BENTO GRID ═══════ */
export function Bento({ cols = 2, gap = 10, children, style }) {
  return <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap, ...style }}>{children}</div>
}

/* ═══════ PRIMARY BUTTON ═══════ */
export function Btn({ children, color = 'var(--orange)', style, onClick, full }) {
  return (
    <motion.button whileTap={{ scale: 0.95 }} onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        background: color, color: '#fff', border: 'none',
        borderRadius: 14, padding: '13px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
        width: full ? '100%' : 'auto', ...style,
      }}>{children}</motion.button>
  )
}

/* ═══════ ACTION CHIP CARDS — light tint / white half split ═══════ */
export function ActionCard({ iconColor = '#64748B', title, subtitle, rightLabel, rightColor, onClick }) {
  const [pref, ...rest] = title.includes(':') ? title.split(':') : ['', title];
  const category = pref.trim();
  const finalTitle = rest.length > 0 ? rest.join(':').trim() : title;
  const accent = rightColor || iconColor;

  return (
    <motion.div
      whileTap={onClick ? { scale: 0.97 } : undefined}
      onClick={onClick}
      style={{
        flex: '0 0 210px', width: 210,
        borderRadius: 20,
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 12px 24px -6px rgba(0,0,0,0.05), 0 4px 8px -2px rgba(0,0,0,0.03)',
        background: '#fff',
        cursor: onClick ? 'pointer' : 'default',
        display: 'flex', flexDirection: 'column',
        scrollSnapAlign: 'start',
      }}
    >
      {/* ── Tinted top half ── */}
      <div style={{
        background: `${accent}12`,
        padding: '14px 14px',
        minHeight: 60,
        position: 'relative',
        borderBottom: `1px solid ${accent}15`
      }}>
        {/* Color accent bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accent }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {category ? (
            <div style={{ fontSize: 10, fontWeight: 800, color: accent, textTransform: 'uppercase', letterSpacing: 1.2 }}>
              {category}
            </div>
          ) : <div />}
          {rightLabel && (
            <div style={{
              display: 'inline-flex', alignItems: 'center',
              background: '#fff', color: accent,
              borderRadius: 100, padding: '4px 10px',
              fontSize: 11, fontWeight: 800, letterSpacing: 0.4,
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
              border: `1px solid ${accent}25`,
            }}>
              {rightLabel}
            </div>
          )}
        </div>
      </div>

      {/* ── White bottom half ── */}
      <div style={{
        padding: '14px 14px 16px',
        flex: 1,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{
            fontSize: 15, fontWeight: 800, color: '#0F172A',
            lineHeight: 1.3, letterSpacing: -0.3,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            marginBottom: 5,
          }}>
            {finalTitle}
          </div>
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600, lineHeight: 1.4 }}>
            {subtitle}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
          <div style={{
            width: 24, height: 24, borderRadius: '50%',
            background: `${accent}12`, border: `1px solid ${accent}25`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="10" height="10" viewBox="0 0 11 11" fill="none">
              <path d="M2 5.5H9M6 2.5L9 5.5L6 8.5" stroke={accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  )
}


/* ═══════ SECTION LABEL ═══════ */
export function SectionLabel({ children, right, color = '#F97316' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingLeft: 4 }}>
      <h3 style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: 1.5, display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
        {children}
      </h3>
      {right && <span style={{ fontSize: 13, fontWeight: 700, color: '#64748B' }}>{right}</span>}
    </div>
  )
}

export function ListRow({ icon: Icon, iconColor, title, subtitle, rightLabel, rightColor, last, onClick, children }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px',
        borderBottom: last ? 'none' : '1px solid rgba(0,0,0,0.06)',
        cursor: onClick ? 'pointer' : 'default',
        background: '#fff',
      }}
    >
      {Icon && (
        <div style={{ width: 40, height: 40, borderRadius: 12, background: `${iconColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
          <Icon size={20} color={iconColor} strokeWidth={2.5} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', marginBottom: 2, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 13, color: '#888', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {subtitle}
          </div>
        )}
      </div>
      {(rightLabel || children) && (
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 16 }}>
          {rightLabel && (
            <div style={{ fontSize: 15, fontWeight: 600, color: rightColor || '#1a1a1a' }}>
              {rightLabel}
            </div>
          )}
          {children}
        </div>
      )}
    </div>
  )
}
