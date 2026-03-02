import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Wallet, CreditCard, Sparkles, Gift } from 'lucide-react'

const tabs = [
  { to: '/', icon: Zap, label: 'Action', badge: 3 },
  { to: '/money', icon: Wallet, label: 'Money' },
  { to: '/advisor', icon: Sparkles, label: 'Command', isCenter: true },
  { to: '/spend', icon: CreditCard, label: 'Spend', badge: 1 },
  { to: '/rewards', icon: Gift, label: 'Rewards' },
]

export default function BottomNav() {
  const loc = useLocation()
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430,
      display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end',
      padding: '10px 8px calc(8px + env(safe-area-inset-bottom, 8px))',
      zIndex: 100, 
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(0,0,0,0.06)',
    }}>
      {tabs.map(t => {
        const active = loc.pathname === t.to
        const color = active ? '#000' : '#999'
        const Icon = t.icon
        
        // Center AI tab gets a special elevated style
        if (t.isCenter) {
          return (
            <NavLink key={t.to} to={t.to} style={{ textDecoration: 'none', flex: 1, textAlign: 'center' }}>
              <motion.div whileTap={{ scale: 0.9 }} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                position: 'relative', marginTop: -18,
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 18,
                  background: active ? '#0F172A' : 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: active
                    ? '0 8px 24px -4px rgba(15, 23, 42, 0.4)'
                    : '0 8px 24px -4px rgba(79, 70, 229, 0.35)',
                }}>
                  {/* ⌘ Command key symbol — looped square knot */}
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <rect x="7" y="7" width="10" height="10" rx="1.5" stroke="#fff" strokeWidth="2.2" fill="none" />
                    <circle cx="5.5" cy="5.5" r="3" stroke="#fff" strokeWidth="2.2" fill="none" />
                    <circle cx="18.5" cy="5.5" r="3" stroke="#fff" strokeWidth="2.2" fill="none" />
                    <circle cx="5.5" cy="18.5" r="3" stroke="#fff" strokeWidth="2.2" fill="none" />
                    <circle cx="18.5" cy="18.5" r="3" stroke="#fff" strokeWidth="2.2" fill="none" />
                  </svg>
                </div>
                <span style={{
                  fontSize: 9, fontWeight: 700,
                  color: active ? '#0F172A' : '#7C3AED',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}>
                  {t.label}
                </span>
              </motion.div>
            </NavLink>
          )
        }

        return (
          <NavLink key={t.to} to={t.to} style={{ textDecoration: 'none', flex: 1, textAlign: 'center' }}>
            <motion.div whileTap={{ scale: 0.95 }} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              position: 'relative'
            }}>
              {/* Icon container */}
              <div style={{ position: 'relative', height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={24} strokeWidth={1.5} color={color} />
                
                {/* Notification badge - Square now */}
                {t.badge && !active && (
                  <div style={{
                    position: 'absolute', top: -2, right: -6,
                    minWidth: 14, height: 14, padding: '0 4px',
                    background: '#000',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 700, color: '#fff',
                    border: '2px solid var(--bg)', borderRadius: 4 
                  }}>
                    {t.badge}
                  </div>
                )}
              </div>
              
              {/* Label */}
              <span style={{
                fontSize: 9, fontWeight: active ? 700 : 500,
                color: color,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                opacity: active ? 1 : 0.8,
              }}>
                {t.label}
              </span>
            </motion.div>
          </NavLink>
        )
      })}
    </nav>
  )
}
