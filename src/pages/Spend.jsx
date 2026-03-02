import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  CreditCard, ShoppingBag, Coffee, ChevronRight, 
  Sparkles, AlertCircle, Calendar, ArrowUpRight,
  School, Plane, Hotel, ArrowRight
} from 'lucide-react'
import { Page, ScrollRow, stagger } from '../components/UI'
import { GaugeArc, Bar, SegmentBar, Donut } from '../components/Charts'

const upcomingExpenses = [
  {
    id: 101,
    icon: School,
    color: '#10B981',
    bg: '#ECFDF5',
    title: 'Reyaan\'s School Fee',
    subtitle: 'Due Mar 5 • Fully funded in RD',
    amount: '₹42,000',
    benefit: 'Auto-Pay Set',
    context: "I have a big school fee payment of ₹42,000 due on March 5th. Can we check if my salary account has enough float or if I need to liquidate something?"
  },
  {
    id: 102,
    icon: Plane,
    color: '#0EA5E9',
    bg: '#E0F2FE',
    title: 'Summer Trip in May',
    subtitle: 'Flights & Hotel fully budgeted',
    amount: '₹1.2 L',
    benefit: 'Goal Reached',
    context: "I've already booked flights for my summer trip, but I need to plan for the hotel bills which I'll pay during the trip. Help me budgert for this."
  },
]

const spendInsights = [
  {
    id: 1,
    icon: ShoppingBag,
    color: '#EF4444',
    bg: '#FEF2F2',
    title: 'Shopping Alert',
    subtitle: 'Myntra & Amazon spend ₹5.6k this month — 40% over your usual.',
    amount: '₹5.6 k',
    benefit: 'Over Budget',
    context: "I seem to have overspent on shopping this month (₹5.6k). Can you break down my recent shopping transactions and suggest a cap?"
  },
  {
    id: 2,
    icon: Calendar,
    color: '#8B5CF6',
    bg: '#F5F3FF',
    title: 'Subscription Audit',
    subtitle: 'Netflix watched 2 hrs in 30 days — cancel or downgrade?',
    amount: '₹649',
    benefit: 'Save Money',
    context: "You mentioned my Netflix usage is low compared to the cost. Should I cancel it or downgrade?"
  },
]

const creditCards = [
  { id: 1, name: 'HDFC Regalia', last4: '4242', limit: 120000, used: 45000, color: '#3B82F6', network: 'VISA',
    topSpend: 'Travel', optimal: true, status: 'Great for Lounge',
    bg: 'linear-gradient(165deg, #EFF6FF 0%, #DBEAFE 100%)',
    breakdown: [
      { label: 'Travel', color: '#3B82F6', pct: '40%' },
      { label: 'Dining', color: '#F59E0B', pct: '30%' },
      { label: 'Grocery', color: '#10B981', pct: '15%' },
    ]
  },
  { id: 2, name: 'ICICI Amazon', last4: '8812', limit: 80000, used: 12100, color: '#F59E0B', network: 'MasterCard',
    topSpend: 'Shopping', optimal: false, status: 'Use Regalia for Dining',
    bg: 'linear-gradient(165deg, #FFFBEB 0%, #FEF3C7 100%)',
    breakdown: [
      { label: 'Shopping', color: '#EF4444', pct: '70%' },
      { label: 'Subscriptions', color: '#8B5CF6', pct: '20%' },
    ]
  },
  { id: 3, name: 'Gold Member', last4: '7821', limit: 200000, used: 24750, color: '#D97706', network: 'Gold Tier',
    topSpend: 'Luxury', optimal: true, status: '2% Flat Cashback',
    bg: 'linear-gradient(165deg, #FEF3C7 0%, #FDE68A 100%)',
    breakdown: [
      { label: 'Premium', color: '#D97706', pct: '50%' },
      { label: 'Dining', color: '#F59E0B', pct: '20%' },
      { label: 'Other', color: '#FDE68A', pct: '10%' },
    ]
  },
]

const recentTrans = [
  { id: 1, name: 'Uber', cat: 'Transport', amount: -450, time: '2h ago', icon: '🚗' },
  { id: 2, name: 'Zomato', cat: 'Food', amount: -624, time: '5h ago', icon: '🍔' },
  { id: 3, name: 'Starbucks', cat: 'Dining', amount: -350, time: 'Yesterday', icon: '☕' },
  { id: 4, name: 'Myntra', cat: 'Shopping', amount: -2100, time: 'Yesterday', icon: '🛍️' },
  { id: 5, name: 'Salary', cat: 'Income', amount: 85000, time: '01 Feb', icon: '💰' },
]

