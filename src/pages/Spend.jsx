import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  CreditCard, ShoppingBag, Coffee, ChevronRight, 
  Sparkles, AlertCircle, Calendar, ArrowUpRight,
  School, Plane, Hotel, ArrowRight
} from 'lucide-react'
import { Page, ScrollRow } from '../components/UI'

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
    amount: '₹1.2L',
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
    subtitle: 'Myntra & Amazon',
    amount: '₹5.6k',
    benefit: 'Over Budget',
    context: "I seem to have overspent on shopping this month (₹5.6k). Can you break down my recent shopping transactions and suggest a cap?"
  },
  {
    id: 2,
    icon: Calendar,
    color: '#8B5CF6',
    bg: '#F5F3FF',
    title: 'Subscription Audit',
    subtitle: 'Netflix usage low',
    amount: '₹649',
    benefit: 'Save Money',
    context: "You mentioned my Netflix usage is low compared to the cost. Should I cancel it or downgrade?"
  },
]

const creditCards = [
  { id: 1, name: 'HDFC Regalia', last4: '4242', limit: 120000, used: 45000, color: '#3B82F6', network: 'VISA',
    topSpend: 'Travel', optimal: true, status: 'Great for Lounge',
    breakdown: [
      { color: '#3B82F6', width: '40%' }, // Travel
      { color: '#F59E0B', width: '30%' }, // Dining
      { color: '#10B981', width: '15%' }, // Grocery
    ]
  },
  { id: 2, name: 'ICICI Amazon', last4: '8812', limit: 80000, used: 12100, color: '#F59E0B', network: 'MasterCard',
    topSpend: 'Shopping', optimal: false, status: 'Use Regalia for Dining',
    breakdown: [
      { color: '#EF4444', width: '70%' }, // Shopping
      { color: '#8B5CF6', width: '20%' }, // Subs
    ]
  },
  { id: 3, name: 'Gold Member', last4: '7821', limit: 200000, used: 24750, color: '#D97706', network: 'Gold Tier',
    topSpend: 'Luxury', optimal: true, status: '2% Flat Cashback',
    breakdown: [
      { color: '#D97706', width: '50%' }, // Gold Only
      { color: '#F59E0B', width: '20%' }, 
      { color: '#FDE68A', width: '10%' }, 
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

export default function Spend() {
  const navigate = useNavigate()
  const [activeCardId, setActiveCardId] = useState(1)
  const totalSpent = 27440
  const monthlyLimit = 45000

  return (
    <Page>
      {/* ─── Header ─── */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: 32, padding: '0 4px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#64748B', letterSpacing: 0.5, textTransform: 'uppercase' }}>
            Cash Flow
          </span>
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 500, letterSpacing: -1, color: '#0F172A' }}>
          February Spend
        </h1>
      </motion.div>

      {/* ─── Hero Spend ─── */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div style={{ padding: 24, background: '#0F172A', borderRadius: 24, color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500 }}>Total Spent</p>
              <h2 style={{ fontSize: 42, fontWeight: 400, letterSpacing: -1.5, marginTop: 4 }}>
                ₹27.4<span style={{ color: '#64748B' }}>k</span>
              </h2>
            </div>
            <div style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.2)', 
              color: '#F87171', 
              padding: '6px 12px', 
              borderRadius: 100,
              fontSize: 13, fontWeight: 600
            }}>
              61% of Limit
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            {/* Multi-Colored Progress Bar */}
            <div style={{ height: 10, width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: 6, overflow: 'hidden', display: 'flex' }}>
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: '35%' }} 
                transition={{ duration: 1, delay: 0.2 }}
                style={{ height: '100%', background: '#3B82F6', borderRight: '2px solid #0F172A' }} 
              />
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: '15%' }} 
                transition={{ duration: 1, delay: 0.4 }}
                style={{ height: '100%', background: '#F59E0B', borderRight: '2px solid #0F172A' }} 
              />
               <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: '11%' }} 
                transition={{ duration: 1, delay: 0.6 }}
                style={{ height: '100%', background: '#10B981', borderRight: '2px solid #0F172A' }} 
              />
            </div>
            
            {/* Legend for Spend */}
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: '#3B82F6' }} />
                    <span style={{ fontSize: 11, color: '#94A3B8' }}>Travel</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: '#F59E0B' }} />
                    <span style={{ fontSize: 11, color: '#94A3B8' }}>Dining</span>
                </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: '#10B981' }} />
                    <span style={{ fontSize: 11, color: '#94A3B8' }}>Shop</span>
                </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── Credit Cards (Usage - Wallet Stack) ─── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.12 }}
        style={{ marginTop: 24 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, padding: '0 4px' }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#64748B', letterSpacing: 0.5, textTransform: 'uppercase' }}>
            Card Limits (Wallet)
          </h3>
        </div>

        <div style={{ position: 'relative', height: 300, marginBottom: 0 }}>
          {creditCards.map((card, i) => {
            const isTarget = activeCardId === card.id
            const percent = Math.round((card.used / card.limit) * 100)
            const isHigh = percent > 30
            const needsBreakdown = card.breakdown && card.breakdown.length > 0
            
            // Wallet Stack Logic
            // If a card is "active", it moves to the top (y=0). 
            // Others bunch up at the bottom or stay in their "stack" position if no card is heavily active?
            // Actually, a simple persistent stack is best for "Basic Info Visible".
            // Let's do: Always stacked with ~60px reveal. Clicking expands one.
            
            return (
              <motion.div 
                key={card.id} 
                onClick={() => setActiveCardId(isTarget ? null : card.id)}
                initial={false}
                animate={{ 
                    y: isTarget ? 0 : i * 55, // Stack headers visible
                    scale: isTarget ? 1.05 : 1,
                    zIndex: isTarget ? 100 : i,
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0,
                  background: 'white', 
                  borderRadius: 24, 
                  padding: 24,
                  border: '1px solid rgba(0,0,0,0.05)',
                  boxShadow: '0 -4px 10px rgba(0,0,0,0.03)',
                  transformOrigin: 'top center',
                  cursor: 'pointer',
                  minHeight: 180 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 28, background: '#1E293B', borderRadius: 6, position: 'relative', overflow: 'hidden' }}>
                       {card.network === 'Gold Tier' && (
                           <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #F59E0B, #D97706)' }} />
                       )}
                      <div style={{ position: 'absolute', top: -10, right: -4, width: 24, height: 24, background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>{card.name}</div>
                      <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>XX{card.last4} • {card.network}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: isHigh && !card.optimal ? '#EF4444' : '#10B981' }}>{percent}%</div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>Used</div>
                  </div>
                </div>

                {/* Multi-Colored Progress Bar */}
                {needsBreakdown ? (
                    <div style={{ height: 10, width: '100%', background: '#F1F5F9', borderRadius: 5, overflow: 'hidden', display: 'flex' }}>
                       {card.breakdown.map((seg, idx) => (
                           <motion.div 
                                key={idx}
                                initial={{ width: 0 }}
                                animate={{ width: seg.width }}
                                transition={{ duration: 0.8, delay: 0.2 + (idx * 0.1) }}
                                style={{ height: '100%', background: seg.color }}
                           />
                       ))}
                    </div>
                ) : (
                    <div style={{ height: 6, width: '100%', background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ 
                        height: '100%', 
                        width: `${percent}%`, 
                        background: isHigh ? '#EF4444' : '#10B981',
                        borderRadius: 3 
                    }} />
                    </div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
                  <div>
                    <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Top: {card.topSpend}</span>
                    <div style={{ fontSize: 12, color: card.optimal ? '#10B981' : '#F59E0B', marginTop: 4, fontWeight: 500 }}>
                      {card.optimal ? '✅ Optimal for Rewards' : `⚠️ ${card.status}`}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                     <div style={{ fontSize: 13, color: '#0F172A', fontWeight: 600 }}>₹{(card.used/1000).toFixed(1)}k</div>
                     <div style={{ fontSize: 11, color: '#94A3B8' }}>of ₹{(card.limit/1000).toFixed(0)}k</div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* ─── Upcoming Cash Flow (New Section) ─── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        style={{ marginTop: 32 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, padding: '0 4px' }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#64748B', letterSpacing: 0.5, textTransform: 'uppercase' }}>
            Big Expenses Coming Up
          </h3>
        </div>

        <ScrollRow gap={12}>
          {upcomingExpenses.map((item, i) => (
            <motion.div 
              key={item.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/advisor', { state: { 
                activeItem: item,
                context: 'spend',
                allItems: upcomingExpenses
              }})}
              style={{ 
                minWidth: 260, 
                scrollSnapAlign: 'center',
                background: item.bg,
                borderRadius: 24,
                padding: 20,
                border: '1px solid rgba(0,0,0,0.03)',
                boxShadow: 'none',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{ 
                  width: 44, height: 44, borderRadius: 14, 
                  background: 'white', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: item.color,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}>
                  <item.icon size={22} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: item.color, background: 'white', padding: '6px 10px', borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
                  {item.amount}
                </div>
              </div>
              
              <h4 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>{item.title}</h4>
              <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.4, marginBottom: 20, fontWeight: 500 }}>
                {item.subtitle} • <span style={{color: item.color}}>{item.benefit}</span>
              </p>

              <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                <button style={{ 
                  flex: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  fontSize: 13, fontWeight: 700, color: 'white',
                  background: '#0F172A', border: 'none', padding: '10px',
                  borderRadius: 12
                }}>
                  Ask AI <ArrowRight size={14} />
                </button>
                <button style={{ 
                  width: 40,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'white', border: 'none', borderRadius: 12,
                  color: item.color
                }}>
                  <Sparkles size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </ScrollRow>
      </motion.div>

      {/* ─── Spend Insights (Deck) ─── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ marginTop: 32 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, padding: '0 4px' }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#64748B', letterSpacing: 0.5, textTransform: 'uppercase' }}>
            Spending Analysis
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6366F1', fontSize: 12, fontWeight: 600 }}>
            <Sparkles size={12} />
            <span>AI Audit</span>
          </div>
        </div>

        <ScrollRow gap={12}>
          {spendInsights.map((item, i) => (
            <div 
              key={i}
              style={{ 
                minWidth: 260, 
                scrollSnapAlign: 'center',
                background: item.bg,
                borderRadius: 24,
                padding: 20,
                border: '1px solid rgba(0,0,0,0.03)',
                boxShadow: 'none',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => navigate('/advisor', { state: { initialQuery: item.context } })}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{ 
                  width: 44, height: 44, borderRadius: 14, 
                  background: 'white', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: item.color,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}>
                  <item.icon size={22} />
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: item.color, background: 'white', padding: '4px 8px', borderRadius: 6 }}>
                  {item.benefit}
                </div>
              </div>
              
              <h4 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>{item.title}</h4>
              <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.4, marginBottom: 20, fontWeight: 500 }}>{item.subtitle}</p>

              <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                <button style={{ 
                  flex: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  fontSize: 13, fontWeight: 700, color: 'white',
                  background: '#0F172A', border: 'none', padding: '10px',
                  borderRadius: 12
                }}>
                  Analyze <ArrowRight size={14} />
                </button>
                <button style={{ 
                  width: 40,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'white', border: 'none', borderRadius: 12,
                  color: item.color
                }}>
                  <Sparkles size={16} />
                </button>
              </div>
            </div>
          ))}
        </ScrollRow>
      </motion.div>

      {/* ─── Transaction List ─── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{ marginTop: 32, marginBottom: 120 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, padding: '0 4px' }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#64748B', letterSpacing: 0.5, textTransform: 'uppercase' }}>
            Recent Transactions
          </h3>
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
                {t.amount < 0 ? '-' : '+'}₹{Math.abs(t.amount)}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </Page>
  )
}
