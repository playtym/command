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
    color: '#EF4444', 
    bgColor: '#EFF6FF',
    title: 'Insurance Expiring', 
    subtitle: 'Renew Creta policy',
    action: 'Due in 12d',
    amount: '₹18,400',
    context: "My car insurance for the Creta is expiring in 12 days. The renewal quote is ₹18,400. Should I stick with this or look for better options?"
  },
  { 
    id: 2,
    icon: Zap, 
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    title: 'Electricity Bill', 
    subtitle: 'BESCOM • Due in 2 days',
    action: 'Pay now',
    amount: '₹2,840',
    context: "I have an electricity bill of ₹2,840 due in 2 days. Please pay it from my salary account."
  },
]

const thisWeekActions = [
  {
    icon: TrendingUp,
    color: '#10B981',
    bg: '#ECFDF5',
    title: 'Invest Surplus',
    subtitle: 'You have ₹15k extra cash',
    amount: 'Invest',
    value: '+₹2.4L',
    meta: 'in 10y',
    context: "I have ₹15,000 surplus cash in my account. You suggested investing it. What's the best fund for this right now?"
  },
  {
    icon: Shield,
    color: '#3B82F6',
    bg: '#EFF6FF',
    title: 'Health Top-up',
    subtitle: 'Get ₹15L cover for family',
    amount: 'Review',
    value: '₹267',
    meta: '/mo',
    context: "I'm interested in the ₹15L health insurance top-up for ₹267/month. Can you explain the coverage details?"
  },
  {
    icon: CreditCard,
    color: '#6366F1',
    bg: '#EEF2FF',
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
    <Page>
      {/* ─── Header ─── */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: 32, padding: '0 4px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#F97316' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#64748B', letterSpacing: 0.5, textTransform: 'uppercase' }}>
            Command
          </span>
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 500, letterSpacing: -1, color: '#0F172A', maxWidth: '80%' }}>
          {greeting}, <span style={{ color: '#94A3B8' }}>Ankur.</span>
        </h1>
      </motion.div>

      {/* ─── Net Worth Hero ─── */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div style={{ padding: 24, background: '#0F172A', borderRadius: 24, color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500 }}>Total Net Worth</p>
              <h2 style={{ fontSize: 42, fontWeight: 400, letterSpacing: -1.5, marginTop: 4 }}>
                ₹75.0<span style={{ color: '#64748B' }}>L</span>
              </h2>
            </div>
            <div style={{ 
              backgroundColor: 'rgba(16, 185, 129, 0.2)', 
              color: '#34D399', 
              padding: '6px 12px', 
              borderRadius: 100,
              fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 4
            }}>
              <TrendingUp size={14} />
              {todayChangePercent}%
            </div>
          </div>
          
          <div style={{ marginTop: 24 }}>
            <Sparkline 
              data={[468, 471, 474, 476, 473, 475, 478, 474, 477, 479]} 
              width={300} 
              height={40} 
              color="#34D399" 
              strokeWidth={2}
            />
          </div>
        </div>
      </motion.div>

      {/* ─── Priority Actions (Urgent) ─── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ marginTop: 32 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, padding: '0 4px' }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#64748B', letterSpacing: 0.5, textTransform: 'uppercase' }}>
            Needs Attention
          </h3>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#EF4444' }}>2 actions</span>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          {urgentItems.map((item) => (
            <div key={item.id} 
              style={{ 
                padding: 16, 
                background: 'white',
                borderRadius: 20,
                display: 'flex', alignItems: 'center', gap: 16,
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                border: '1px solid #F1F5F9'
              }}
              onClick={() => navigate('/advisor', { state: { initialQuery: item.context } })}
            >
              <div style={{ 
                width: 44, height: 44, borderRadius: 14, 
                background: item.bgColor, 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: item.color
              }}>
                <item.icon size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: 16, fontWeight: 600, color: '#0F172A' }}>{item.title}</h4>
                <p style={{ fontSize: 13, color: '#64748B' }}>{item.subtitle}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', display: 'block' }}>{item.amount}</span>
                <span style={{ fontSize: 11, color: item.color, fontWeight: 600 }}>{item.action}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ─── AI Opportunities (Horizontal Deck) ─── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{ marginTop: 32 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, padding: '0 4px' }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#64748B', letterSpacing: 0.5, textTransform: 'uppercase' }}>
            Suggested For You
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6366F1', fontSize: 12, fontWeight: 600 }}>
            <Sparkles size={12} />
            <span>AI Insights</span>
          </div>
        </div>

        <ScrollRow gap={12}>
          {thisWeekActions.map((action, i) => (
            <div 
              key={i}
              style={{ 
                minWidth: 260, 
                scrollSnapAlign: 'center',
                background: action.bg,
                borderRadius: 24,
                padding: 20,
                border: '1px solid rgba(0,0,0,0.03)',
                boxShadow: 'none',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => navigate('/advisor', { state: { initialQuery: action.context } })}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div style={{ 
                  width: 44, height: 44, borderRadius: 14, 
                  background: 'white', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: action.color,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}>
                  <action.icon size={22} />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: action.color, letterSpacing: -0.5 }}>{action.value}</div>
                  <div style={{ fontSize: 11, color: action.color, fontWeight: 600, opacity: 0.8 }}>{action.meta}</div>
                </div>
              </div>
              
              <h4 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>{action.title}</h4>
              <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.4, marginBottom: 20, fontWeight: 500 }}>{action.subtitle}</p>

              <div style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                paddingTop: 16, borderTop: '1px solid rgba(0,0,0,0.06)' 
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: action.color }}>{action.amount}</span>
                <div style={{ 
                  width: 24, height: 24, borderRadius: 12, 
                  background: 'white', color: action.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <ChevronRight size={14} />
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
        style={{ marginTop: 32, marginBottom: 120 }}
      >
         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, padding: '0 4px' }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#64748B', letterSpacing: 0.5, textTransform: 'uppercase' }}>
            Recent Activity
          </h3>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#3B82F6' }}>See all</span>
        </div>
        
        <div style={{ background: 'white', borderRadius: 20, padding: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.02)', border: '1px solid #F1F5F9' }}>
          {recentTrans.map((t, i) => (
            <div key={t.id} style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              padding: '16px 12px',
              borderBottom: i < recentTrans.length - 1 ? '1px solid #F1F5F9' : 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ 
                  width: 40, height: 40, borderRadius: 12, 
                  background: '#F8FAFC', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18
                }}>
                  {t.icon}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#0F172A' }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: '#94A3B8' }}>{t.time} • {t.cat}</div>
                </div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: t.amount < 0 ? '#0F172A' : '#10B981' }}>
                {t.amount < 0 ? '-' : '+'}₹{Math.abs(t.amount)}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </Page>
  )
}
