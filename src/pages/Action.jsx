import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, TrendingUp, Flame, Utensils, CreditCard, Clapperboard, FileText, Sparkles, ArrowRight, X } from 'lucide-react'
import { Page, Dot, SH, Card, WhiteCard, Num, AnimNum, stagger, ScrollRow } from '../components/UI'

/* ─── Data ─── */
const totalMoneySaved = 83553

/* ─── Actionable Insights (AI Deck) ─── */
const actions = [
  {
    id: 'portfolio-rebalance',
    label: 'Critical Alert',
    title: 'Your Equity is Risky!',
    desc: 'You are 77% in stocks (Target 60%). Move ₹1.2L to Debt before market falls.',
    color: '#F59E0B', // Amber
    bg: '#FFFBEB',
    impact: 'Reduce Risk',
    cta: 'Rotate Now',
    context: "My debt allocation is just 12% against a target of 30%. Help me rebalance by moving ₹1.2L from high-risk equity."
  },
  {
    id: 'tax-nps',
    label: 'Money Left on Table',
    title: 'Ankur, Claim ₹15.6K!',
    desc: 'You missed Section 80CCD. Invest ₹50K in NPS to get ₹15.6K back.',
    color: '#4F46E5', // Indigo
    bg: '#EEF2FF',
    impact: 'Get Refund',
    cta: 'Invest ₹50K',
    context: 'Help me understand Section 80CCD(1B) and why investing ₹50K saves me ₹15.6K?'
  },
  {
    id: 'idle-cash',
    label: 'Sleeping Money',
    title: 'Your ₹1.3L is rotting',
    desc: 'HDFC savings gives only 3%. Move to Liquid Fund for 7.2%?',
    color: '#059669', // Emerald
    bg: '#ECFDF5',
    impact: '+₹4,924',
    cta: 'Switch',
    context: 'Analyze my HDFC idle cash. Why is a Liquid Fund better than my savings account?'
  },
  {
    id: 'insurance-gap',
    label: 'Risk Alert',
    title: 'Fix 15L Cover Gap',
    desc: 'Mumbai ICU costs ~₹10L. Your cover is ₹5L. Top-up for ₹267/mo.',
    color: '#DC2626', // Red
    bg: '#FEF2F2',
    impact: 'Critical',
    cta: 'Get Top-up',
    context: 'Explain the gap in my health insurance compared to Mumbai hospital rates.'
  },
  {
    id: 'zomato-spend',
    label: 'Spending',
    title: 'Cut Zomato by 20%',
    desc: 'You spent ₹8.4K this month. Cap it at ₹1.5K/week to save ₹24k/yr.',
    color: '#D97706', // Amber
    bg: '#FFFBEB',
    impact: '₹24,000/yr',
    cta: 'Set Limit',
    context: 'Analyze my food delivery spending trends and suggest a realistic budget.'
  }
]


const totalPotentialSavings = 4924 + 4200 + 24000 + 15600 + 3200

const now = new Date()
const dateStr = now.toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })
const hour = now.getHours()
const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

const lastSync = '2 hours ago'

