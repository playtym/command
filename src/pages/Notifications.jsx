import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Bell, AlertTriangle, TrendingDown, Wallet, Shield, 
  Utensils, CreditCard, Gift, Flame, ArrowLeft, 
  ChevronRight, Smartphone, Check, X, Clock, Zap,
  TrendingUp, Sparkles, ArrowRight
} from 'lucide-react'
import { Page, stagger } from '../components/UI'

/* ─── Notifications Data ─── */
const notifications = [
  {
    id: 'n1',
    group: 'urgent',
    icon: AlertTriangle,
    iconColor: '#EF4444',
    iconBg: '#FEF2F2',
    app: 'Command Money',
    title: "\u26a0\ufe0f \u20b910L health cover gap detected",
    body: "Your \u20b95L policy won't cover 1 Mumbai ICU week. Top-up to \u20b915L for just \u20b9267/mo.",
    impact: '\u20b910L',
    impactLabel: 'GAP',
    impactColor: '#EF4444',
    impactBg: 'linear-gradient(135deg, #FEF2F2, #FEE2E2)',
    urgency: 'Act within 48h',
    urgencyIcon: Clock,
    cta: 'Close this gap →',
    time: 'now',
    unread: true,
    context: "I'm interested in the ₹15L health insurance top-up for ₹267/month. Can you explain the coverage details?",
  },
  {
    id: 'n2',
    group: 'urgent',
    icon: TrendingDown,
    iconColor: '#D97706',
    iconBg: '#FFFBEB',
    app: 'Command Money',
    title: "\u20b91.2L at risk \u2014 portfolio overweight",
    body: 'Equity at 77% vs your 60% target. Rebalance to debt before market opens tomorrow.',
    impact: '\u20b91.2L',
    impactLabel: 'AT RISK',
    impactColor: '#D97706',
    impactBg: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
    urgency: 'Market open tomorrow',
    urgencyIcon: Zap,
    cta: 'Rebalance now →',
    time: '15m ago',
    unread: true,
    context: "My portfolio equity allocation is at 77% vs my 60% target. Should I rebalance ₹1.2L to debt?",
  },
  {
    id: 'n3',
    group: 'money',
    icon: Wallet,
    iconColor: '#059669',
    iconBg: '#ECFDF5',
    app: 'Command Money',
    title: 'Earn +₹4,900/yr on idle cash',
    body: 'Move ₹1.3L from HDFC Savings (3%) to Liquid Fund (7.2%). One-tap transfer.',
    impact: '+₹4.9K',
    impactLabel: 'extra/year',
    impactColor: '#059669',
    impactBg: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)',
    urgency: '1-tap move',
    urgencyIcon: Zap,
    cta: 'Move money →',
    time: '1 hour ago',
    unread: true,
    context: "I have ₹15,000 surplus cash in my account. You suggested investing it. What's the best fund for this right now?",
  },
  {
    id: 'n4',
    group: 'money',
    icon: Shield,
    iconColor: '#4338CA',
    iconBg: '#EEF2FF',
    app: 'Command Money',
    title: 'Claim ₹15,600 tax refund before Mar 31',
    body: 'Invest ₹50K in NPS under 80CCD(1B). 26 days left.',
    impact: '₹15.6K',
    impactLabel: 'tax refund',
    impactColor: '#4338CA',
    impactBg: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
    urgency: 'Before Mar 31',
    urgencyIcon: Clock,
    cta: 'Claim refund →',
    time: '2 hours ago',
    unread: false,
    context: "How can I save more on taxes? What about NPS under 80CCD(1B)?",
  },
  {
    id: 'n5',
    group: 'spend',
    icon: Utensils,
    iconColor: '#B45309',
    iconBg: '#FFFBEB',
    app: 'Command Money',
    title: '₹1,600 overspend on food delivery',
    body: '₹8.4K this month vs ₹6.8K last month (+23%). Set a weekly cap?',
    impact: '+₹1.6K',
    impactLabel: 'overspend',
    impactColor: '#B45309',
    impactBg: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
    urgency: 'Set cap now',
    urgencyIcon: Zap,
    cta: 'Set spending cap →',
    time: '3 hours ago',
    unread: false,
    context: "Show me my spending breakdown for this month. I feel like food delivery is too high.",
  },
  {
    id: 'n6',
    group: 'spend',
    icon: CreditCard,
    iconColor: '#0F172A',
    iconBg: '#F1F5F9',
    app: 'Command Money',
    title: '₹47,832 credit card bill in 3 days',
    body: 'HDFC Infinia outstanding. Auto-pay is set. Tap to review.',
    impact: '₹47.8K',
    impactLabel: 'due soon',
    impactColor: '#0F172A',
    impactBg: 'linear-gradient(135deg, #F1F5F9, #E2E8F0)',
    urgency: '3 days left',
    urgencyIcon: Clock,
    cta: 'Review bill →',
    time: '5 hours ago',
    unread: false,
    context: "Show me my upcoming bills",
  },
  {
    id: 'n7',
    group: 'rewards',
    icon: Gift,
    iconColor: '#7C3AED',
    iconBg: '#F5F3FF',
    app: 'Command Money',
    title: '+240 points this week!',
    body: '2 more actions to unlock Gold milestone bonus.',
    impact: '+240',
    impactLabel: 'points earned',
    impactColor: '#7C3AED',
    impactBg: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)',
    urgency: '2 actions away',
    urgencyIcon: Flame,
    cta: 'Earn more →',
    time: '6 hours ago',
    unread: false,
    context: "Show me my reward status and how to earn more points",
  },
  {
    id: 'n8',
    group: 'rewards',
    icon: Flame,
    iconColor: '#059669',
    iconBg: '#ECFDF5',
    app: 'Command Money',
    title: '18-day streak! Keep it alive',
    body: 'Check in tomorrow to maintain your streak and earn bonus.',
    impact: '18',
    impactLabel: 'day streak',
    impactColor: '#059669',
    impactBg: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)',
    urgency: "Don't break it",
    urgencyIcon: Flame,
    cta: 'Check in →',
    time: '1 day ago',
    unread: false,
    context: "Show me my reward status and how to earn more points",
  },
]

