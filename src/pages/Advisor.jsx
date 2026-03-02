import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, Sparkles, ChevronLeft, ArrowRight, 
  Shield, TrendingUp, Zap, CreditCard, Globe, Activity,
  Wallet, PiggyBank, Receipt, School, Heart,
  AlertTriangle, Target, Flame, ChevronRight
} from 'lucide-react'
import { Page, ScrollRow, stagger } from '../components/UI'
import { Bar } from '../components/Charts'

/* ─── Quick Topic Cards (shown when landing on AI tab directly) ─── */
const quickTopics = [
  {
    id: 'portfolio',
    icon: TrendingUp,
    color: '#10B981',
    bg: '#ECFDF5',
    title: 'Portfolio Health',
    subtitle: 'Check XIRR, allocation & risk',
    context: "Give me a quick health check of my investment portfolio — XIRR, allocation balance, and any risk flags.",
  },
  {
    id: 'tax',
    icon: Receipt,
    color: '#4F46E5',
    bg: '#EEF2FF',
    title: 'Optimize My Taxes',
    subtitle: 'Save up to ₹33 K this year',
    context: "Help me find any unclaimed tax deductions I can still use this financial year — 80C, 80CCD, 80D etc.",
  },
  {
    id: 'spend',
    icon: CreditCard,
    color: '#EF4444',
    bg: '#FEF2F2',
    title: 'Spending Audit',
    subtitle: 'Where is my money going?',
    context: "Do a full audit of my monthly spending — categorize it, flag overspends, and suggest savings.",
  },
  {
    id: 'goals',
    icon: PiggyBank,
    color: '#F59E0B',
    bg: '#FFFBEB',
    title: 'Goal Tracker',
    subtitle: 'Am I on track for my goals?',
    context: "Am I on track for my financial goals? Check my ₹1Cr target, emergency fund, and school fee planning.",
  },
]

/* ─── Action Items (mirrored from Action tab — the most important) ─── */
const urgentActions = [
  {
    id: 'portfolio-rebalance',
    icon: AlertTriangle,
    color: '#D97706',
    title: 'Equity at 77% — target is 60%',
    detail: 'Move ₹1.2L from equity to debt before market corrects.',
    impact: 'Reduce Risk',
    query: "My debt allocation is just 12% against a target of 30%. Help me rebalance by moving ₹1.2L from high-risk equity.",
  },
  {
    id: 'insurance-gap',
    icon: Shield,
    color: '#B91C1C',
    title: '₹15L health cover gap',
    detail: 'Mumbai ICU costs ₹10L. Your cover is ₹5L. Top-up for ₹267/mo.',
    impact: 'Critical',
    query: "Explain the gap in my health insurance compared to Mumbai hospital rates.",
  },
  {
    id: 'tax-nps',
    icon: Receipt,
    color: '#4338CA',
    title: 'Claim ₹15.6K tax refund',
    detail: 'Invest ₹50K in NPS under 80CCD(1B). Deadline approaching.',
    impact: 'Get ₹15.6K',
    query: "Help me understand Section 80CCD(1B) and why investing ₹50K saves me ₹15.6K?",
  },
  {
    id: 'insurance-review',
    icon: CreditCard,
    color: '#059669',
    title: 'Save ₹4K/yr on car insurance',
    detail: 'Switch HDFC Ergo → ICICI Lombard. Same coverage, lower premium.',
    impact: 'Save ₹4K',
    query: "I noticed you're paying ₹18k for HDFC Ergo. ICICI Lombard offers better coverage for ₹14k. Shall we switch?",
  },
  {
    id: 'idle-cash',
    icon: Wallet,
    color: '#047857',
    title: '₹1.3L idle in savings at 3%',
    detail: 'Move to Liquid Fund for 7.2%. Extra ₹4.9K/yr with same liquidity.',
    impact: '+₹4.9K',
    query: "Analyze my HDFC idle cash. Why is a Liquid Fund better than my savings account?",
  },
  {
    id: 'zomato-spend',
    icon: Flame,
    color: '#B45309',
    title: 'Cut food delivery by 20%',
    detail: '₹8.4K this month. Cap at ₹1.5K/week to save ₹24K/yr.',
    impact: '₹24K/yr',
    query: "Analyze my food delivery spending trends and suggest a realistic budget.",
  },
]

/* ─── Review items — not urgent, for whenever ─── */
const reviewItems = [
  {
    id: 'house-goal',
    icon: Target,
    color: '#EC4899',
    label: 'Goals',
    title: 'House goal ₹12L away • 2.8 yrs',
    detail: 'Increase SIP by ₹5K to cut to 2.1 yrs.',
    query: "My house down-payment goal is ₹12L short. I'm saving ₹15K/mo. How can I close this gap faster?",
  },
  {
    id: 'platinum-push',
    icon: Zap,
    color: '#D97706',
    label: 'Rewards',
    title: '150 pts to Platinum',
    detail: 'Complete 3 challenges → 700 pts → instant upgrade.',
    query: "I'm 150 points away from Platinum. I have 3 active challenges worth 700 pts total. What's the fastest path?",
  },
  {
    id: 'credit-score',
    icon: TrendingUp,
    color: '#10B981',
    label: 'Health',
    title: 'Credit utilization 45% → reduce to 28%',
    detail: 'Pay mid-cycle ₹20K. Score +15-25 pts in 30 days.',
    query: "How can I improve my credit score? It says keeping utilization under 30% helps. Currently at 45%.",
  },
  {
    id: 'small-cap-trim',
    icon: Activity,
    color: '#8B5CF6',
    label: 'Money',
    title: 'Small Cap 24% — trim ₹2L',
    detail: 'Book Quant profits (+64%), rotate to balanced fund.',
    query: "Should I trim Small Cap? My allocation is 24% against a 15% target. Quant Small Cap has +64% gains.",
  },
  {
    id: 'expenses-funding',
    icon: AlertTriangle,
    color: '#F59E0B',
    label: 'Spend',
    title: '2 upcoming expenses need funding',
    detail: 'Vacation ₹80K (Jun) + Insurance ₹45K (Jul).',
    query: "I have two upcoming expenses that need funding — Vacation ₹80K in June and Insurance ₹45K in July. Help me plan where the money comes from.",
  },
]

