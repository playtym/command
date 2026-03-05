import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowUpRight, ArrowDownRight, PieChart, Activity, 
  TrendingUp, Shield, Globe, Zap, ChevronRight, ChevronDown, Sparkles, ArrowRight
} from 'lucide-react'
import { Page, ScrollRow, stagger, SectionLabel, ListRow, ActionCard } from '../components/UI'
import { Sparkline, Donut, SegmentBar, Bar, Ring } from '../components/Charts'

/* ─── Data ─── */
const accounts = [
  {
    category: 'Banking',
    icon: '🏦',
    color: '#3B82F6',
    items: [
      { name: 'HDFC Bank', detail: 'Salary A/c + FD', value: 785000, holdings: '₹2.85L savings • ₹5L FD' },
      { name: 'SBI', detail: 'Savings + SGB', value: 665000, holdings: '₹1.15L savings • ₹5.5L Gold Bond' },
    ]
  },
  {
    category: 'Groww',
    icon: '📈',
    color: '#4F46E5',
    items: [
      { name: 'Mutual Funds', detail: '3 schemes • SIP ₹35k/mo', value: 3876000, ret: 35.2, holdings: 'PPFAS Flexi ₹18.2L • Quant Small ₹12.4L • HDFC Mid ₹8.1L' },
      { name: 'ETFs', detail: '5 ETFs', value: 180000, ret: 12.1, holdings: 'Nifty BeES • Gold BeES • Nifty Next 50 + 2 more' },
    ]
  },
  {
    category: 'Zerodha',
    icon: '💹',
    color: '#10B981',
    items: [
      { name: 'Stocks', detail: '12 stocks', value: 520000, ret: 18.4, holdings: 'Reliance • TCS • HDFC Bank • Infosys + 8 more' },
      { name: 'IPOs & Others', detail: '2 allotted', value: 100000, ret: 22.0, holdings: 'Swiggy IPO • Hyundai IPO' },
    ]
  },
  {
    category: 'NPS (NSDL)',
    icon: '🏛️',
    color: '#8B5CF6',
    items: [
      { name: 'Tier I', detail: 'Auto-choice aggressive', value: 170000, ret: 11.6, holdings: '75% equity • 15% corp bonds • 10% govt sec' },
    ]
  },
  {
    category: 'Insurance',
    icon: '🛡️',
    color: '#6366F1',
    items: [
      { name: 'HDFC Life', detail: 'Term Plan • ₹1Cr cover', value: null, holdings: 'Premium ₹12k/yr • Till age 60' },
      { name: 'Star Health', detail: 'Family Floater • ₹10L', value: null, holdings: 'Premium ₹18k/yr • 2 adults + 1 child' },
    ]
  },
  {
    category: 'Property',
    icon: '🏠',
    color: '#E11D48',
    items: [
      { name: '2BHK Pune', detail: 'Self-occupied', value: 5000000, holdings: 'Bought 2021 @ ₹42L • Current ₹50L est.' },
    ]
  },
  {
    category: 'Loans',
    icon: '💳',
    color: '#EF4444',
    items: [
      { name: 'HDFC Home Loan', detail: 'EMI ₹28k/mo • 18yr left', value: 1200000, holdings: 'Orig ₹35L • Rate 8.5% • Outstanding ₹12L' },
      { name: 'ICICI Credit Card', detail: 'Due 15th Mar', value: 45000, holdings: 'Amazon card • Limit ₹3L • Utilised 15%' },
    ]
  },
]

const totalAssets = 1404600 // ₹1.40Cr
const totalLiabilities = 1245000 // ₹12.45L
const netWorth = totalAssets - totalLiabilities // ~₹1.28Cr

const netWorthGrowth = [38, 40, 42, 44, 47, 50, 54, 57, 61, 65, 70, 73, 75]

const actionItems = [
  {
    id: 'rebalance',
    icon: Shield,
    color: '#EF4444', // RED
    bg: '#FEF2F2',
    title: 'Medium Term: 73% Equity',
    subtitle: 'Move ₹1.2 L to Debt NOW',
    benefit: 'Protect Gains',
    context: "My medium term bucket has 73% equity allocation against a target of 30%. Help me rebalance by moving ₹1.2L from high-risk equity to debt."
  },
  {
    id: 'insurance-gap',
    icon: Shield,
    color: '#7C3AED',
    bg: '#F5F3FF',
    title: 'No Term Insurance',
    subtitle: '₹1 Cr cover costs just ₹800/mo',
    benefit: 'Protection Gap',
    context: "I don't have any term insurance. I'm 32 with a ₹75L portfolio and dependents. What's the right term plan coverage and which provider should I pick?"
  }
]

