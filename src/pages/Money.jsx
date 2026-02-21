import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowUpRight, ArrowDownRight, PieChart, Activity, 
  TrendingUp, Shield, Globe, Zap, ChevronRight, Sparkles, ArrowRight
} from 'lucide-react'
import { Page, ScrollRow } from '../components/UI'
import { Sparkline } from '../components/Charts'

/* ─── Data ─── */
const holdings = [
  { name: 'Parag Parikh Flexi', type: 'Equity MF', invested: 1450000, current: 1822000, sip: 15000, trend: [172, 174, 176, 178, 177, 180, 182] },
  { name: 'Quant Small Cap', type: 'Equity MF', invested: 760000, current: 1244000, sip: 10000, trend: [108, 112, 116, 118, 120, 122, 124] },
  { name: 'HDFC MidCap Opps', type: 'Equity MF', invested: 580000, current: 810000, sip: 10000, trend: [74, 76, 77, 79, 78, 80, 81] },
  { name: 'SGB 2028', type: 'Gold Bond', invested: 480000, current: 550000, sip: 0, trend: [52, 53, 54, 55, 55, 56, 55] },
]

const netWorthGrowth = [38, 40, 42, 44, 47, 50, 54, 57, 61, 65, 70, 73, 75]

const actionItems = [
  {
    id: 'rebalance',
    icon: Shield,
    color: '#EF4444', // RED
    bg: '#FEF2F2',
    title: 'Medium Term: 73% Equity',
    subtitle: 'Move ₹1.2L to Debt NOW',
    benefit: 'Protect Gains',
    context: "My medium term bucket has 73% equity allocation against a target of 30%. Help me rebalance by moving ₹1.2L from high-risk equity to debt."
  },
  {
    id: 'insurance-gap',
    icon: Shield,
    color: '#7C3AED',
    bg: '#F5F3FF',
    title: 'No Term Insurance',
    subtitle: '₹1Cr cover costs just ₹800/mo',
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

export default function Money() {
  const navigate = useNavigate()

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
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#64748B', letterSpacing: 0.5, textTransform: 'uppercase' }}>
            Wealth
          </span>
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 500, letterSpacing: -1, color: '#0F172A' }}>
          Investments
        </h1>
      </motion.div>

      {/* ─── Hero Swipeable Deck ─── */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <ScrollRow gap={16} style={{ paddingBottom: 10 }}>
            {/* Card 1: Net Worth & XIRR */}
            <div style={{ 
                minWidth: 320, 
                padding: 24, 
                background: '#0F172A', 
                borderRadius: 24, 
                color: 'white',
                scrollSnapAlign: 'center',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                height: 440
            }}>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500 }}>Net Worth</p>
                            <h2 style={{ fontSize: 42, fontWeight: 400, letterSpacing: -1.5, marginTop: 4 }}>
                                ₹75.0<span style={{ color: '#64748B' }}>L</span>
                            </h2>
                        </div>
                        <div style={{ 
                            background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', 
                            padding: '6px 12px', borderRadius: 100, fontSize: 13, fontWeight: 700 
                        }}>
                            18.4% XIRR
                        </div>
                    </div>

                    {/* Net Worth Growth Chart */}
                    <div style={{ marginTop: 16 }}>
                        <div style={{ fontSize: 10, color: '#64748B', marginBottom: 4, fontWeight: 500 }}>12-Month Growth</div>
                        <Sparkline data={netWorthGrowth} width={272} height={48} color="#34D399" strokeW={2} gradient={true} />
                    </div>

                    <div style={{ marginTop: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94A3B8', marginBottom: 6 }}>
                            <span>₹75L Reached</span>
                            <span>₹1 Cr Target</span>
                        </div>
                        <div style={{ height: 6, width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                            <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: '75%' }} 
                                transition={{ duration: 1, delay: 0.2 }}
                                style={{ height: '100%', background: '#10B981' }} 
                            />
                        </div>
                        <div style={{ marginTop: 8, fontSize: 12, color: '#10B981', fontWeight: 500 }}>
                            🚀 You are 75% of the way to ₹1 Crore!
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 24, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div>
                        <div style={{ fontSize: 13, color: '#94A3B8' }}>Invested</div>
                        <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>₹58.2L</div>
                    </div>
                    <div>
                        <div style={{ fontSize: 13, color: '#94A3B8' }}>Unrealized Gains</div>
                        <div style={{ fontSize: 18, fontWeight: 600, color: '#34D399', marginTop: 4 }}>+₹16.8L</div>
                    </div>
                </div>
            </div>

            {/* Card 2: Portfolio Mix (Previous View) */}
            <div style={{ 
                minWidth: 320, 
                padding: 24, 
                background: 'white', 
                borderRadius: 24, 
                border: '1px solid #E2E8F0',
                color: '#0F172A',
                scrollSnapAlign: 'center',
                height: 440,
                display: 'flex', flexDirection: 'column'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>Portfolio Mix</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#3B82F6', background: '#EFF6FF', padding: '2px 8px', borderRadius: 4 }}>Horizon</span>
                </div>
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {/* Liquid */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                            <span>Liquid <span style={{color:'#64748B', fontWeight:400}}>(Emergency)</span></span>
                            <span>₹6L</span>
                        </div>
                        <div style={{ height: 6, background: '#F1F5F9', borderRadius: 4 }}><div style={{ width: '8%', height: '100%', background: '#10B981', borderRadius: 4}} /></div>
                        <div style={{ fontSize: 10, color: '#64748B', marginTop: 3 }}>Savings A/C ₹2L • Liquid Fund ₹4L</div>
                    </div>
                     {/* Short Term */}
                     <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                            <span>Short <span style={{color:'#64748B', fontWeight:400}}>(1-3 Yrs)</span></span>
                            <span>₹9L</span>
                        </div>
                        <div style={{ height: 6, background: '#F1F5F9', borderRadius: 4 }}><div style={{ width: '12%', height: '100%', background: '#0EA5E9', borderRadius: 4}} /></div>
                        <div style={{ fontSize: 10, color: '#64748B', marginTop: 3 }}>Ultra Short Debt ₹5L • FDs ₹4L</div>
                    </div>
                     {/* Medium Term */}
                     <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                            <span>Medium <span style={{color:'#64748B', fontWeight:400}}>(3-5 Yrs)</span></span>
                            <span>₹15L</span>
                        </div>
                        <div style={{ height: 6, background: '#F1F5F9', borderRadius: 4 }}><div style={{ width: '20%', height: '100%', background: '#F59E0B', borderRadius: 4}} /></div>
                        <div style={{ fontSize: 10, color: '#64748B', marginTop: 3 }}>Gold SGB ₹5.5L • Balanced Adv ₹9.5L</div>
                    </div>
                     {/* Long Term */}
                     <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                            <span>Long <span style={{color:'#64748B', fontWeight:400}}>(7+ Yrs)</span></span>
                            <span>₹45L</span>
                        </div>
                        <div style={{ height: 6, background: '#F1F5F9', borderRadius: 4, display: 'flex', overflow:'hidden' }}>
                            <div style={{ width: '47%', height: '100%', background: '#3B82F6'}} />
                            <div style={{ width: '32%', height: '100%', background: '#6366F1'}} />
                            <div style={{ width: '21%', height: '100%', background: '#818CF8'}} />
                        </div>
                        <div style={{ fontSize: 10, color: '#64748B', marginTop: 3 }}>Flexi Cap ₹18.2L • Small Cap ₹12.4L • MidCap ₹8.1L</div>
                    </div>

                    {/* Protection */}
                    <div style={{ paddingTop: 6, borderTop: '1px dashed #E2E8F0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                            <span style={{ color: '#7C3AED' }}>🛡 Protection</span>
                            <span style={{ color: '#EF4444', fontSize: 11 }}>Gap!</span>
                        </div>
                        <div style={{ fontSize: 10, color: '#64748B' }}>No Term Insurance • Health ₹5L (upgrade to ₹25L)</div>
                    </div>
                </div>
            </div>

            {/* Card 3: Top Movers */}
            <div style={{ 
                minWidth: 320, 
                padding: 24, 
                background: '#F8FAFC', 
                borderRadius: 24, 
                border: '1px solid #E2E8F0',
                color: '#0F172A',
                scrollSnapAlign: 'center',
                height: 440,
                display: 'flex', flexDirection: 'column'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>Top Gainers</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#10B981' }}>1Y Returns</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                    {[
                        { name: 'Quant Small Cap', ret: '+64%', amt: '₹12.4L', color: '#10B981' },
                        { name: 'HDFC MidCap Opps', ret: '+41%', amt: '₹8.1L', color: '#10B981' },
                        { name: 'Parag Parikh Flexi', ret: '+28%', amt: '₹18.2L', color: '#34D399' },
                        { name: 'SGB 2028 (Gold)', ret: '+14%', amt: '₹5.5L', color: '#F59E0B' },
                    ].map((fund, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#1E293B' }}>{fund.name}</div>
                                <div style={{ fontSize: 11, color: '#64748B' }}>Value: {fund.amt}</div>
                            </div>
                            <div style={{ 
                                background: 'white', border: `1px solid ${fund.color}`, 
                                color: fund.color, fontSize: 12, fontWeight: 700, 
                                padding: '4px 8px', borderRadius: 6 
                            }}>
                                {fund.ret}
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid #E2E8F0', fontSize: 12, color: '#F59E0B', fontStyle: 'italic', fontWeight: 500 }}>
                    ⚠️ Small Caps led this year, but regime is shifting — watch for correction signs.
                </div>
            </div>
        </ScrollRow>

        {/* ─── Optimize CTA ─── */}
        <div style={{ padding: '16px 4px 0' }}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/advisor', { state: {
              activeItem: {
                id: 'optimize',
                icon: Zap,
                color: '#6366F1',
                bg: '#EEF2FF',
                title: 'Optimize My Portfolio',
                subtitle: 'AI-powered rebalancing',
                benefit: 'Optimize',
                context: "Analyze my full portfolio of ₹75L across equity, debt, and gold. Suggest rebalancing moves to optimize risk-adjusted returns, improve diversification, and align with my goals."
              },
              context: 'money',
              allItems: actionItems
            }})}
            style={{
              width: '100%', padding: '14px 20px',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              color: 'white', border: 'none', borderRadius: 16,
              fontSize: 15, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 16px rgba(99,102,241,0.3)'
            }}
          >
            <Zap size={18} /> Optimize My Portfolio
          </motion.button>
        </div>
      </motion.div>

      {/* ─── Action Items (Priority) ─── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        style={{ marginTop: 32 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, padding: '0 4px' }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#EF4444', letterSpacing: 0.5, textTransform: 'uppercase' }}>
            Attention Needed
          </h3>
        </div>

        <ScrollRow gap={12}>
          {actionItems.map((item, i) => (
            <motion.div 
              key={item.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/advisor', { state: { 
                activeItem: item,
                context: 'money',
                allItems: actionItems
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
                overflow: 'hidden'
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
                  Take Action <ArrowRight size={14} />
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

      {/* ─── Market Intelligence (Deck) ─── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ marginTop: 32 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, padding: '0 4px' }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#64748B', letterSpacing: 0.5, textTransform: 'uppercase' }}>
            Market Intelligence
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6366F1', fontSize: 12, fontWeight: 600 }}>
            <Sparkles size={12} />
            <span>AI Briefs</span>
          </div>
        </div>

        <ScrollRow gap={12}>
          {marketInsights.map((item, i) => (
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
              onClick={() => navigate('/advisor', { state: { 
                activeItem: item,
                context: 'market',
                allItems: marketInsights
              }})}
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
                  Analyze Impact <ArrowRight size={14} />
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

      {/* ─── Holdings List ─── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{ marginTop: 32, marginBottom: 120 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, padding: '0 4px' }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#64748B', letterSpacing: 0.5, textTransform: 'uppercase' }}>
            Top Holdings
          </h3>
        </div>

        <div style={{ background: 'white', borderRadius: 20, padding: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.02)', border: '1px solid #F1F5F9' }}>
          {holdings.map((h, i) => (
            <div key={i} style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              padding: '16px 12px',
              borderBottom: i < holdings.length - 1 ? '1px solid #F1F5F9' : 'none'
            }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#0F172A' }}>{h.name}</div>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>{h.type}{h.sip > 0 ? ` • SIP ₹${h.sip/1000}k` : ''}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#0F172A' }}>₹{(h.current/100000).toFixed(1)}L</div>
                <div style={{ 
                  fontSize: 12, fontWeight: 600, 
                  color: h.current > h.invested ? '#10B981' : '#EF4444',
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2
                }}>
                  {h.current > h.invested ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {Math.round(((h.current - h.invested)/h.invested)*100)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </Page>
  )
}