const suggestedPrompts = [
  "How much tax can I still save this year?",
  "Which credit card should I use for groceries?",
  "Is my emergency fund big enough?",
  "Should I increase my SIP amount?",
]


/* ─── Context Cards (Injected into chat) ─── */
const ContextCard = ({ data }) => {
  if (!data) return null
  return (
    <div style={{ marginTop: 16, marginBottom: 4 }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        boxShadow: '0 12px 24px -6px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03)',
        overflow: 'hidden',
        position: 'relative'
      }}>
         {/* Background Gradient */}
         <div style={{
             position: 'absolute', top: 0, left: 0, right: 0, height: 6,
             background: data.bg || '#F1F5F9'
         }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
           <div>
              <div style={{ 
                  fontSize: 12, fontWeight: 800, color: data.color, 
                  textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 
              }}>
                  {data.label}
              </div>
              <h4 style={{ 
                  fontSize: 22, fontWeight: 800, color: '#0F172A', 
                  margin: 0, letterSpacing: -0.5, lineHeight: 1.1 
              }}>
                  {data.title}
              </h4>
           </div>
        </div>

        <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.5, fontWeight: 500, marginBottom: 20 }}>
            {data.desc}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {data.impact && (
                 <div style={{
                    background: '#FEF08A', 
                    border: '2px solid #0F172A',
                    borderRadius: 12, padding: '6px 14px',
                    fontSize: 14, fontWeight: 800, color: '#0F172A',
                    boxShadow: '3px 3px 0px #0F172A',
                    transform: 'rotate(-2deg)'
                 }}>
                    {data.impact}
                 </div>
            )}
            
            {data.cta && (
                <button style={{
                    background: '#0F172A', color: 'white',
                    padding: '10px 20px', borderRadius: 100, border: 'none',
                    fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8,
                    cursor: 'pointer'
                }}>
                    {data.cta} <ArrowRight size={16} />
                </button>
            )}
        </div>
      </div>
    </div>
  )
}