/* ─── iOS-Authentic Phone Notification ─── */
/*
  Real iOS lock-screen constraints respected:
  - Translucent white/frost background with blur
  - Standard rounded rect (~13-14px radius, iOS 16+)
  - Top row: 20x20 app icon + "APP NAME" + timestamp
  - Bold title (SF Pro, ~15px semibold)
  - Regular body (SF Pro, ~15px regular, secondary color)
  - Max ~4 visible lines before system truncates
  - No custom backgrounds, accent strips, animations, or embedded CTAs
  - Money amounts embedded in title text for boldness
*/
function PhoneNotification({ notification, index, onTap }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onTap(notification)}
      style={{
        background: 'rgba(255, 255, 255, 0.78)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        borderRadius: 14,
        padding: '12px 14px',
        marginBottom: 10,
        cursor: 'pointer',
        border: 'none',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 0 0.5px rgba(0,0,0,0.08)',
        position: 'relative',
      }}
    >
      {/* ── iOS top row: App icon + app name + timestamp ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4,
      }}>
        {/* App icon — rounded square like real iOS */}
        <div style={{
          width: 20, height: 20, borderRadius: 5,
          background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 10, color: '#fff', fontWeight: 900, lineHeight: 1 }}>C</span>
        </div>
        <span style={{
          fontSize: 13, fontWeight: 400, color: 'rgba(0,0,0,0.45)',
          fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif',
          textTransform: 'uppercase', letterSpacing: 0.2,
          flex: 1,
        }}>
          COMMAND MONEY
        </span>
        <span style={{
          fontSize: 13, fontWeight: 400, color: 'rgba(0,0,0,0.35)',
          fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif',
        }}>
          {notification.time}
        </span>
      </div>

      {/* ── Title — bold, money-amount embedded ── */}
      <div style={{
        fontSize: 15, fontWeight: 600, color: '#000',
        fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif',
        lineHeight: 1.3, letterSpacing: -0.2,
        marginBottom: 2,
      }}>
        {notification.title}
      </div>

      {/* ── Body — regular weight, secondary color ── */}
      <div style={{
        fontSize: 15, fontWeight: 400, color: 'rgba(0,0,0,0.55)',
        fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif',
        lineHeight: 1.35,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {notification.body}
      </div>
    </motion.div>
  )
}

