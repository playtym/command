import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  TrendingUp, TrendingDown, Shield, CreditCard, Zap, 
  ChevronRight, Sparkles, Receipt, Wallet, ArrowUpRight
} from 'lucide-react'
import { Page, Card, ScrollRow } from '../components/UI'
import { Sparkline } from '../components/Charts'

/* ─── Modern Swiss Data ─── */
const portfolioValue = 7500000
const todayChange = 12400
const todayChangePercent = 0.17

const urgentItems = [
  { 
    id: 1,
    icon: Shield, 
    color: '#064E3B', 
    bgColor: '#ECFDF5',
    title: 'Insurance Expiring', 
    subtitle: 'Renew Creta policy',
    action: 'Due in 12d',
    amount: '₹18.4 k',
    context: "My car insurance for the Creta is expiring in 12 days. The renewal quote is ₹18,400. Should I stick with this or look for better options?"
  },
  { 
    id: 2,
    icon: Zap, 
    color: '#7C2D12',
    bgColor: '#FFEDD5',
    title: 'Electricity Bill', 
    subtitle: 'BESCOM • Due in 2 days',
    action: 'Pay now',
    amount: '₹2.8 k',
    context: "I have an electricity bill of ₹2,840 due in 2 days. Please pay it from my salary account."
  },
]

const thisWeekActions = [
  {
    id: 1,
    icon: TrendingUp,
    color: '#FFFFFF',
    bg: '#1E293B',
    title: 'Monitor',
    subtitle: 'Portfolio at high risk',
    amount: 'Balance',
    value: '+₹2.4 L',
    meta: 'in 10y',
    context: "I have ₹15,000 surplus cash in my account. You suggested investing it. What's the best fund for this right now?"
  },
  {
    id: 2,
    icon: Shield,
    color: '#1E293B',
    bg: '#BFDBFE', // Light Blue
    title: 'Health Top-up',
    subtitle: 'Get ₹15L cover for family',
    amount: 'Review',
    value: '₹267',
    meta: '/mo',
    context: "I'm interested in the ₹15L health insurance top-up for ₹267/month. Can you explain the coverage details?"
  },
  {
    id: 3,
    icon: CreditCard,
    color: '#1E293B',
    bg: '#E9D5FF', // Soft Purple
    title: 'Credit Score',
    subtitle: 'Report utilization < 30%',
    amount: 'Boost',
    value: '+12',
    meta: 'pts',
    context: "How can I improve my credit score? It says keeping utilization under 30% helps. Currently at 45%."
  },
]

