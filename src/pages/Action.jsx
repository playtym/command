import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, TrendingUp, Flame, Utensils, CreditCard, Clapperboard, FileText, ArrowRight, X, Check, MessageCircle, AlertTriangle, Zap } from 'lucide-react'
import { Page, Dot, SH, Card, WhiteCard, Num, AnimNum, stagger, ScrollRow } from '../components/UI'

/* ─── Data ─── */
const totalMoneySaved = 83553

/* ─── Actionable Insights (AI Deck) ─── */
const actions = [
  {
    id: 'insurance-review',
    type: 'comparison',
    label: 'INSURANCE REVIEW',
    title: 'Save ₹4,000/yr',
    desc: 'Switching to ICICI Lombard gives you better coverage for less premium.',
    color: '#059669', 
    bg: 'linear-gradient(165deg, #ECFDF5 0%, #D1FAE5 100%)', 
    impact: 'Save ₹4,000',
    cta: 'Switch',
    secondaryCta: 'Compare all options',
    
    // Comparison Data matching Screenshot
    header: {
      title: 'From ₹18,000 → ₹14,000 per year',
      subtitle: ''
    },
    comparison: {
      left: { 
        name: 'HDFC Ergo', 
        subtitle: 'Your active policy',
        type: 'CURRENT',
        values: [
            { label: 'Annual Premium', value: '₹18,000', strike: true },
            { label: 'Coverage Benefits', value: '✓ Same' },
            { label: 'Claim Payout Ratio', value: '88%' },
            { label: 'Garages in Your City', value: '230 garages' },
            { label: 'Cashless Claims', value: '✓ Yes' }
        ]
      },
      right: { 
        name: 'ICICI Lombard', 
        subtitle: 'Same benefits, less cost',
        type: 'RECOMMENDED',
        highlight: true,
        values: [
            { label: 'Annual Premium', value: '₹14,000', color: '#10B981' },
            { label: 'Coverage Benefits', value: '✓ Same', color: '#fff' },
            { label: 'Claim Payout Ratio', value: '94%', sub: '↑ 6 pts better', color: '#10B981' },
            { label: 'Garages in Your City', value: '390 garages', sub: '+160 near you', color: '#10B981' },
            { label: 'Cashless Claims', value: '✓ Yes', color: '#10B981' }
        ]
      }
    },
    recommendation: {
      title: 'WHY COMMAND RECOMMENDS THIS',
      points: [
        'Same IDV and zero-dep benefits — you\'re not losing any coverage',
        'ICICI Lombard has a higher claim settlement ratio in your state (TN) this year',
        '170 more network garages in Chennai — better cashless reach',
        'Your renewal is due in 18 days — best window to switch without penalty'
      ]
    },
    context: "I noticed you're paying ₹18k for HDFC Ergo. ICICI Lombard offers better coverage for ₹14k. Shall we switch?"
  },
  {
    id: 'portfolio-rebalance',
    type: 'comparison',
    label: 'Critical Alert',
    title: 'Your Equity\nis Risky!',
    desc: 'You are 77% in stocks (Target 60%). Move ₹1.2 L to Debt before market falls.',
    color: '#D97706',
    bg: 'linear-gradient(165deg, #FFFBEB 0%, #FEF3C7 100%)',
    impact: 'Reduce Risk',
    cta: 'Rotate Now',
    secondaryCta: 'View Portfolio',
    header: {
      title: 'Target 60% Equity → Currently 77%',
      subtitle: ''
    },
    comparison: {
      left: {
        name: 'Current Allocation',
        subtitle: 'High Risk',
        type: 'CURRENT',
        values: [
          { label: 'Equity', value: '77%', strike: true },
          { label: 'Debt', value: '12%', strike: true },
          { label: 'Gold', value: '11%', strike: true }
        ]
      },
      right: {
        name: 'Target Allocation',
        subtitle: 'Balanced Risk',
        type: 'RECOMMENDED',
        highlight: true,
        values: [
          { label: 'Equity', value: '60%', color: '#10B981' },
          { label: 'Debt', value: '30%', color: '#10B981' },
          { label: 'Gold', value: '10%', color: '#10B981' }
        ]
      }
    },
    recommendation: {
      title: 'WHY COMMAND RECOMMENDS THIS',
      points: [
        'Market is at all-time highs. Rebalancing now locks in profits and protects against downside.'
      ]
    },
    context: "My debt allocation is just 12% against a target of 30%. Help me rebalance by moving ₹1.2L from high-risk equity."
  },
  {
    id: 'tax-nps',
    type: 'comparison',
    label: 'Money Left on Table',
    title: 'Ankur, Claim\n₹15.6 K!',
    desc: 'You missed Section 80CCD. Invest ₹50 K in NPS to get ₹15.6 K back.',
    color: '#4338CA',
    bg: 'linear-gradient(165deg, #EEF2FF 0%, #E0E7FF 100%)',
    impact: 'Get Refund',
    cta: 'Invest ₹50 K',
    secondaryCta: 'Learn More',
    header: {
      title: 'Invest ₹50,000 → Save ₹15,600 in Tax',
      subtitle: ''
    },
    comparison: {
      left: {
        name: 'Without NPS',
        subtitle: 'Current Tax Plan',
        type: 'CURRENT',
        values: [
          { label: 'Taxable Income', value: '₹15L', strike: true },
          { label: 'Tax Paid', value: '₹2.73L', strike: true },
          { label: 'Sec 80CCD(1B)', value: '₹0', strike: true }
        ]
      },
      right: {
        name: 'With NPS',
        subtitle: 'Optimized Tax Plan',
        type: 'RECOMMENDED',
        highlight: true,
        values: [
          { label: 'Taxable Income', value: '₹14.5L', color: '#10B981' },
          { label: 'Tax Paid', value: '₹2.57L', color: '#10B981' },
          { label: 'Sec 80CCD(1B)', value: '₹50K', color: '#10B981' }
        ]
      }
    },
    recommendation: {
      title: 'WHY COMMAND RECOMMENDS THIS',
      points: [
        "You haven't used the extra ₹50k limit under 80CCD(1B). Investing now gives you a guaranteed 31.2% return via tax savings."
      ]
    },
    context: 'Help me understand Section 80CCD(1B) and why investing ₹50K saves me ₹15.6K?'
  },
  {
    id: 'idle-cash',
    type: 'comparison',
    label: 'Sleeping Money',
    title: 'Your ₹1.3 L\nis rotting',
    desc: 'HDFC savings gives only 3%. Move to Liquid Fund for 7.2%?',
    color: '#047857',
    bg: 'linear-gradient(165deg, #ECFDF5 0%, #D1FAE5 100%)',
    impact: '+₹4,924',
    cta: 'Switch',
    secondaryCta: 'Compare Funds',
    header: {
      title: 'From 3.0% → 7.2% Returns',
      subtitle: ''
    },
    comparison: {
      left: {
        name: 'HDFC Savings',
        subtitle: 'Current Account',
        type: 'CURRENT',
        values: [
          { label: 'Interest Rate', value: '3.0%', strike: true },
          { label: 'Annual Return', value: '₹3,900', strike: true },
          { label: 'Lock-in', value: 'None' }
        ]
      },
      right: {
        name: 'Liquid Fund',
        subtitle: 'Better Returns',
        type: 'RECOMMENDED',
        highlight: true,
        values: [
          { label: 'Interest Rate', value: '7.2%', color: '#10B981' },
          { label: 'Annual Return', value: '₹9,360', color: '#10B981' },
          { label: 'Lock-in', value: 'None', color: '#fff' }
        ]
      }
    },
    recommendation: {
      title: 'WHY COMMAND RECOMMENDS THIS',
      points: [
        "Liquid funds offer FD-like returns with savings-account-like liquidity. You can withdraw up to ₹50k instantly 24x7."
      ]
    },
    context: 'Analyze my HDFC idle cash. Why is a Liquid Fund better than my savings account?'
  },
  {
    id: 'insurance-gap',
    type: 'comparison',
    label: 'Risk Alert',
    title: 'Fix 15 L\nCover Gap',
    desc: 'Mumbai ICU costs ~₹10 L. Your cover is ₹5 L. Top-up for ₹267/mo.',
    color: '#B91C1C',
    bg: 'linear-gradient(165deg, #FEF2F2 0%, #FECACA 100%)',
    impact: 'Critical',
    cta: 'Get Top-up',
    secondaryCta: 'View Details',
    header: {
      title: '₹5L Cover → ₹20L Cover',
      subtitle: ''
    },
    comparison: {
      left: {
        name: 'Base Policy',
        subtitle: 'Current Cover',
        type: 'CURRENT',
        values: [
          { label: 'Sum Insured', value: '₹5L', strike: true },
          { label: 'Premium', value: '₹12k/yr' },
          { label: 'ICU Limit', value: '₹5k/day', strike: true }
        ]
      },
      right: {
        name: 'Base + Super Top-up',
        subtitle: 'Recommended Cover',
        type: 'RECOMMENDED',
        highlight: true,
        values: [
          { label: 'Sum Insured', value: '₹20L', color: '#10B981' },
          { label: 'Premium', value: '₹15.2k/yr', color: '#fff' },
          { label: 'ICU Limit', value: 'No Limit', color: '#10B981' }
        ]
      }
    },
    recommendation: {
      title: 'WHY COMMAND RECOMMENDS THIS',
      points: [
        "A 10-day ICU stay in Mumbai costs ~₹10L. Your current ₹5L cover is inadequate. A super top-up is the cheapest way to increase cover."
      ]
    },
    context: 'Explain the gap in my health insurance compared to Mumbai hospital rates.'
  },
  {
    id: 'zomato-spend',
    type: 'comparison',
    label: 'Spending',
    title: 'Cut Zomato\nby 20%',
    desc: 'You spent ₹8.4 K this month. Cap it at ₹1.5 K/week to save ₹24 K/yr.',
    color: '#B45309',
    bg: 'linear-gradient(165deg, #FFF7ED 0%, #FFEDD5 100%)',
    impact: '₹24,000/yr',
    cta: 'Set Limit',
    secondaryCta: 'View Spends',
    header: {
      title: '₹8.4k/mo → ₹6.4k/mo',
      subtitle: ''
    },
    comparison: {
      left: {
        name: 'Current Trend',
        subtitle: 'High Spending',
        type: 'CURRENT',
        values: [
          { label: 'Monthly Spend', value: '₹8,400', strike: true },
          { label: 'Orders/Week', value: '5', strike: true },
          { label: 'Annual Cost', value: '₹1.0L', strike: true }
        ]
      },
      right: {
        name: 'Target Budget',
        subtitle: 'Optimized Spending',
        type: 'RECOMMENDED',
        highlight: true,
        values: [
          { label: 'Monthly Spend', value: '₹6,400', color: '#10B981' },
          { label: 'Orders/Week', value: '3', color: '#10B981' },
          { label: 'Annual Cost', value: '₹76k', color: '#10B981' }
        ]
      }
    },
    recommendation: {
      title: 'WHY COMMAND RECOMMENDS THIS',
      points: [
        "You're spending 15% of your discretionary budget on food delivery. Cutting 2 orders a week saves you ₹24,000 a year."
      ]
    },
    context: 'Analyze my food delivery spending trends and suggest a realistic budget.'
  }
]