/* ─── Multi-Turn Chat Responses (2-3 levels deep) ─── */
const chatFlows = {
  // ── Portfolio Health ──
  "Give me a quick health check of my investment portfolio — XIRR, allocation balance, and any risk flags.": {
    response: "Here's your portfolio snapshot:\n\n**XIRR:** 18.4% (Excellent — beating Nifty 50 by 3.2%)\n\n**Allocation:**\n• Equity: 60% (Flexi + Small Cap)\n• Gold: 20% (SGB 2028)\n• Short Term Debt: 12%\n• Liquid: 8%\n\n**Risk Flag:** Your Small Cap allocation is 24% — that's above the recommended 15% for your risk profile. Consider trimming ₹2L into a balanced fund.",
    suggestions: ["Should I trim Small Cap?", "Which balanced fund?", "Show me fund-wise XIRR"],
    cardData: {
        label: 'Critical Alert',
        title: 'Your Equity\nis Risky!',
        desc: 'You are 77% in stocks (Target 60%). Move ₹1.2 L to Debt before market falls.',
        color: '#D97706',
        bg: 'linear-gradient(90deg, #F59E0B, #D97706)',
        impact: 'Reduce Risk',
        cta: 'Rotate Now'
    },
    followUps: {
      "Should I trim Small Cap?": {

        response: "Yes, at 24% Small Cap, you're overweight in a volatile asset class. Here's my plan:\n\n**Step 1:** Sell ₹2L from Quant Small Cap (it has +64% gains, good time to book partial profits)\n**Step 2:** Move ₹1.2L → HDFC Balanced Advantage Fund\n**Step 3:** Move ₹0.8L → Liquid Fund (top up emergency)\n\nThis brings Small Cap to ~17% and boosts your safety cushion. Tax impact is minimal — LTCG of ~₹6,000 (₹625 tax).",
        suggestions: ["Execute this plan", "What about tax on this?"],
        followUps: {
          "Execute this plan": {
            response: "I've prepared the switch order:\n\n1. **Sell:** ₹2,00,000 from Quant Small Cap Fund\n2. **Buy:** ₹1,20,000 → HDFC Balanced Advantage\n3. **Buy:** ₹80,000 → ICICI Liquid Fund\n\n⏳ Processing takes 2-3 business days. You'll get a confirmation SMS from the AMC.\n\nShall I also set an alert to review this allocation again in 3 months?",
            suggestions: ["Set 3-month reminder", "Thanks, that's all"],
          },
          "What about tax on this?": {
            response: "Great question. Since you've held these for over 1 year:\n\n**Long Term Capital Gains (LTCG):**\n• Gains on ₹2L sale ≈ ₹76,000\n• First ₹1.25L LTCG is exempt\n• Taxable amount: ₹0 (under the exempt limit!)\n\nSo you pay **zero tax** on this switch. Perfect timing to rebalance.",
            suggestions: ["Okay, execute the plan"],
          }
        }
      },
      "Which balanced fund?": {
        response: "For your profile, I'd recommend:\n\n**HDFC Balanced Advantage Fund**\n• Category: Dynamic Asset Allocation\n• 3Y Return: 18.2% CAGR\n• Expense Ratio: 0.74%\n• Why: It auto-adjusts equity/debt based on market valuations. When Nifty PE is high (like now at 23x), it reduces equity — protecting you automatically.\n\n**Runner-up:** ICICI Prudential BAF (slightly lower returns but lower volatility).",
        suggestions: ["Start SIP in HDFC BAF", "Compare both funds"],
      },
      "Show me fund-wise XIRR": {
        response: "**Fund-wise XIRR Breakdown:**\n\n🏆 Quant Small Cap: **42.1%** XIRR\n📊 HDFC MidCap Opps: **24.3%** XIRR\n📊 Parag Parikh Flexi: **21.7%** XIRR\n🥇 SGB 2028 (Gold): **14.2%** XIRR\n\n**Weighted Portfolio XIRR: 18.4%**\n\nQuant is your star performer but also carries the most risk. The rest are steady compounders.",
        suggestions: ["Should I add more to Quant?", "Is Parag Parikh still good?"],
      }
    }
  },

  // ── Tax Savings ──
  "Help me find any unclaimed tax deductions I can still use this financial year — 80C, 80CCD, 80D etc.": {
    response: "Let me scan your tax position for FY 25-26:\n\n**Section 80C (₹1.5L limit):**\n✅ EPF: ₹72,000 (auto from salary)\n✅ ELSS SIP: ₹60,000 (your Axis ELSS)\n❌ **Gap: ₹18,000** — you can top up ELSS or PPF\n\n**Section 80CCD(1B) — NPS:**\n❌ **₹50,000 unused** → Tax saving: ₹15,600\n\n**Section 80D — Health Insurance:**\n✅ Self: ₹25,000 claimed\n❌ Parents: **₹50,000 available** if you pay their premium\n\n**Total potential savings: ₹33,600 in tax refund!**",
    suggestions: ["Invest ₹50K in NPS now", "How to claim parents' 80D?", "Top up 80C gap"],
    followUps: {
      "Invest ₹50K in NPS now": {
        response: "Smart move! Here's how:\n\n**Option 1 — eNPS (Fastest):**\n1. Go to enps.nsdl.com\n2. Login with PAN → Choose Tier 1\n3. Select scheme: SBI Pension Fund (Aggressive — 75% equity)\n4. Pay ₹50,000 via net banking\n\n**Timeline:** Completes in 10 minutes. NAV allotted in T+2 days.\n\n**Tax saved: ₹15,600** (at your 31.2% effective rate)\n\nShall I remind you to do this before March 31?",
        suggestions: ["Set March 31 reminder", "Which NPS scheme is best?"],
      },
      "How to claim parents' 80D?": {
        response: "If your parents are **senior citizens (60+)**, you can claim up to **₹50,000** for their health insurance premium.\n\n**Steps:**\n1. Pay their premium from your bank account (crucial — payer must be you)\n2. Get receipt in your parent's name, paid by you\n3. Claim under Section 80D in your ITR\n\n**If parents aren't 60+:** Limit is ₹25,000.\n\n**Tax saved:** Up to ₹15,600 (at your bracket).\n\nDo your parents have health insurance currently?",
        suggestions: ["Yes, they do", "No, need to buy one"],
      },
      "Top up 80C gap": {
        response: "You have an ₹18,000 gap in 80C. Quickest options:\n\n**1. ELSS Top-up (Best for growth):**\nInvest ₹18,000 in your Axis Long Term Equity. 3-year lock-in but highest return potential (~14% CAGR historically).\n\n**2. PPF (Safest):**\nDeposit ₹18,000 in your PPF. Guaranteed 7.1% tax-free return.\n\n**My recommendation:** Go with ELSS since you're already in it and the lock-in is just 3 years. The ₹18K will grow to ~₹27K in 3 years.\n\nShall I trigger the ELSS investment?",
        suggestions: ["Go with ELSS", "Go with PPF"],
      }
    }
  },

  // ── Spending Audit ──
  "Do a full audit of my monthly spending — categorize it, flag overspends, and suggest savings.": {
    response: "Here's your February spending audit:\n\n**Total Spend: ₹27,440** (61% of ₹45K limit)\n\n📊 **Breakdown:**\n• 🍔 Food Delivery: ₹8,420 (⚠️ 37% over budget)\n• 🚗 Transport: ₹4,200 (On track)\n• 🛍️ Shopping: ₹5,600 (⚠️ Overspend)\n• ☕ Dining Out: ₹3,800 (Moderate)\n• 🏠 Bills & Utilities: ₹2,840 (Normal)\n• 📱 Subscriptions: ₹2,580 (4 active)\n\n**Savings Potential: ₹4,200/month** by fixing Food & Shopping.",
    suggestions: ["Fix my food spending", "Audit my subscriptions", "Which card for dining?"],
    cardData: {
        label: 'Spending',
        title: 'Cut Zomato\nby 20%',
        desc: 'You spent ₹8.4 K this month. Cap it at ₹1.5 K/week to save ₹24 K/yr.',
        color: '#ea580c',
        bg: 'linear-gradient(90deg, #F97316, #EA580C)',
        impact: '₹24,000/yr',
        cta: 'Set Limit'
    },
    followUps: {
      "Fix my food spending": {
        response: "Your Zomato/Swiggy bill has crept up 32% in 3 months:\n\n**Trend:**\n• Nov: ₹5,100\n• Dec: ₹5,800\n• Jan: ₹6,380\n• Feb: ₹8,420 ← Here now\n\n**My Plan:**\n1. **Weekly cap:** ₹1,500/week (₹6,000/mo)\n2. **Hack:** Use Swiggy One (₹149/mo) — saves ~₹800 in delivery fees\n3. **Awareness:** I'll send you a nudge when you cross ₹1.5K any week\n\n**Annual saving: ₹24,000** if you stick to the cap. That's an extra SIP!",
        suggestions: ["Set the weekly cap", "₹1,500 feels too low"],
      },
      "Audit my subscriptions": {
        response: "You have **4 active subscriptions** totaling **₹2,580/month:**\n\n1. **Netflix Premium** — ₹649/mo → Usage: 3 hrs/month ⚠️\n2. **Spotify Family** — ₹179/mo → Usage: Daily ✅\n3. **YouTube Premium** — ₹149/mo → Usage: Regular ✅\n4. **iCloud 200GB** — ₹149/mo → Using 45GB only ⚠️\n5. **Gym (Cult.fit)** — ₹1,454/mo → 6 sessions/mo ⚠️\n\n**Save ₹1,652/mo:**\n• Downgrade Netflix to ₹199 Mobile plan (you mostly watch on phone)\n• Drop iCloud to 50GB (₹75/mo)\n• Cancel Cult, switch to outdoor runs",
        suggestions: ["Downgrade Netflix", "Cancel Cult.fit"],
      },
      "Which card for dining?": {
        response: "For dining, your **HDFC Regalia** is the optimal choice:\n\n**Why Regalia for Dining:**\n• 2X reward points on dining (4 points/₹150)\n• Each point = ₹0.50 → Effective cashback: ~1.3%\n• Access to Swiggy vouchers in SmartBuy\n\n**Don't use ICICI Amazon Pay** for dining — it only gives 1% cashback (meant for Amazon purchases at 5%).\n\n**Pro tip:** Pay on Regalia and link it to Zomato Pro → Double dscounts + rewards.",
        suggestions: ["Best card for each category?"],
      }
    }
  },

  // ── Goal Tracker ──
  "Am I on track for my financial goals? Check my ₹1Cr target, emergency fund, and school fee planning.": {
    response: "Let me check all three goals:\n\n**1. ₹1 Crore Target:**\n• Current: ₹75L (75% done!)\n• At 18.4% XIRR + current SIPs: You'll hit ₹1Cr by **Dec 2027**\n• Status: ✅ On track\n\n**2. Emergency Fund (6 months):**\n• Need: ₹2.7L (₹45K × 6)\n• Have: ₹6L in Liquid\n• Status: ✅ Over-funded (8 months covered)\n\n**3. Reyaan's School Fee:**\n• Next due: ₹42K on March 5\n• Account balance: ₹85K\n• Status: ✅ Covered (use Regalia for points)\n\n**Overall: You're in great shape, Ankur!**",
    suggestions: ["Speed up ₹1Cr goal", "Move extra emergency fund", "Plan next year's fees"],
    followUps: {
      "Speed up ₹1Cr goal": {
        response: "You're projected for Dec 2027. Let's see how to get there faster:\n\n**Option 1: Increase SIP by ₹10K/month**\n→ Hits ₹1Cr by **Aug 2027** (4 months early)\n\n**Option 2: Invest March bonus (₹1.5L lump sum)**\n→ Hits ₹1Cr by **Oct 2027** (2 months early)\n\n**Option 3: Both**\n→ Hits ₹1Cr by **May 2027** (7 months early! 🚀)\n\nGiven your cash flow, Option 1 is the safest bet. An extra ₹10K/month into Parag Parikh Flexi would compound beautifully.",
        suggestions: ["Go with Option 1", "Do Option 3"],
      },
      "Move extra emergency fund": {
        response: "You have 8 months covered instead of the recommended 6. That's ₹90K sitting idle in a Liquid Fund earning 7%.\n\n**Suggestion:** Move ₹90K to a Short Duration Debt Fund:\n• Expected return: 8.5-9%\n• Still accessible in 1-2 days\n• Extra earning: ~₹1,800/year\n\nThis keeps 6 months in instant-access Liquid and puts the surplus to slightly better use without adding risk.",
        suggestions: ["Move ₹90K now", "Keep it safe in Liquid"],
      },
      "Plan next year's fees": {
        response: "Reyaan's school fee for next academic year (2027-28) will likely be **₹45,000-48,000** per quarter (assuming 10% annual hike).\n\n**Annual total: ~₹1.8L-₹1.92L**\n\n**Plan:**\n1. Start a monthly RD of ₹16,000 from April\n2. By March 2027 you'll have ₹1.92L + interest\n3. This keeps fees out of your main cash flow\n\nAlternatively, invest ₹1.6L lumpsum in an Ultra Short Duration fund now — it'll grow to ~₹1.72L with zero stress.",
        suggestions: ["Start RD of ₹16K", "Lumpsum approach"],
      }
    }
  },

  // ── Legacy context responses (from card clicks) ──
  "My debt allocation is just 12% against a target of 30%. Help me rebalance by moving ₹1.2L from high-risk equity.": {
    response: "**Smart Move.** Markets are at all-time highs.\n\n**Execution Plan:**\n1. Sell ₹1.2L from **Parag Parikh Flexi Cap** (LTCG tax is negligible)\n2. Invest ₹1.2L into **Kotak Low Duration Fund** (Debt)\n\nThis brings your Debt allocation to ~28%. Shall I execute the switch order?",
    suggestions: ["Execute switch", "Show me other debt funds", "What about tax?"],
    followUps: {
      "Execute switch": {
        response: "Switch order prepared:\n\n**From:** Parag Parikh Flexi Cap → ₹1,20,000\n**To:** Kotak Low Duration Fund → ₹1,20,000\n\n⏳ Will process in T+2 days. Your new allocation will be:\n• Equity: 60% (down from 73%)\n• Debt: 28% (up from 12%)\n• Gold: 12%\n\nThis is much closer to your target. I'll alert you if allocation drifts again.",
        suggestions: ["Set rebalance alerts", "Thanks!"],
      }
    }
  },

  "I have a big school fee payment of ₹42,000 due on March 5th. Can we check if my salary account has enough float or if I need to liquidate something?": {
    response: "Checked your Salary Account (HDFC).\n\n**Balance:** ₹85,000\n**Avg Monthly Expenses:** ₹45,000\n**Available Float:** ~₹40,000\n\nYou're just short by ₹2,000 for fee + expenses.\n\n**Recommendation:** Swipe your **HDFC Regalia** for the fee — you'll earn ~420 reward points, and pay it off next cycle. Keeps your liquidity safe.",
    suggestions: ["Pay with Regalia", "Transfer from savings instead"],
    followUps: {
      "Pay with Regalia": {
        response: "Great choice! Here's why Regalia wins:\n\n**Rewards earned:** 420 points (worth ₹210)\n**Grace period:** 45 days interest-free\n**Credit utilization:** 35% (still healthy)\n\n**Set a reminder** to pay the Regalia bill by April 15 to avoid interest. I'll nudge you 3 days before.",
        suggestions: ["Set payment reminder", "Thanks!"],
      }
    }
  },

  "Help me understand Section 80CCD(1B) and why investing ₹50K saves me ₹15.6K?": {
    response: "Great question! Section 80CCD(1B) is an *exclusive* deduction for NPS, over and above the ₹1.5L limit of Section 80C.\n\nSince you're in the 30% tax bracket (plus cess):\n\n**The Math:**\n30% of ₹50,000 = ₹15,000\n4% Cess = ₹600\n**Total Tax Saved = ₹15,600**\n\nIt's essentially a risk-free 31.2% return on day one!",
    suggestions: ["Invest ₹50K in NPS now", "Which NPS scheme?", "NPS vs ELSS?"],
  },

  "Analyze my HDFC idle cash. Why is a Liquid Fund better than my savings account?": {
    response: "Your HDFC savings account pays **3-3.5%** interest. Inflation is ~5-6%, so your money is losing purchasing power.\n\nA Liquid Fund yields **7.1-7.3%** by investing in ultra-safe short-term instruments.\n\n**Liquidity:** Insta-Redemption up to ₹50K in 30 mins.\n**Risk:** Very low (almost equal to savings).\n**Gain:** ~₹4,900 more per year on your ₹1.3L.",
    suggestions: ["Move ₹1.3L to Liquid Fund", "Which Liquid Fund?", "Is it really safe?"],
  },

  "I seem to have overspent on shopping this month (₹5.6k). Can you break down my recent shopping transactions and suggest a cap?": {
    response: "Your shopping breakdown this month:\n\n**Transactions:**\n• Myntra: ₹2,100 (clothing)\n• Amazon: ₹1,800 (electronics cable + home)\n• Nykaa: ₹950 (personal care)\n• Decathlon: ₹750 (sports gear)\n\n**Your 3-month avg:** ₹3,200/month\n**This month:** ₹5,600 (75% over average!)\n\n**Suggested cap:** ₹3,500/month. That gives you room while staying disciplined. Save ₹25K/year.",
    suggestions: ["Set ₹3,500 cap", "Show me annual shopping trend"],
  },

  "Gold prices corrected by 4%. I currently have 11% exposure (₹0.51L) in SGB. Should I use this dip to increase it to 15%?": {
    response: "Yes! SGB Tranches available on secondary market at discount.\n\n**Target:** 15% allocation = ₹11.25L\n**Current:** ₹9L in SGB\n**To Buy:** ₹2.25L (~35 grams)\n\nBuying at a 4% dip effectively gives you a head start. SGBs also give 2.5% annual interest + capital gains tax-free at maturity.",
    suggestions: ["Buy ₹2.25L in SGB", "Wait for bigger dip", "Why SGB over Gold ETF?"],
  },

  "My portfolio XIRR is 23.4% vs Nifty's 15.2%. Can you breakdown which funds are generating this alpha?": {
    response: "**You have 8.2% Alpha!** Impressive.\n\n**Contributors:**\n1. **Quant Small Cap:** 42% XIRR (High Beta play)\n2. **Parag Parikh Flexi:** 26% XIRR (US Tech rally)\n3. **HDFC Midcap Opps:** 24% XIRR (Domestic growth)\n\nNifty Index fund is dragging the average at 14%. Your active funds are clearly outperforming the benchmark.",
    suggestions: ["Should I add more to Quant?", "Is this alpha sustainable?"],
  },

  "The US Fed cut rates by 50bps. How will this specifically impact the US equity portion of my Parag Parikh Flexi Cap fund?": {
    response: "PPFAS holds ~18% in US tech stocks (Alphabet, Microsoft, Meta).\n\n**Impact:**\n1. **Valuation:** US stocks likely rally (Positive)\n2. **Currency:** USD might fall vs INR (Negative for translated returns)\n\n**Net Effect:** Likely positive (+3-5%) in short term. Valuation expansion outweighs currency drag. Hold and enjoy the ride.",
    suggestions: ["Should I add international exposure?", "What if Fed reverses?"],
  },

  "How can I improve my credit score? It says keeping utilization under 30% helps. Currently at 45%.": {
    response: "Your credit utilization is 45% — that's the #1 thing hurting your score.\n\n**Quick Fixes:**\n1. **Pay mid-cycle:** Don't wait for the bill. Pay ₹20K now to drop utilization to 28%.\n2. **Increase limit:** Request a limit increase on HDFC Regalia (you're eligible for ₹2L).\n3. **Spread across cards:** Use your ICICI Amazon for small purchases.\n\n**Expected improvement:** +15-25 points in 30 days.",
    suggestions: ["Request limit increase", "Show my score trend"],
  },
}