const marketInsights = [
  {
    id: 'gold-correction',
    icon: Sparkles,
    color: '#D97706', // Gold-ish Amber
    bg: '#FFFBEB',
    title: 'Your Gold is Down',
    subtitle: 'Wait, or Buy More?',
    benefit: 'SGB @ ₹5788',
    context: "Gold prices corrected by 4%. I currently have 11% exposure (₹0.51L) in SGB. Should I use this dip to increase it to 15%?"
  },
  {
    id: 1,
    icon: Globe,
    color: '#3B82F6',
    bg: '#EFF6FF',
    title: 'Fed Rate Cut',
    subtitle: 'Watch your PPFAS Fund',
    benefit: 'US Stock Impact',
    context: "The US Fed cut rates by 50bps. How will this specifically impact the US equity portion of my Parag Parikh Flexi Cap fund?"
  },
  {
    id: 4,
    icon: Activity,
    color: '#6366F1',
    bg: '#EEF2FF',
    title: 'XIRR Breakdown',
    subtitle: 'You vs Nifty 50',
    benefit: 'Alpha: +8.2%',
    context: "My portfolio XIRR is 23.4% vs Nifty's 15.2%. Can you breakdown which funds are generating this alpha?"
  },
  {
    id: 2,
    icon: TrendingUp,
    color: '#10B981',
    bg: '#ECFDF5',
    title: 'Infra Boom',
    subtitle: 'Add SBI Bluechip?',
    benefit: 'High Growth',
    context: "Infrastructure sector is booming. I don't hold any infra-specific funds. Should I add SBI Bluechip or an Infra thematic fund to my portfolio?"
  },
]

/* ─── Flippable Card Wrapper ─── */
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
  boxShadow: '0 16px 40px -12px rgba(0,0,0,0.08)',
  border: '1px solid rgba(255,255,255,0.7)',
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
        transition={{ duration: 0.7, type: 'spring', stiffness: 200, damping: 24 }}
        style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d', cursor: 'pointer' }}
      >
        {/* Front */}
        <div style={{ ...faceBase, background: bg, color: '#0F172A' }}>
          {front}
        </div>
        {/* Back */}
        <div style={{ ...faceBase, background: bg, color: '#0F172A', transform: 'rotateY(180deg)' }}>
          {back}
        </div>
      </motion.div>
    </div>
  )
}

