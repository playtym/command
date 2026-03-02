import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Trophy, Zap, Star, ChevronRight, CheckCircle2, 
  Crown, ArrowRight, User
} from 'lucide-react'
import { Page, ScrollRow, stagger } from '../components/UI'
import { Bar, Sparkline } from '../components/Charts'

/* ─── Data ─── */
const milestones = [
  { id: 1, name: 'First SIP', date: 'Oct 2025', earned: true },
  { id: 2, name: 'Budget Pro', date: 'Jan 2026', earned: true },
  { id: 3, name: 'Net Worth ₹50L', date: 'Feb 2026', earned: true },
  { id: 4, name: 'Zero Debt Month', date: 'Pending', earned: false },
  { id: 5, name: 'Platinum Status', date: 'Pending', earned: false },
]

/* ─── Card infrastructure (matching Money/Spend) ─── */
const cardStyle = {
  minWidth: 'calc(100% - 24px)',
  height: '62vh',
  scrollSnapAlign: 'center',
  perspective: 1200,
  flexShrink: 0,
}

const faceBase = {
  position: 'absolute',
  inset: 0,
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  borderRadius: 40,
  padding: '36px 32px 32px',
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

/* ─── Points growth sparkline data ─── */
const pointsGrowth = [200, 380, 520, 650, 800, 980, 1100, 1320, 1500, 1650, 1750, 1850]

export default function Rewards() {
  const navigate = useNavigate()

  return (
    <Page paddingTop={100} bg="#F5F5F4">
      <motion.div variants={stagger.container} initial="hidden" animate="show">

      {/* ─── Header ─── */}
      <motion.div variants={stagger.item} style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 38, fontWeight: 900, letterSpacing: -1.5, color: '#0F172A', lineHeight: 1.05 }}>
          Rewards<span style={{ color: '#D97706' }}>.</span>
        </h1>
      </motion.div>

      {/* ─── Hero Swipeable Deck ─── */}
      <motion.div variants={stagger.item} style={{ marginBottom: 32 }}>
        <ScrollRow gap={16} style={{ paddingBottom: 10 }}>

          {/* ═══ Card 1: Level & Points ═══ */}
          <FlipCard
            bg="linear-gradient(165deg, #FFFBEB 0%, #FEF3C7 100%)"
            front={
              <>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: 1.5, background: 'rgba(255,255,255,0.5)', padding: '10px 18px', borderRadius: 100 }}>
                    Gold Status
                  </div>
                  <div style={{ position: 'relative', width: 52, height: 52, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px -4px rgba(0,0,0,0.05)' }}>
                    <Crown size={20} color="#D97706" strokeWidth={2.5} />
                  </div>
                </div>

                {/* Hero Content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Mini Credit Card */}
                  <div style={{
                    background: 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)',
                    borderRadius: 16, padding: '14px 16px', position: 'relative', overflow: 'hidden',
                    marginBottom: 14, boxShadow: '0 8px 24px -6px rgba(245, 158, 11, 0.4)'
                  }}>
                    <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 2px, transparent 2px, transparent 10px)', transform: 'rotate(30deg)', pointerEvents: 'none' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#451A03', opacity: 0.7, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Command Gold</div>
                        <div style={{ fontSize: 15, fontFamily: 'monospace', fontWeight: 700, color: '#451A03', letterSpacing: 2 }}>•••• 7821</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#451A03', opacity: 0.7, marginBottom: 2 }}>ANKUR GARG</div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#451A03', opacity: 0.6 }}>09/29</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Total Points</div>
                      <h4 style={{ fontSize: 44, fontWeight: 900, color: '#0F172A', letterSpacing: -2.5, lineHeight: 1 }}>1,850</h4>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#D97706' }}>150 to Platinum</span>
                  </div>

                  {/* Progress to Platinum */}
                  <div style={{ marginTop: 10, marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>Gold → Platinum</span>
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#D97706' }}>92%</span>
                    </div>
                    <Bar value={92} max={100} color="#D97706" h={8} />
                  </div>

                  {/* Points sparkline */}
                  <div style={{ background: 'rgba(255,255,255,0.5)', borderRadius: 14, padding: '6px 12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 }}>12 mo</span>
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#D97706' }}>+1,650 pts</span>
                    </div>
                    <Sparkline data={pointsGrowth} width={280} height={40} color="#D97706" strokeW={2} />
                  </div>
                </div>

                {/* Callout + CTA */}
                <div style={{ marginTop: 'auto' }}>
                  <div style={{ display: 'inline-flex', marginBottom: 12 }}>
                    <div style={{ background: '#FEF08A', border: '2px solid #0F172A', borderRadius: 14, padding: '9px 14px', fontSize: 14, fontWeight: 800, color: '#0F172A', boxShadow: '3px 3px 0px #0F172A' }}>
                      🏆 3 milestones earned
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate('/advisor', { state: { initialQuery: "I'm a Gold member with 1,850 points, 150 away from Platinum. What's the fastest way to reach Platinum and what benefits do I unlock?" } }) }}
                    style={{ width: '100%', padding: '24px', borderRadius: 32, background: '#0F172A', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', cursor: 'pointer', boxShadow: '0 16px 32px -8px rgba(15, 23, 42, 0.25)' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 13, textTransform: 'uppercase', opacity: 0.7, letterSpacing: 1, marginBottom: 2 }}>Action</span>
                      <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>View Card</span>
                    </div>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'white', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ArrowRight size={22} strokeWidth={3} />
                    </div>
                  </button>
                </div>
              </>
            }
            back={
              <>
                {/* Back: Platinum Benefits Preview */}
                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.8 }}>Platinum Unlocks</span>
                  <p style={{ fontSize: 12, color: '#64748B', fontWeight: 600, marginTop: 4 }}>Benefits you'll get at 2,000 pts</p>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: '2% Flat Cashback', detail: 'On all card spends', color: '#4F46E5', value: '~₹6k/yr savings' },
                    { label: 'Lounge Access', detail: 'Domestic + International', color: '#0EA5E9', value: '8 visits/yr' },
                    { label: 'AI Concierge', detail: 'Priority financial planning', color: '#8B5CF6', value: '24/7 access' },
                    { label: '₹5,000 Voucher', detail: 'Amazon or Flipkart', color: '#10B981', value: 'On upgrade' },
                    { label: 'Fee Waiver', detail: 'Annual card fee reversed', color: '#F59E0B', value: '₹2,500 saved' },
                  ].map((b, i) => (
                    <div key={i} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.5)', borderRadius: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: 4, background: b.color }} />
                          <span style={{ fontSize: 14, fontWeight: 800 }}>{b.label}</span>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: b.color }}>{b.value}</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginTop: 3 }}>{b.detail}</div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: 14, background: '#ECFDF5', borderRadius: 14, marginTop: 'auto', fontSize: 13, fontWeight: 700, color: '#065F46', lineHeight: 1.4 }}>
                  ✅ Total Platinum value: ~₹13.5k/yr in savings & perks
                </div>
              </>
            }
          />

          {/* ═══ Card 2: Active Challenges ═══ */}
          <FlipCard
            bg="linear-gradient(165deg, #EEF2FF 0%, #E0E7FF 100%)"
            front={
              <>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: 1.5, background: 'rgba(255,255,255,0.5)', padding: '10px 18px', borderRadius: 100 }}>
                    Challenges
                  </div>
                  <div style={{ position: 'relative', width: 52, height: 52, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px -4px rgba(0,0,0,0.05)' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#4F46E5' }} />
                  </div>
                </div>

                {/* Hero Content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Active Quests</div>
                  <h4 style={{ fontSize: 42, fontWeight: 900, color: '#0F172A', marginBottom: 16, letterSpacing: -2, lineHeight: 0.95 }}>
                    3 Active
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { label: 'No Spend Week', progress: 71, color: '#F59E0B', pts: '+500', status: '5/7 days' },
                      { label: 'Credit Builder', progress: 40, color: '#8B5CF6', pts: 'Score+', status: 'Pay early' },
                      { label: 'SIP Streak', progress: 50, color: '#4F46E5', pts: '+200', status: '6/12 mo' },
                    ].map((c, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 3, color: '#0F172A' }}>
                          <span>{c.label}</span>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: c.color }}>{c.pts}</span>
                            <span style={{ color: '#94A3B8', fontWeight: 600 }}>{c.status}</span>
                          </div>
                        </div>
                        <Bar value={c.progress} max={100} color={c.color} h={6} delay={i * 0.1} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Callout + CTA */}
                <div style={{ marginTop: 'auto' }}>
                  <div style={{ display: 'inline-flex', marginBottom: 12 }}>
                    <div style={{ background: '#FEF08A', border: '2px solid #0F172A', borderRadius: 14, padding: '9px 14px', fontSize: 14, fontWeight: 800, color: '#0F172A', boxShadow: '3px 3px 0px #0F172A' }}>
                      ⚡ 700 pts available
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate('/advisor', { state: { initialQuery: "I have 3 active challenges: No Spend Week (5/7 done), Credit Builder (pay early), and SIP Streak (6/12 months). Help me complete them all for 700 bonus points." } }) }}
                    style={{ width: '100%', padding: '24px', borderRadius: 32, background: '#0F172A', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', cursor: 'pointer', boxShadow: '0 16px 32px -8px rgba(15, 23, 42, 0.25)' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 13, textTransform: 'uppercase', opacity: 0.7, letterSpacing: 1, marginBottom: 2 }}>Action</span>
                      <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>Complete All</span>
                    </div>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'white', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ArrowRight size={22} strokeWidth={3} />
                    </div>
                  </button>
                </div>
              </>
            }
            back={
              <>
                {/* Back: Challenge Details */}
                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.8 }}>Challenge Details</span>
                  <p style={{ fontSize: 12, color: '#64748B', fontWeight: 600, marginTop: 4 }}>Rules, tips & reward breakdown</p>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'No Spend Week', reward: '500 pts', progress: 71, color: '#F59E0B', tip: 'Meal prep Sunday — avoid Swiggy for 2 more days', rule: 'Zero discretionary spends for 7 days' },
                    { label: 'Credit Builder', reward: 'Score +20', progress: 40, color: '#8B5CF6', tip: 'Pay HDFC card ₹12k by Mar 10 (10 days early)', rule: 'Pay any card bill 10+ days before due date' },
                    { label: 'SIP Streak', reward: '200 pts', progress: 50, color: '#4F46E5', tip: 'Keep Mar SIP on auto — 6 more months to go', rule: '12 consecutive months of SIP without pause' },
                  ].map((c, i) => (
                    <div key={i} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.5)', borderRadius: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: 4, background: c.color }} />
                          <span style={{ fontSize: 14, fontWeight: 800 }}>{c.label}</span>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 800, color: c.color }}>{c.reward}</span>
                      </div>
                      <Bar value={c.progress} max={100} color={c.color} h={5} delay={i * 0.1} />
                      <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginTop: 4 }}>{c.rule}</div>
                      <div style={{ fontSize: 11, color: '#0F172A', fontWeight: 700, marginTop: 3 }}>💡 {c.tip}</div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: 14, background: '#EEF2FF', borderRadius: 14, marginTop: 'auto', fontSize: 13, fontWeight: 700, color: '#312E81', lineHeight: 1.4 }}>
                  🎯 Complete all 3 → earn 700 pts → instant Platinum upgrade
                </div>
              </>
            }
          />

          {/* ═══ Card 3: Rewards Summary ═══ */}
          <FlipCard
            bg="linear-gradient(165deg, #ECFDF5 0%, #D1FAE5 100%)"
            front={
              <>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: 1.5, background: 'rgba(255,255,255,0.5)', padding: '10px 18px', borderRadius: 100 }}>
                    Rewards Earned
                  </div>
                  <div style={{ position: 'relative', width: 52, height: 52, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px -4px rgba(0,0,0,0.05)' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10B981' }} />
                  </div>
                </div>

                {/* Hero Content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Cashback & Perks This Year</div>
                  <h4 style={{ fontSize: 42, fontWeight: 900, color: '#0F172A', marginBottom: 4, letterSpacing: -2, lineHeight: 0.95 }}>
                    ₹8,240
                  </h4>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#10B981', marginBottom: 16 }}>
                    Saved across cards & offers
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { label: 'Card Cashback', amount: '₹4,120', pct: 50, color: '#4F46E5' },
                      { label: 'Offer Savings', amount: '₹2,300', pct: 28, color: '#10B981' },
                      { label: 'Points Redeemed', amount: '₹1,200', pct: 15, color: '#F59E0B' },
                      { label: 'Fee Waivers', amount: '₹620', pct: 7, color: '#0EA5E9' },
                    ].map((r, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 3, color: '#0F172A' }}>
                          <span>{r.label}</span>
                          <span style={{ color: r.color }}>{r.amount}</span>
                        </div>
                        <Bar value={r.pct} max={100} color={r.color} h={5} delay={i * 0.1} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Callout + CTA */}
                <div style={{ marginTop: 'auto' }}>
                  <div style={{ display: 'inline-flex', marginBottom: 12 }}>
                    <div style={{ background: '#FEF08A', border: '2px solid #0F172A', borderRadius: 14, padding: '9px 14px', fontSize: 14, fontWeight: 800, color: '#0F172A', boxShadow: '3px 3px 0px #0F172A' }}>
                      💰 ₹4.2k more possible this year
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate('/advisor', { state: { initialQuery: "I've earned ₹8,240 in cashback & perks this year. How can I maximize my rewards across my 3 credit cards and available offers?" } }) }}
                    style={{ width: '100%', padding: '24px', borderRadius: 32, background: '#0F172A', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', cursor: 'pointer', boxShadow: '0 16px 32px -8px rgba(15, 23, 42, 0.25)' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 13, textTransform: 'uppercase', opacity: 0.7, letterSpacing: 1, marginBottom: 2 }}>Action</span>
                      <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>Maximize</span>
                    </div>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'white', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ArrowRight size={22} strokeWidth={3} />
                    </div>
                  </button>
                </div>
              </>
            }
            back={
              <>
                {/* Back: Optimization Tips */}
                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.8 }}>Maximize Rewards</span>
                  <p style={{ fontSize: 12, color: '#64748B', fontWeight: 600, marginTop: 4 }}>Card-wise optimization tips</p>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { card: 'HDFC Regalia', tip: 'Use for dining & travel — 4x points', current: '₹2.1k earned', potential: '+₹1.8k', color: '#4F46E5' },
                    { card: 'Amazon ICICI', tip: 'All Amazon orders here — 5% back', current: '₹1.4k earned', potential: '+₹900', color: '#F59E0B' },
                    { card: 'SBI SimplyCLICK', tip: 'Online shopping — 2.5% back', current: '₹620 earned', potential: '+₹1.5k', color: '#10B981' },
                  ].map((c, i) => (
                    <div key={i} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.5)', borderRadius: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: 4, background: c.color }} />
                          <span style={{ fontSize: 14, fontWeight: 800 }}>{c.card}</span>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#10B981' }}>{c.potential}</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginTop: 2 }}>{c.tip}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, marginTop: 2 }}>{c.current}</div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: 14, background: '#ECFDF5', borderRadius: 14, marginTop: 'auto', fontSize: 13, fontWeight: 700, color: '#065F46', lineHeight: 1.4 }}>
                  💡 Switch grocery to Regalia — saves ₹200/mo in extra points
                </div>
              </>
            }
          />

        </ScrollRow>
      </motion.div>

      {/* ─── Milestones (Compact List) ─── */}
      <motion.div variants={stagger.item} style={{ marginTop: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Milestones
          </h3>
        </div>
        <div style={{ background: '#FFFFFF', borderRadius: 20, overflow: 'hidden', border: 'none', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
          {milestones.map((m, i) => (
            <div key={m.id} style={{ 
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '16px 16px',
              borderBottom: i < milestones.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
              opacity: m.earned ? 1 : 0.5
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: m.earned ? '#ECFDF5' : '#F5F5F4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {m.earned 
                  ? <CheckCircle2 size={18} color="#10B981" strokeWidth={2.5} />
                  : <Trophy size={18} color="#94A3B8" strokeWidth={2.5} />
                }
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>{m.name}</div>
                <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>{m.date}</div>
              </div>
              {m.earned && (
                <span style={{ fontSize: 11, fontWeight: 800, color: '#10B981' }}>Unlocked</span>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* ─── Quick Actions ─── */}
      <motion.div variants={stagger.item} style={{ marginTop: 28, marginBottom: 120 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Earn More Points
          </h3>
        </div>
        <div style={{ background: '#FFFFFF', borderRadius: 20, overflow: 'hidden', border: 'none', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
          {[
            { label: 'Refer a friend', pts: '+300 pts', color: '#4F46E5', query: "How does the referral program work? I want to refer a friend and earn 300 points." },
            { label: 'Complete KYC update', pts: '+100 pts', color: '#10B981', query: "I need to update my KYC. Walk me through the process and confirm the 100 points reward." },
            { label: 'Link bank account', pts: '+150 pts', color: '#F59E0B', query: "I want to link my bank account for auto-tracking. What do I earn and how safe is it?" },
          ].map((action, i) => (
            <motion.div
              key={i}
              whileTap={{ scale: 0.985 }}
              onClick={() => navigate('/advisor', { state: { initialQuery: action.query } })}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '16px 16px',
                borderBottom: i < 2 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                cursor: 'pointer'
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${action.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: action.color }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>{action.label}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: action.color }}>{action.pts}</span>
                <ChevronRight size={16} color="#94A3B8" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      </motion.div>
    </Page>
  )
}