/* ─── Phone Frame Wrapper ─── */
function PhoneFrame({ children }) {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: 380,
      margin: '0 auto',
      background: '#000',
      borderRadius: 44,
      padding: '12px',
      boxShadow: '0 25px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1) inset',
    }}>
      {/* Inner screen */}
      <div style={{
        background: 'linear-gradient(180deg, #1a1040 0%, #0f0a2e 30%, #1a1040 100%)',
        borderRadius: 34,
        overflow: 'hidden',
        position: 'relative',
        minHeight: 680,
      }}>
        {/* Status bar */}
        <div style={{
          padding: '14px 28px 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>9:41</span>
          <div style={{
            position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
            width: 120, height: 32, borderRadius: 20, background: '#000',
          }} />
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 1 }}>
              {[4, 6, 8, 10].map((h, i) => (
                <div key={i} style={{ width: 3, height: h, background: '#fff', borderRadius: 1 }} />
              ))}
            </div>
            <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
              <path d="M7.5 3C9.5 3 11.3 3.8 12.5 5L14 3.5C12.3 1.8 10 0.8 7.5 0.8C5 0.8 2.7 1.8 1 3.5L2.5 5C3.7 3.8 5.5 3 7.5 3Z" fill="#fff"/>
              <path d="M7.5 6.2C8.7 6.2 9.8 6.7 10.6 7.5L12 6C10.8 4.8 9.2 4 7.5 4C5.8 4 4.2 4.8 3 6L4.4 7.5C5.2 6.7 6.3 6.2 7.5 6.2Z" fill="#fff"/>
              <circle cx="7.5" cy="10" r="1.5" fill="#fff"/>
            </svg>
            <div style={{ width: 24, height: 11, borderRadius: 3, border: '1px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', padding: 1 }}>
              <div style={{ width: '75%', height: '100%', background: '#34D399', borderRadius: 2 }} />
            </div>
          </div>
        </div>

        {/* Lock screen time */}
        <div style={{ textAlign: 'center', padding: '40px 20px 8px' }}>
          <div style={{ fontSize: 72, fontWeight: 700, color: '#fff', letterSpacing: -3, lineHeight: 1 }}>
            9:41
          </div>
          <div style={{ fontSize: 17, fontWeight: 500, color: 'rgba(255,255,255,0.6)', marginTop: 6 }}>
            Wednesday, 5 March
          </div>
        </div>

        {/* Notifications area */}
        <div style={{ 
          padding: '24px 14px 40px', 
          overflowY: 'auto',
          maxHeight: 420,
          WebkitOverflowScrolling: 'touch',
        }}>
          {children}
        </div>

        {/* Bottom home indicator */}
        <div style={{
          position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
          width: 134, height: 5, borderRadius: 100, background: 'rgba(255,255,255,0.3)',
        }} />
      </div>
    </div>
  )
}