const recentTrans = [
  { id: 1, name: 'Uber', cat: 'Transport', amount: -450, time: '2h ago', icon: '🚗' },
  { id: 2, name: 'Zomato', cat: 'Food', amount: -624, time: '5h ago', icon: '🍔' },
  { id: 3, name: 'SIP Debit', cat: 'Invest', amount: -5000, time: 'Yesterday', icon: '📈' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <Page paddingTop={60}>
      {/* ─── Header ─── */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: 32 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#064E3B' }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#57534E', textTransform: 'uppercase', letterSpacing: 1.5 }}>
            Overview
          </span>
        </div>
        <h1 style={{ fontSize: 42, fontWeight: 900, letterSpacing: -2, color: '#1C1917', lineHeight: 1 }}>
          Good morning,<br/>Ankur<span style={{ color: '#F97316' }}>.</span>
        </h1>
      </motion.div>

      {/* ─── Net Worth Hero ─── */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div style={{ 
          padding: 'clamp(24px, 5vw, 36px) clamp(20px, 4vw, 32px) clamp(20px, 4vw, 32px)', 
          background: '#FFFFFF', // New Clean White  
          borderRadius: 40,
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: 'none',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative Loop/Swirl (CSS) - Now Glowing Orbs to match Action.jsx */}
          <div style={{
            position: 'absolute', top: -40, right: -40, width: 220, height: 220,
            borderRadius: '50%', background: '#064E3B', 
            filter: 'blur(50px)', opacity: 0.08,
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute', bottom: -60, left: -40, width: 180, height: 180,
            borderRadius: '50%', background: '#10B981', 
            filter: 'blur(60px)', opacity: 0.12,
            pointerEvents: 'none'
          }} />

          {/* Top Label */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1, marginBottom: 24 }}>
             <div style={{ 
                fontSize: 12, fontWeight: 800, color: '#0F172A', 
                textTransform: 'uppercase', letterSpacing: 1.5,
                background: '#F8FAFC', padding: '10px 18px', borderRadius: 100
            }}>
                Net Worth
            </div>
            
             <div style={{ 
              backgroundColor: '#ECFDF5', 
              color: '#064E3B', 
              padding: '8px 16px', 
              borderRadius: 100,
              fontSize: 14, fontWeight: 800,
              display: 'flex', alignItems: 'center', gap: 6,
              boxShadow: 'none'
            }}>
              <TrendingUp size={16} strokeWidth={3} />
              {todayChangePercent}%
            </div>
          </div>

          <div>
             <h2 style={{ fontSize: 'clamp(48px, 14vw, 64px)', fontWeight: 900, letterSpacing: -1.5, marginBottom: 4, lineHeight: 0.9, color: '#0F172A' }}>
                ₹75.0<span style={{ opacity: 0.4, fontSize: 36, fontWeight: 700, marginLeft: 4 }}>L</span>
             </h2>
             <p style={{ fontSize: 16, fontWeight: 600, color: '#64748B', marginTop: 12 }}>+₹12.4k today</p>
          </div>
          
          <div style={{ marginTop: 42, position: 'relative', zIndex: 1, opacity: 1 }}>
            <Sparkline 
              data={[468, 471, 474, 476, 473, 475, 478, 474, 477, 479]} 
              width={300} 
              height={56} 
              color="#10B981" 
              strokeWidth={4}
            />
          </div>
        </div>
      </motion.div>

      {/* ─── Notification Bubbles (Urgent) ─── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ marginTop: 32 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 11, fontWeight: 800, color: '#78716C', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Needs Attention
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {urgentItems.map((item) => (
            <div key={item.id} 
              style={{ 
                padding: 18, 
                background: '#FFFFFF',
                borderRadius: 28,
                display: 'flex', alignItems: 'center', gap: 14,
                boxShadow: 'none',
                border: '1px solid rgba(0,0,0,0.08)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => navigate('/advisor', { state: { initialQuery: item.context } })}
            >
              {/* Glow */}
              <div style={{
                position: 'absolute', top: -30, left: -30, width: 100, height: 100,
                background: item.bgColor, opacity: 0.25, filter: 'blur(40px)', borderRadius: '50%'
              }} />

              <div style={{ 
                width: 44, height: 44, borderRadius: 16, 
                background: item.bgColor, 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: item.color,
                zIndex: 1,
                flexShrink: 0,
                boxShadow: 'none'
              }}>
                <item.icon size={22} strokeWidth={2.5} />
              </div>
              <div style={{ flex: 1, zIndex: 1, minWidth: 0 }}>
                <h4 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', letterSpacing: -0.6, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                   <span style={{ fontSize: 11, fontWeight: 800, color: item.color, background: `${item.bgColor}40`, padding: '4px 10px', borderRadius: 100, letterSpacing: 0.5, backdropFilter: 'blur(4px)' }}>
                      {item.action}
                   </span>
                   <span style={{ fontSize: 13, color: '#64748B', fontWeight: 600 }}>{item.subtitle.split('•')[0]}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', zIndex: 1 }}>
                 <div style={{ fontSize: 19, fontWeight: 900, color: '#0F172A', letterSpacing: -0.8 }}>{item.amount}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ─── Suggested For You (Cards) ─── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{ marginTop: 32 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 11, fontWeight: 800, color: '#78716C', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Suggested For You
          </h3>
        </div>

        <ScrollRow gap={16}>
          {thisWeekActions.map((action, i) => (
            <div 
              key={i}
              style={{ 
                minWidth: 260, 
                scrollSnapAlign: 'center',
                background: action.color === '#FFFFFF' ? '#1E293B' : '#FFFFFF',
                borderRadius: 40,
                padding: 'clamp(20px, 5vw, 32px)',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: 'none',
                position: 'relative',
                overflow: 'hidden',
                color: action.color === '#FFFFFF' ? 'white' : '#0F172A'
              }}
              onClick={() => navigate('/advisor', { state: { initialQuery: action.context } })}
            >
              {/* Glow */}
              <div style={{
                  position: 'absolute', top: -50, right: -50, width: 200, height: 200,
                  borderRadius: '50%', background: action.color === '#FFFFFF' ? 'rgba(255,255,255,0.05)' : action.bg,
                  filter: 'blur(60px)', opacity: 0.2,
                  pointerEvents: 'none'
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
                <div style={{ 
                    padding: '8px 16px', 
                    background: action.color === '#FFFFFF' ? 'rgba(255,255,255,0.1)' : '#F1F5F9', 
                    backdropFilter: 'blur(8px)',
                    color: action.color === '#FFFFFF' ? 'white' : '#64748B',
                    borderRadius: 100, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1
                }}>
                    {action.title}
                </div>
              </div>
              
              <div style={{ marginBottom: 32, position: 'relative', zIndex: 1 }}>
                 <div style={{ fontSize: 'clamp(28px, 8vw, 36px)', fontWeight: 900, letterSpacing: -2, lineHeight: 1, marginBottom: 8 }}>{action.value}</div>
                 <div style={{ fontSize: 14, fontWeight: 600, opacity: 0.7 }}>{action.subtitle}</div>
              </div>

              <div style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                paddingTop: 24, borderTop: `1px solid ${action.color === '#FFFFFF' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}` 
              }}>
                <span style={{ fontSize: 16, fontWeight: 800 }}>{action.amount}</span>
                <div style={{ 
                  width: 44, height: 44, borderRadius: 16, 
                  background: action.color === '#FFFFFF' ? 'white' : '#0F172A', 
                  color: action.color === '#FFFFFF' ? '#0F172A' : 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: 'none'
                }}>
                  <ArrowUpRight size={22} strokeWidth={3} />
                </div>
              </div>
            </div>
          ))}
        </ScrollRow>
      </motion.div>

      {/* ─── Recent Activity List ─── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        style={{ marginTop: 32 }}
      >
         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 11, fontWeight: 800, color: '#78716C', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Recent Activity
          </h3>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#EA580C' }}>See all</span>
        </div>
        
        <div style={{ background: 'white', borderRadius: 28, padding: 8, boxShadow: 'none', border: '1px solid rgba(0,0,0,0.08)' }}>
          {recentTrans.map((t, i) => (
            <div key={t.id} style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              padding: '18px 16px',
              borderBottom: i < recentTrans.length - 1 ? '1px solid #F5F5F4' : 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ 
                  width: 44, height: 44, borderRadius: 14, 
                  background: '#F5F5F4', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20
                }}>
                  {t.icon}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#1C1917' }}>{t.name}</div>
                  <div style={{ fontSize: 13, color: '#78716C', fontWeight: 500 }}>{t.time}</div>
                </div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: t.amount < 0 ? '#1C1917' : '#059669' }}>
                {t.amount < 0 ? '-' : '+'}₹{Math.abs(t.amount)}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </Page>
  )
}