export default function Action() {
  const navigate = useNavigate()
  const [introSeen] = useState(() => {
    try { return localStorage.getItem('command_intro_seen') === '1' } catch { return false }
  })
  const [introStep, setIntroStep] = useState(introSeen ? 2 : 0)
  const [showCheckin, setShowCheckin] = useState(() => {
    try {
      const last = localStorage.getItem('command_checkin_date')
      const today = new Date().toDateString()
      if (last !== today) {
        localStorage.setItem('command_checkin_date', today)
        return true
      }
      return false
    } catch { return false }
  })

  useEffect(() => {
    if (introStep === 0) {
      const timer = setTimeout(() => setIntroStep(1), 2800)
      return () => clearTimeout(timer)
    }
  }, [introStep])

  useEffect(() => {
    if (showCheckin) {
      const t = setTimeout(() => setShowCheckin(false), 4000)
      return () => clearTimeout(t)
    }
  }, [showCheckin])

  const finishIntro = () => {
    setIntroStep(2)
    try { localStorage.setItem('command_intro_seen', '1') } catch {}
  }
  
  const handleAskAI = (action) => {
    navigate('/advisor', { state: { 
      activeItem: action,
      context: 'actions',
      allItems: actions 
    }})
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {introStep === 0 && (
          <motion.div key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }} onClick={() => setIntroStep(1)}
            style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#fff',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: 20, textAlign: 'center', cursor: 'pointer' }}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: 'spring' }}
                style={{ fontSize: 48, marginBottom: 12 }}>🎉</motion.div>
              <h2 style={{ fontSize: 13, color: '#666', fontWeight: 700, textTransform: 'uppercase', marginBottom: 16, letterSpacing: 1.5 }}>Total Money Saved</h2>
              <AnimNum value={totalMoneySaved} prefix="₹" style={{ fontSize: 64, fontWeight: 900, color: '#000', letterSpacing: -3, lineHeight: 1 }} />
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
                style={{ marginTop: 24, padding: '8px 20px', background: '#F3F4F6', borderRadius: 100, color: '#374151', fontSize: 13, fontWeight: 600 }}>
                You're doing great, Ankur! 🚀
              </motion.div>
            </motion.div>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
              style={{ position: 'absolute', bottom: 60, fontSize: 12, color: '#9CA3AF' }}>
              Tap anywhere to continue
            </motion.span>
          </motion.div>
        )}

        {introStep === 1 && (
          <motion.div key="lost" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#FEF2F2',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: 30, textAlign: 'center' }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
              style={{ fontSize: 48, marginBottom: 12 }}>😔</motion.div>
            <h2 style={{ fontSize: 13, color: '#B91C1C', fontWeight: 700, textTransform: 'uppercase', marginBottom: 16, letterSpacing: 1.5 }}>But you could still save</h2>
            <AnimNum value={totalPotentialSavings} prefix="₹" suffix="/yr" style={{ fontSize: 56, fontWeight: 900, color: '#EF4444', letterSpacing: -3, lineHeight: 1 }} />
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              style={{ fontSize: 15, color: '#7F1D1D', maxWidth: 300, lineHeight: 1.6, fontWeight: 500, marginTop: 16 }}>
              Lost to idle cash, missed renewals & unclaimed tax benefits.
            </motion.p>
            <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              whileTap={{ scale: 0.95 }} onClick={finishIntro}
              style={{ marginTop: 48, background: '#EF4444', color: '#fff', border: 'none',
                padding: '18px 42px', borderRadius: 100, fontSize: 18, fontWeight: 800,
                cursor: 'pointer', boxShadow: '0 20px 40px -10px rgba(239, 68, 68, 0.4)' }}>
              See Action Plan →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dashboard */}
      <Page>
        <motion.div variants={stagger.container} initial="hidden" animate="show">
          {/* Greeting */}
          <motion.div variants={stagger.item} style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Dot color="#10B981" pulse />
                <span style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>Synced {lastSync}</span>
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, color: '#111827' }}>{greeting}, Ankur.</h1>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 }}>
               A
            </div>
          </motion.div>

          {/* Daily check-in reward */}
          <AnimatePresence>
            {showCheckin && (
              <motion.div variants={stagger.item}
                initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }} transition={{ duration: 0.4 }}
              >
                <div style={{
                  background: '#ECFDF5', border: '1px solid #D1FAE5',
                  borderRadius: 14, padding: '12px 16px', marginBottom: 24,
                  display: 'flex', alignItems: 'center', gap: 10, color: '#065F46',
                }}>
                  <div style={{ padding: 6, background: '#fff', borderRadius: '50%' }}>
                    <Flame size={16} color="#059669" fill="#059669" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>Daily check-in: +10 points!</span>
                    <span style={{ fontSize: 11, opacity: 0.8, display: 'block', marginTop: 1 }}>Day 18 streak — keep it going</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 800, background: '#fff', padding: '4px 10px', borderRadius: 8, color: '#059669' }}>+10 pts</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── AI ACTION DECK (Swipeable) ─── */}
          <motion.div variants={stagger.item} style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: '#64748B', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                AI Action Plan
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6366F1', fontSize: 12, fontWeight: 600 }}>
                <Sparkles size={12} />
                <span>{actions.length} Pending</span>
              </div>
            </div>
            
            <ScrollRow gap={12}>
              {actions.map((action, i) => (
                <motion.div 
                  key={action.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAskAI(action)}
                  style={{ 
                    minWidth: 280,
                    scrollSnapAlign: 'center',
                    background: action.bg,
                    borderRadius: 24,
                    padding: 20,
                    border: '1px solid rgba(0,0,0,0.03)',
                    boxShadow: 'none',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                      <div style={{ 
                        width: 44, height: 44, borderRadius: 14, 
                        background: 'white', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: action.color,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                      }}>
                        <Sparkles size={22} />
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: action.color, background: 'white', padding: '4px 8px', borderRadius: 6 }}>
                        Save {action.impact}
                      </div>
                    </div>
                    
                    <h4 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>{action.title}</h4>
                    <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.4, marginBottom: 24, fontWeight: 500 }}>{action.desc}</p>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ 
                      flex: 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      fontSize: 13, fontWeight: 700, color: 'white',
                      background: '#0F172A', border: 'none', padding: '10px',
                      borderRadius: 12
                    }}>
                      {action.cta} <ArrowRight size={14} />
                    </button>
                    <button style={{ 
                      width: 40,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'white', border: 'none', borderRadius: 12,
                      color: action.color
                    }}>
                      <Sparkles size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </ScrollRow>
          </motion.div>

          {/* Right Now — cross-page status feed */}
          <motion.div variants={stagger.item}>
            <div style={{ marginBottom: 12 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111827' }}>Right Now</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { Icon: TrendingUp, text: 'Portfolio +23% XIRR — metric is solid', sub: 'Beating Nifty by 8.8%', color: '#10B981', bg: '#ECFDF5' },
                { Icon: CreditCard, text: 'HDFC Bill Due', sub: '₹7,962 due in 12 days', color: '#3B82F6', bg: '#EFF6FF' },
              ].map(({ Icon, text, sub, color, bg }, i) => (
                <div key={i} style={{ 
                  background: '#fff', borderRadius: 16, padding: '14px 16px', 
                  display: 'flex', alignItems: 'center', gap: 14,
                  boxShadow: '0 2px 6px -2px rgba(0,0,0,0.03), 0 0 0 1px rgba(0,0,0,0.02)'
                }}>
                  <div style={{ 
                    width: 40, height: 40, borderRadius: 12, background: bg, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: color 
                  }}>
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{text}</div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: '#6B7280', marginTop: 2 }}>{sub}</div>
                  </div>
                  <ChevronRight size={16} color="#D1D5DB" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Smart Summary - Reduced Visual Weight */}
          <motion.div variants={stagger.item} style={{ marginTop: 32, marginBottom: 20 }}>
            <div style={{ padding: 20, background: '#F9FAFB', borderRadius: 20 }}>
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                 <span style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>Saved YTD</span>
                 <span style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>Potential</span>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                 <span style={{ fontSize: 24, fontWeight: 800, color: '#10B981', fontFamily: 'var(--mono)' }}>₹{(totalMoneySaved/1000).toFixed(1)}k</span>
                 <div style={{ height: 24, width: 1, background: '#E5E7EB' }} />
                 <span style={{ fontSize: 24, fontWeight: 800, color: '#EF4444', fontFamily: 'var(--mono)' }}>₹{(totalPotentialSavings/1000).toFixed(1)}k</span>
               </div>
            </div>
          </motion.div>
        </motion.div>
      </Page>
    </>
  )
}