/* ─── Flippable Card Wrapper (matches Money/Action) ─── */
const cardStyle = {
  minWidth: 'calc(100% - 24px)',
  scrollSnapAlign: 'center',
  height: 'clamp(400px, 58vh, 540px)',
  perspective: 1200,
  borderRadius: 32,
}

const faceBase = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  borderRadius: 32,
  padding: '24px 22px 22px',
  border: 'none',
  boxShadow: '0 8px 40px -12px rgba(0,0,0,0.10)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}

function FlipCard({ front, back, bg = '#FFFFFF' }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <div style={cardStyle} onClick={() => setFlipped(f => !f)}>
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
        style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d', cursor: 'pointer' }}
      >
        <div style={{ ...faceBase, background: bg, color: '#0F172A' }}>
          {front}
        </div>
        <div style={{ ...faceBase, background: bg, color: '#0F172A', transform: 'rotateY(180deg)' }}>
          {back}
        </div>
      </motion.div>
    </div>
  )
}

export default function Spend() {
  const navigate = useNavigate()

  return (
    <Page paddingTop={100} bg="#F5F5F4">
      <motion.div variants={stagger.container} initial="hidden" animate="show">

      {/* ─── Header ─── */}
      <motion.div variants={stagger.item} style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 38, fontWeight: 900, letterSpacing: -1.5, color: '#0F172A', lineHeight: 1.05 }}>
          Spend<span style={{ color: '#EA580C' }}>.</span>
        </h1>
      </motion.div>

      {/* ─── Hero Cards: Feb Outflow + All Credit Cards (Horizontal Scroll) ─── */}
      <motion.div variants={stagger.item} style={{ marginBottom: 32 }}>
        <ScrollRow gap={16} style={{ paddingBottom: 10 }}>

          {/* ── Card 1: February Outflow ── */}
          <FlipCard
            bg="linear-gradient(165deg, #FFF7ED 0%, #FFEDD5 100%)"
            front={
              <>
                {/* Header: Pill Label + Circle Dot */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: 1.5, background: 'rgba(255,255,255,0.5)', padding: '10px 18px', borderRadius: 100 }}>
                    February Outflow
                  </div>
                  <div style={{ position: 'relative', width: 44, height: 44, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px -4px rgba(0,0,0,0.05)' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#F97316' }} />
                  </div>
                </div>

                {/* Hero Content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h4 style={{ fontSize: 44, fontWeight: 900, color: '#0F172A', marginBottom: 16, letterSpacing: -2.8, lineHeight: 0.92 }}>
                    ₹27.4k Spent
                  </h4>
                  <p style={{ fontSize: 16, color: '#64748B', lineHeight: 1.5, fontWeight: 600, letterSpacing: -0.4, maxWidth: '95%' }}>
                    61% of your ₹45k monthly budget used. Travel was the biggest category.
                  </p>
                  <div style={{ marginTop: 16 }}>
                      <div style={{ marginBottom: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#9A3412' }}>Budget Used</span>
                          <span style={{ fontSize: 11, fontWeight: 800, color: '#F97316' }}>61%</span>
                        </div>
                        <Bar value={61} max={100} color="#F97316" h={6} />
                      </div>
                    </div>
                </div>

                  {/* Callout + CTA pinned to bottom */}
                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'inline-flex', marginBottom: 12 }}>
                      <div style={{ background: '#FEF08A', border: '2px solid #0F172A', borderRadius: 14, padding: '9px 14px', fontSize: 14, fontWeight: 800, color: '#0F172A', boxShadow: '3px 3px 0px #0F172A' }}>
                        ₹17.6k Remaining
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate('/advisor', { state: { initialQuery: "I've spent ₹27.4k this month out of my ₹45k budget. Travel is my biggest category at ₹9.6k. Help me stay on track for the rest of the month." } }) }}
                    style={{ width: '100%', padding: '16px 20px', borderRadius: 28, background: '#0F172A', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', cursor: 'pointer', boxShadow: '0 12px 24px -8px rgba(15, 23, 42, 0.25)' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 13, textTransform: 'uppercase', opacity: 0.7, letterSpacing: 1, marginBottom: 2 }}>Action</span>
                      <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.5 }}>Track Spending</span>
                    </div>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'white', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ArrowRight size={18} strokeWidth={3} />
                    </div>
                  </button>
                </div>
              </>
            }
            back={
              <>
                {/* Back: Spend Breakdown with GaugeArc + Category bars */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.8 }}>Budget Tracker</span>
                    <p style={{ fontSize: 12, color: '#9A3412', fontWeight: 600, marginTop: 4 }}>61% used • 26 days left</p>
                  </div>
                  <GaugeArc value={61} max={100} size={80} stroke={8} color="#F97316" track="rgba(0,0,0,0.06)">
                    <span style={{ fontSize: 16, fontWeight: 900, color: '#EA580C', marginTop: -8 }}>61%</span>
                  </GaugeArc>
                </div>

                {/* Category breakdown with animated bars */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { cat: 'Travel', val: 9.6, max: 12, color: '#F97316', icon: '✈️' },
                    { cat: 'Food & Dining', val: 6.2, max: 10, color: '#EF4444', icon: '🍔' },
                    { cat: 'Shopping', val: 5.6, max: 6, color: '#8B5CF6', icon: '🛍️' },
                    { cat: 'Transport', val: 3.2, max: 5, color: '#0EA5E9', icon: '🚗' },
                    { cat: 'Subscriptions', val: 2.8, max: 4, color: '#10B981', icon: '📱' },
                  ].map((c, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 12 }}>{c.icon}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>{c.cat}</span>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 800, color: c.color }}>₹{c.val}k</span>
                      </div>
                      <Bar value={c.val} max={c.max} color={c.color} h={6} delay={i * 0.1} />
                    </div>
                  ))}
                </div>

                {/* Bottom stats */}
                <div style={{ paddingTop: 12, borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', gap: 20 }}>
                  <div>
                    <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, letterSpacing: 0.5 }}>SAFE/DAY</div>
                    <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2, color: '#10B981' }}>₹677</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, letterSpacing: 0.5 }}>PROJECTION</div>
                    <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2, color: '#10B981' }}>₹35k</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, letterSpacing: 0.5 }}>VS LAST MO</div>
                    <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2, color: '#10B981' }}>-12%</div>
                  </div>
                </div>
              </>
            }
          />

          {/* ── Card 2: All Credit Cards in One ── */}
          <FlipCard
            bg="linear-gradient(165deg, #F0F4FF 0%, #E0E7FF 100%)"
            front={
              <>
                {/* Header: Pill Label + Circle Dot */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: 1.5, background: 'rgba(255,255,255,0.5)', padding: '10px 18px', borderRadius: 100 }}>
                    Credit Cards
                  </div>
                  <div style={{ position: 'relative', width: 44, height: 44, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px -4px rgba(0,0,0,0.05)' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#6366F1' }} />
                  </div>
                </div>

                {/* Hero Content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h4 style={{ fontSize: 44, fontWeight: 900, color: '#0F172A', marginBottom: 16, letterSpacing: -2.8, lineHeight: 0.92 }}>
                    ₹81.9k Used
                  </h4>
                  <p style={{ fontSize: 16, color: '#64748B', lineHeight: 1.5, fontWeight: 600, letterSpacing: -0.4, maxWidth: '95%' }}>
                    3 cards active • 20% overall utilization across ₹4L total limit.
                  </p>
                  <div style={{ marginTop: 12 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 10 }}>
                        {[
                          { name: 'Regalia', pct: 38, color: '#3B82F6' },
                          { name: 'Amazon', pct: 15, color: '#F59E0B' },
                          { name: 'Gold', pct: 12, color: '#D97706' },
                        ].map((c, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#64748B', width: 48 }}>{c.name}</span>
                            <div style={{ flex: 1 }}>
                              <Bar value={c.pct} max={100} color={c.color} h={5} delay={i * 0.1} />
                            </div>
                            <span style={{ fontSize: 10, fontWeight: 800, color: c.color, width: 28 }}>{c.pct}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                </div>

                {/* Callout + CTA pinned to bottom */}
                <div style={{ marginTop: 'auto' }}>
                  <div style={{ display: 'inline-flex', marginBottom: 12 }}>
                    <div style={{ background: '#FEF08A', border: '2px solid #0F172A', borderRadius: 14, padding: '9px 14px', fontSize: 14, fontWeight: 800, color: '#0F172A', boxShadow: '3px 3px 0px #0F172A' }}>
                      20% Used • All Healthy
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate('/advisor', { state: { initialQuery: "I have 3 credit cards — HDFC Regalia (₹45k used), ICICI Amazon (₹12.1k used), Gold Member (₹24.75k used). Help me optimize which card to use for what." } }) }}
                    style={{ width: '100%', padding: '16px 20px', borderRadius: 28, background: '#0F172A', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', cursor: 'pointer', boxShadow: '0 12px 24px -8px rgba(15, 23, 42, 0.25)' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 13, textTransform: 'uppercase', opacity: 0.7, letterSpacing: 1, marginBottom: 2 }}>Action</span>
                      <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.5 }}>Optimize Cards</span>
                    </div>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'white', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ArrowRight size={18} strokeWidth={3} />
                    </div>
                  </button>
                </div>
              </>
            }
            back={
              <>
                {/* Back: Card Utilization with visual bars + Donut */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div>
                    <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.8, color: '#312E81' }}>Card Health</span>
                    <p style={{ fontSize: 12, color: '#6366F1', fontWeight: 600, marginTop: 4 }}>Utilization & rewards</p>
                  </div>
                  <Donut size={72} stroke={9} segments={[
                    { value: 55, color: '#3B82F6' },
                    { value: 15, color: '#F59E0B' },
                    { value: 30, color: '#D97706' },
                  ]}>
                    <span style={{ fontSize: 12, fontWeight: 900, color: '#312E81' }}>20%</span>
                  </Donut>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { name: 'HDFC Regalia', used: 45000, limit: 120000, color: '#3B82F6', tip: '4x on dining', optimal: true },
                    { name: 'ICICI Amazon', used: 12100, limit: 80000, color: '#F59E0B', tip: '5% on Amazon', optimal: false },
                    { name: 'Gold Member', used: 24750, limit: 200000, color: '#D97706', tip: '2% flat cashback', optimal: true },
                  ].map((card, i) => {
                    const pct = Math.round((card.used / card.limit) * 100)
                    return (
                      <div key={i} style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.5)', borderRadius: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 8, height: 8, borderRadius: 4, background: card.color }} />
                            <span style={{ fontSize: 14, fontWeight: 800 }}>{card.name}</span>
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 800, color: pct > 30 ? '#F59E0B' : '#10B981' }}>{pct}%</span>
                        </div>
                        <Bar value={card.used} max={card.limit} color={card.color} h={6} delay={i * 0.15} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                          <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>₹{(card.used / 1000).toFixed(1)}k / ₹{(card.limit / 1000)}k</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: card.optimal ? '#10B981' : '#F59E0B' }}>{card.tip}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div style={{ padding: 12, background: '#EEF2FF', borderRadius: 14, marginTop: 'auto', fontSize: 13, fontWeight: 700, color: '#312E81', lineHeight: 1.4 }}>
                  💡 Switch dining to Regalia for 4x points — saves ~₹1,200/yr
                </div>
              </>
            }
          />

          {/* ── Card 3: Big Expenses Coming Up ── */}
          <FlipCard
            bg="linear-gradient(165deg, #ECFDF5 0%, #D1FAE5 100%)"
            front={
              <>
                {/* Header: Pill Label + Circle Dot */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: 1.5, background: 'rgba(255,255,255,0.5)', padding: '10px 18px', borderRadius: 100 }}>
                    Upcoming Expenses
                  </div>
                  <div style={{ position: 'relative', width: 44, height: 44, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px -4px rgba(0,0,0,0.05)' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10B981' }} />
                  </div>
                </div>

                {/* Hero Content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Next 90 Days</div>
                  <h4 style={{ fontSize: 42, fontWeight: 900, color: '#0F172A', marginBottom: 16, letterSpacing: -2, lineHeight: 0.95 }}>
                    ₹2.8L Due
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { label: 'School Fee', when: 'Mar 5', amount: '₹42k', pct: 100, color: '#10B981', status: 'Funded' },
                      { label: 'Insurance Premium', when: 'Mar 20', amount: '₹28k', pct: 60, color: '#F59E0B', status: '₹11k short' },
                      { label: 'Summer Trip', when: 'May', amount: '₹1.2L', pct: 100, color: '#0EA5E9', status: 'Budgeted' },
                      { label: 'Car Service', when: 'Apr', amount: '₹15k', pct: 0, color: '#EF4444', status: 'Not planned' },
                    ].map((e, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 3, color: '#0F172A' }}>
                          <span>{e.label} <span style={{ color: '#94A3B8', fontWeight: 600 }}>• {e.when}</span></span>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: e.pct >= 100 ? '#10B981' : e.pct > 0 ? '#F59E0B' : '#EF4444' }}>{e.status}</span>
                            <span>{e.amount}</span>
                          </div>
                        </div>
                        <Bar value={Math.max(e.pct, 3)} max={100} color={e.color} h={5} delay={i * 0.1} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Callout + CTA pinned to bottom */}
                <div style={{ marginTop: 'auto' }}>
                  <div style={{ display: 'inline-flex', marginBottom: 12 }}>
                    <div style={{ background: '#FEF08A', border: '2px solid #0F172A', borderRadius: 14, padding: '9px 14px', fontSize: 14, fontWeight: 800, color: '#0F172A', boxShadow: '3px 3px 0px #0F172A' }}>
                      ⚠️ 2 expenses need funding
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate('/advisor', { state: { initialQuery: "I have ₹2.8L in expenses coming up over 90 days: School fee ₹42k (funded), Insurance ₹28k (₹11k short), Summer trip ₹1.2L (budgeted), Car service ₹15k (not planned). Help me plan." } }) }}
                    style={{ width: '100%', padding: '16px 20px', borderRadius: 28, background: '#0F172A', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', cursor: 'pointer', boxShadow: '0 12px 24px -8px rgba(15, 23, 42, 0.25)' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 13, textTransform: 'uppercase', opacity: 0.7, letterSpacing: 1, marginBottom: 2 }}>Action</span>
                      <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.5 }}>Plan Ahead</span>
                    </div>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'white', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ArrowRight size={18} strokeWidth={3} />
                    </div>
                  </button>
                </div>
              </>
            }
            back={
              <>
                {/* Back: Expense Details */}
                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.8 }}>Expense Plan</span>
                  <p style={{ fontSize: 12, color: '#64748B', fontWeight: 600, marginTop: 4 }}>Funding status & source for each</p>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'School Fee', when: 'Mar 5', amount: '₹42,000', source: 'RD Auto-Pay', pct: 100, color: '#10B981', detail: 'Fully funded — auto-debit set' },
                    { label: 'Insurance Premium', when: 'Mar 20', amount: '₹28,000', source: 'Salary A/c', pct: 60, color: '#F59E0B', detail: '₹17k available • Move ₹11k from savings' },
                    { label: 'Summer Trip', when: 'May 15', amount: '₹1,20,000', source: 'Travel Fund', pct: 100, color: '#0EA5E9', detail: 'Flights booked • Hotel ₹45k pending' },
                    { label: 'Car Service', when: 'Apr 10', amount: '₹15,000', source: 'Unplanned', pct: 0, color: '#EF4444', detail: 'Set aside from next salary cycle' },
                  ].map((exp, i) => (
                    <div key={i} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.5)', borderRadius: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: 4, background: exp.color }} />
                          <span style={{ fontSize: 14, fontWeight: 800 }}>{exp.label}</span>
                          <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>{exp.when}</span>
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 800, color: exp.color }}>{exp.amount}</span>
                      </div>
                      <Bar value={Math.max(exp.pct, 3)} max={100} color={exp.color} h={5} delay={i * 0.1} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                        <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{exp.source}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: exp.pct >= 100 ? '#10B981' : '#64748B' }}>{exp.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: 14, background: '#FEF2F2', borderRadius: 14, marginTop: 'auto', fontSize: 13, fontWeight: 700, color: '#B91C1C', lineHeight: 1.4 }}>
                  ⚠️ Move ₹11k to salary a/c by Mar 15 for insurance premium
                </div>
              </>
            }
          />

        </ScrollRow>
      </motion.div>

      {/* ─── Spend Insights (Compact) ─── */}
      <motion.div variants={stagger.item} style={{ marginTop: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Spending Analysis
          </h3>
        </div>
        <div style={{ background: '#FFFFFF', borderRadius: 20, overflow: 'hidden', border: 'none', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
          {spendInsights.map((item, i) => (
            <motion.div
              key={item.id}
              whileTap={{ scale: 0.985 }}
              onClick={() => navigate('/advisor', { state: { initialQuery: item.context }})}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '16px 16px',
                borderBottom: i < spendInsights.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                cursor: 'pointer'
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${item.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>{item.subtitle}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: item.color, background: `${item.color}15`, padding: '5px 10px', borderRadius: 100, whiteSpace: 'nowrap' }}>{item.benefit}</span>
                <ChevronRight size={16} color="#94A3B8" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ─── Transaction List ─── */}
      <motion.div variants={stagger.item} style={{ marginTop: 32, marginBottom: 120 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Recent Transactions
          </h3>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 24, padding: 8, boxShadow: '0 1px 8px rgba(0,0,0,0.04)', border: 'none' }}>
          {recentTrans.map((t, i) => (
            <div key={t.id} style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              padding: '16px 12px',
              borderBottom: i < recentTrans.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ 
                  width: 40, height: 40, borderRadius: 12, 
                  background: 'rgba(0,0,0,0.03)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16
                }}>
                  {t.icon}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#0F172A' }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: '#94A3B8' }}>{t.time} • {t.cat}</div>
                </div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: t.amount < 0 ? '#0F172A' : '#10B981' }}>
                {t.amount < 0 ? '-' : '+'}₹{Math.abs(t.amount).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      </motion.div>
    </Page>
  )
}
