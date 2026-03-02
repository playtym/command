import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Trophy, Medal, Zap, Star, ChevronRight, CheckCircle2, 
  Sparkles, Crown, ArrowRight, User
} from 'lucide-react'
import { Page, ScrollRow } from '../components/UI'

const challenges = [
  {
    id: 1,
    icon: Zap,
    color: '#F59E0B',
    bg: '#FFFBEB',
    title: 'No Spend Week',
    subtitle: '5/7 days completed',
    benefit: '+500 Pts',
    context: "I'm doing the 'No Spend Week' challenge. I have 2 days left. Any tips to stay on track this weekend?"
  },
  {
    id: 2,
    icon: Star,
    color: '#8B5CF6',
    bg: '#F5F3FF',
    title: 'Credit Builder',
    subtitle: 'Pay bill early',
    benefit: 'Boost Score',
    context: "How does paying my bill early help my credit score? I'm trying to complete the Credit Builder challenge."
  },
]

const milestones = [
  { id: 1, name: 'First SIP', date: 'Oct 2025', earned: true },
  { id: 2, name: 'Budget Pro', date: 'Jan 2026', earned: true },
  { id: 3, name: 'Net Worth ₹5 L', date: 'Pending', earned: false },
]

export default function Rewards() {
  const navigate = useNavigate()
  const currentLevel = 'Gold'
  const points = 1850

  return (
    <Page paddingTop={60}>
      {/* ─── Header ─── */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: 32 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#D97706' }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#57534E', textTransform: 'uppercase', letterSpacing: 1.5 }}>
            Status
          </span>
        </div>
        <h1 style={{ fontSize: 42, fontWeight: 900, letterSpacing: -2, color: '#1C1917', lineHeight: 1 }}>
          Progress<span style={{ color: '#D97706' }}>.</span>
        </h1>
      </motion.div>

      {/* ─── Hero Level (Credit Card) ─── */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, rotateX: 10 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        style={{ perspective: 1000 }}
      >
        <div style={{ 
          background: 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)', 
          borderRadius: 32, 
          padding: 32, 
          color: '#78350F', 
          position: 'relative', 
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(245, 158, 11, 0.4)',
          minHeight: 240,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
        }}>
           {/* Shimmer/Pattern Effect */}
           <div style={{
              position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
              background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 2px, transparent 2px, transparent 10px)',
              transform: 'rotate(30deg)',
              pointerEvents: 'none',
              opacity: 0.5
           }} />
           
           <div style={{
              position: 'absolute', top: 0, right: 0, width: 200, height: 200,
              background: 'radial-gradient(circle at top right, rgba(255,255,255,0.4), transparent 70%)',
              pointerEvents: 'none',
           }} />

            {/* Top Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ 
                      padding: '6px 14px', background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(12px)', 
                      borderRadius: 100, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1,
                      border: '1px solid rgba(255,255,255,0.5)', color: '#78350F',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                  }}>
                    Gold Member
                  </div>
              </div>
              <Crown size={32} color="#78350F" strokeWidth={2} />
            </div>

            {/* Middle Numbers */}
            <div style={{ 
                fontSize: 26, fontFamily: 'monospace', fontWeight: 700, letterSpacing: 4, 
                marginTop: 32, textShadow: '0 1px 0 rgba(255,255,255,0.3)', position: 'relative', zIndex: 2,
                color: '#451A03'
            }}>
                •••• •••• •••• 7821
            </div>

            {/* Bottom Details */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 2, marginTop: 'auto' }}>
                <div>
                    <div style={{ fontSize: 10, textTransform: 'uppercase', opacity: 0.8, fontWeight: 700, marginBottom: 4, color: '#451A03' }}>Card Holder</div>
                    <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: 0.5, color: '#451A03' }}>ANKUR GARG</div>
                </div>
                 <div>
                    <div style={{ fontSize: 10, textTransform: 'uppercase', opacity: 0.8, fontWeight: 700, marginBottom: 4, color: '#451A03', textAlign: 'right' }}>Expires</div>
                    <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: 0.5, color: '#451A03' }}>09/29</div>
                </div>
            </div>
        </div>
      </motion.div>

      {/* ─── Progression ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ marginTop: 32 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#78716C' }}>Progress to <span style={{ color: '#1C1917', fontWeight: 900 }}>Platinum</span></span>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#D97706' }}>150 pts left</span>
        </div>
        <div style={{ height: 12, background: '#F5F5F4', borderRadius: 6, overflow: 'hidden' }}>
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '85%' }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                style={{ height: '100%', background: 'linear-gradient(90deg, #F59E0B, #EA580C)', borderRadius: 6 }}
            />
        </div>

        {/* Platinum Benefits */}
        <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#78716C', textTransform: 'uppercase', marginBottom: 16, letterSpacing: 1.5 }}>
                Platinum Unlocks
            </div>
            <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }} className="hide-scroll">
                {[
                    { label: '2% Flat Cashback', icon: Zap, sub: 'On all spends' },
                    { label: 'Lounge Access', icon: Star, sub: 'International' },
                    { label: 'Concierge GenAI', icon: User, sub: '24/7 Access' },
                    { label: '₹5000 Voucher', icon: CheckCircle2, sub: 'Amazon/Flipkart' }
                ].map((benefit, i) => (
                    <div key={i} style={{ 
                        display: 'flex', flexDirection: 'column',
                        background: 'white', padding: '16px 20px', borderRadius: 24, 
                        border: 'none', minWidth: 150,
                        boxShadow: '0 4px 20px -4px rgba(0,0,0,0.06)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <benefit.icon size={16} color="#4F46E5" strokeWidth={2.5} />
                            <span style={{ fontSize: 13, fontWeight: 800, color: '#1C1917' }}>{benefit.label}</span>
                        </div>
                        <div style={{ fontSize: 12, color: '#78716C', fontWeight: 600 }}>{benefit.sub}</div>
                    </div>
                ))}
            </div>
        </div>
      </motion.div>

      {/* ─── Active Challenges (Deck) ─── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ marginTop: 32 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 11, fontWeight: 800, color: '#78716C', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Active Challenges
          </h3>
        </div>

        <ScrollRow gap={20}>
          {challenges.map((item, i) => (
            <div 
              key={i}
              style={{ 
                minWidth: 280, 
                scrollSnapAlign: 'center',
                background: '#FFFFFF',
                borderRadius: 32,
                padding: 24,
                border: 'none',
                boxShadow: `0 24px 48px -12px ${item.color}15, 0 0 0 1px rgba(0,0,0,0.03)`,
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/advisor', { state: { initialQuery: item.context } })}
            >
              {/* Glow */}
              <div style={{
                  position: 'absolute', top: -60, right: -60, width: 160, height: 160,
                  borderRadius: '50%', background: item.color,
                  filter: 'blur(60px)', opacity: 0.1,
                  pointerEvents: 'none'
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                 <div style={{ 
                    fontSize: 11, fontWeight: 800, color: item.color, textTransform: 'uppercase', letterSpacing: 1.5,
                    background: `${item.color}15`, padding: '6px 12px', borderRadius: 100
                }}>{item.benefit}</div>
                 <div style={{ 
                   width: 44, height: 44, borderRadius: 14, 
                   background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                   color: item.color, boxShadow: '0 8px 16px -4px rgba(0,0,0,0.08)'
                 }}>
                   <item.icon size={22} strokeWidth={2.5} />
                 </div>
              </div>
              
              <h4 style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', marginBottom: 8, letterSpacing: -1, lineHeight: 1.1 }}>{item.title}</h4>
              <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.5, marginBottom: 24, fontWeight: 600 }}>{item.subtitle}</p>

              <button style={{ 
                display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 14, fontWeight: 800, color: item.color,
                background: 'transparent', border: 'none', padding: 0, cursor: 'pointer'
              }}>
                View Progress <ChevronRight size={18} strokeWidth={3} />
              </button>
            </div>
          ))}
        </ScrollRow>
      </motion.div>

      {/* ─── Milestones List ─── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{ marginTop: 32, marginBottom: 120 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 11, fontWeight: 800, color: '#78716C', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Milestones
          </h3>
        </div>

        <div style={{ background: 'white', borderRadius: 28, padding: 8, boxShadow: '0 4px 20px -4px rgba(0,0,0,0.06)', border: 'none' }}>
          {milestones.map((m, i) => (
            <div key={m.id} style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              padding: '18px 16px',
              borderBottom: i < milestones.length - 1 ? '1px solid #F5F5F4' : 'none',
              opacity: m.earned ? 1 : 0.5
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ 
                  width: 44, height: 44, borderRadius: 14, 
                  background: m.earned ? '#ECFDF5' : '#F5F5F4', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: m.earned ? '#059669' : '#A8A29E'
                }}>
                  {m.earned ? <CheckCircle2 size={22} strokeWidth={2.5} /> : <Trophy size={22} strokeWidth={2.5} />}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#1C1917', letterSpacing: -0.3 }}>{m.name}</div>
                  <div style={{ fontSize: 13, color: '#78716C', fontWeight: 600 }}>{m.date}</div>
                </div>
              </div>
              {m.earned && (
                <div style={{ fontSize: 12, fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: 4 }}>
                  Unlocked
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </Page>
  )
}