export default function Money() {
  const navigate = useNavigate()
  return (
    <Page paddingTop={100} bg="#F5F5F4">
      <motion.div variants={stagger.container} initial="hidden" animate="show">
      {/* ─── Header ─── */}
      <motion.div variants={stagger.item} style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 38, fontWeight: 900, letterSpacing: -1.5, color: '#0F172A', lineHeight: 1.05 }}>
          Money<span style={{ color: '#6366F1' }}>.</span>
        </h1>
      </motion.div>

      {/* ─── Hero Swipeable Deck ─── */}
      <motion.div variants={stagger.item} style={{ marginBottom: 32 }}>
        <ScrollRow gap={16} style={{ paddingBottom: 10 }}>

            {/* ═══ Card 1: Net Worth — FLIPPABLE ═══ */}
            <FlipCard
              bg="linear-gradient(165deg, #EEF2FF 0%, #E0E7FF 100%)"
              front={
                <>
                  {/* Header: Pill Label + Circle Dot (matches other cards) */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: 1.5, background: 'rgba(255,255,255,0.5)', padding: '10px 18px', borderRadius: 100 }}>
                      Total Wealth
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 4, opacity: 0.6, marginTop: 10 }}>
                      <span>Flip</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                    </div>
                  </div>

                  {/* Hero Content */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Net Worth</div>
                    <h4 style={{ fontSize: 'clamp(48px, 14vw, 64px)', fontWeight: 900, color: '#0F172A', letterSpacing: -1.5, lineHeight: 0.9, marginBottom: 12 }}>
                      ₹1.25<span style={{ opacity: 0.4, fontSize: 36, fontWeight: 700, marginLeft: 4 }}>Cr</span>
                    </h4>
                    
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, background: 'rgba(255,255,255,0.6)', padding: '6px 12px', borderRadius: 100, color: '#0F172A', width: 'fit-content' }}>
                      <span style={{ color: '#10B981' }}>+₹16.8L</span> 
                      <span style={{ opacity: 0.3 }}>|</span>
                      <span>18% <span style={{ opacity: 0.6 }}>XIRR</span></span>
                    </div>

                    <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
                       <div style={{ fontSize: 13, fontWeight: 600, color: '#64748B' }}>
                          <span style={{ color: '#0F172A', fontWeight: 800, display: 'block', marginBottom: 2 }}>Assets</span>₹1.40Cr
                       </div>
                       <div style={{ fontSize: 13, fontWeight: 600, color: '#64748B' }}>
                          <span style={{ color: '#EF4444', fontWeight: 800, display: 'block', marginBottom: 2 }}>Debts</span>₹12.45L
                       </div>
                    </div>
                  </div>

                  {/* Callout + CTA pinned to bottom */}
                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'inline-flex', marginBottom: 12 }}>
                      <div style={{ background: '#FEF08A', border: '2px solid #0F172A', borderRadius: 14, padding: '9px 14px', fontSize: 13, fontWeight: 800, color: '#0F172A' }}>
                        SIP ₹35k/mo • Invested ₹58.2L
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate('/advisor', { state: { activeItem: { id: 'net-worth', title: 'Total Wealth — ₹1.25 Cr', subtitle: '₹75L invested across equity, debt & gold. ₹44L in property equity. XIRR 18.4% with SIP ₹35k/mo. Your wealth grew 22% this year.', color: '#4F46E5', icon: Wallet, benefit: '18.4% XIRR', context: "Analyze my full portfolio of ₹75L across equity, debt, and gold. Show me complete breakdown and suggest optimizations." } } }) }}
                      style={{ width: '100%', padding: '16px 20px', borderRadius: 28, background: '#0F172A', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', cursor: 'pointer' }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.5 }}>View Breakdown</span>
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
                  {/* Back: Donut Chart + Breakdown */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                      <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.8 }}>Wealth Map</span>
                      <p style={{ fontSize: 12, color: '#64748B', fontWeight: 600, marginTop: 4 }}>Assets ₹1.40Cr − Liabilities ₹12.4L</p>
                    </div>
                    <Donut size={80} stroke={10} segments={[
                      { value: 36, color: '#E11D48' },
                      { value: 28, color: '#4F46E5' },
                      { value: 7, color: '#0EA5E9' },
                      { value: 4, color: '#F59E0B' },
                      { value: 9, color: '#10B981' },
                      { value: 6, color: '#3B82F6' },
                      { value: 1, color: '#8B5CF6' },
                      { value: 9, color: '#EF4444' },
                    ]}>
                      <span style={{ fontSize: 13, fontWeight: 900, color: '#0F172A' }}>1.25Cr</span>
                    </Donut>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {/* Assets */}
                    {[
                      { label: 'Real Estate', value: '₹50L', pct: 36, color: '#E11D48', xirr: '8.5%' },
                      { label: 'Equity MFs', value: '₹38.8L', pct: 28, color: '#4F46E5', xirr: '22.1%' },
                      { label: 'FDs & Bonds', value: '₹10.5L', pct: 7, color: '#0EA5E9', xirr: '7.4%' },
                      { label: 'Gold (SGB)', value: '₹5.5L', pct: 4, color: '#F59E0B', xirr: '14.8%' },
                      { label: 'Stocks & ETFs', value: '₹8.0L', pct: 6, color: '#10B981', xirr: '16.2%' },
                      { label: 'Bank / Cash', value: '₹4.0L', pct: 3, color: '#3B82F6', xirr: '4.0%' },
                      { label: 'NPS', value: '₹1.7L', pct: 1, color: '#8B5CF6', xirr: '11.6%' },
                    ].map((item, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 3 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, flex: 1 }}>
                            <div style={{ width: 8, height: 8, borderRadius: 4, background: item.color, flexShrink: 0 }} />
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexShrink: 0 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#16A34A' }}>{item.xirr}</span>
                            <span style={{ whiteSpace: 'nowrap' }}>{item.value} <span style={{ color: '#64748B', fontWeight: 500 }}>({item.pct}%)</span></span>
                          </div>
                        </div>
                        <Bar value={item.pct} max={100} color={item.color} h={4} delay={i * 0.08} />
                      </div>
                    ))}
                    {/* Liabilities divider */}
                    <div style={{ borderTop: '1px dashed rgba(239,68,68,0.3)', paddingTop: 6 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 3 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 8, height: 8, borderRadius: 4, background: '#EF4444', flexShrink: 0 }} />
                          <span style={{ color: '#EF4444' }}>Liabilities</span>
                        </div>
                        <span style={{ color: '#EF4444', whiteSpace: 'nowrap' }}>−₹12.4L <span style={{ color: '#64748B', fontWeight: 500 }}>(9%)</span></span>
                      </div>
                      <Bar value={9} max={100} color="#EF4444" h={4} delay={0.7} />
                    </div>
                  </div>
                  {/* Bottom stats */}
                  <div style={{ paddingTop: 12, borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: 20 }}>
                      <div>
                        <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700, letterSpacing: 0.5 }}>SIP/MO</div>
                        <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2 }}>₹35k</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700, letterSpacing: 0.5 }}>INVESTED</div>
                        <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2, color: '#4F46E5' }}>₹58.2L</div>
                      </div>
                    </div>
                    <Sparkline data={netWorthGrowth} width={80} height={32} color="#4F46E5" strokeW={2} />
                  </div>
                </>
              }
            />

            {/* ═══ Card 2: Portfolio Mix — FLIPPABLE ═══ */}
            <FlipCard
              bg="linear-gradient(165deg, #ECFDF5 0%, #D1FAE5 100%)"
              front={
                <>
                  {/* Header: Pill Label + Circle Dot */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: 1.5, background: 'rgba(255,255,255,0.5)', padding: '10px 18px', borderRadius: 100 }}>
                      Portfolio Mix
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 4, opacity: 0.6, marginTop: 10 }}>
                      <span>Flip</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                    </div>
                  </div>

                  {/* Hero Content */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Asset Allocation</div>
                    <h4 style={{ fontSize: 44, fontWeight: 900, color: '#0F172A', marginBottom: 16, letterSpacing: -1.5, lineHeight: 1.0 }}>
                      Equity <span style={{ color: '#4F46E5' }}>65%</span><br/>Debt <span style={{ color: '#0EA5E9' }}>17%</span>
                    </h4>
                    <div style={{ marginTop: 0 }}>
                      <SegmentBar height={8} segments={[
                        { value: 65, color: '#4F46E5' },
                        { value: 17, color: '#0EA5E9' },
                        { value: 7, color: '#F59E0B' },
                        { value: 8, color: '#10B981' },
                      ]} />
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                        {[
                          { l: 'Eq', p: 65, c: '#4F46E5' },
                          { l: 'Debt', p: 17, c: '#0EA5E9' },
                          { l: 'Gold', p: 7, c: '#F59E0B' },
                          { l: 'Cash', p: 8, c: '#10B981' },
                        ].map((a, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 700, color: '#64748B' }}>
                            <div style={{ width: 6, height: 6, borderRadius: 3, background: a.c }} />
                            {a.l} {a.p}%
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Callout + CTA pinned to bottom */}
                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'inline-flex', marginBottom: 12 }}>
                      <div style={{ background: '#FEF08A', border: '2px solid #0F172A', borderRadius: 14, padding: '9px 14px', fontSize: 13, fontWeight: 800, color: '#0F172A', boxShadow: 'none', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        ⏳ Long-term 60% • Short needs +₹3L
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate('/advisor', { state: { activeItem: { id: 'portfolio-mix', title: 'Portfolio Mix — 4 Buckets', subtitle: 'Liquid ₹6L (8%), Short ₹9L (12%), Medium ₹15L (20%), Long ₹45L (60%). Short-term bucket needs +₹3L to hit target.', color: '#10B981', icon: PieChart, benefit: '60% Long-Term', context: "Analyze my portfolio allocation across 4 buckets — Liquid ₹6L, Short ₹9L, Medium ₹15L, Long ₹45L. Am I balanced?" } } }) }}
                      style={{ width: '100%', padding: '16px 20px', borderRadius: 28, background: '#0F172A', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', cursor: 'pointer', boxShadow: 'none' }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.5 }}>Rebalance</span>
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
                  {/* Back: Time-Horizon Allocation */}
                  <div style={{ marginBottom: 16 }}>
                    <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.8 }}>Horizon Buckets</span>
                    <p style={{ fontSize: 12, color: '#64748B', fontWeight: 600, marginTop: 4 }}>₹75L split by when you need the money</p>
                  </div>

                  {/* Stacked segment bar */}
                  <div style={{ marginBottom: 16 }}>
                    <SegmentBar height={14} segments={[
                      { value: 8, color: '#10B981' },
                      { value: 12, color: '#0EA5E9' },
                      { value: 20, color: '#F59E0B' },
                      { value: 60, color: '#4F46E5' },
                    ]} />
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { label: 'Liquid', horizon: '< 6 months', value: '₹6.0L', pct: 8, color: '#10B981', xirr: '5.2%',
                        assets: [
                          { name: 'Cash', value: 42, color: '#10B981' },
                          { name: 'Liquid Fund', value: 58, color: '#0EA5E9' },
                        ] },
                      { label: 'Short Term', horizon: '6mo – 2yr', value: '₹9.0L', pct: 12, color: '#0EA5E9', xirr: '7.8%',
                        assets: [
                          { name: 'FDs', value: 56, color: '#0EA5E9' },
                          { name: 'Short Debt', value: 44, color: '#8B5CF6' },
                        ] },
                      { label: 'Medium Term', horizon: '2 – 5yr', value: '₹15.0L', pct: 20, color: '#F59E0B', xirr: '12.4%',
                        assets: [
                          { name: 'Equity', value: 53, color: '#4F46E5' },
                          { name: 'Debt', value: 30, color: '#0EA5E9' },
                          { name: 'Gold', value: 17, color: '#F59E0B' },
                        ] },
                      { label: 'Long Term', horizon: '5yr+', value: '₹45.0L', pct: 60, color: '#4F46E5', xirr: '22.1%',
                        assets: [
                          { name: 'Equity', value: 78, color: '#4F46E5' },
                          { name: 'NPS', value: 11, color: '#8B5CF6' },
                          { name: 'Gold', value: 7, color: '#F59E0B' },
                          { name: 'Debt', value: 4, color: '#0EA5E9' },
                        ] },
                    ].map((bucket, i) => (
                      <div key={i} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.5)', borderRadius: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, flex: 1 }}>
                            <div style={{ width: 8, height: 8, borderRadius: 4, background: bucket.color, flexShrink: 0 }} />
                            <span style={{ fontSize: 13, fontWeight: 800, whiteSpace: 'nowrap' }}>{bucket.label}</span>
                            <span style={{ fontSize: 10, color: '#64748B', fontWeight: 600, whiteSpace: 'nowrap' }}>{bucket.horizon}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexShrink: 0 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: bucket.xirr.startsWith('-') ? '#DC2626' : '#16A34A', whiteSpace: 'nowrap' }}>{bucket.xirr}</span>
                            <span style={{ fontSize: 13, fontWeight: 800, color: bucket.color, whiteSpace: 'nowrap' }}>{bucket.value}</span>
                          </div>
                        </div>
                        {/* Asset-class split bar */}
                        <SegmentBar height={7} segments={bucket.assets.map(a => ({ value: a.value, color: a.color }))} />
                        {/* Small legend dots */}
                        <div style={{ display: 'flex', gap: 10, marginTop: 5, flexWrap: 'wrap' }}>
                          {bucket.assets.map((a, j) => (
                            <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <div style={{ width: 6, height: 6, borderRadius: 3, background: a.color }} />
                              <span style={{ fontSize: 10, fontWeight: 600, color: '#64748B' }}>{a.name} {a.value}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ padding: 14, background: '#FEF2F2', borderRadius: 14, marginTop: 'auto', fontSize: 13, fontWeight: 700, color: '#B91C1C', lineHeight: 1.4 }}>
                    ⚠️ Medium bucket 73% in equity — rebalance ₹1.2L to debt
                  </div>
                </>
              }
            />

            {/* ═══ Card 3: Top Movers — FLIPPABLE ═══ */}
            <FlipCard
              bg="linear-gradient(165deg, #FFFBEB 0%, #FEF3C7 100%)"
              front={
                <>
                  {/* Header: Pill Label + Circle Dot */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: 1.5, background: 'rgba(255,255,255,0.5)', padding: '10px 18px', borderRadius: 100 }}>
                      Top Gainers
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 4, opacity: 0.6, marginTop: 10 }}>
                      <span>Flip</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                    </div>
                  </div>

                  {/* Hero Content */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Best Performing Fund</div>
                    <h4 style={{ fontSize: 44, fontWeight: 900, color: '#0F172A', marginBottom: 16, letterSpacing: -1.5, lineHeight: 1.0 }}>
                      Quant Small Cap<br/><span style={{ color: '#10B981' }}>+64%</span> <span style={{ fontSize: 22, fontWeight: 700, color: '#64748B' }}>1Y return</span>
                    </h4>
                    <div style={{ marginTop: 0 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Top Performers</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                        {[
                          { name: 'Quant', ret: '+64%', color: '#10B981' },
                          { name: 'HDFC', ret: '+41%', color: '#F59E0B' },
                          { name: 'PPFAS', ret: '+28%', color: '#4F46E5' },
                        ].map((f, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.6)', padding: '5px 10px', borderRadius: 10 }}>
                            <div style={{ width: 6, height: 6, borderRadius: 3, background: f.color }} />
                            <span style={{ fontSize: 11, fontWeight: 800, color: '#0F172A' }}>{f.name}</span>
                            <span style={{ fontSize: 11, fontWeight: 800, color: f.color }}>{f.ret}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Underperforming</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {[
                          { name: 'Axis Bluechip', ret: '-3%', color: '#EF4444' },
                          { name: 'ICICI Pru Value', ret: '+4%', color: '#F97316' },
                        ].map((f, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(239,68,68,0.08)', padding: '5px 10px', borderRadius: 10 }}>
                            <div style={{ width: 6, height: 6, borderRadius: 3, background: f.color }} />
                            <span style={{ fontSize: 11, fontWeight: 800, color: '#0F172A' }}>{f.name}</span>
                            <span style={{ fontSize: 11, fontWeight: 800, color: f.color }}>{f.ret}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Callout + CTA pinned to bottom */}
                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'inline-flex', marginBottom: 12, maxWidth: '100%' }}>
                      <div style={{ background: '#FEF08A', border: '2px solid #0F172A', borderRadius: 14, padding: '9px 14px', fontSize: 13, fontWeight: 800, color: '#0F172A', boxShadow: 'none', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        +8.2% Alpha vs Nifty
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate('/advisor', { state: { activeItem: { id: 'top-gainers', title: 'Fund Performance — +8.2% Alpha', subtitle: 'Quant Small Cap +64%, HDFC MidCap +41%, PPFAS +28%, SGB +14%. Axis Bluechip -3%. Portfolio Sharpe 1.7 vs Nifty 1.2.', color: '#059669', icon: TrendingUp, benefit: '+8.2% vs Nifty', context: "Show me all my fund returns: Quant Small Cap +64%, HDFC MidCap +41%, PPFAS +28%, SGB +14%. Should I book profits in small caps?" } } }) }}
                      style={{ width: '100%', padding: '16px 20px', borderRadius: 28, background: '#0F172A', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', cursor: 'pointer', boxShadow: 'none' }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.5 }}>View All Funds</span>
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
                  {/* Back: Simple fund action list */}
                  <div style={{ marginBottom: 16 }}>
                    <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.8 }}>What To Do</span>
                    <p style={{ fontSize: 12, color: '#64748B', fontWeight: 600, marginTop: 4 }}>AI verdict on each fund</p>
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { name: 'Quant Small Cap', ret: '+64%', val: '₹12.4L', tag: '📈 Book Profit', tagBg: '#FEF3C7', tagColor: '#92400E', hint: 'High risk — trim ₹2L' },
                      { name: 'HDFC MidCap',     ret: '+41%', val: '₹8.1L',  tag: '✅ Hold',        tagBg: '#ECFDF5', tagColor: '#065F46', hint: null },
                      { name: 'PPFAS Flexi',     ret: '+28%', val: '₹18.2L', tag: '✅ Hold',        tagBg: '#ECFDF5', tagColor: '#065F46', hint: null },
                      { name: 'SGB 2028',        ret: '+14%', val: '₹5.5L',  tag: '🛡️ Steady',     tagBg: '#F1F5F9', tagColor: '#475569', hint: null },
                      { name: 'ICICI Pru Value',  ret: '+4%',  val: '₹3.0L',  tag: '👀 Watch',      tagBg: '#FFFBEB', tagColor: '#92400E', hint: 'Below benchmark' },
                      { name: 'Axis Bluechip',   ret: '-3%',  val: '₹2.1L',  tag: '🚫 Exit',       tagBg: '#FEF2F2', tagColor: '#991B1B', hint: 'Negative return' },
                    ].map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'rgba(255,255,255,0.55)', borderRadius: 14 }}>
                        {/* Left: Fund info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>{f.name}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                            <span style={{ fontSize: 16, fontWeight: 900, color: f.ret.startsWith('-') ? '#DC2626' : '#059669' }}>{f.ret}</span>
                            <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{f.val}</span>
                          </div>
                          {f.hint && <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, marginTop: 2 }}>{f.hint}</div>}
                        </div>
                        {/* Right: Action badge */}
                        <div style={{ background: f.tagBg, padding: '5px 10px', borderRadius: 10, fontSize: 11, fontWeight: 800, color: f.tagColor, whiteSpace: 'nowrap', flexShrink: 0 }}>{f.tag}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ padding: 10, background: '#ECFDF5', borderRadius: 12, marginTop: 8, fontSize: 11, fontWeight: 700, color: '#065F46', lineHeight: 1.4 }}>
                    ✅ 4 of 6 funds in green · Portfolio Sharpe 1.7 vs Nifty 1.2
                  </div>
                </>
              }
            />

            {/* ═══ Card 4: Goals — FLIPPABLE ═══ */}
            <FlipCard
              bg="linear-gradient(165deg, #FFF1F2 0%, #FFE4E6 100%)"
              front={
                <>
                  {/* Header: Pill Label + Circle Dot */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: 1.5, background: 'rgba(255,255,255,0.5)', padding: '10px 18px', borderRadius: 100 }}>
                      Life Goals
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 4, opacity: 0.6, marginTop: 10 }}>
                      <span>Flip</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                    </div>
                  </div>

                  {/* Hero Content */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Goal Progress</div>
                    <h4 style={{ fontSize: 44, fontWeight: 900, color: '#0F172A', marginBottom: 16, letterSpacing: -1.5, lineHeight: 1.0 }}>
                      4 Goals
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {[
                        { label: 'Emergency Fund', pct: 100, color: '#10B981' },
                        { label: 'House Down-pay', pct: 68, color: '#E11D48' },
                        { label: 'Child Education', pct: 22, color: '#F59E0B' },
                        { label: 'Retirement', pct: 15, color: '#4F46E5' },
                      ].map((g, i) => (
                        <div key={i}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 3, color: '#0F172A' }}>
                            <span>{g.label}</span>
                            <span style={{ color: g.pct >= 100 ? '#10B981' : g.color }}>{g.pct}%</span>
                          </div>
                          <Bar value={g.pct} max={100} color={g.color} h={6} delay={i * 0.1} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Callout + CTA pinned to bottom */}
                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'inline-flex', marginBottom: 12, maxWidth: '100%' }}>
                      <div style={{ background: '#FEF08A', border: '2px solid #0F172A', borderRadius: 14, padding: '9px 14px', fontSize: 13, fontWeight: 800, color: '#0F172A', boxShadow: 'none', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        🏠 House ₹12L away • 2.8 yrs
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate('/advisor', { state: { activeItem: { id: 'life-goals', title: '4 Life Goals — Mixed Progress', subtitle: 'Emergency Fund done, House 68% (₹12L away in 2.8 yrs), Child Education 22%, Retirement 15%. Child SIP needs +₹5k/mo.', color: '#E11D48', icon: Target, benefit: '🏠 ₹12L to House', context: "Review my 4 life goals: Emergency Fund ₹6L (done), House Down-payment ₹20L (68% at ₹13.6L), Child Education ₹50L (22%), Retirement ₹3Cr (15%). Am I on track?" } } }) }}
                      style={{ width: '100%', padding: '16px 20px', borderRadius: 28, background: '#0F172A', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', cursor: 'pointer', boxShadow: 'none' }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.5 }}>Plan Goals</span>
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
                  {/* Back: Goal Details */}
                  <div style={{ marginBottom: 16 }}>
                    <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.8 }}>Goal Tracker</span>
                    <p style={{ fontSize: 12, color: '#64748B', fontWeight: 600, marginTop: 4 }}>Progress, timeline & monthly need</p>
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { label: 'Emergency Fund', target: '₹6L', saved: '₹6.0L', pct: 100, color: '#10B981', horizon: 'Done ✓', sip: '—', status: 'Fully funded' },
                      { label: 'House Down-payment', target: '₹20L', saved: '₹13.6L', pct: 68, color: '#E11D48', horizon: 'Mar 2029', sip: '₹18k/mo', status: '₹6.4L remaining' },
                      { label: 'Child Education', target: '₹50L', saved: '₹11L', pct: 22, color: '#F59E0B', horizon: 'Jun 2040', sip: '₹12k/mo', status: '₹39L remaining • 14 yrs' },
                      { label: 'Retirement', target: '₹3Cr', saved: '₹45L', pct: 15, color: '#4F46E5', horizon: 'Apr 2050', sip: '₹25k/mo', status: '₹2.55Cr gap • 24 yrs' },
                    ].map((goal, i) => (
                      <div key={i} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.5)', borderRadius: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 8, height: 8, borderRadius: 4, background: goal.color }} />
                            <span style={{ fontSize: 14, fontWeight: 800 }}>{goal.label}</span>
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 800, color: goal.color }}>{goal.saved}<span style={{ color: '#64748B', fontWeight: 500, fontSize: 11 }}> / {goal.target}</span></span>
                        </div>
                        <Bar value={goal.pct} max={100} color={goal.color} h={5} delay={i * 0.1} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                          <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{goal.horizon} {goal.sip !== '—' ? `• SIP ${goal.sip}` : ''}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: goal.pct >= 100 ? '#10B981' : '#64748B' }}>{goal.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ padding: 14, background: '#FEF2F2', borderRadius: 14, marginTop: 'auto', fontSize: 13, fontWeight: 700, color: '#B91C1C', lineHeight: 1.4 }}>
                    ⚠️ Child Education SIP needs +₹5k/mo to stay on 12% XIRR track
                  </div>
                </>
              }
            />
        </ScrollRow>


      </motion.div>

      {/* ─── Action Items (Compact) ─── */}
      <motion.div variants={stagger.item} style={{ marginTop: 28 }}>
        <SectionLabel color="#EF4444">Attention Needed</SectionLabel>
        <ScrollRow gap={12} style={{ paddingBottom: 12 }}>
          {actionItems.map((item) => (
            <ActionCard
              key={item.id}
              icon={item.icon}
              iconColor={item.color}
              title={item.title}
              subtitle={item.subtitle}
              rightLabel={item.benefit}
              rightColor={item.color}
              onClick={() => navigate('/advisor', { state: { activeItem: item, context: 'money', allItems: actionItems }})}
            />
          ))}
        </ScrollRow>
      </motion.div>

      {/* ─── Market Intelligence (Compact) ─── */}
      <motion.div variants={stagger.item} style={{ marginTop: 28 }}>
        <SectionLabel color="#4F46E5">Market Intelligence</SectionLabel>
        <ScrollRow gap={12} style={{ paddingBottom: 12 }}>
          {marketInsights.map((item) => (
            <ActionCard
              key={item.id}
              icon={item.icon}
              iconColor={item.color}
              title={item.title}
              subtitle={item.subtitle}
              rightLabel={item.benefit}
              rightColor={item.color}
              onClick={() => navigate('/advisor', { state: { activeItem: item, context: 'market', allItems: marketInsights }})}
            />
          ))}
        </ScrollRow>
      </motion.div>

      </motion.div>
    </Page>
  )
}
