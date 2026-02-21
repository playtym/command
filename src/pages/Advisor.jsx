import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, Sparkles, ChevronLeft, ArrowRight, 
  Shield, TrendingUp, Zap, CreditCard, Globe, Activity,
  Wallet, PiggyBank, Receipt, School, Heart
} from 'lucide-react'
import { Page, ScrollRow } from '../components/UI'

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
    subtitle: 'Save up to ₹33K this year',
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

const suggestedPrompts = [
  "How much tax can I still save this year?",
  "Which credit card should I use for groceries?",
  "Is my emergency fund big enough?",
  "Should I increase my SIP amount?",
]

/* ─── Multi-Turn Chat Responses (2-3 levels deep) ─── */
const chatFlows = {
  // ── Portfolio Health ──
  "Give me a quick health check of my investment portfolio — XIRR, allocation balance, and any risk flags.": {
    response: "Here's your portfolio snapshot:\n\n**XIRR:** 18.4% (Excellent — beating Nifty 50 by 3.2%)\n\n**Allocation:**\n• Equity: 60% (Flexi + Small Cap)\n• Gold: 20% (SGB 2028)\n• Short Term Debt: 12%\n• Liquid: 8%\n\n**Risk Flag:** Your Small Cap allocation is 24% — that's above the recommended 15% for your risk profile. Consider trimming ₹2L into a balanced fund.",
    suggestions: ["Should I trim Small Cap?", "Which balanced fund?", "Show me fund-wise XIRR"],
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
            { role: 'ai', text: flow.response, suggestions: flow.suggestions, flowKey: prompt }
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
          role: 'ai', text: directFlow.response, 
          suggestions: directFlow.suggestions, flowKey: text 
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
            role: 'ai', text: followUp.response, 
            suggestions: followUp.suggestions,
            flowKey: lastAiMsg.flowKey // maintain parent for deeper lookups
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
            role: 'ai', text: followUp.response, 
            suggestions: followUp.suggestions,
            flowKey: key
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
                role: 'ai', text: deepFollowUp.response, 
                suggestions: deepFollowUp.suggestions 
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
    <Page>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 140px)' }}>
        
        {/* ─── Header ─── */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, flexShrink: 0 }}>
          {hasStartedChat && (
            <button 
              onClick={() => {
                if (activeCard && !activeItem) {
                  // Came from topic card, go back to landing
                  setActiveCard(null)
                  setMessages([])
                  setHasStartedChat(false)
                } else {
                  navigate(-1)
                }
              }}
              style={{ 
                background: 'white', border: '1px solid #E2E8F0', borderRadius: '50%', 
                width: 40, height: 40, cursor: 'pointer', marginRight: 16, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B',
                flexShrink: 0
              }}
            >
              <ChevronLeft size={24} />
            </button>
          )}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {hasStartedChat ? 'Advisor' : 'AI Advisor'}
            </h1>
            <span style={{ fontSize: 13, color: '#64748B' }}>
              {hasStartedChat && activeCard
                ? <>Helping with <span style={{ fontWeight: 600, color: '#4F46E5' }}>{activeCard.title}</span></>
                : hasStartedChat 
                  ? 'Analyzing your finances'
                  : 'What can I help you with?'
              }
            </span>
          </div>
          <div style={{ padding: 8, background: '#EEF2FF', borderRadius: 12, flexShrink: 0 }}>
            <Sparkles size={20} color="#4F46E5" fill="#4F46E5" />
          </div>
        </div>

        {/* ─── MAIN CONTENT ─── */}
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 20 }} className="hide-scroll">
          
          {!hasStartedChat ? (
            /* ─── DEFAULT LANDING (No card selected) ─── */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Greeting */}
              <div style={{ 
                textAlign: 'center', padding: '20px 0 32px', 
              }}>
                <div style={{ 
                  width: 64, height: 64, borderRadius: 20, 
                  background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(79, 70, 229, 0.3)'
                }}>
                  <Sparkles size={32} color="white" />
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
                  Hi Ankur, how can I help?
                </h2>
                <p style={{ fontSize: 14, color: '#64748B', maxWidth: 280, margin: '0 auto' }}>
                  I can analyze your portfolio, audit spending, plan taxes, and more.
                </p>
              </div>

              {/* Quick Topic Cards */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12, padding: '0 4px' }}>
                  Quick Actions
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {quickTopics.map((topic) => (
                    <motion.div
                      key={topic.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleTopicClick(topic)}
                      style={{
                        background: topic.bg,
                        borderRadius: 20,
                        padding: 18,
                        cursor: 'pointer',
                        border: '1px solid rgba(0,0,0,0.03)',
                      }}
                    >
                      <div style={{ 
                        width: 40, height: 40, borderRadius: 12, background: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: topic.color, marginBottom: 12,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                      }}>
                        <topic.icon size={20} />
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>
                        {topic.title}
                      </div>
                      <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.3 }}>
                        {topic.subtitle}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Suggested Prompts */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12, padding: '0 4px' }}>
                  Try asking
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {suggestedPrompts.map((prompt, i) => (
                    <motion.div
                      key={i}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleUserMessage(prompt)}
                      style={{
                        background: 'white',
                        borderRadius: 16,
                        padding: '14px 18px',
                        cursor: 'pointer',
                        border: '1px solid #E2E8F0',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>{prompt}</span>
                      <ArrowRight size={16} color="#94A3B8" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            /* ─── CHAT VIEW ─── */
            <div>
              {/* Active Card (if present) */}
              {activeCard && (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  style={{ marginBottom: 24 }}
                >
                  <div style={{ 
                    background: activeCard.bg, 
                    borderRadius: 20, 
                    padding: 20, 
                    border: '1px solid rgba(0,0,0,0.05)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ 
                        width: 44, height: 44, borderRadius: 14, background: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: activeCard.color || '#4F46E5',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)', flexShrink: 0
                      }}>
                        {activeCard.icon ? <activeCard.icon size={22} /> : <Sparkles size={22} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#1E293B' }}>{activeCard.title}</div>
                        <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>
                          {activeCard.desc || activeCard.subtitle}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Messages */}
              <div style={{ padding: '0 2px' }}>
                {messages.map((msg, i) => !msg.isHidden && (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    style={{ marginBottom: 20 }}
                  >
                    {msg.role === 'ai' ? (
                      <div style={{ display: 'flex', gap: 12 }}>
                        <div style={{ 
                          minWidth: 30, height: 30, borderRadius: '50%', background: '#4F46E5', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', 
                          marginTop: 2, flexShrink: 0
                        }}>
                          <Sparkles size={14} color="white" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ 
                            fontSize: 15, color: '#374151', lineHeight: 1.65, whiteSpace: 'pre-line',
                            background: '#F8FAFC', borderRadius: '4px 18px 18px 18px', padding: '14px 18px',
                            border: '1px solid #F1F5F9'
                          }}>
                            {msg.text.split('**').map((part, j) => 
                              j % 2 === 1 ? <strong key={j} style={{ color: '#0F172A' }}>{part}</strong> : part
                            )}
                          </div>
                          
                          {/* Suggestion Chips */}
                          {msg.suggestions && !isTyping && i === messages.length - 1 && (
                            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                              {msg.suggestions.map((s, j) => (
                                <motion.button
                                  key={j}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleSuggestionClick(s)}
                                  style={{ 
                                    border: '1px solid #E2E8F0', background: 'white', 
                                    padding: '8px 16px', borderRadius: 100,
                                    fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
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
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div style={{ 
                          background: '#0F172A', color: 'white', padding: '10px 18px', 
                          borderRadius: '18px 18px 4px 18px', fontSize: 15, maxWidth: '85%',
                          lineHeight: 1.5
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
                    style={{ display: 'flex', gap: 12, marginBottom: 20 }}
                  >
                    <div style={{ 
                      minWidth: 30, height: 30, borderRadius: '50%', background: '#4F46E5',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <Sparkles size={14} color="white" />
                    </div>
                    <div style={{ 
                      background: '#F8FAFC', borderRadius: '4px 18px 18px 18px', 
                      padding: '14px 18px', border: '1px solid #F1F5F9',
                      display: 'flex', gap: 6, alignItems: 'center'
                    }}>
                      {[0, 1, 2].map(j => (
                        <motion.div
                          key={j}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: j * 0.2 }}
                          style={{ width: 7, height: 7, borderRadius: '50%', background: '#94A3B8' }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Pending items from navigation */}
              {pendingItems.length > 0 && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
                    Other Actions ({pendingItems.length})
                  </div>
                  <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }} className="hide-scroll">
                    {pendingItems.map(item => (
                      <div 
                        key={item.id}
                        onClick={() => {
                          setActiveCard(item)
                          setMessages([])
                        }}
                        style={{ 
                          minWidth: 180, background: item.bg, padding: 12, borderRadius: 14,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                          border: '1px solid rgba(0,0,0,0.04)',
                        }}
                      >
                        <div style={{ 
                          width: 30, height: 30, borderRadius: 8, background: 'white',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: item.color || '#4F46E5', flexShrink: 0
                        }}>
                          {item.icon ? <item.icon size={14} /> : <Sparkles size={14} />}
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#1E293B', lineHeight: 1.3 }}>
                          {item.title}
                        </div>
                      </div>
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
          bottom: 72, 
          left: '50%', 
          transform: 'translateX(-50%)',
          width: '100%', 
          maxWidth: 430, 
          padding: '12px 20px',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          zIndex: 50
        }}>
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: 10,
            background: '#F1F5F9', borderRadius: 16, padding: '6px 6px 6px 18px',
            border: '1px solid #E2E8F0',
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything about your money..."
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontSize: 15, color: '#0F172A', fontFamily: 'inherit',
              }}
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSend}
              style={{
                width: 40, height: 40, borderRadius: 12,
                background: input.trim() ? '#0F172A' : '#CBD5E1',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}
            >
              <Send size={18} color="white" />
            </motion.button>
          </div>
        </div>
      </div>
    </Page>
  )
}