const totalPotentialSavings = 4924 + 4200 + 24000 + 15600 + 3200

const now = new Date()
const dateStr = now.toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })
const hour = now.getHours()
const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

const lastSync = '2 hours ago'

/* ─── Hinge-style Swipe Card ─── */
function SwipeCard({ action, stackIndex, isTop, onSwipe }) {
  const [isFlipped, setIsFlipped] = useState(false)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5])
  
  // Swipe direction indicators
  const skipOpacity = useTransform(x, [-150, -50, 0], [1, 0.5, 0])
  const actOpacity = useTransform(x, [0, 50, 150], [0, 0.5, 1])

  const handleDragEnd = (_, info) => {
    const threshold = 100
    if (info.offset.x > threshold) {
      onSwipe(1) // right = act
    } else if (info.offset.x < -threshold) {
      onSwipe(-1) // left = skip
    }
  }

  // Stack effect: cards behind are slightly smaller and shifted down
  const scale = 1 - stackIndex * 0.05
  const yOffset = stackIndex * 10
  const zIndex = 10 - stackIndex
  
  const handleTap = (e) => {
    if (isTop) {
      setIsFlipped(!isFlipped)
    }
  }

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '100%',
        zIndex,
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        scale,
        cursor: isTop ? 'grab' : 'default',
        perspective: 1000
      }}
      initial={{ scale: 0.95, opacity: 0, y: 40 }}
      animate={{ scale, opacity: 1, y: yOffset }}
      exit={{ 
        x: x.get() > 0 ? 400 : -400,
        rotate: x.get() > 0 ? 20 : -20,
        opacity: 0,
        transition: { duration: 0.3, ease: 'easeOut' }
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: 'grabbing' }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Swipe direction overlays - outside the flipping container */}
      {isTop && (
        <>
          <motion.div style={{
            position: 'absolute', top: 32, left: 32, zIndex: 20,
            opacity: skipOpacity,
            background: '#FEE2E2', border: '3px solid #EF4444',
            borderRadius: 100, padding: '12px 24px',
            display: 'flex', alignItems: 'center', gap: 8,
            pointerEvents: 'none',
            boxShadow: '0 12px 24px rgba(239,68,68,0.15)',
          }}>
            <X size={20} color="#EF4444" strokeWidth={4} />
            <span style={{ fontSize: 16, fontWeight: 900, color: '#EF4444', letterSpacing: 1 }}>SKIP</span>
          </motion.div>
          <motion.div style={{
            position: 'absolute', top: 32, right: 32, zIndex: 20,
            opacity: actOpacity,
            background: '#DCFCE7', border: '3px solid #10B981',
            borderRadius: 100, padding: '12px 24px',
            display: 'flex', alignItems: 'center', gap: 8,
            pointerEvents: 'none',
            boxShadow: '0 12px 24px rgba(16,185,129,0.15)',
          }}>
            <Check size={20} color="#10B981" strokeWidth={4} />
            <span style={{ fontSize: 16, fontWeight: 900, color: '#10B981', letterSpacing: 1 }}>ACT</span>
          </motion.div>
        </>
      )}

      <motion.div
        onClick={handleTap}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Front Face (Standard View) */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            background: action.bg || '#FFFFFF', 
            borderRadius: 32,      
            padding: '24px 22px 22px',
            border: 'none',
            boxShadow: isTop 
              ? '0 8px 40px -12px rgba(0,0,0,0.10)'
              : '0 4px 16px -4px rgba(0,0,0,0.06)',
            display: 'flex', flexDirection: 'column', 
            color: 'inherit'
          }}
        >
            {/* ─── Standard Top Brand/Label ─── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <div style={{ 
                    fontSize: 12, fontWeight: 800, color: '#0F172A', 
                    textTransform: 'uppercase', letterSpacing: 1.5,
                    background: 'rgba(255,255,255,0.5)', padding: '10px 18px', borderRadius: 100
                }}>
                    {action.label}
                </div>
                
                <div style={{
                    position: 'relative',
                    width: 44, height: 44, borderRadius: '50%',
                    background: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 8px 16px -4px rgba(0,0,0,0.05)`
                }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: action.color }} />
                </div>
            </div>

            {/* ─── Standard Hero Content ─── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
                <h4 style={{ 
                    fontSize: 44, fontWeight: 900, color: '#0F172A', 
                    marginBottom: 16, letterSpacing: -2.8, lineHeight: 0.92,
                    whiteSpace: 'pre-line' 
                }}>
                    {action.title}
                </h4>
                
                <p style={{ 
                    fontSize: 16, color: '#64748B', lineHeight: 1.5, 
                    fontWeight: 600, letterSpacing: -0.4, maxWidth: '95%' 
                }}>
                    {action.desc}
                </p>

                <div style={{ marginTop: 24, display: 'inline-flex' }}>
                    <div style={{
                        background: '#FEF08A', 
                        border: '2px solid #0F172A',
                        borderRadius: 14, padding: '10px 14px',
                        fontSize: 14, fontWeight: 800, color: '#0F172A',
                        boxShadow: '3px 3px 0px #0F172A'
                    }}>
                        {action.impact}
                    </div>
                </div>
            </div>

            {/* ─── Standard Bottom Action Bar ─── */}
            <div style={{ marginTop: 'auto', paddingTop: 32 }}>
                <button 
                    onClick={(e) => { e.stopPropagation(); onSwipe(1) }}
                    style={{ 
                        width: '100%', padding: '18px 20px',
                        borderRadius: 32,
                        background: '#0F172A', 
                        color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        border: 'none', cursor: 'pointer',
                        boxShadow: '0 16px 32px -8px rgba(15, 23, 42, 0.25)',
                        position: 'relative', overflow: 'hidden'
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 13, textTransform: 'uppercase', opacity: 0.7, letterSpacing: 1, marginBottom: 2 }}>Action</span>
                        <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.5, whiteSpace: 'nowrap' }}>{action.cta}</span>
                    </div>
                    
                    <div style={{ 
                        width: 44, height: 44, borderRadius: '50%', 
                        background: 'white', color: '#0F172A',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <ArrowRight size={22} strokeWidth={3} />
                    </div>
                </button>
            </div>
        </div>

        {/* Back Face (Comparison View) */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: '#FFFFFF', 
            borderRadius: 32,      
            padding: '22px',
            border: 'none',
            boxShadow: isTop 
              ? '0 8px 40px -12px rgba(0,0,0,0.10)'
              : '0 4px 16px -4px rgba(0,0,0,0.06)',
            display: 'flex', flexDirection: 'column', 
            color: '#0F172A'
          }}
        >
            {/* ─── Comparison Card Layout ─── */}
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 0 }}>
                {/* Header */}
                <div style={{ textAlign: 'left', marginTop: 0, paddingBottom: 16 }}>
                    <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>
                        {action.header?.title}
                    </div>
                </div>

                {/* Comparison Table */}
                <div style={{ 
                    display: 'grid', gridTemplateColumns: '1fr 1fr', 
                    border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, overflow: 'hidden',
                    marginBottom: 20
                }}>
                    {/* Left Column (Current) */}
                    <div style={{ background: '#F8FAFC', padding: '16px 12px' }}>
                        <div style={{ marginBottom: 16, minHeight: 60 }}>
                            <div style={{ fontSize: 10, color: '#EF4444', fontWeight: 700, letterSpacing: 0.5, marginBottom: 4 }}>{action.comparison?.left.type}</div>
                            <div style={{ fontSize: 13, fontWeight: 500, color: '#0F172A', lineHeight: 1.3 }}>{action.comparison?.left.name}</div>
                            <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.3 }}>{action.comparison?.left.subtitle}</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {action.comparison?.left.values.map((item, i) => (
                                <div key={i} style={{ height: 38 }}>
                                    <div style={{ fontSize: 11, color: '#64748B', marginBottom: 2 }}>{item.label}</div>
                                    <div style={{ 
                                        fontSize: 14, fontWeight: 500, color: '#0F172A',
                                        textDecoration: item.strike ? 'line-through' : 'none',
                                        opacity: item.strike ? 0.6 : 1
                                    }}>{item.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column (Recommended) */}
                    <div style={{ background: '#ECFDF5', padding: '16px 12px', borderLeft: '1px solid rgba(0,0,0,0.08)' }}>
                        <div style={{ marginBottom: 16, minHeight: 60 }}>
                             <div style={{ fontSize: 10, color: '#059669', fontWeight: 700, letterSpacing: 0.5, marginBottom: 4 }}>{action.comparison?.right.type}</div>
                             <div style={{ fontSize: 13, fontWeight: 500, color: '#0F172A', lineHeight: 1.3 }}>{action.comparison?.right.name}</div>
                             <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.3 }}>{action.comparison?.right.subtitle}</div>
                        </div>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {action.comparison?.right.values.map((item, i) => (
                                <div key={i} style={{ height: 38 }}>
                                    <div style={{ fontSize: 11, color: '#64748B', marginBottom: 2, opacity: 0 }}>{item.label}</div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: '#065F46' }}>{item.value}</div>
                                    {item.sub && <div style={{ fontSize: 10, color: '#059669' }}>{item.sub}</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recommendation Box */}
                <div style={{ 
                    border: '1px solid #A7F3D0', background: '#F0FDF4', 
                    borderRadius: 12, padding: 16, marginBottom: 20,
                    overflow: 'auto', maxHeight: 140
                }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#059669', marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase' }}>
                        {action.recommendation?.title}
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 16, color: '#065F46', fontSize: 11, lineHeight: '1.5', fontWeight: 400, listStyle: 'none' }}>
                        {action.recommendation?.points.map((point, i) => (
                            <li key={i} style={{ marginBottom: 8, color: '#065F46', display: 'flex', alignItems: 'flex-start' }}>
                                <span style={{ color: '#10B981', marginRight: 8, fontSize: 16, lineHeight: 1 }}>•</span> 
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Actions */}
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onSwipe(1) }}
                        style={{ 
                            width: '100%', padding: '16px', borderRadius: 12,
                            background: '#0F172A', color: '#FFFFFF',
                            border: 'none', fontSize: 15, fontWeight: 700, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)'
                        }}
                    >
                       <Zap size={18} fill="white" strokeWidth={0} /> 
                       {action.cta} <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.6, marginLeft: 2, marginTop: 2 }}>takes ~30 sec</span>
                    </button>
                    <button 
                         onClick={(e) => { e.stopPropagation(); onSwipe(-1) }}
                        style={{ 
                            width: '100%', padding: '14px', borderRadius: 12,
                            background: 'transparent', color: '#64748B',
                            border: '1px solid rgba(0,0,0,0.1)', fontSize: 14, fontWeight: 600, cursor: 'pointer'
                        }}
                    >
                        {action.secondaryCta} →
                    </button>
                </div>
            </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

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

  const [currentCard, setCurrentCard] = useState(0)
  const [exitDirection, setExitDirection] = useState(0)

  const handleSwipe = useCallback((dir, action) => {
    setExitDirection(dir)
    setTimeout(() => {
      if (dir > 0) {
        handleAskAI(action)
      }
      setCurrentCard(prev => prev + 1)
      setExitDirection(0)
    }, 250)
  }, [])

  const remainingActions = actions.slice(currentCard)

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
                style={{ fontSize: 56, marginBottom: 16 }}>🎉</motion.div>
              <h2 style={{ fontSize: 11, color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase', marginBottom: 20, letterSpacing: 2 }}>Total Money Saved</h2>
              <AnimNum value={totalMoneySaved} prefix="₹" style={{ fontSize: 'clamp(48px, 14vw, 72px)', fontWeight: 900, color: '#0F172A', letterSpacing: -4, lineHeight: 1 }} />
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
                style={{ marginTop: 28, padding: '10px 24px', background: '#ECFDF5', borderRadius: 100, color: '#059669', fontSize: 14, fontWeight: 800 }}>
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
              style={{ fontSize: 56, marginBottom: 16 }}>😔</motion.div>
            <h2 style={{ fontSize: 11, color: '#B91C1C', fontWeight: 800, textTransform: 'uppercase', marginBottom: 20, letterSpacing: 2 }}>But you could still save</h2>
            <AnimNum value={totalPotentialSavings} prefix="₹" suffix="/yr" style={{ fontSize: 'clamp(42px, 12vw, 64px)', fontWeight: 900, color: '#EF4444', letterSpacing: -4, lineHeight: 1 }} />
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              style={{ fontSize: 17, color: '#7F1D1D', maxWidth: 280, lineHeight: 1.6, fontWeight: 600, marginTop: 20 }}>
              Lost to idle cash, missed renewals & unclaimed tax benefits.
            </motion.p>
            <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              whileTap={{ scale: 0.95 }} onClick={finishIntro}
              style={{ marginTop: 48, background: '#EF4444', color: '#fff', border: 'none',
                padding: '20px 48px', borderRadius: 100, fontSize: 19, fontWeight: 900,
                cursor: 'pointer', boxShadow: '0 20px 40px -10px rgba(239, 68, 68, 0.4)' }}>
              See Action Plan →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dashboard */}
      <Page paddingTop={100} bg="#F5F5F4">
        <motion.div variants={stagger.container} initial="hidden" animate="show">
          {/* Header */}
          <motion.div variants={stagger.item} style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 38, fontWeight: 900, letterSpacing: -1.5, color: '#0F172A', lineHeight: 1.05 }}>
              Action<br/>Plan<span style={{ color: '#6366F1' }}>.</span>
            </h1>
          </motion.div>

          {/* Daily check-in reward */}
          <AnimatePresence>
            {showCheckin && (
              <motion.div variants={stagger.item}
                initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }} transition={{ duration: 0.4 }}
              >
                <div style={{
                  background: '#ECFDF5', border: 'none',
                  borderRadius: 20, padding: '16px 18px', marginBottom: 24,
                  display: 'flex', alignItems: 'center', gap: 12, color: '#065F46',
                }}>
                  <div style={{ padding: 8, background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <Flame size={18} color="#059669" fill="#059669" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#065F46' }}>Daily check-in: +10 points!</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: '#059669', display: 'block', marginTop: 3 }}>Day 18 streak — keep it going 🔥</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 900, background: '#fff', padding: '6px 14px', borderRadius: 100, color: '#059669' }}>+10 pts</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── AI ACTION DECK (Hinge-style Swipeable Stack) ─── */}
          <motion.div variants={stagger.item} style={{ marginBottom: 32 }}>
            {/* Card Stack */}
            <div style={{ position: 'relative', height: 'clamp(400px, 58vh, 540px)', perspective: 1000 }}>
              <AnimatePresence>
                {remainingActions.slice(0, 3).reverse().map((action, reverseIdx) => {
                  const stackIdx = remainingActions.slice(0, 3).length - 1 - reverseIdx
                  const isTop = stackIdx === 0
                  return (
                    <SwipeCard 
                      key={action.id}
                      action={action}
                      stackIndex={stackIdx}
                      isTop={isTop}
                      onSwipe={(dir) => handleSwipe(dir, action)}
                    />
                  )
                })}
              </AnimatePresence>

              {remainingActions.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    height: '100%', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                    background: 'linear-gradient(180deg, #EEF2FF 0%, #F9FAFB 100%)', borderRadius: 28, padding: 40,
                  }}
                >
                  <h3 style={{ fontSize: 34, fontWeight: 900, color: '#0F172A', marginBottom: 12, letterSpacing: -1.5, lineHeight: 1.05 }}>All caught<br/>up<span style={{ color: '#6366F1' }}>.</span></h3>
                  <p style={{ fontSize: 17, color: '#64748B', lineHeight: 1.6, fontWeight: 500, maxWidth: 260 }}>You've reviewed all actions.<br/>Check back later for new insights.</p>
                  <button onClick={() => setCurrentCard(0)} style={{
                    marginTop: 32, background: '#0F172A', color: 'white', border: 'none',
                    padding: '16px 36px', borderRadius: 100, fontSize: 16, fontWeight: 800, cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(15,23,42,0.2)'
                  }}>
                    Review Again
                  </button>
                </motion.div>
              )}
            </div>

            {/* Swipe hint */}
            {remainingActions.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 16, alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94A3B8', fontSize: 13, fontWeight: 700 }}>
                  <X size={15} /> Skip
                </div>
                <div style={{ display: 'flex', gap: 5 }}>
                  {actions.map((_, i) => (
                    <div key={i} style={{
                      width: i === currentCard ? 24 : 8, height: 8, borderRadius: 4,
                      background: i === currentCard ? '#0F172A' : i < currentCard ? '#CBD5E1' : '#E2E8F0',
                      transition: 'all 0.3s ease',
                    }} />
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6366F1', fontSize: 13, fontWeight: 700 }}>
                  Act <ArrowRight size={15} />
                </div>
              </div>
            )}
          </motion.div>

          {/* Stats Row */}
          <motion.div variants={stagger.item} style={{ marginTop: 8, marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1, padding: '14px 12px', background: '#ECFDF5', borderRadius: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>Saved YTD</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#10B981', fontFamily: 'var(--mono)', letterSpacing: -1 }}>₹{(totalMoneySaved/1000).toFixed(1)}k</div>
              </div>
              <div style={{ flex: 1, padding: '14px 12px', background: '#EEF2FF', borderRadius: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>Can Save</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#6366F1', fontFamily: 'var(--mono)', letterSpacing: -1 }}>₹{(totalPotentialSavings/1000).toFixed(1)}k</div>
              </div>
              <div style={{ flex: 1, padding: '14px 12px', background: '#FEF2F2', borderRadius: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: '#B91C1C', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>Inaction</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#EF4444', fontFamily: 'var(--mono)', letterSpacing: -1 }}>₹1.2k</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Page>
    </>
  )
}

