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
  { id: 3, name: 'Net Worth ₹5L', date: 'Pending', earned: false },
]

export default function Rewards() {
  const navigate = useNavigate()
  const currentLevel = 'Gold'
  const points = 1850

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
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#F59E0B' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#64748B', letterSpacing: 0.5, textTransform: 'uppercase' }}>
            Status
          </span>
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 500, letterSpacing: -1, color: '#0F172A' }}>
          Your Progress
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
          background: 'linear-gradient(135deg, #FDE68A 0%, #D97706 100%)', 
          borderRadius: 24, 
          padding: 28, 
          color: '#78350F', 
          position: 'relative', 
          overflow: 'hidden',
          boxShadow: '0 20px 40px -10px rgba(217, 119, 6, 0.5), 0 0 0 1px rgba(0,0,0,0.05)',
          minHeight: 220,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
        }}>
           {/* Shimmer Effect */}
           <div style={{
              position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
              background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)',
              transform: 'rotate(30deg)',
              pointerEvents: 'none',
           }} />

            {/* Top Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ 
                      padding: '4px 10px', background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)', 
                      borderRadius: 100, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1,
                      border: '1px solid rgba(255,255,255,0.4)', color: '#78350F'
                  }}>
                    Gold Member
                  </div>
              </div>
              <Crown size={28} color="#92400E" strokeWidth={1.5} />
            </div>

            {/* Chip & Contactless */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 24, position: 'relative', zIndex: 2 }}>
                <div style={{ 
                    width: 44, height: 34, background: 'linear-gradient(135deg, #FCD34D 0%, #B45309 100%)', 
                    borderRadius: 6, border: '1px solid rgba(0,0,0,0.1)', position: 'relative' 
                }}>
                    <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(0,0,0,0.1)' }} />
                    <div style={{ position: 'absolute', top: 0, bottom: 0, left: '33%', width: 1, background: 'rgba(0,0,0,0.1)' }} />
                    <div style={{ position: 'absolute', top: 0, bottom: 0, right: '33%', width: 1, background: 'rgba(0,0,0,0.1)' }} />
                </div>
                <Zap size={24} style={{ transform: 'rotate(15deg)', opacity: 0.6 }} />
            </div>

            {/* Middle Numbers */}
            <div style={{ 
                fontSize: 22, fontFamily: 'monospace', fontWeight: 600, letterSpacing: 3, 
                marginTop: 24, textShadow: '0 1px 0 rgba(255,255,255,0.4)', position: 'relative', zIndex: 2 
            }}>
                •••• •••• •••• 7821
            </div>

            {/* Bottom Details */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 2 }}>
                <div>
                    <div style={{ fontSize: 9, textTransform: 'uppercase', opacity: 0.8, fontWeight: 600, marginBottom: 2 }}>Card Holder</div>
                    <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 0.5 }}>ANKUR GARG</div>
                </div>
                 <div>
                    <div style={{ fontSize: 9, textTransform: 'uppercase', opacity: 0.8, fontWeight: 600, marginBottom: 2 }}>Expires</div>
                    <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 0.5 }}>09/29</div>
                </div>
            </div>
        </div>
      </motion.div>

      {/* ─── Progression ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ marginTop: 24, padding: '0 8px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#64748B' }}>Progress to <span style={{ color: '#0F172A' }}>Platinum</span></span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>150 pts left</span>
        </div>
        <div style={{ height: 8, background: '#E2E8F0', borderRadius: 10, overflow: 'hidden' }}>
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '85%' }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                style={{ height: '100%', background: 'linear-gradient(90deg, #F59E0B, #D97706)', borderRadius: 10 }}
            />
        </div>

        {/* Platinum Benefits */}
        <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 12, letterSpacing: 0.5 }}>
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
                        background: 'white', padding: '12px 16px', borderRadius: 16, 
                        border: '1px solid #E2E8F0', minWidth: 140,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                            <benefit.icon size={14} color="#4F46E5" />
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#1E293B' }}>{benefit.label}</span>
                        </div>
                        <div style={{ fontSize: 11, color: '#64748B' }}>{benefit.sub}</div>
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, padding: '0 4px' }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#64748B', letterSpacing: 0.5, textTransform: 'uppercase' }}>
            Active Challenges
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6366F1', fontSize: 12, fontWeight: 600 }}>
            <Sparkles size={12} />
            <span>AI Coach</span>
          </div>
        </div>

        <ScrollRow gap={12}>
          {challenges.map((item, i) => (
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

              <button style={{ 
                display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 13, fontWeight: 700, color: item.color,
                background: 'transparent', border: 'none', padding: 0
              }}>
                View Progress <ChevronRight size={14} />
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, padding: '0 4px' }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#64748B', letterSpacing: 0.5, textTransform: 'uppercase' }}>
            Milestones
          </h3>
        </div>

        <div style={{ background: 'white', borderRadius: 20, padding: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.02)', border: '1px solid #F1F5F9' }}>
          {milestones.map((m, i) => (
            <div key={m.id} style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              padding: '16px 12px',
              borderBottom: i < milestones.length - 1 ? '1px solid #F1F5F9' : 'none',
              opacity: m.earned ? 1 : 0.5
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ 
                  width: 40, height: 40, borderRadius: 12, 
                  background: m.earned ? '#ECFDF5' : '#F1F5F9', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: m.earned ? '#10B981' : '#94A3B8'
                }}>
                  {m.earned ? <CheckCircle2 size={20} /> : <Trophy size={20} />}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#0F172A' }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: '#94A3B8' }}>{m.date}</div>
                </div>
              </div>
              {m.earned && (
                <div style={{ fontSize: 12, fontWeight: 600, color: '#10B981', display: 'flex', alignItems: 'center', gap: 4 }}>
                  Unlocked <Sparkles size={12} />
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </Page>
  )
}