/* ─── Fallback response ─── */
const fallbackResponse = {
  response: "That's a great question! Based on your financial profile, I'd suggest we look at this carefully. Let me analyze your accounts, spending patterns, and investments to give you a personalized answer.\n\nWould you like me to focus on any specific area?",
  suggestions: ["Check my portfolio", "Audit my spending", "Tax saving options"],
}

export default function Advisor() {
  const location = useLocation()
  const navigate = useNavigate()
  const { initialQuery, activeItem, context, allItems = [] } = location.state || {}
  
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [activeCard, setActiveCard] = useState(activeItem || null)
  const [hasStartedChat, setHasStartedChat] = useState(false)
  const chatEndRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Process incoming card context
  useEffect(() => {
    if (activeCard && activeCard.context) {
      setHasStartedChat(true)
      const prompt = activeCard.context
      
      setMessages([
        { role: 'user', text: prompt, isHidden: true }
      ])
      
      setIsTyping(true)
      setTimeout(() => {
        const flow = chatFlows[prompt]
        if (flow) {
          setMessages([
            { role: 'user', text: prompt, isHidden: true },
            { 
                role: 'ai', 
                text: flow.response, 
                suggestions: flow.suggestions, 
                flowKey: prompt,
                cardData: flow.cardData 
            }
          ])
        } else {
          setMessages([
            { role: 'user', text: prompt, isHidden: true },
            { role: 'ai', text: fallbackResponse.response, suggestions: fallbackResponse.suggestions }
          ])
        }
        setIsTyping(false)
      }, 1200)
    } else if (initialQuery) {
      setHasStartedChat(true)
      handleUserMessage(initialQuery, true)
    }
  }, [activeCard])

  const handleUserMessage = (text, hideUserBubble = false) => {
    if (!text.trim()) return
    setHasStartedChat(true)
    
    const userMsg = { role: 'user', text, isHidden: hideUserBubble }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      // Check direct flows first
      const directFlow = chatFlows[text]
      if (directFlow) {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: directFlow.response, 
          suggestions: directFlow.suggestions, 
          flowKey: text,
          cardData: directFlow.cardData
        }])
        setIsTyping(false)
        return
      }

      // Check if it's a follow-up suggestion from a previous AI message
      const lastAiMsg = [...messages, userMsg].filter(m => m.role === 'ai').pop()
      if (lastAiMsg?.flowKey) {
        const parentFlow = chatFlows[lastAiMsg.flowKey]
        if (parentFlow?.followUps?.[text]) {
          const followUp = parentFlow.followUps[text]
          setMessages(prev => [...prev, { 
            role: 'ai', 
            text: followUp.response, 
            suggestions: followUp.suggestions,
            flowKey: lastAiMsg.flowKey, // maintain parent for deeper lookups
            cardData: followUp.cardData
          }])
          setIsTyping(false)
          return
        }
      }

      // Search all flows for matching follow-ups (handles multi-level)
      for (const [key, flow] of Object.entries(chatFlows)) {
        if (flow.followUps?.[text]) {
          const followUp = flow.followUps[text]
          setMessages(prev => [...prev, { 
            role: 'ai', 
            text: followUp.response, 
            suggestions: followUp.suggestions,
            flowKey: key,
            cardData: followUp.cardData
          }])
          setIsTyping(false)
          return
        }
        // Check nested follow-ups (level 3)
        if (flow.followUps) {
          for (const [fKey, fFlow] of Object.entries(flow.followUps)) {
            if (fFlow.followUps?.[text]) {
              const deepFollowUp = fFlow.followUps[text]
              setMessages(prev => [...prev, { 
                role: 'ai', 
                text: deepFollowUp.response, 
                suggestions: deepFollowUp.suggestions,
                cardData: deepFollowUp.cardData
              }])
              setIsTyping(false)
              return
            }
          }
        }
      }

      // Fallback
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: fallbackResponse.response, 
        suggestions: fallbackResponse.suggestions 
      }])
      setIsTyping(false)
    }, 1000)
  }

  const handleSend = () => {
    if (!input.trim()) return
    handleUserMessage(input)
  }

  const handleSuggestionClick = (suggestion) => {
    handleUserMessage(suggestion)
  }

  const handleTopicClick = (topic) => {
    setActiveCard(topic)
  }

  const pendingItems = allItems.filter(i => activeCard && i.id !== activeCard.id)

  return (
    <Page paddingTop={100} bg="#F5F5F4">
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 140px)' }}>
        
        {/* ─── Header ─── */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, flexShrink: 0, paddingLeft: 4 }}>
          {hasStartedChat && (
            <motion.button 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={() => {
                if (activeCard && !activeItem) {
                  setActiveCard(null)
                  setMessages([])
                  setHasStartedChat(false)
                } else {
                  navigate(-1)
                }
              }}
              style={{ 
                background: 'white', border: '1px solid #F1F5F9', borderRadius: 16, 
                width: 44, height: 44, cursor: 'pointer', marginRight: 16, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}
            >
              <ChevronLeft size={24} />
            </motion.button>
          )}
          <div style={{ flex: 1 }}>
            {!hasStartedChat && (
              <h1 style={{ fontSize: 38, fontWeight: 900, letterSpacing: -1.5, color: '#0F172A', lineHeight: 1.05 }}>
                Command<span style={{ color: '#7C3AED' }}>.</span>
              </h1>
            )}
            {hasStartedChat && (
              <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: -0.5 }}>
                Advisor
              </h1>
            )}
            {hasStartedChat && (
              <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>
               {activeCard ? <>Helping with <span style={{ fontWeight: 700, color: '#4F46E5' }}>{activeCard.title}</span></> : 'Analyzing your finances'}
              </span>
            )}
          </div>
          {/* Header Icon Removed as per request */}
        </div>

        {/* ─── MAIN CONTENT ─── */}
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100 }} className="hide-scroll">
          
          {!hasStartedChat ? (
            /* ─── COMMAND CENTER LANDING ─── */
            <motion.div
              variants={stagger.container} initial="hidden" animate="show"
            >
              {/* Score strip */}
              <motion.div variants={stagger.item} style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
                {[
                  { label: 'Net Worth', value: '₹1.25Cr', color: '#4F46E5' },
                  { label: 'Monthly Burn', value: '₹27.4K', color: '#EF4444' },
                  { label: 'XIRR', value: '18.4%', color: '#10B981' },
                ].map((s, i) => (
                  <div key={i} style={{ flex: 1, background: '#fff', borderRadius: 16, padding: '12px 10px', boxShadow: '0 1px 8px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: s.color, letterSpacing: -0.5, whiteSpace: 'nowrap' }}>{s.value}</div>
                  </div>
                ))}
              </motion.div>

              {/* ─── Urgent Actions (from Action tab) ─── */}
              <motion.div variants={stagger.item} style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <h3 style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                    Needs Your Action
                  </h3>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#EF4444' }}>{urgentActions.length} items</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {urgentActions.map((action) => {
                    const Icon = action.icon
                    return (
                      <motion.div
                        key={action.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleUserMessage(action.query, true)}
                        style={{
                          background: '#fff', borderRadius: 20, padding: '14px 16px',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
                          boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
                          borderLeft: `4px solid ${action.color}`,
                        }}
                      >
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: `${action.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={18} color={action.color} strokeWidth={2.5} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>{action.title}</div>
                          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{action.detail}</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, flexShrink: 0 }}>
                          <span style={{ fontSize: 10, fontWeight: 800, color: action.color, background: `${action.color}10`, padding: '3px 8px', borderRadius: 6 }}>{action.impact}</span>
                          <ChevronRight size={14} color="#CBD5E1" style={{ marginTop: 2 }} />
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>

              {/* ─── Review When Free ─── */}
              <motion.div variants={stagger.item} style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
                  Review When Free
                </h3>
                <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
                  {reviewItems.map((item, i) => {
                    const Icon = item.icon
                    return (
                      <motion.div
                        key={item.id}
                        whileTap={{ scale: 0.985 }}
                        onClick={() => handleUserMessage(item.query, true)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 14,
                          padding: '14px 16px',
                          borderBottom: i < reviewItems.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${item.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={16} color={item.color} strokeWidth={2.5} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 1 }}>{item.title}</div>
                          <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.detail}</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, flexShrink: 0 }}>
                          <span style={{ fontSize: 9, fontWeight: 800, color: item.color, textTransform: 'uppercase', letterSpacing: 0.5, background: `${item.color}10`, padding: '2px 8px', borderRadius: 6 }}>{item.label}</span>
                          <ChevronRight size={14} color="#CBD5E1" />
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>

              {/* Explore Topics */}
              <motion.div variants={stagger.item} style={{ marginBottom: 120 }}>
                <h3 style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
                  Explore
                </h3>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {quickTopics.map((topic) => {
                    const Icon = topic.icon
                    return (
                      <motion.div
                        key={topic.id}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleTopicClick(topic)}
                        style={{
                          flex: '1 1 calc(50% - 5px)', minWidth: 150,
                          background: '#fff', borderRadius: 16, padding: '16px 14px',
                          cursor: 'pointer', boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
                        }}
                      >
                        <div style={{ width: 32, height: 32, borderRadius: 10, background: topic.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                          <Icon size={16} color={topic.color} strokeWidth={2.5} />
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>{topic.title}</div>
                        <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>{topic.subtitle}</div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>

            </motion.div>
          ) : (
            /* ─── CHAT VIEW ─── */
            <div style={{ padding: '0 4px' }}>
              
              {/* Removed large 'Active Card' block to declutter. Relying on Header for context. */}

              {/* Messages */}
              <div style={{ padding: '0 2px' }}>
                {messages.map((msg, i) => !msg.isHidden && (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    style={{ marginBottom: 24 }}
                  >
                    {msg.role === 'ai' ? (
                      <div style={{ display: 'flex', gap: 12 }}>
                        {/* Minimal AI Icon */}
                        <div style={{ 
                          width: 28, height: 28, borderRadius: 8, 
                          background: '#F1F5F9',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', 
                          marginTop: 4, flexShrink: 0
                        }}>
                          <Sparkles size={16} color="#4F46E5" strokeWidth={2.5} />
                        </div>
                        
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ 
                            fontSize: 16, color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-line',
                            // Removed bubble background for a cleaner "text-first" look, or keep it very subtle
                          }}>
                            {msg.text.split('**').map((part, j) => 
                              j % 2 === 1 ? <strong key={j} style={{ color: '#0F172A', fontWeight: 700 }}>{part}</strong> : part
                            )}
                          </div>
                          
                          {/* Context Card (if any) - Kept but margin adjusted */}
                          <ContextCard data={msg.cardData} />

                          {/* Suggestion Chips - Simplified */}
                          {msg.suggestions && !isTyping && i === messages.length - 1 && (
                            <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                              {msg.suggestions.map((s, j) => (
                                <motion.button
                                  key={j}
                                  whileTap={{ scale: 0.96 }}
                                  onClick={() => handleSuggestionClick(s)}
                                  style={{ 
                                    border: '1px solid #E2E8F0', 
                                    background: 'white', 
                                    padding: '8px 16px', 
                                    borderRadius: 100,
                                    fontSize: 13, fontWeight: 600, color: '#475569', 
                                    cursor: 'pointer',
                                  }}
                                >
                                  {s}
                                </motion.button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                        <div style={{ 
                          background: '#F1F5F9', color: '#0F172A', padding: '12px 20px', 
                          borderRadius: '20px 20px 4px 20px', fontSize: 16, maxWidth: '85%',
                          lineHeight: 1.5,
                          fontWeight: 500
                        }}>
                          {msg.text}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
                
                {/* Typing indicator */}
                {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ display: 'flex', gap: 16, marginBottom: 24 }}
                  >
                    <div style={{ 
                      width: 36, height: 36, borderRadius: 14, 
                      background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)'
                    }}>
                      <Sparkles size={18} color="white" />
                    </div>
                    <div style={{ 
                      background: '#FFFFFF', borderRadius: '4px 24px 24px 24px', 
                      padding: '16px 24px', 
                      boxShadow: '0 2px 10px rgba(0,0,0,0.03), 0 0 0 1px rgba(0,0,0,0.03)',
                      display: 'flex', gap: 6, alignItems: 'center',
                      minHeight: 50
                    }}>
                      {[0, 1, 2].map(j => (
                        <motion.div
                          key={j}
                          animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.1, 1] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: j * 0.2 }}
                          style={{ width: 8, height: 8, borderRadius: '50%', background: '#64748B' }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Pending items from navigation */}
              {pendingItems.length > 0 && (
                <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16, paddingLeft: 4 }}>
                    Also analyze
                  </div>
                  <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8, paddingLeft: 2 }} className="hide-scroll">
                    {pendingItems.map(item => (
                      <motion.div 
                        key={item.id}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          setActiveCard(item)
                          setMessages([])
                        }}
                        style={{ 
                          minWidth: 200, background: 'white', padding: 14, borderRadius: 18,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.03), 0 0 0 1px rgba(0,0,0,0.03)',
                          border: `1px solid ${item.color}20` // Subtle hint of color
                        }}
                      >
                        <div style={{ 
                          width: 36, height: 36, borderRadius: 12, background: `${item.color}15`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: item.color || '#4F46E5', flexShrink: 0
                        }}>
                          {item.icon ? <item.icon size={18} strokeWidth={2.5} /> : <Sparkles size={18} />}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#1E293B', lineHeight: 1.3, marginBottom: 2 }}>
                            {item.title}
                          </div>
                          <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>
                            Tap to view
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ─── INPUT BAR (Always visible) ─── */}
        <div style={{ 
          position: 'fixed', 
          bottom: 'calc(72px + env(safe-area-inset-bottom, 8px))', 
          left: '50%', 
          transform: 'translateX(-50%)',
          width: 'min(calc(100% - 32px), 398px)', 
          maxWidth: 398, 
          zIndex: 50
        }}>
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'rgba(255, 255, 255, 0.9)', 
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: 24, 
            padding: '8px 8px 8px 20px',
            boxShadow: '0 20px 40px -6px rgba(0,0,0,0.12), 0 8px 16px -4px rgba(0,0,0,0.04), 0 0 0 1px rgba(255,255,255,0.4) inset',
            border: '1px solid rgba(255,255,255,0.6)'
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask Advisor..."
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontSize: 16, color: '#0F172A', fontWeight: 500, fontFamily: 'inherit',
                minWidth: 0
              }}
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSend}
              style={{
                width: 44, height: 44, borderRadius: 18,
                background: input.trim() ? '#0F172A' : '#E2E8F0',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
                boxShadow: input.trim() ? '0 4px 12px rgba(15, 23, 42, 0.3)' : 'none'
              }}
            >
              <Send size={20} color={input.trim() ? 'white' : '#94A3B8'} strokeWidth={2.5} />
            </motion.button>
          </div>
        </div>
      </div>
    </Page>
  )
}