/* ─── Main Notifications Page ─── */
export default function Notifications() {
  const navigate = useNavigate()
  const [dismissed, setDismissed] = useState([])
  const [view, setView] = useState('phone') // 'phone' or 'list'

  const activeNotifs = notifications.filter(n => !dismissed.includes(n.id))
  const unreadCount = activeNotifs.filter(n => n.unread).length

  const handleTap = (notification) => {
    navigate('/advisor', { state: { initialQuery: notification.context } })
  }

  return (
    <Page paddingTop={60} bg="#F5F5F4">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
              style={{
                width: 40, height: 40, borderRadius: 14,
                background: '#fff', border: '1px solid rgba(0,0,0,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              <ArrowLeft size={18} color="#0F172A" strokeWidth={2.5} />
            </motion.button>
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 900, letterSpacing: -1.5, color: '#0F172A', lineHeight: 1.05 }}>
            Notifications<span style={{ color: '#6366F1' }}>.</span>
          </h1>
          <p style={{ fontSize: 14, color: '#64748B', fontWeight: 500, marginTop: 6 }}>
            {unreadCount} unread • {activeNotifs.length} total
          </p>
        </div>

        {/* View toggle */}
        <div style={{
          display: 'flex', background: '#fff', borderRadius: 12, padding: 3,
          border: '1px solid rgba(0,0,0,0.06)', marginTop: 48,
        }}>
          {[
            { key: 'phone', icon: Smartphone, label: 'Phone' },
            { key: 'list', icon: Bell, label: 'List' },
          ].map(v => (
            <motion.button
              key={v.key}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView(v.key)}
              style={{
                padding: '8px 14px', borderRadius: 10, border: 'none',
                background: view === v.key ? '#0F172A' : 'transparent',
                color: view === v.key ? '#fff' : '#64748B',
                fontSize: 12, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              <v.icon size={14} />
              {v.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {view === 'phone' ? (
          /* ─── Phone Preview Mode ─── */
          <motion.div
            key="phone"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <PhoneFrame>
              {activeNotifs.slice(0, 2).map((notif, i) => (
                <PhoneNotification 
                  key={notif.id}
                  notification={notif} 
                  index={i}
                  onTap={handleTap}
                />
              ))}
              {activeNotifs.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ textAlign: 'center', padding: '60px 20px' }}
                >
                  <Bell size={40} color="rgba(255,255,255,0.2)" strokeWidth={1.5} />
                  <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginTop: 12 }}>
                    All caught up!
                  </p>
                </motion.div>
              )}
            </PhoneFrame>
          </motion.div>
        ) : (
          /* ─── List View Mode ─── */
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Unread section */}
            {activeNotifs.filter(n => n.unread).length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, paddingLeft: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366F1' }} />
                  <h3 style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                    New
                  </h3>
                </div>
                <div style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)' }}>
                  {activeNotifs.filter(n => n.unread).map((notif, i, arr) => {
                    const Icon = notif.icon
                    return (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => navigate('/advisor', { state: { initialQuery: notif.context } })}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 14,
                          padding: '16px 18px',
                          borderBottom: i < arr.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                          cursor: 'pointer',
                          position: 'relative',
                        }}
                      >
                        {/* Accent left edge */}
                        <div style={{
                          position: 'absolute', left: 0, top: 8, bottom: 8,
                          width: 3, borderRadius: 2, background: notif.impactColor,
                        }} />
                        <div style={{
                          width: 44, height: 44, borderRadius: 14,
                          background: notif.iconBg,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <Icon size={20} color={notif.iconColor} strokeWidth={2.5} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 3, letterSpacing: -0.3 }}>
                            {notif.title}
                          </div>
                          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500, lineHeight: 1.3 }}>
                            {notif.body}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, flexShrink: 0 }}>
                          <span style={{ fontSize: 18, fontWeight: 900, color: notif.impactColor, letterSpacing: -0.8 }}>
                            {notif.impact}
                          </span>
                          <span style={{ fontSize: 9, fontWeight: 700, color: notif.impactColor, opacity: 0.7, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            {notif.impactLabel}
                          </span>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Earlier section */}
            {activeNotifs.filter(n => !n.unread).length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, paddingLeft: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#94A3B8' }} />
                  <h3 style={{ fontSize: 11, fontWeight: 800, color: '#64748B', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                    Earlier
                  </h3>
                </div>
                <div style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)' }}>
                  {activeNotifs.filter(n => !n.unread).map((notif, i, arr) => {
                    const Icon = notif.icon
                    return (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + i * 0.05 }}
                        onClick={() => navigate('/advisor', { state: { initialQuery: notif.context } })}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 14,
                          padding: '16px 18px',
                          borderBottom: i < arr.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{
                          width: 44, height: 44, borderRadius: 14,
                          background: notif.iconBg,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0, opacity: 0.7,
                        }}>
                          <Icon size={20} color={notif.iconColor} strokeWidth={2.5} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 15, fontWeight: 600, color: '#475569', marginBottom: 3, letterSpacing: -0.3 }}>
                            {notif.title}
                          </div>
                          <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, lineHeight: 1.3 }}>
                            {notif.body}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, flexShrink: 0 }}>
                          <span style={{ fontSize: 16, fontWeight: 800, color: `${notif.impactColor}90`, letterSpacing: -0.5 }}>
                            {notif.impact}
                          </span>
                          <span style={{ fontSize: 9, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            {notif.impactLabel}
                          </span>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Page>
  )
}
