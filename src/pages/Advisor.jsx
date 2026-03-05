import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, Sparkles, ChevronLeft, ArrowRight, 
  Shield, TrendingUp, Zap, CreditCard, Globe, Activity,
  Wallet, PiggyBank, Receipt, School, Heart,
  AlertTriangle, Target, Flame, ChevronRight
} from 'lucide-react'
import { Page, ScrollRow, stagger, SectionLabel, ListRow } from '../components/UI'
import { Bar, SegmentBar, Donut, GaugeArc, Sparkline } from '../components/Charts'

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
    response: "Here is your detailed portfolio diagnostic.\n\n### The \"So What\"\nYour portfolio is performing remarkably well with an **18.4% XIRR**, beating the Nifty 50 by 3.2%. However, your asset mix has drifted significantly. You currently hold **60% in Equity** (heavily weighted towards Small Cap), **20% in Gold**, **12% in Short Term Debt**, and **8% in Liquid assets**.\n\n### Risk Analysis\nYour Small Cap allocation stands at **24% of your total equity**. This is sharply above the 15% ceiling recommended for your moderate-aggressive risk profile. In a market correction, this overweight position could expose your portfolio to outsized drawdowns, wiping out your recent alpha.\n\n### Your Choices\n1. **Do Nothing:** Continue riding the small-cap wave, accepting higher volatility and potential 20-30% drawdowns in that segment.\n2. **Rebalance (Recommended):** Trim **₹2L from Quant Small Cap** and redirect it into a balanced fund or debt to lock in gains and restore your target allocation.\n3. **Hedge:** Increase your SIPs in Large Cap/Debt without selling current holdings, though this takes longer to fix the skew.\n\n### Tax Implications\nIf you choose to rebalance by selling ₹2L of Quant Small Cap now:\n• **LTCG:** If units are held for >1 year, gains under ₹1.25L are tax-free.\n• **Current Status:** Your estimated gains are ~₹76,000, meaning you will pay **zero tax** on this rotation.\n• **STCG:** For units held <1 year, you would incur a 20% tax. (We recommend selling only long-term units).",
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
        response: "Yes, addressing this 24% Small Cap concentration is critical.\n\n### The \"So What\"\nRotating out of small caps right after a massive +64% run is textbook profit booking. We shift risk into steady compounding assets while maintaining your long-term growth trajectory.\n\n### Risk Analysis\nSmall caps are currently trading at peak valuations. The primary risk here is *not* selling and getting caught in a mean-reversion cycle.\n\n### Your Choices\nHere is my actionable plan:\n• **Step 1:** Sell ₹2L from Quant Small Cap.\n• **Step 2:** Move ₹1.2L → HDFC Balanced Advantage Fund.\n• **Step 3:** Move ₹0.8L → Liquid Fund.\n\n### Tax Implications\nAs outlined, selling ₹2L of long-term holdings triggers ~₹76,000 in LTCG. Since this is well below the ₹1.25L annual exempt threshold, your tax impact is **₹0**.",
        suggestions: ["Execute this plan", "What about tax on this?"],
        followUps: {
          "Execute this plan": {
            response: "I've prepared the switch order:\n\n1. **Sell:** ₹2,00,000 from Quant Small Cap Fund\n2. **Buy:** ₹1,20,000 → HDFC Balanced Advantage\n3. **Buy:** ₹80,000 → ICICI Liquid Fund\n\n### The \"So What\"\nThis switch simultaneously achieves three things: locks in +64% gains on Quant, diversifies into a dynamically managed fund (HDFC BAF), and parks ₹80K in liquid reserves for tactical redeployment.\n\n### Risk Analysis\n• **Processing Window:** T+2 to T+3 business days. During transit, your ₹2L is unallocated. Market moves during this period are negligible on this amount.\n• **NAV Risk:** Sell and buy NAVs are on different days — net impact typically <0.2%.\n\n### Your Choices\n1. **Confirm and proceed** — I'll submit the order now.\n2. **Set a 3-month portfolio review alert** — I'll check if further rebalancing is needed.\n\n### Tax Implications\n• Already confirmed: ₹76K LTCG is within the ₹1.25L exemption → **Tax: ₹0**.\n• The new HDFC BAF units start a fresh 12-month LTCG clock. Plan any future exit after 12 months to avoid 20% STCG.\n\n⏳ Processing takes 2-3 business days. You'll get a confirmation SMS from the AMC.",
            suggestions: ["Set 3-month reminder", "Thanks, that's all"],
          },
          "What about tax on this?": {
            response: "Great question.\n\n### The \"So What\"\nThis switch is designed to be completely tax-neutral. The math works in your favor because your gains are well below the annual exemption threshold — meaning you're rebalancing your portfolio for free.\n\n### Risk Analysis\n1. **If gains were higher:** Had your Quant gains exceeded ₹1.25L, you'd owe 12.5% LTCG tax on the excess. Timing your sales to stay under this annual threshold is critical for tax-free rebalancing.\n2. **STCG Trap:** If any units were purchased less than 12 months ago, those gains would be taxed at 20% (STCG). We've specifically selected only long-term units.\n\n### Your Choices\n1. **Proceed with the switch (Recommended):** ₹0 tax, maximum rebalancing benefit.\n2. **Wait till next financial year:** If you have other equity sales planned this year that might push total LTCG above ₹1.25L, deferring this switch to April preserves a fresh exemption.\n\n### Tax Implications\n**Detailed Breakdown:**\n• **Total Sale:** ₹2,00,000 from Quant Small Cap\n• **Cost Basis:** ~₹1,24,000\n• **Estimated LTCG:** ₹76,000\n• **Annual Exemption:** ₹1,25,000\n• **Taxable Gains:** ₹0\n• **Tax Payable:** Absolutely **₹0**\n\nThe timing is mathematically perfect to rebalance without any drag on your wealth.",
            suggestions: ["Okay, execute the plan"],
          }
        }
      },
      "Which balanced fund?": {
        response: "For your profile, I'd recommend:\n\n**HDFC Balanced Advantage Fund**\n• Category: Dynamic Asset Allocation\n• 3Y Return: 18.2% CAGR\n• Expense Ratio: 0.74%\n• Why: It auto-adjusts equity/debt based on market valuations. When Nifty PE is high (like now at 23x), it reduces equity — protecting you automatically.\n\n**Runner-up:** ICICI Prudential BAF (slightly lower returns but lower volatility).\n\n### The \"So What\"\nA Balanced Advantage Fund is the ideal vehicle for your ₹1.2L rebalance because it dynamically shifts between equity and debt based on market conditions. You don't need to manually rebalance again — the fund does it for you. At current valuations (Nifty PE 23x), HDFC BAF is already ~45% in debt, providing built-in crash protection.\n\n### Risk Analysis\n1. **Underperformance in Bull Markets:** BAFs cap equity at 65-70% — they intentionally lag pure equity funds during rallies. This is a feature, not a bug.\n2. **Expense Ratio:** 0.74% is moderate. ICICI BAF charges 0.82% — so HDFC wins on cost too.\n3. **Fund Manager Risk:** HDFC BAF is managed by Prashant Jain's successor team. The investment philosophy has remained consistent post-transition.\n\n### Your Choices\n1. **HDFC Balanced Advantage Fund (Recommended):** Best risk-adjusted returns, lowest expense ratio, automatic rebalancing.\n2. **ICICI Prudential BAF:** Slightly more conservative — lower volatility but 1.5% lower 3Y CAGR. Better if you're more risk-averse.\n\n### Tax Implications\n• BAFs are classified as equity-oriented funds (>65% equity at all times for tax purposes). This means **LTCG rules apply:** 12.5% above ₹1.25L exemption for holdings >12 months.\n• If BAF were classified as debt (some hybrid funds are), gains would be taxed at your slab rate (30%). **Verify the fund's equity allocation stays above 65%** — HDFC BAF consistently does.",
        suggestions: ["Start SIP in HDFC BAF", "Compare both funds"],
      },
      "Show me fund-wise XIRR": {
        response: "**Fund-wise XIRR Breakdown:**\n\n🏆 Quant Small Cap: **42.1%** XIRR\n📊 HDFC MidCap Opps: **24.3%** XIRR\n📊 Parag Parikh Flexi: **21.7%** XIRR\n🥇 SGB 2028 (Gold): **14.2%** XIRR\n\n**Weighted Portfolio XIRR: 18.4%**\n\n### The \"So What\"\nYour 18.4% weighted XIRR is 3.2% above Nifty 50's 15.2%. But strip out Quant Small Cap and your remaining portfolio XIRR drops to ~16.1% — still good, but it reveals how dependent your alpha is on one high-beta fund.\n\n### Risk Analysis\n1. **Quant Concentration:** 42% XIRR is exceptional but unsustainable. Small cap cycles typically run 2-3 years before mean reversion. Quant's outperformance may already be peaking.\n2. **SGB at 14.2%:** This is gold's best run in years (war, inflation). Don't expect 14% XIRR from gold going forward — 8-10% is the long-run average.\n\n### Your Choices\n1. **Trim the top, feed the middle:** Take ₹1L from Quant, deploy into HDFC MidCap to diversify alpha sources.\n2. **Let winners ride:** Accept the concentration and enjoy 42% while it lasts.\n\n### Tax Implications\n• **XIRR is pre-tax.** Your after-tax XIRR depends on when you exit.\n• Quant (42% XIRR): If you hold >12 months, LTCG = 12.5% above ₹1.25L exemption. After-tax XIRR: ~37%.\n• SGB (14.2%): Capital gains at maturity are **completely tax-free**. The 2.5% coupon interest is taxed at slab rate. After-tax XIRR: ~13.4%.\n• **Best after-tax return:** SGB wins on tax efficiency. Best absolute return: Quant wins. Portfolio needs both.",
        suggestions: ["Should I add more to Quant?", "Is Parag Parikh still good?"],
      }
    }
  },

  "Why is 73% equity risky for my medium term bucket? Why move ₹1.2L to debt now?": {
    response: "Let's break down this specific risk related to your medium-term goals.\n\n### The \"So What\"\nMedium-term buckets (money needed in 2-5 years) require stability because you don't have the time to wait out a market crash. Right now, allocating 73% to equity in this bucket makes your capital highly vulnerable.\n\n### Risk Analysis\nHistorically, equities can suffer drawdowns of 20-30% in a single year. If the market corrects just as you need to withdraw this money (for a home down payment or child's pre-college fees), you would be forced to sell at a severe loss, directly jeopardizing those goals.\n\n### Your Choices\n1. **Maintain 73% Equity:** Accept the risk that your goal might fall short by up to 30% if the market turns.\n2. **De-risk (Move ₹1.2L):** Shift ₹1.2L into Debt. This lowers your equity ratio to ~50% in this bucket, providing a robust buffer without killing all growth.\n\n### Tax Implications\nSelling ₹1.2L in equity requires optimization:\n• Target units held >1 year to utilize the ₹1.25L tax-free LTCG limit.\n• Assuming standard embedded gains of 30%, your gains on ₹1.2L will be ~₹36,000.\n• This is fully covered by your exemption limit, resulting in **zero tax**.\n\nShall we initialize the transfer?",
    suggestions: ["Yes, move ₹1.2L to Debt", "What Debt fund should I use?"],
    followUps: {
      "What Debt fund should I use?": {
        response: "For a medium-term horizon (2-5 years), I recommend a **Short Duration Fund** or a **Corporate Bond Fund**.\n\n### The \"So What\"\nThese funds strike the perfect balance—offering better yields than liquid funds (7-7.5% expected) while minimizing interest rate risk and default risk.\n\n### Your Choices\n1. **HDFC Short Term Debt Fund:** High credit quality, matches your 3-year timeline beautifully.\n2. **ICICI Corporate Bond Fund:** Slightly higher yield, backed by AAA-rated paper.\n\n### Tax Implications\nDebt mutual funds purchased now are taxed at your marginal income tax slab rate when you redeem them. Therefore, expect any future gains on this ₹1.2L to be taxed at your effective slab rate (30%+).",
        suggestions: ["Go with HDFC Short Term"],
      }
    }
  },

  // ── Tax Savings ──
  "Help me find any unclaimed tax deductions I can still use this financial year — 80C, 80CCD, 80D etc.": {
    response: "**Tax Position Scan for FY 25-26:**\n\n**Section 80C (₹1.5L limit):**\n✅ EPF: ₹72,000 (auto from salary)\n✅ ELSS SIP: ₹60,000 (your Axis ELSS)\n❌ **Gap: ₹18,000** — you can top up ELSS or PPF\n\n**Section 80CCD(1B) — NPS:**\n❌ **₹50,000 unused** → Tax saving: ₹15,600\n\n**Section 80D — Health Insurance:**\n✅ Self: ₹25,000 claimed\n❌ Parents: **₹50,000 available** if you pay their premium\n\n### The \"So What\"\nYou have **₹33,600 in unclaimed tax refunds** sitting on the table. This isn't optional optimization — it's money the government will keep if you don't act before March 31. The NPS gap alone (₹50K investment = ₹15,600 saved) is a guaranteed 31.2% instant return.\n\n### Risk Analysis\n1. **Deadline Risk:** Section 80C and 80CCD(1B) investments must be made before March 31. Missing this deadline means waiting an entire year for the next opportunity.\n2. **NPS Lock-in:** The ₹50K NPS investment is locked until age 60 (partial withdrawal at 25 years). This is a long commitment — only invest if you won't need this money sooner.\n3. **80D Documentation Risk:** For parents' health insurance, the premium MUST be paid from YOUR bank account. If paid from theirs, the deduction is invalid.\n\n### Your Choices\n1. **Max Everything (Recommended):** Invest ₹18K in ELSS (80C) + ₹50K in NPS (80CCD) + pay parents' health premium (80D). Total tax saved: **₹33,600**.\n2. **Quick Wins Only:** Just do NPS ₹50K (10 minutes online, saves ₹15,600). Highest ROI for effort.\n3. **Defer NPS:** If the 60-year lock-in concerns you, skip NPS and focus on ELSS + 80D only. Tax saved: ₹18,000.\n\n### Tax Implications\n• **80C (₹18K ELSS):** Saves ₹5,580 in tax (₹18K × 31%). ELSS has 3-year lock-in but ~14% CAGR returns.\n• **80CCD(1B) (₹50K NPS):** Saves ₹15,600. NPS returns ~10-12% historically (aggressive scheme).\n• **80D (Parents):** Saves up to ₹15,600. No lock-in — this is just paying their existing premium.\n• **Combined impact:** ₹33,600 refund + investment growth. Over 10 years, this annual ritual compounds to **₹5-8L** in pure tax alpha.",
    suggestions: ["Invest ₹50K in NPS now", "How to claim parents' 80D?", "Top up 80C gap"],
    followUps: {
      "Invest ₹50K in NPS now": {
        response: "**NPS Investment via eNPS:**\n\n**Option 1 — eNPS (Fastest):**\n1. Go to enps.nsdl.com\n2. Login with PAN → Choose Tier 1\n3. Select scheme: SBI Pension Fund (Aggressive — 75% equity)\n4. Pay ₹50,000 via net banking\n\n**Timeline:** Completes in 10 minutes. NAV allotted in T+2 days.\n\n### The \"So What\"\nThis single 10-minute action saves you **₹15,600 in tax** this financial year — a guaranteed 31.2% instant return before any market performance. No other investment gives you a risk-free 31% return on day one.\n\n### Risk Analysis\n1. **Lock-in Risk:** NPS is locked until age 60. At withdrawal, 60% must be annuitized (providing a pension) and only 40% is available as lump sum — tax-free.\n2. **Scheme Choice Risk:** 'Aggressive' (75% equity) is optimal for your age, but expect ±15% annual volatility. Don't check NPS NAV frequently.\n\n### Your Choices\n1. **SBI Pension Fund Aggressive (Recommended):** Best long-term track record among NPS schemes. 3Y return: ~14%.\n2. **HDFC Pension Fund:** Slightly lower returns but marginally lower volatility.\n\n### Tax Implications\n• **Tax saved:** ₹15,600 (₹50K × 31.2% effective rate including cess).\n• **At maturity (60+):** 60% corpus into annuity (taxed as income), 40% lump sum is **completely tax-free**.\n• **Deadline:** Must invest before **March 31** to claim deduction in this FY.",
        suggestions: ["Set March 31 reminder", "Which NPS scheme is best?"],
      },
      "How to claim parents' 80D?": {
        response: "**Parents' Health Insurance — Section 80D:**\n\nIf your parents are **senior citizens (60+)**, you can claim up to **₹50,000** for their health insurance premium.\n\n**Steps:**\n1. Pay their premium from your bank account (crucial — payer must be you)\n2. Get receipt in your parent's name, paid by you\n3. Claim under Section 80D in your ITR\n\n**If parents aren't 60+:** Limit is ₹25,000.\n\n### The \"So What\"\nThis is the easiest ₹15,600 in tax savings you'll ever claim — you're simply paying a premium they likely need anyway, but routing the payment through your account to unlock the deduction. If your parents already have insurance but pay for it themselves, just change the payment method.\n\n### Risk Analysis\n1. **Documentation Risk:** The premium MUST be paid from YOUR bank account. If it shows as debited from your parent's account, the deduction is disallowed during assessment.\n2. **Policy Validity:** The policy must be active and from an IRDA-approved insurer. Employer-provided group insurance does NOT qualify.\n\n### Your Choices\n1. **Pay from your account (Recommended):** If parents have existing insurance, switch the payment mandate to your bank. Tax saved: up to ₹15,600.\n2. **Buy a new policy:** If parents are uninsured, this is doubly important — you get health protection AND tax savings.\n\n### Tax Implications\n• Senior citizen parents (60+): Deduction up to **₹50,000** → saves ₹15,600 at 31.2% effective rate.\n• Non-senior parents (<60): Deduction up to **₹25,000** → saves ₹7,800.\n• This is OVER AND ABOVE your own ₹25,000 self/family 80D claim — the two are independent limits.",
        suggestions: ["Yes, they do", "No, need to buy one"],
      },
      "Top up 80C gap": {
        response: "**Section 80C Gap: ₹18,000**\n\n**1. ELSS Top-up (Best for growth):**\nInvest ₹18,000 in your Axis Long Term Equity. 3-year lock-in but highest return potential (~14% CAGR historically).\n\n**2. PPF (Safest):**\nDeposit ₹18,000 in your PPF. Guaranteed 7.1% tax-free return.\n\n### The \"So What\"\nLeaving ₹18K of 80C unused means you're forfeiting **₹5,580 in tax savings** (₹18K × 31%). Over 10 years, this annual missed deduction compounds to ₹55,800 in lost tax alpha — and that's before counting the investment returns.\n\n### Risk Analysis\n1. **ELSS Lock-in:** 3 years mandatory. If you need this money sooner, it's inaccessible. However, at ₹18K, this is a minor portion of your liquidity.\n2. **PPF Lock-in:** 15 years (partial withdrawal after 7). Much longer commitment but zero volatility risk.\n3. **Deadline Risk:** Both must be invested before March 31 to count for this FY.\n\n### Your Choices\n1. **ELSS (Recommended):** Higher expected returns (~14% CAGR), shorter lock-in (3yr), and you already hold Axis ELSS — so this is a top-up, not a new investment.\n2. **PPF:** Guaranteed 7.1%, completely tax-free at maturity. Better if you want zero-risk certainty.\n\n### Tax Implications\n• **Immediate:** ₹18K deduction under 80C saves ₹5,580 in tax this year.\n• **ELSS at maturity:** After 3-year lock-in, gains are LTCG at 12.5% (after ₹1.25L exemption). The ₹18K could grow to ~₹27K, with gains of ₹9K fully covered by the exemption = **₹0 tax on exit**.\n• **PPF at maturity:** Returns are 100% tax-free under EEE (Exempt-Exempt-Exempt) treatment. The safest tax instrument available.",
        suggestions: ["Go with ELSS", "Go with PPF"],
      }
    }
  },

  // ── Spending Audit ──
  "Do a full audit of my monthly spending — categorize it, flag overspends, and suggest savings.": {
    response: "Here's your February spending audit:\n\n**Total Spend: ₹27,440** (61% of ₹45K limit)\n\n📊 **Breakdown:**\n• 🍔 Food Delivery: ₹8,420 (⚠️ 37% over budget)\n• 🚗 Transport: ₹4,200 (On track)\n• 🛍️ Shopping: ₹5,600 (⚠️ Overspend)\n• ☕ Dining Out: ₹3,800 (Moderate)\n• 🏠 Bills & Utilities: ₹2,840 (Normal)\n• 📱 Subscriptions: ₹2,580 (4 active)\n\n### The \"So What\"\nYou have a **₹4,200/month savings potential** hiding in just two categories: Food Delivery and Shopping. At an annual rate, that's ₹50,400 — enough to fully fund your Child Education SIP gap (₹5K/mo) and still have ₹200/mo left over. Your fixed costs are healthy; it's purely discretionary leakage.\n\n### Risk Analysis\n1. **Food Delivery Spiral:** Your Zomato/Swiggy spend has increased 32% over 3 months. This is classic lifestyle creep — each month normalizes a higher baseline.\n2. **Subscription Bloat:** ₹2,580/mo across 5 subscriptions, but 3 show low usage. You're paying for convenience you don't use.\n3. **Shopping Impulse:** ₹5,600 vs ₹3,200 average (+75%). End-of-season sales trigger impulse buys that feel like 'savings' but are actually incremental spend.\n\n### Your Choices\n1. **Full Audit Fix (Recommended):** Cap food at ₹6K/mo, freeze shopping at ₹3.5K, audit subscriptions. Monthly savings: ₹4,200.\n2. **Target #1 Category:** Just fix food delivery (cap Zomato at 5 orders/week). Savings: ₹2,400/mo.\n3. **Do Nothing:** Accept current spend and offset by earning more.\n\n### Tax Implications\n• Spending cuts themselves have no tax impact.\n• **But the redirect matters:** If you channel the ₹4,200/mo savings into ELSS, that's ₹50,400/yr qualifying for Section 80C — saving an additional **₹15,120 in tax** (at 30% slab). Your overspending is literally costing you a tax deduction.",
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
        response: "Your Zomato/Swiggy bill has crept up 32% in 3 months:\n\n**Trend:**\n• Nov: ₹5,100\n• Dec: ₹5,800\n• Jan: ₹6,380\n• Feb: ₹8,420 ← Here now\n\n### The \"So What\"\nThis is a textbook spending spiral — each month normalizes a higher baseline. At this trajectory, you'll hit ₹10K/mo on food delivery by April. The **annual saving from capping at ₹6K/mo is ₹24,000** — that's an entire extra SIP.\n\n### Risk Analysis\n1. **Convenience Addiction:** Food delivery apps are designed to create habit loops. The 32% 3-month increase shows the algorithm is working against you.\n2. **Health Cost:** Beyond finances, frequent delivery food correlates with higher caloric intake and sodium — a hidden long-term cost.\n\n### Your Choices\n1. **Weekly Cap at ₹1,500 (Recommended):** Limits to ₹6,000/mo. I'll send a nudge when you cross ₹1.5K any week. Annual saving: ₹24,000.\n2. **Swiggy One Hack:** Subscribe to Swiggy One (₹149/mo) for free delivery, saving ~₹800/mo in delivery fees alone.\n3. **Cook 4 Days/Week:** Most impactful but requires lifestyle change. Can halve the food delivery bill.\n\n### Tax Implications\nNo direct tax implications. However, the ₹24,000/yr saved, if invested in ELSS, generates **₹7,200/yr additional tax savings** under Section 80C (30% of ₹24K). Your food delivery habit is costing you both the money AND the tax benefit.",
        suggestions: ["Set the weekly cap", "₹1,500 feels too low"],
      },
      "Audit my subscriptions": {
        response: "**Subscription Audit — ₹2,580/month:**\n\n1. **Netflix Premium** — ₹649/mo → Usage: 3 hrs/month ⚠️\n2. **Spotify Family** — ₹179/mo → Usage: Daily ✅\n3. **YouTube Premium** — ₹149/mo → Usage: Regular ✅\n4. **iCloud 200GB** — ₹149/mo → Using 45GB only ⚠️\n5. **Gym (Cult.fit)** — ₹1,454/mo → 6 sessions/mo ⚠️\n\n### The \"So What\"\nYou're spending ₹2,580/mo but actually using value from only 2 of 5 subscriptions (Spotify and YouTube). The other 3 are **₹1,652/mo of phantom spend** — money leaving your account for services you barely use. That's ₹19,824/year wasted.\n\n### Risk Analysis\n1. **Netflix Premium:** At 3 hrs/month, you're paying ₹216/hr for content. The Mobile plan at ₹199/mo delivers the same library at ₹66/hr — 3x better value.\n2. **Cult.fit:** At 6 sessions/mo, each session costs ₹242. A pay-per-session model would cost ₹150/session (₹900/mo) — saving ₹554/mo.\n3. **iCloud:** You're using 23% of your 200GB plan. The 50GB tier at ₹75/mo covers your needs with room to spare.\n\n### Your Choices\n1. **Full Optimization (Recommended):** Downgrade Netflix (save ₹450), drop iCloud to 50GB (save ₹74), cancel Cult (save ₹1,454). Total: **₹1,652/mo saved (₹19,824/yr)**.\n2. **Keep Cult, Fix Rest:** If you value gym access, just fix Netflix + iCloud. Savings: ₹524/mo.\n3. **Do Nothing:** Accept ₹19,824/yr in subscription leakage.\n\n### Tax Implications\nNo direct tax implications for subscription changes. The ₹1,652/mo savings redirected to ELSS would generate **₹5,952/yr in tax savings** under Section 80C. You're currently burning this tax benefit on unused subscriptions.",
        suggestions: ["Downgrade Netflix", "Cancel Cult.fit"],
      },
      "Which card for dining?": {
        response: "For dining, your **HDFC Regalia** is the optimal choice:\n\n**Why Regalia for Dining:**\n• 2X reward points on dining (4 points/₹150)\n• Each point = ₹0.50 → Effective cashback: ~1.3%\n• Access to Swiggy vouchers in SmartBuy\n\n### The \"So What\"\nUsing Regalia for dining earns you 2.6% effective return vs Gold Member's 2% or Amazon's 1%. On your ₹6K/mo dining budget, that's ₹156/mo on Regalia vs ₹60/mo on Amazon — a ₹96/mo difference that adds up to ₹1,152/yr.\n\n### Risk Analysis\n1. **Merchant Coding:** Not all food outlets code as 'Dining.' Swiggy/Zomato sometimes code as 'Technology.' Verify points earned post-purchase.\n2. **Utilization Impact:** Adding dining charges to Regalia (already at 38% utilization) could push it toward 50%. Monitor this.\n\n### Your Choices\n1. **Regalia for all dining (Recommended):** Stack with Zomato Pro for double discounts + Regalia points.\n2. **Split:** Use Regalia for restaurants, Gold for delivery (if Swiggy codes as non-dining).\n\n### Tax Implications\n• Reward points earned are non-taxable. The ₹1,152/yr extra from routing is tax-free income.\n• **Don't use ICICI Amazon Pay** for dining — it only gives 1% cashback (meant for Amazon purchases at 5%).",
        suggestions: ["Best card for each category?"],
      }
    }
  },

  // ── Goal Tracker ──
  "Am I on track for my financial goals? Check my ₹1Cr target, emergency fund, and school fee planning.": {
    response: "**Goal Progress Report:**\n\n**1. ₹1 Crore Target:**\n• Current: ₹75L (75% done!)\n• At 18.4% XIRR + current SIPs: You'll hit ₹1Cr by **Dec 2027**\n• Status: ✅ On track\n\n**2. Emergency Fund (6 months):**\n• Need: ₹2.7L (₹45K × 6)\n• Have: ₹6L in Liquid\n• Status: ✅ Over-funded (8 months covered)\n\n**3. Reyaan's School Fee:**\n• Next due: ₹42K on March 5\n• Account balance: ₹85K\n• Status: ✅ Covered (use Regalia for points)\n\n### The \"So What\"\nAll 3 goals are green — a rare position. However, 'on track' masks two optimizations: your Emergency Fund is **over-funded by ₹90K** (dead capital earning 7% instead of 12%+), and your ₹1Cr timeline can be pulled forward by 4-7 months with minimal effort. Being 'on track' is good; being 'ahead of track' compounds your advantage.\n\n### Risk Analysis\n1. **₹1Cr Goal Assumption Risk:** The 18.4% XIRR assumes sustained bull market conditions. A conservative 14% XIRR pushes the timeline to mid-2028 — adding 6 months.\n2. **Emergency Fund Opportunity Cost:** ₹90K surplus earning 7% instead of 8.5-9% in Short Duration = ₹1,800/yr in lost returns. Small but compounding.\n3. **School Fee Inflation:** If Reyaan's school hikes by 10% annually, next year's fee rises to ₹46K/quarter (₹1.84L/year). This needs its own funding silo.\n\n### Your Choices\n1. **Optimize All 3 (Recommended):** Move ₹90K surplus to Short Duration fund, accelerate ₹1Cr with ₹10K extra SIP, start a ₹16K/mo RD for next year's school fees.\n2. **Focus on ₹1Cr Only:** Add ₹10K SIP to hit ₹1Cr by Aug 2027 (4 months early).\n3. **Maintain Status Quo:** All goals are technically on track. No action needed if you're comfortable with current margins.\n\n### Tax Implications\n• ₹1Cr goal: If invested in equity MFs, final redemption faces LTCG at 12.5% (after ₹1.25L exemption). Plan redemptions across financial years to maximize exemption.\n• Emergency fund surplus redeployment: Liquid → Short Duration is a taxable event, but on ₹90K corpus the gain is ~₹1,200, taxed at slab rate = ~₹400. Negligible.\n• School fee RD: Interest earned is taxable at slab rate but qualifies for TDS exemption if below threshold. The tuition fee itself is deductible under **Section 80C** (up to ₹1.5L/yr for 2 children).",
    suggestions: ["Speed up ₹1Cr goal", "Move extra emergency fund", "Plan next year's fees"],
    followUps: {
      "Speed up ₹1Cr goal": {
        response: "You're projected for Dec 2027. Let's see how to get there faster:\n\n### The \"So What\"\nYou're already 75% of the way to ₹1Cr. Every ₹10K/month added now gets magnified by compounding — the last 25% of the journey is where acceleration has the biggest absolute impact.\n\n### Risk Analysis\n1. **Option 3 Risk:** Deploying bonus AND raising SIP may stretch your monthly cash flow. If an emergency hits, you may need to pause SIPs — which breaks the compounding chain.\n2. **Market Timing:** Lump-sum investing your bonus at current Nifty highs carries short-term drawdown risk (~10-15%). An STP over 3 months mitigates this.\n\n### Your Choices\n**Option 1: Increase SIP by ₹10K/month**\n→ Hits ₹1Cr by **Aug 2027** (4 months early)\n\n**Option 2: Invest March bonus (₹1.5L lump sum)**\n→ Hits ₹1Cr by **Oct 2027** (2 months early)\n\n**Option 3: Both (Recommended)**\n→ Hits ₹1Cr by **May 2027** (7 months early! 🚀)\n\n### Tax Implications\n• Route the extra ₹10K SIP through **ELSS** to simultaneously close your ₹18K Section 80C gap — saving ₹5,580/yr in tax.\n• Bonus lump sum into Parag Parikh Flexi qualifies for LTCG exemption (₹1.25L) if held >12 months — plan exit timing around that threshold.",
        suggestions: ["Go with Option 1", "Do Option 3"],
      },
      "Move extra emergency fund": {
        response: "You have 8 months covered instead of the recommended 6. That's ₹90K sitting idle in a Liquid Fund earning 7%.\n\n### The \"So What\"\nThat extra ₹90K is earning 7% in Liquid when it could earn 8.5-9% in Short Duration Debt — a ₹1,800/yr drag for zero added risk. Over 5 years, that's ₹9,000 in lost compounding on money you don't even need immediate access to.\n\n### Risk Analysis\n1. **Liquidity Trade-off:** Short Duration Funds redeem in T+1 (1 business day) vs Liquid Fund's instant redemption. If you need cash on a Saturday night, you'll wait till Monday. Mitigant: Your salary account has ₹85K as a first-line buffer.\n2. **Credit Risk:** Marginal — stick with AAA-only funds like HDFC Short Term Debt.\n\n### Your Choices\n1. **Move ₹90K to Short Duration Debt (Recommended):** Earn 8.5-9%, still accessible in 1-2 days. Best risk-adjusted return for surplus emergency reserves.\n2. **Keep in Liquid Fund:** Accept lower returns for instant redemption comfort.\n\n### Tax Implications\n• Gains from Liquid and Short Duration Debt funds are taxed at your income tax slab (30% + cess) regardless of holding period. No differential tax treatment between the two.\n• Net after-tax extra earning: ~₹1,260/yr — small but free money.",
        suggestions: ["Move ₹90K now", "Keep it safe in Liquid"],
      },
      "Plan next year's fees": {
        response: "Reyaan's school fee for next academic year (2027-28) will likely be **₹45,000-48,000** per quarter (assuming 10% annual hike).\n\n**Annual total: ~₹1.8L-₹1.92L**\n\n### The \"So What\"\nSchool fees are a non-negotiable expense with a fixed deadline. The risk isn't running short — it's letting fee payments disrupt your investment SIPs. A dedicated sinking fund keeps education costs completely isolated from your wealth-building engine.\n\n### Risk Analysis\n1. **Inflation Risk:** School fees often inflate 8-12% annually. If the hike exceeds 10%, your ₹1.92L RD may fall short by ₹5-10K. Buffer: set RD at ₹17K instead of ₹16K.\n2. **Opportunity Cost:** RD yields only ~7%. An Ultra Short Duration fund yields 7.5-8% but carries marginally more volatility.\n\n### Your Choices\n1. **Monthly RD of ₹16,000 from April (Recommended):** By March 2027 you'll have ₹1.92L + interest. Completely autopilot — no decisions needed.\n2. **Lump sum ₹1.6L in Ultra Short Duration Fund now:** Grows to ~₹1.72L. Requires having ₹1.6L available upfront.\n\n### Tax Implications\n• **RD Interest:** Taxed at your slab rate (30% + cess). On ~₹6K interest, you'll pay ~₹1,872 in tax. TDS is deducted if interest exceeds ₹40K.\n• **Ultra Short Fund:** Also taxed at slab rate. However, you can time redemption in a lower-income year for better tax efficiency.\n• **Section 80C Alert:** If you use a 5-year Tax Saver FD instead, it doubles as an 80C deduction — but locks your money. Not ideal for a 1-year goal.",
        suggestions: ["Start RD of ₹16K", "Lumpsum approach"],
      }
    }
  },

  // ── Legacy context responses (from card clicks) ──
  "My debt allocation is just 12% against a target of 30%. Help me rebalance by moving ₹1.2L from high-risk equity.": {
    response: "**Smart Move.** Markets are at all-time highs.\n\n### The \"So What\"\nYour Debt allocation at 12% vs a 30% target is dangerously low in a frothy market. Moving ₹1.2L from equity to debt isn't just rebalancing — it's insurance. Every 10% market correction costs you ₹12,000 more on this excess equity than it would with proper allocation.\n\n### Risk Analysis\n1. **Timing Risk:** Selling equity at highs feels right, but markets can stay irrational. If Nifty rallies another 15%, you'll feel you sold too early. Mitigant: You're only moving ₹1.2L (a fraction of your ₹45L equity), not timing the market.\n2. **Rebalancing Frequency:** Doing this once isn't enough — set a quarterly review trigger.\n\n### Your Choices\n1. **Execute Plan (Recommended):** Sell ₹1.2L from Parag Parikh Flexi Cap → Invest in Kotak Low Duration Fund. Brings Debt to ~28%.\n2. **Gradual Shift:** Move ₹40K/month over 3 months via STP instead. Slower but smooths entry into debt.\n\n### Tax Implications\n• **Parag Parikh Flexi Cap:** Held >12 months → LTCG regime. Estimated gains on ₹1.2L sale: ~₹36,000. Well within the ₹1.25L annual LTCG exemption → **Tax: ₹0**.\n• **Kotak Low Duration Fund:** Future gains taxed at slab rate (30% + cess) regardless of holding period under new debt fund rules.",
    suggestions: ["Execute switch", "Show me other debt funds", "What about tax?"],
    followUps: {
      "Execute switch": {
        response: "Switch order prepared:\n\n**From:** Parag Parikh Flexi Cap → ₹1,20,000\n**To:** Kotak Low Duration Fund → ₹1,20,000\n\n### The \"So What\"\nThis single switch moves your debt allocation from 12% to 28% — closing 89% of the gap to your 30% target. Your portfolio's downside protection in a market crash improves by approximately ₹18,000 per 10% Nifty correction.\n\n### Risk Analysis\n• **Processing Time:** T+2 days. During this window, your capital is in transit and unallocated. Market movement during processing is marginal on ₹1.2L but worth noting.\n• **NAV Risk:** Sell NAV and Buy NAV are calculated on different days. Net impact: typically <0.1%.\n\n### Your Choices\n1. **Confirm switch now** — I'll process immediately.\n2. **Wait till month-end** — Align with your salary credit for smoother cash flow management.\n\n### Tax Implications\n• **Tax on this switch: ₹0.** Gains (~₹36K) fall under the ₹1.25L LTCG exemption.\n• **New allocation post-switch:**\n  • Equity: 60% (down from 73%)\n  • Debt: 28% (up from 12%)\n  • Gold: 12%\n\nI'll alert you if allocation drifts again beyond ±5%.",
        suggestions: ["Set rebalance alerts", "Thanks!"],
      }
    }
  },

  "I have a big school fee payment of ₹42,000 due on March 5th. Can we check if my salary account has enough float or if I need to liquidate something?": {
    response: "Checked your Salary Account (HDFC).\n\n**Balance:** ₹85,000\n**Avg Monthly Expenses:** ₹45,000\n**Available Float:** ~₹40,000\n\n### The \"So What\"\nYou technically have ₹85K, but after accounting for monthly expenses (₹45K), only ₹40K is truly free. Paying ₹42K from your account leaves just ₹43K — cutting your month-end buffer dangerously thin if any unexpected expense arises.\n\n### Risk Analysis\n1. **Cash Flow Crunch:** Paying ₹42K from salary account leaves only ₹43K for the rest of the month. One unplanned expense (car repair, medical) and you're dipping into your emergency fund.\n2. **Credit Score Impact:** Swiping Regalia keeps utilization at 35% — still in the healthy zone. Above 45% starts hurting your score.\n\n### Your Choices\n1. **Swipe HDFC Regalia (Recommended):** Earn ~420 reward points (worth ₹210), get 45 days interest-free, preserve salary account liquidity.\n2. **Pay from salary account directly:** Saves you the mental overhead of tracking another credit card bill, but tightens cash flow.\n\n### Tax Implications\n• School fees paid via any method qualify for **Section 80C deduction** — up to ₹1.5L per year for tuition fees. Ensure the receipt is in your name.\n• The ₹42K fee payment, combined with your ₹72K EPF + ₹60K ELSS, brings your 80C utilization to ₹1.74L — already over the ₹1.5L cap. So this deduction is fully saturated regardless.",
    suggestions: ["Pay with Regalia", "Transfer from savings instead"],
    followUps: {
      "Pay with Regalia": {
        response: "Great choice! Here's why Regalia wins:\n\n**Rewards earned:** 420 points (worth ₹210)\n**Grace period:** 45 days interest-free\n**Credit utilization:** 35% (still healthy)\n\n### The \"So What\"\nBy using Regalia, you're earning ₹210 in rewards on an expense you'd pay anyway — that's a 0.5% instant return on a mandatory payment. More importantly, your salary account retains ₹85K of liquidity through the month.\n\n### Risk Analysis\n1. **Missed Payment Risk:** If you forget to pay the Regalia bill by April 15, interest kicks in at 3.5%/month (42% annualized) on ₹42K = ₹1,470/month. This instantly destroys the ₹210 reward benefit.\n2. **Utilization Creep:** Adding ₹42K brings your Regalia utilization to ~35%. Still safe, but monitor other charges this month.\n\n### Your Choices\n1. **Set automated reminder for April 12** (3 days before due date) — I'll nudge you.\n2. **Set up auto-debit** from salary account for Regalia — eliminates missed payment risk entirely.\n\n### Tax Implications\n• Credit card rewards are **not taxable** in India — the ₹210 is tax-free income.\n• The tuition fee itself qualifies under Section 80C (already discussed — your 80C is fully utilized).",
        suggestions: ["Set payment reminder", "Thanks!"],
      }
    }
  },

  "Help me understand Section 80CCD(1B) and why investing ₹50K saves me ₹15.6K?": {
    response: "Great question! Section 80CCD(1B) is an *exclusive* deduction for NPS, over and above the ₹1.5L limit of Section 80C.\n\nSince you're in the 30% tax bracket (plus cess):\n\n**The Math:**\n30% of ₹50,000 = ₹15,000\n4% Cess = ₹600\n**Total Tax Saved = ₹15,600**\n\n### The \"So What\"\nThis is a guaranteed 31.2% instant return on day one — no market risk, no waiting. No other financial instrument in India offers a risk-free 31% return. The ₹50K effectively costs you only ₹34,400 after the tax refund.\n\n### Risk Analysis\n1. **Lock-in Period:** NPS locks your money until age 60 (with partial withdrawal allowed after 3 years for specific purposes: home purchase, education, medical). This is a 25-30 year commitment for someone your age.\n2. **Annuity Mandate:** At maturity, 40% of the NPS corpus must be mandatorily converted to an annuity (pension). Current annuity rates are low (5-6%), which dilutes your effective long-term return.\n3. **Scheme Selection Risk:** Choosing the wrong pension fund manager or allocation can underperform. Stick with SBI/HDFC Pension with aggressive equity tilt.\n\n### Your Choices\n1. **Invest ₹50K now via eNPS (Recommended):** 10-minute process, ₹15,600 tax saved, NAV allotted in T+2.\n2. **Split across months:** ₹10K/month as NPS SIP — smoother but you may forget to complete by March 31.\n\n### Tax Implications\n• Section 80CCD(1B) is **over and above** Section 80C's ₹1.5L. Your total eligible deductions become ₹2L (80C) + ₹50K (80CCD1B) = ₹2.5L.\n• At maturity: 60% of corpus is tax-free on withdrawal. The 40% annuity is taxable as income in retirement (likely at a lower slab then).\n• **Double benefit:** If your employer offers NPS, their contribution (up to 10% of basic) gets a separate deduction under 80CCD(2).",
    suggestions: ["Invest ₹50K in NPS now", "Which NPS scheme?", "NPS vs ELSS?"],
  },

  "Analyze my HDFC idle cash. Why is a Liquid Fund better than my savings account?": {
    response: "Your HDFC savings account pays **3-3.5%** interest. Inflation is ~5-6%, so your money is losing purchasing power.\n\nA Liquid Fund yields **7.1-7.3%** by investing in ultra-safe short-term instruments.\n\n### The \"So What\"\nEvery ₹1.3L sitting in your savings account loses ~₹2,600/year in real terms (after inflation). Moving to a Liquid Fund not only stops the bleed but generates an additional ₹4,900/year in returns — a ₹7,500/year swing in your favor.\n\n### Risk Analysis\n1. **Safety:** Liquid Funds invest in Treasury Bills, CPs, and CDs with <91 day maturity. Default risk is near-zero for top-rated funds (HDFC, SBI, ICICI). Far safer than FDs from small finance banks.\n2. **Liquidity:** Instant redemption up to ₹50K via IMPS in 30 minutes. For amounts above ₹50K, T+1 settlement. Slightly slower than a debit card swipe but functionally identical for planned expenses.\n3. **NAV Volatility:** Extremely rare, but a credit event (IL&FS style, 2018) can cause temporary NAV dips of 0.5-1%. Mitigant: Stick with funds that hold only AAA/A1+ rated paper.\n\n### Your Choices\n1. **Move full ₹1.3L to Liquid Fund (Recommended):** Keep ₹20-30K in savings for debit card/ATM needs, sweep the rest.\n2. **Park in Savings + Auto-Sweep FD:** Some banks offer auto-sweep above a threshold into FDs at 6.5-7%. Less return than Liquid Fund but zero effort.\n\n### Tax Implications\n• **Savings Account:** Interest up to ₹10,000/year is exempt under Section 80TTA. Your current interest (~₹4,500) is within this limit — effectively tax-free.\n• **Liquid Fund:** Gains are taxed at your slab rate (30% + cess) regardless of holding period. On ₹7,100 gain, tax = ~₹2,200. Net extra earning vs savings: ~₹2,700/year after tax.\n• **Verdict:** Even after tax drag, Liquid Fund beats savings by ₹2,700/year on ₹1.3L — and this gap widens as your idle cash grows.",
    suggestions: ["Move ₹1.3L to Liquid Fund", "Which Liquid Fund?", "Is it really safe?"],
  },

  "I seem to have overspent on shopping this month (₹5.6k). Can you break down my recent shopping transactions and suggest a cap?": {
    response: "Your shopping breakdown this month:\n\n**Transactions:**\n• Myntra: ₹2,100 (clothing)\n• Amazon: ₹1,800 (electronics cable + home)\n• Nykaa: ₹950 (personal care)\n• Decathlon: ₹750 (sports gear)\n\n**Your 3-month avg:** ₹3,200/month\n**This month:** ₹5,600 (75% over average!)\n\n### The \"So What\"\nYou've spent ₹2,400 more than your 3-month average on shopping alone. Over a year, this ₹2,400/month overshoot compounds to ₹28,800 — enough for nearly an entire year of ELSS SIP that would save ₹8,928 in tax. Shopping overspend isn't just lost money — it's lost tax-advantaged wealth.\n\n### Risk Analysis\n1. **Lifestyle Inflation:** Online shopping has a ratchet effect — this month's splurge becomes next month's baseline. Your Nov→Feb trend shows steady creep: ₹2,800 → ₹3,200 → ₹4,100 → ₹5,600.\n2. **Impulse vs. Planned:** Of the ₹5,600, only Decathlon (₹750) appears pre-planned. The rest are likely impulse or convenience purchases.\n\n### Your Choices\n1. **Set ₹3,500 monthly cap (Recommended):** Gives 10% buffer over your average. Saves ₹25,200/year.\n2. **Implement 48-hour rule:** Add items to cart but wait 48 hours before checkout. Studies show 60% of cart items get abandoned.\n3. **Remove saved cards from apps:** Friction reduces impulse spend by 30-40%.\n\n### Tax Implications\n• The ₹25,200/year saved from capping shopping, if redirected to ELSS, generates a Section 80C deduction saving you ₹7,812 in tax (₹25.2K × 31%). Total annual benefit: ₹25,200 (savings) + ₹7,812 (tax saved) = **₹33,012**.\n• Even routing savings into NPS (80CCD1B) achieves the same 31% tax arbitrage.",
    suggestions: ["Set ₹3,500 cap", "Show me annual shopping trend"],
  },

  "Gold prices corrected by 4%. I currently have 11% exposure (₹0.51L) in SGB. Should I use this dip to increase it to 15%?": {
    response: "Yes! SGB Tranches available on secondary market at discount.\n\n**Target:** 15% allocation = ₹11.25L\n**Current:** ₹9L in SGB\n**To Buy:** ₹2.25L (~35 grams)\n\n### The \"So What\"\nBuying at a 4% dip effectively gives you a head start of ~₹9,000 on ₹2.25L. SGBs also pay 2.5% annual interest on top of gold price appreciation — it's like gold that pays a dividend. At current gold momentum, this allocation increase is well-timed.\n\n### Risk Analysis\n1. **Gold Volatility:** Gold corrected 4% now, but can drop another 8-10% if USD strengthens or rates rise. Your average cost goes up with this purchase.\n2. **Liquidity:** SGBs trade on exchanges but volumes are thin. Selling before maturity means accepting a 1-3% discount to NAV. Lock-in is 5 years (premature exit allowed after 5th year).\n3. **Opportunity Cost:** ₹2.25L in equity (at 18% XIRR) would generate more long-term wealth than gold (historically 10-12%). You're choosing stability over growth.\n\n### Your Choices\n1. **Buy ₹2.25L in SGB now (Recommended):** Locks in the 4% dip + 2.5% annual coupon. Brings gold to target 15%.\n2. **Buy ₹1.1L now, ₹1.1L later:** Average your entry over 2 months. Reduces timing risk if gold corrects further.\n3. **Wait for bigger dip (5-7%):** Risk of gold recovering and missing the current discount entirely.\n\n### Tax Implications\n• **SGB Interest (2.5%):** Taxable at your slab rate. On ₹11.25L, annual interest = ₹28,125 → Tax: ~₹8,730.\n• **Capital Gains at Maturity:** Completely **TAX-FREE** if held till maturity (8 years). This is SGB's killer advantage over Gold ETFs and physical gold.\n• **Secondary Market Purchase:** If you buy from the exchange, LTCG (after 12 months) is taxed at 12.5% with indexation — still favorable but not as good as maturity redemption.\n• **Verdict:** Hold till maturity for maximum tax efficiency. The 2.5% coupon + tax-free gains make SGB the most tax-efficient gold instrument in India.",
    suggestions: ["Buy ₹2.25L in SGB", "Wait for bigger dip", "Why SGB over Gold ETF?"],
  },

  "My portfolio XIRR is 23.4% vs Nifty's 15.2%. Can you breakdown which funds are generating this alpha?": {
    response: "**You have 8.2% Alpha!** Impressive.\n\n**Contributors:**\n1. **Quant Small Cap:** 42% XIRR (High Beta play)\n2. **Parag Parikh Flexi:** 26% XIRR (US Tech rally)\n3. **HDFC Midcap Opps:** 24% XIRR (Domestic growth)\n\n### The \"So What\"\nYour 8.2% alpha means for every ₹1L invested, you're earning ₹8,200 more per year than a passive Nifty investor. On your ₹75L portfolio, that's roughly ₹6.15L in extra annual wealth creation. However, 60%+ of this alpha comes from a single fund (Quant Small Cap) — making your outperformance fragile.\n\n### Risk Analysis\n1. **Alpha Concentration:** Quant Small Cap alone contributes ~5% of your 8.2% alpha. If small caps revert to mean (which happens cyclically), your alpha could collapse to 3-4% overnight.\n2. **Nifty Index Drag:** Your index fund is underperforming at 14% vs Nifty's 15.2%. Consider switching to a lower-expense-ratio index fund.\n3. **Sustainability:** Historically, only ~20% of active funds consistently beat their benchmark over 10 years. Your current alpha streak may not persist.\n\n### Your Choices\n1. **Diversify Alpha Sources:** Trim ₹2L from Quant Small Cap into a Mid-Cap fund (HDFC MidCap is already delivering 24%). This spreads your alpha generation across two engines.\n2. **Lock In Gains:** Book partial profits from Quant and redeploy into a Balanced Advantage fund — lowers beta while preserving returns.\n3. **Ride the Momentum:** Keep current allocation and accept concentrated risk.\n\n### Tax Implications\n• Profit-booking from Quant (held >12 months): LTCG at 12.5% above ₹1.25L exemption. On ₹2L, estimated gains ~₹76K — well within the tax-free threshold → **₹0 tax**.\n• Nifty Index fund at 14%: If held at a loss relative to expectations, no tax benefit (only realized losses can be harvested).\n• **Alpha is pre-tax.** After accounting for LTCG on eventual exit, your net alpha drops to ~6.8%. Still excellent, but plan exits around the ₹1.25L annual exemption.",
    suggestions: ["Should I add more to Quant?", "Is this alpha sustainable?"],
  },

  "The US Fed cut rates by 50bps. How will this specifically impact the US equity portion of my Parag Parikh Flexi Cap fund?": {
    response: "PPFAS holds ~18% in US tech stocks (Alphabet, Microsoft, Meta).\n\n### The \"So What\"\nA 50bps Fed rate cut is the single biggest tailwind for US tech valuations. Lower rates → lower discount rates → higher present value of future cash flows. Your PPFAS US allocation (~₹3.3L) could see a 3-5% uplift from this tailwind alone — that's ₹10K-16.5K in paper gains.\n\n### Risk Analysis\n1. **Currency Headwind:** Fed cuts weaken the USD. If INR strengthens 2-3% vs USD, it offsets half the equity gain when translated back to rupees. Net effect is still positive but muted.\n2. **Already Priced In:** Markets may have front-run this cut. If the Fed signals fewer future cuts, US stocks could sell off despite this cut (classic 'buy the rumor, sell the news').\n3. **Concentration in Big Tech:** PPFAS's US holdings are concentrated in 4-5 mega-cap tech stocks. Sector-specific risk (AI bubble, antitrust regulation) applies.\n\n### Your Choices\n1. **Hold PPFAS (Recommended):** Valuation expansion from rate cuts + strong fundamentals of Alphabet/Microsoft. No action needed — let the thesis play out.\n2. **Add International Exposure:** If you're bullish on the global rate-cut cycle, consider adding ₹50K to a dedicated US/International fund (Motilal Oswal Nasdaq 100) for more direct exposure.\n3. **Hedge Currency Risk:** Not practical at your portfolio size. Accept the INR/USD variance as noise.\n\n### Tax Implications\n• **PPFAS (Indian Mutual Fund):** Even though it holds US stocks, tax treatment follows Indian LTCG rules — 12.5% above ₹1.25L exemption for holdings >12 months.\n• **If you invest directly in US stocks/ETFs:** Different regime — US dividend withholding tax (25%) applies, and Indian LTCG on foreign assets is taxed at slab rate. PPFAS avoids this complexity.\n• **Currency gains** on international funds are automatically bundled into your NAV gain — no separate currency tax calculation needed.",
    suggestions: ["Should I add international exposure?", "What if Fed reverses?"],
  },

  "How can I improve my credit score? It says keeping utilization under 30% helps. Currently at 45%.": {
    response: "Your credit utilization is 45% — that's the #1 thing hurting your score.\n\n### The \"So What\"\nCredit utilization above 30% signals to bureaus that you're cash-strapped, even if you're not. Dropping from 45% to 28% typically adds 15-25 points to your CIBIL score within 30 days. A higher score unlocks better loan rates — on a ₹50L home loan, even a 0.25% rate reduction saves ₹4.5L over 20 years.\n\n### Risk Analysis\n1. **Mid-Cycle Payment Risk:** Paying ₹20K mid-cycle reduces utilization on the *next* statement. If you pay after statement generation, the high utilization has already been reported. Timing matters.\n2. **Limit Increase Risk:** Requesting a limit increase triggers a hard inquiry (temporarily -5 to -10 points). However, the long-term utilization improvement far outweighs this.\n3. **Score Volatility:** Credit scores fluctuate 10-20 points month-to-month from normal activity. Don't panic-react to single-month dips.\n\n### Your Choices\n1. **Pay ₹20K now (Recommended):** Instantly drops utilization to 28%. Simplest, fastest impact.\n2. **Request limit increase on Regalia:** You're eligible for ₹2L (currently ₹1.2L). New utilization = 45% × (1.2/2) = 27%. Same effect, permanent fix.\n3. **Spread spending across cards:** Route small purchases to ICICI Amazon. Distributes utilization across multiple cards (bureaus look at per-card AND aggregate utilization).\n\n### Tax Implications\n• Credit score optimization has no direct tax implications, but the *downstream* benefit is significant.\n• A higher credit score qualifies you for lower home loan rates. On a ₹50L loan, the interest paid (up to ₹2L) is deductible under Section 24(b). A lower rate means more of your EMI goes to principal — building equity faster.\n• **Credit card rewards** earned from strategic card usage are non-taxable.",
    suggestions: ["Request limit increase", "Show my score trend"],
  },

  // ═══════════════════════════════════════════
  // FlipCard Context Flows (Start Full Analysis)
  // ═══════════════════════════════════════════

  // ── Money: Net Worth ──
  "Analyze my full portfolio of ₹75L across equity, debt, and gold. Show me complete breakdown and suggest optimizations.": {
    response: "Here is your complete ₹1.25 Cr Net Worth breakdown.\n\n### The \"So What\"\nYour overall wealth is compounding brilliantly, but success has warped your safe asset allocation. **Equity now makes up 66% (₹49.5L)** of your liquid investments against a target of 60%. Meanwhile, **Debt is starved at 14% (₹10.5L)** vs a target of 25%. \n\n### Risk Analysis\nThe biggest danger in a strong bull market is \"allocation drift.\" Being 6% overweight in equity (₹4.5L surplus) means an unexpected market correction will hit your portfolio significantly harder than your original risk profile was designed to handle.\n\n### Your Choices\n1. **Do Nothing:** Accept an aggressive 66% equity tilt. \n2. **Rebalance (Recommended):** Sell ₹4.5L in equity across your top performering funds and systematically move it to Debt/Fixed Income to hit your 60/40 target spread.\n\n### Tax Implications\nRebalancing requires selling equity. The key is to exclusively sell units held for over 1 year (LTCG). Currently, gains under ₹1.25L per financial year are tax-free under Indian law. We can construct a sell-order that fully absorbs this exemption, executing the rebalance for **₹0 in taxes**.",
    suggestions: ["Fix my equity overweight", "Show fund-wise breakdown", "How to reach ₹2Cr?"],
    cardData: {
      label: 'Portfolio',
      title: 'Equity\nOverweight',
      desc: 'At 66%, your equity allocation is 6% above target. Move ₹4.5L to debt for safer positioning.',
      color: '#4F46E5',
      bg: 'linear-gradient(90deg, #4F46E5, #7C3AED)',
      impact: '66% → 60%',
      cta: 'Rebalance'
    },
    followUps: {
      "Fix my equity overweight": {
        response: "Here is my tactical execution plan to restore your 60% equity target safely.\n\n### The \"So What\"\nBy drawing capital specifically from units with large embedded gains, we are de-risking your portfolio while essentially pulling \"free money\" out of the market right before a potential dip.\n\n### Your Choices (The Moves)\n• **Step 1:** Sell ₹2L from Quant Small Cap (+64% gains — peak profit booking)\n• **Step 2:** Sell ₹2.5L from Parag Parikh Flexi Cap\n• **Step 3:** Invest the total ₹4.5L into **HDFC Short Term Debt Fund**\n\n### Tax Implications\n• Total sale: ₹4.5L\n• Estimated Long Term Capital Gains (LTCG) from the sold units: ~₹1.1L\n• **Annual Exemption Threshold:** ₹1.25L\nBecause your gains are under the limit, this entire rebalance triggers **Zero Tax**.",
        suggestions: ["Execute this plan", "I want to keep Quant Small Cap"],
      },
      "Show fund-wise breakdown": {
        response: "**Fund-wise Net Worth Breakdown:**\n\n🏆 **Parag Parikh Flexi:** ₹18.2L (24.3%) — XIRR 21.7%\n📊 **Quant Small Cap:** ₹12.4L (16.5%) — XIRR 42.1%\n📊 **HDFC MidCap Opp:** ₹8.1L (10.8%) — XIRR 24.3%\n🥇 **SGB 2028 (Gold):** ₹9L (12%) — XIRR 14.2%\n💰 **HDFC Short Debt:** ₹10.5L (14%) — XIRR 7.8%\n🏦 **Liquid Fund:** ₹6L (8%) — XIRR 7.1%\n📉 **Axis Bluechip:** ₹2.1L (2.8%) — XIRR -3%\n📉 **ICICI Pru Value:** ₹3L (4%) — XIRR 4%\n\n### The \"So What\"\nYour top 3 funds (Quant, PPFAS, HDFC MidCap) account for 51.6% of your wealth and deliver stellar returns. But your bottom 2 — **Axis Bluechip (-3%)** and **ICICI Pru Value (4%)** — are dead weight totaling ₹5.1L that's compounding at below-inflation rates. That's ₹5.1L working against you every day.\n\n### Risk Analysis\n1. **Axis Bluechip:** Negative XIRR over your holding period means you've lost money in absolute terms. The fund has consistently underperformed Nifty 50 TRI by 15%+. Continuing to hold is an opportunity cost of ~₹71K/year vs a simple index fund.\n2. **ICICI Pru Value:** At 4% XIRR, it's barely beating a savings account. Value style has underperformed growth in India for 3 consecutive years.\n\n### Your Choices\n1. **Exit Axis Bluechip (₹2.1L) + ICICI Pru Value (₹3L):** Reinvest ₹5.1L into better-performing funds → Boost portfolio XIRR by ~1.5%.\n2. **Exit only Axis Bluechip:** The -3% XIRR is indefensible. Give ICICI Value one more quarter to recover.\n\n### Tax Implications\n• **Axis Bluechip exit:** You're sitting on a capital loss (~₹63K). This loss can be **set off against gains** from other equity fund redemptions, saving you up to ₹7,875 in tax (₹63K × 12.5% LTCG rate).\n• **ICICI Pru Value:** Minimal gains → minimal tax. Likely under ₹5K in LTCG.\n• **Strategy:** Exit Axis first to harvest the loss, then use it to offset gains when you trim Quant or PPFAS later. Tax-loss harvesting at its finest.",
        suggestions: ["Exit Axis Bluechip?", "Add more to Quant?"],
      },
      "How to reach ₹2Cr?": {
        response: "**Path to ₹2 Crore:**\n\nAt your current pace (18.4% XIRR + ₹35K SIP):\n📅 **₹2Cr by: March 2030** (4.5 years)\n\n### The \"So What\"\nYou're on a glide path to ₹2Cr regardless — the question is *when*, not *if*. Every ₹15K/month added now shaves 8 months off the timeline. At your current XIRR, each month saved is worth ~₹3.7L in future value. Small actions now have outsized compounding effects.\n\n### Risk Analysis\n1. **XIRR Sustainability:** 18.4% is exceptional. A more conservative 14% XIRR (closer to long-term averages) pushes the target to mid-2031 — an 18-month delay. Plan for the conservative scenario.\n2. **SIP Consistency:** Missing even 3 months of the ₹15K top-up delays the target by 4 months. Automate via mandate to eliminate human error.\n3. **Market Cycle:** If a bear market hits between 2027-2029, your XIRR could temporarily drop to 10-12%. The key is continuing SIPs through the downturn — that's where maximum wealth gets created.\n\n### Your Choices\n**Option 1: +₹15K SIP (Recommended)** → ₹2Cr by **Oct 2029** (8 months faster)\n**Option 2: Annual bonus ₹2L lump sum** → ₹2Cr by **Dec 2029** (4 months faster)\n**Option 3: Both** → ₹2Cr by **Jun 2029** (12 months faster! 🚀)\n\n### Tax Implications\n• Route the ₹15K SIP increase through ELSS to claim Section 80C deduction. Your current 80C gap is ₹18K, so the first ₹18K/year of extra SIPs generates ₹5,580 in tax savings. Remaining ₹1.62L/year goes into Flexi Cap (no 80C benefit but better liquidity).\n• At ₹2Cr, plan exit strategy around the ₹1.25L annual LTCG exemption. Systematically withdrawing ₹10L/year keeps you below the tax threshold — zero tax on ₹2Cr over 20 years of SWP.",
        suggestions: ["Go with Option 1", "Can I do Option 3?"],
      }
    }
  },

  // ── Money: Portfolio Mix ──
  "Analyze my portfolio allocation across 4 buckets — Liquid ₹6L, Short ₹9L, Medium ₹15L, Long ₹45L. Am I balanced?": {
    response: "Let's review your 4-bucket strategy and identify the gaps.\n\n### The \"So What\"\nBucketing ties your investments to time horizons. Right now, your **Long-term bucket (60%)** is significantly overweight vs a target of 50%, while your **Short-term bucket (12%)** is starved against a target of 20% (gap of ₹6L).\n\n### Risk Analysis\nThis imbalance means your capital isn't properly segmented for liquidity. If the market crashes by 20%, your short-term bucket only has ₹9L to absorb the shock. You might be forced to liquidate your Long-term equity at depressed prices to fund immediate needs within the next 24 months, realizing permanent capital loss.\n\n### Your Choices\n1. **Reallocate Capital:** Move ₹6L from Long-term equity into Short-term debt over the next 3 months to close the gap.\n2. **Hedge via Cashflow:** Keep current allocations but deploy 100% of your upcoming monthly SIPs strictly into Short-term debt for the next year.\n\n### Tax Implications\nIf we reallocate by selling Long-term equity, we must stagger the sales across months. By selling ₹2L per month, we keep the Long Term Capital Gains (LTCG) generated *under* the ₹1.25L tax-free threshold each time.\nResult: **0% Tax Liability.**",
    suggestions: ["Show me the rebalance plan", "What if markets crash?", "Is my liquid enough?"],
    followUps: {
      "Show me the rebalance plan": {
        response: "Here is your tax-optimized, 3-month rotation strategy.\n\n### The \"So What\"\nA staggered rotation prevents you from 'guessing' the market peak. By moving ₹2L per month for 3 months, you're systematically shifting risk while keeping your capital heavily invested.\n\n### Your Choices (The Execution)\n• **Month 1:** Sell ₹2L from Quant Small Cap → Buy **HDFC Short Duration Fund**\n• **Month 2:** Sell ₹2L from PPFAS Flexi → Buy **ICICI Savings Fund**\n• **Month 3:** Sell ₹2L from HDFC MidCap → Buy **SBI Magnum Medium Duration**\n\n### Tax Implications\nAs mentioned, Indian Tax Law allows up to ₹1.25L in tax-free LTCG per year. \n• Month 1 Gain: ~₹60k\n• Month 2 Gain: ~₹40k\n• Month 3 Gain: ~₹70k\nBy spreading this out or ensuring total gains fall under ₹1.25L for the financial year, you completely avoid paying the 12.5% LTCG tax.",
        suggestions: ["Start month 1 now", "What if I delay?"],
      },
      "What if markets crash?": {
        response: "Let's run a severe scenario to stress-test this structure.\n\n### The \"So What\"\nIf the Nifty drops 25% tomorrow, the difference between your current setup and my proposed target setup is nearly ₹3L in protected wealth.\n\n### Risk Analysis\n**Scenario: Nifty drops 25%**\n• **Current Setup (60% Long-term Equity):** Your portfolio drops by ~₹11.2L. Your Short-term buffer of only ₹9L may not cover emergencies, forcing you to sell equity at a 25% loss.\n• **Proposed Setup (50% Long, 20% Short):** Your portfolio drops by only ~₹8.4L. Crucially, your robust ₹15L Short-term buffer completely protects you from needing to touch your equity for at least 18-24 months while the market eventually recovers.\n\n### Your Choices\nThe choice is simply between risking forced liquidation at market bottoms, or building a \"cash moat\" to let your equity compound undisturbed.\n\n### Tax Implications\nNo immediate tax implications on the stress test itself, but remember that selling equity *during* a crash generally registers a Capital Loss that can be harvested. However, the goal of this strategy is avoiding that sale entirely.",
        suggestions: ["Convinced — rebalance now", "Show me historical crashes"],
      }
    }
  },

  // ── Money: Top Gainers ──
  "Show me all my fund returns: Quant Small Cap +64%, HDFC MidCap +41%, PPFAS +28%, SGB +14%. Should I book profits in small caps?": {
    response: "Here is your detailed fund performance report.\n\n### The \"So What\"\nYour overall **portfolio alpha is +8.2%** versus the Nifty, primarily driven by **Quant Small Cap (+64%)** and **HDFC MidCap (+41%)**. While your winners have done incredibly well, underperformers like **Axis Bluechip (-3%)** are creating a steady drag on your overall compounding rate.\n\n### Risk Analysis\nYour heavy reliance on Quant Small Cap means your alpha is highly fragile. At 24% of your portfolio, a routine 15% small-cap correction would wipe out a massive portion of your absolute gains. Conversely, continuing to hold Axis Bluechip represents an opportunity cost, as standard large-cap index funds are outperforming it by 17%.\n\n### Your Choices\n1. **Take No Action:** Let your winners run, but remain highly exposed to small-cap volatility while dragging dead weight in Axis.\n2. **Strategic Reallocation (Recommended):** Trim **₹2L** from Quant Small Cap to lock in those exceptional gains, and execute a full exit from Axis Bluechip (₹2.1L) to stem the bleeding. Reinvest the combined ₹4.1L into a balanced advantage fund to stabilize the portfolio.\n\n### Tax Implications\nIf you execute the Strategic Reallocation:\n• **Quant Small Cap (LTCG):** Selling ₹2L yields ~₹76,000 in gains. Under the ₹1.25L exemption, tax is **₹0**.\n• **Axis Bluechip (STCG/LTCG):** Selling at a -3% loss allows you to harvest those losses to offset any other gains, effectively giving you a future tax credit.\n**Total Tax Impact: ₹0**.",
    suggestions: ["Trim Quant + Exit Axis", "Keep everything, I'm bullish", "What balanced fund?"],
    cardData: {
      label: 'Action Required',
      title: 'Book Quant\nProfits',
      desc: 'Small Cap at 24% is overweight (target 15%). Trim ₹2L at +64% gains before market corrects.',
      color: '#059669',
      bg: 'linear-gradient(90deg, #10B981, #059669)',
      impact: 'Lock ₹7.7L gain',
      cta: 'Trim Now'
    },
    followUps: {
      "Trim Quant + Exit Axis": {
        response: "Here is exactly how the execution plays out.\n\n### The \"So What\"\nBy simultaneously booking profits from your outperformer and harvesting losses from your underperformer, you drastically optimize your risk-return ratio without pulling fresh capital from your bank.\n\n### Your Choices (Execution Plan)\n**Trade 1 — Trim Quant Small Cap:**\n• **Sell:** ₹2,00,000\n\n**Trade 2 — Exit Axis Bluechip:**\n• **Sell:** ₹2,10,000 (full exit)\n\n**Reinvest ₹4.1L Total:**\n• **₹2.5L** → HDFC Balanced Advantage (auto-adjusts equity/debt)\n• **₹1.6L** → ICICI Savings Fund (boosts your short-term emergency bucket)\n\n### Tax Implications\n• **Trade 1:** Your ~₹76,000 LTCG on Quant is entirely covered by the ₹1.25L tax-free threshold. Tax = ₹0.\n• **Trade 2:** Your ~₹6,300 capital loss on Axis Bluechip is categorized as a Long-Term Capital Loss. Under Tax rules, this loss can be carried forward for 8 years to offset future LTCG.\n**Net result:** Safer, more balanced portfolio with zero current tax liability and future tax benefits.",
        suggestions: ["Execute both trades", "Wait for better timing"],
      },
      "What balanced fund?": {
        response: "For your profile, **HDFC Balanced Advantage Fund** is the optimal fit.\n\n### The \"So What\"\nThis fund uses an algorithm to auto-adjust its equity exposure between 30% and 80% based on market valuations. It takes the emotional difficulty out of timing the market.\n\n### Risk Analysis\nCurrently, the Nifty is trading at a PE of 23x (expensive). The fund is already actively reducing its equity exposure to protect downside. If the market corrects, it will systematically buy cheap equity. It acts as an automatic shock-absorber.\n\n### Your Choices\n1. **HDFC Balanced Advantage:** Best for dynamic valuation plays and steady compounding (18.2% CAGR over 3Y).\n2. **ICICI Prudential BAF:** A viable alternative with slightly lower volatility but inherently similar tax structures.\n\n### Tax Implications\nBecause these funds maintain a minimum 65% 'gross equity' exposure (using arbitrage), they are taxed purely as **Equity Mutual Funds** under Indian Law. \n**Your Benefit:** You get debt-like stability during crashes, but you only pay the ultra-low 12.5% LTCG equity tax (after the ₹1.25L exemption) when you eventually sell.",
        suggestions: ["Start ₹2.5L in HDFC BAF", "Compare with ICICI BAF"],
      }
    }
  },

  // ── Money: Life Goals ──
  "Review my 4 life goals: Emergency Fund ₹6L (done), House Down-payment ₹20L (68% at ₹13.6L), Child Education ₹50L (22%), Retirement ₹3Cr (15%). Am I on track?": {
    response: "**Life Goals Health Check:**\n\n✅ **Emergency Fund:** ₹6L — Done! Actually over-funded (8 months vs 6 needed).\n\n🟡 **House Down-payment (₹20L):**\n• Saved: ₹13.6L (68%) | Gap: ₹6.4L\n• SIP ₹18K/mo | Timeline: 2.8 years\n• Status: On track, but tight\n\n🟠 **Child Education (₹50L):**\n• Saved: ₹11L (22%) | Gap: ₹39L\n• SIP ₹12K/mo | Timeline: 14 years\n• ⚠️ SIP needs increase to ₹17K/mo for 12% XIRR target\n\n🔴 **Retirement (₹3Cr):**\n• Saved: ₹45L (15%) | Gap: ₹2.55Cr\n• SIP ₹25K/mo | Timeline: 24 years\n• Status: On track at 14% CAGR assumption\n\n### The \"So What\"\nTwo of your four goals are in the danger zone. Child Education is critically underfunded — your current SIP trajectory falls **₹5L short** of the ₹50L target. House Down-payment will technically cross the line but has zero buffer for market volatility or delays. Only Emergency Fund (over-funded) and Retirement (on track at optimistic assumptions) are comfortable.\n\n### Risk Analysis\n1. **Child Education Shortfall:** At ₹12K/mo SIP, you reach ₹45L — not ₹50L. Tuition inflation at ~10% could push the actual need to ₹60L+, making the gap catastrophic.\n2. **House Timeline Risk:** ₹18K SIP has zero margin. Any SIP pause or market dip pushes the goal past 2029, potentially losing a property deal.\n3. **Retirement Assumption Risk:** 14% CAGR over 24 years assumes perpetual bull markets. A more conservative 11% CAGR leaves a ₹70L gap.\n\n### Your Choices\n1. **Increase Child Education SIP by ₹5K/mo** (₹12K → ₹17K) to close the gap and build a 6% inflation buffer.\n2. **Redirect Emergency Fund surplus** — you have 2 extra months (₹1.5L) sitting idle; deploy into the House goal for instant acceleration.\n3. **Do nothing** and accept the projected shortfalls in the hope that bonus income or market outperformance bridges them.\n\n### Tax Implications\n• SIP increases carry no tax event — they are fresh investments.\n• Redeploying the Emergency Fund surplus: If it's parked in a liquid fund held >3 years, gains are taxed at your slab rate. If <3 years, short-term gains also apply at slab rate. The actual tax on ₹1.5L redeployment is negligible (~₹500-1,000) since gains on liquid funds are minimal.",

    suggestions: ["Fix child education gap", "Accelerate house goal", "Are retirement projections safe?"],
    followUps: {
      "Fix child education gap": {
        response: "Your child education SIP needs a **₹5K/mo boost** (₹12K → ₹17K/mo).\n\n**Why ₹17K?**\nAt 12% XIRR over 14 years:\n• ₹12K/mo → ₹45L (₹5L short of ₹50L target)\n• ₹17K/mo → ₹53L (₹3L buffer for tuition inflation)\n\n### The \"So What\"\nA ₹5K/mo gap today becomes a **₹5L+ shortfall** at the finish line. Tuition inflation compounds mercilessly — every month you delay costs you ₹3,200 in future value. The math is non-negotiable: the SIP must be ₹17K.\n\n### Risk Analysis\n1. **Inflation Risk:** Education costs inflate 8-10% annually. If IIMs or top colleges are the target, ₹50L may itself be conservative by 2039.\n2. **Execution Risk:** Finding ₹5K/mo from discretionary cuts requires sustained discipline. History shows lifestyle spending tends to creep back within 3-6 months.\n\n### Your Choices\n**Where to find ₹5K/mo:**\n1. **Cut Zomato by ₹2K** (from ₹8.4K → ₹6.4K)\n2. **Downgrade Netflix** (₹649 → ₹199 = ₹450 saved)\n3. **Move iCloud 200GB to 50GB** (₹74 saved)\n4. **Remaining ₹2.5K** from bonus allocation\n\nAlternatively, deploy your annual bonus (₹1.5L lump sum) into the education fund and keep SIP at ₹14K/mo instead — a less painful path.\n\n### Tax Implications\n• Increasing SIP is a fresh investment — zero tax event.\n• If routed into an equity mutual fund (recommended for 14-year horizon), eventual redemption qualifies for LTCG at 12.5% after ₹1.25L exemption. At ₹53L corpus, expected tax-free growth is substantial.\n• **Section 80C:** If you choose ELSS for this SIP, you also save ₹46,800/yr in tax (at 30% slab on ₹1.5L deduction).",

        suggestions: ["Set up ₹17K SIP now", "I can't cut Zomato"],
      },
      "Accelerate house goal": {
        response: "Your house goal needs ₹6.4L more over 2.8 years.\n\n**Current path:** ₹18K SIP reaches ₹20L by March 2029. Tight — no margin for error.\n\n### The \"So What\"\nAt ₹18K/mo, you arrive at ₹20L with zero buffer. Any market hiccup, missed SIP, or property price increase wipes out the timeline. For a goal this close and this illiquid, you need a safety margin of at least 3-6 months.\n\n### Risk Analysis\n1. **Sequence Risk:** If your debt fund dips even 2% in the final year, the corpus falls short by ₹40K+.\n2. **Property Price Inflation:** Real estate in your target area is appreciating ~5% annually. Every 6-month delay adds ₹50K-1L to the required down-payment.\n3. **Asset Class Risk:** If the SIP is in equity (not debt), a 20% crash at month 30 is devastating — never put 2-3 year goals in equity.\n\n### Your Choices\n**Option 1: Bump SIP to ₹23K (+₹5K)**\n→ ₹20L by **Oct 2028** (6 months early)\n\n**Option 2: Deploy March bonus (₹1.5L lump sum)**\n→ ₹20L by **Dec 2028** (4 months early)\n\n**Option 3: Both (Recommended)**\n→ ₹20L by **Jul 2028** (9 months early = more negotiating power!)\n\n### Tax Implications\n• SIP in Ultra Short/Short Duration debt funds: Gains taxed at your slab rate regardless of holding period (post April 2023 rules for debt funds).\n• On a ₹6.4L accumulation with ~8% return, expected gains are ~₹50K. Tax at 30% slab = ₹15,000 — a small price for securing your home.\n• **Pro tip:** If you have headroom in Section 80C, use PPF for a portion — completely tax-free returns, though locked for 15 years (partial withdrawal after 7).",

        suggestions: ["Go with Option 3", "Keep it as is"],
      }
    }
  },

  // ── Spend: February Outflow ──
  "I've spent ₹27.4k this month out of my ₹45k budget. Travel is my biggest category at ₹9.6k. Help me stay on track for the rest of the month.": {
    response: "**February Budget Status: 61% used**\n\nYou've spent ₹27.4K out of ₹45K with 26 days remaining.\n\n**Category Breakdown:**\n✈️ Travel: ₹9.6K (35%) — This is the spike\n🍔 Food & Dining: ₹6.2K (23%) — ⚠️ Over usual by ₹1.4K\n🛍️ Shopping: ₹5.6K (20%) — ⚠️ Myntra spree\n🚗 Transport: ₹3.2K (12%)\n📱 Subscriptions: ₹2.8K (10%)\n\n### The \"So What\"\nAt 61% spent with 85% of the month left, you're on a trajectory to **blow past ₹45K by ₹8-10K** if spending continues at this rate. The ₹9.5K overspend vs your 3-month average is 100% discretionary — meaning it was entirely avoidable and eats directly into your SIP capacity.\n\n### Risk Analysis\n1. **Budget Blowout Risk:** At current burn, projected month-end spend is ₹53K (₹8K over budget). This directly reduces your investable surplus.\n2. **Habit Formation Risk:** Two consecutive overspend months create a new baseline. Your brain normalizes ₹53K as the \"real\" budget.\n3. **SIP Cannibalization:** Every ₹5K overspent is ₹5K NOT going into your Child Education SIP gap — which is already ₹5K/mo short.\n\n### Your Choices\n1. **Hard Freeze (Recommended):** Freeze all discretionary spending (shopping, dining out) for the remaining 26 days. Safe-to-spend becomes **₹677/day** for essentials only. Projected finish: ₹35K (₹10K under budget).\n2. **Soft Cap:** Allow ₹2K in controlled dining but cut shopping to zero. Projected finish: ₹40K (on budget).\n3. **Do Nothing:** Accept ₹53K spend and pull from savings to cover the gap.\n\n### Tax Implications\nNo direct tax event from spending decisions. However, the **indirect tax impact** is significant: if you redirect the ₹10K surplus (from hard freeze) into an ELSS SIP, you save ₹3,000 in taxes annually under Section 80C at the 30% slab. Your overspending is literally costing you tax benefits.",
    suggestions: ["Set daily spending alerts", "Break down my food costs", "Can I afford one dinner out?"],
    cardData: {
      label: 'Budget',
      title: 'Stay Under\n₹45K',
      desc: '₹17.6K remaining for 26 days. Cap daily spend at ₹677. Freeze shopping to finish strong.',
      color: '#F97316',
      bg: 'linear-gradient(90deg, #F97316, #EA580C)',
      impact: '₹677/day limit',
      cta: 'Set Alerts'
    },
    followUps: {
      "Set daily spending alerts": {
        response: "Setting up a **smart spending guardrail** system for you:\n\n**Daily Alerts:**\n• ₹500+ spend → Yellow nudge\n• ₹1,000+ in a day → Red alert with category\n• Weekly summary every Sunday at 9 AM\n\n**Category Caps (for rest of Feb):**\n• Food: ₹150/day (₹3.9K remaining)\n• Transport: ₹100/day (₹2.6K remaining)\n• Shopping: **₹0** (already overspent)\n• Subscriptions: Auto-pay only\n\n### The \"So What\"\nBehavioral finance research shows that **real-time spending alerts reduce discretionary spending by 15-20%**. Without them, your brain treats each swipe in isolation. With them, you see the cumulative damage in real-time — which triggers the pain of paying.\n\n### Risk Analysis\n1. **Alert Fatigue:** If caps are too tight, you'll start ignoring notifications within a week. The ₹150/day food cap is aggressive — it allows only home cooking and basic meals.\n2. **False Savings:** Alerts alone don't save money; they require follow-through. 40% of users disable alerts within 2 weeks.\n\n### Your Choices\n1. **Full Lock Mode (Recommended):** Activate all alerts + hard caps. I'll also flag if projected month-end total crosses ₹40K, giving you 5 days to course-correct.\n2. **Soft Nudge Mode:** Alerts only, no hard caps. Better for habit building but slower impact.\n\n### Tax Implications\nNo direct tax implications for setting alerts. However, consistently saving ₹5K/mo through better discipline can be routed into ELSS for a **₹18,000/yr tax saving** (at 30% slab on ₹60K annual ELSS investment).",
        suggestions: ["Activate all alerts", "₹150 for food is too tight"],
      },
      "Break down my food costs": {
        response: "Your **₹6.2K Food & Dining** breakdown:\n\n🍔 **Zomato/Swiggy:** ₹3,800 (61%) — Avg ₹380/order, 10 orders\n☕ **Starbucks & cafés:** ₹1,200 (19%) — 4 visits\n🍕 **Dining out:** ₹800 (13%) — 2 restaurant visits\n🥤 **Quick bites:** ₹400 (7%) — Street food, snacks\n\n**Vs your 3-month average:** ₹4,800/mo\n**This month:** ₹6,200 (+29% over average)\n\n### The \"So What\"\nYour Zomato orders alone doubled from 5 to 10 this month, adding ₹1,900 in pure incremental spend. At an annual run-rate, this single habit costs you **₹22,800/yr extra** — enough to fund an entire month of your Child Education SIP gap.\n\n### Risk Analysis\n1. **Lifestyle Creep:** Food delivery is the #1 silent budget killer. The convenience premium (delivery fee + markup) means you're paying 40-60% more than home cooking for equivalent meals.\n2. **Compounding Opportunity Cost:** That ₹1,400/mo overspend, if invested at 12% for 14 years, becomes **₹6.2L** — a meaningful chunk of Reyaan's education fund.\n\n### Your Choices\n1. **Hard Cap Zomato at 5 orders/mo** (your historical average). Savings: ₹1,900/mo.\n2. **Switch to Swiggy One** (₹149/mo for free delivery) + cook 4 days/week. Net savings: ₹1,200/mo.\n3. **Meal prep Sundays:** Batch cook for the week. Cuts both Zomato and dining out by 50%.\n\n### Tax Implications\nNo direct tax implications on food spending. The **opportunity cost** is the tax angle: redirecting ₹1,900/mo into ELSS saves ₹6,840/yr in tax (₹22,800 × 30% slab). You are literally eating your tax savings.",
        suggestions: ["Set Zomato weekly cap", "How much can I save annually?"],
      }
    }
  },

  // ── Spend: Credit Cards ──
  "I have 3 credit cards — HDFC Regalia (₹45k used), ICICI Amazon (₹12.1k used), Gold Member (₹24.75k used). Help me optimize which card to use for what.": {
    response: "**Your Card Optimization Guide:**\n\n💳 **HDFC Regalia** (₹45K/₹1.2L used — 38%):\n• 🏆 Best for: Dining & Travel (4x points = ~2.6% cashback)\n• ✈️ Lounge access: 8 domestic + 2 international\n• Tip: Route ALL dining & travel here\n\n💳 **ICICI Amazon** (₹12.1K/₹80K — 15%):\n• 🏆 Best for: Amazon orders (5% cashback) & online shopping (2%)\n• Tip: All online purchases should go here\n\n💳 **Gold Member** (₹24.75K/₹2L — 12%):\n• 🏆 Best for: Everything else (2% flat cashback)\n• Tip: Groceries, fuel, utilities, insurance\n\n### The \"So What\"\nYou're leaving **~₹200/mo (₹2,400/yr)** on the table by using the wrong cards for the wrong categories. Most of the leakage comes from swiping Gold Member for dining (where Regalia earns 4x more) and Regalia for online shopping (where Amazon card earns 2-3x more). Fixed routing alone boosts annual rewards from ₹20,400 to ₹25,200.\n\n### Risk Analysis\n1. **Utilization Ratio:** Your combined utilization is 20% — perfectly healthy for credit score (ideal is <30%). No action needed here.\n2. **Regalia Concentration:** 38% utilization on Regalia alone is slightly elevated. If it crosses 50%, it can drag your CIBIL score down by 10-20 points.\n3. **Annual Fee Trap:** Regalia charges ₹2,500/yr (waived at ₹3L spend). You're at ₹45K this month — on pace to hit ₹5.4L annually, so the waiver is safe.\n\n### Your Choices\n1. **Implement Fixed Card Routing (Recommended):** Dining/Travel → Regalia, Online → Amazon, Everything else → Gold. Instant ₹4,800/yr boost.\n2. **Consolidate to 2 Cards:** Close Gold and use Regalia as default — but this sacrifices 2% flat cashback on groceries/fuel.\n3. **Keep Current Habits:** Accept ₹2,400/yr in lost rewards.\n\n### Tax Implications\n• Credit card cashback and reward points are **not taxable** in India — they are classified as discounts, not income.\n• However, if you redeem points as gift vouchers and encash them, amounts exceeding ₹50,000 in a financial year could attract taxation under 'Income from Other Sources.'\n• Your current annual rewards (₹20-25K) are well within the safe zone.",
    suggestions: ["Show me monthly rewards earned", "Should I close any card?", "Best card for groceries?"],
    followUps: {
      "Show me monthly rewards earned": {
        response: "**Monthly Rewards Breakdown:**\n\n💳 **Regalia:** 1,200 points (₹600 value)\n→ Dining: 800 pts | Travel: 400 pts\n\n💳 **Amazon:** ₹605 cashback\n→ Amazon: ₹480 | Online: ₹125\n\n💳 **Gold:** ₹495 cashback\n→ Groceries: ₹200 | Fuel: ₹160 | Others: ₹135\n\n**Total monthly rewards: ₹1,700**\n**Annual value: ₹20,400**\n\n### The \"So What\"\nYou're earning ₹1,700/mo passively, but optimized routing pushes this to **₹2,100/mo (₹25,200/yr)** — a ₹4,800 annual uplift with zero additional spending. The gap comes from misrouted dining (on Gold instead of Regalia) and online shopping (on Regalia instead of Amazon).\n\n### Risk Analysis\n1. **Point Devaluation:** HDFC periodically devalues reward points (last devaluation: 2023, reduced value by ~15%). Your 1,200 Regalia points may be worth less next year.\n2. **Cashback vs Points:** Amazon and Gold give direct cashback (guaranteed value). Regalia gives points (variable value depending on redemption method).\n\n### Your Choices\n1. **Optimize card routing** to earn ₹2,100/mo (+₹400). The ₹400/mo boost comes mainly from routing dining to Regalia and online shopping to Amazon.\n2. **Redeem Regalia points immediately** before any potential devaluation — convert to Amazon vouchers at 1:0.50 ratio.\n3. **Stack offers:** Swiggy + Regalia dining = double dip on rewards.\n\n### Tax Implications\n• Cashback rewards are **not taxable income** — treated as discount on purchase price.\n• Reward points redeemed as vouchers or cash equivalent remain non-taxable up to ₹50K/yr. Your ₹20-25K/yr is well within safe limits.\n• **No TDS** applies on credit card reward redemptions.",
        suggestions: ["Optimize automatically", "How do points work?"],
      },
      "Should I close any card?": {
        response: "**Keep vs Close Analysis:**\n\n✅ **HDFC Regalia — KEEP**\n• Annual fee: ₹2,500 (waived at ₹3L spend)\n• Value delivered: ₹7,200/yr in points + lounges\n• ROI: 2.9x the fee\n\n✅ **ICICI Amazon — KEEP**\n• Annual fee: ₹0 (lifetime free!)\n• Value: ₹7,260/yr on Amazon alone\n• No-brainer keeper\n\n🤔 **Gold Member — REVIEW**\n• Annual fee: ₹1,000\n• Value: ₹5,940/yr cashback\n• ROI: 5.9x — actually great value!\n\n### The \"So What\"\nAll 3 cards earn more than their fees. Combined, they deliver **₹20,400/yr** in rewards against **₹3,500/yr** in total fees — a 5.8x return. Closing any card destroys value, not creates it.\n\n### Risk Analysis\n1. **Credit Limit Reduction:** Closing Gold Member removes ₹2L from your total credit limit, pushing combined utilization from 20% to 28%. This dents your CIBIL score by 15-20 points.\n2. **Average Account Age:** Closing your oldest card shortens credit history length — a key CIBIL factor. If Gold is your oldest card, never close it.\n3. **Fee Escalation:** Banks can raise annual fees. If Gold's fee rises to ₹2,000+, the ROI drops below 3x and closure becomes rational.\n\n### Your Choices\n1. **Keep All 3 (Recommended):** Combined value outweighs combined cost by 5.8x. No action needed.\n2. **Negotiate Fee Waivers:** Call HDFC and request Regalia fee waiver (cite ₹5L+ annual spend). Success rate: ~70%.\n3. **Close Gold (Only if):** You can route all offline spending through Regalia at 1% — but you'd lose the 2% flat cashback on groceries/fuel.\n\n### Tax Implications\n• Closing a credit card has **zero tax implications** — it's not a financial asset.\n• However, outstanding reward points at closure are forfeited. Redeem all Gold Member cashback before any closure decision.\n• Annual fees paid on cards used for business expenses can be claimed as a **business deduction** if you have freelance/consulting income.",
        suggestions: ["Good, I'll keep all", "Can I negotiate fee waivers?"],
      }
    }
  },

  // ── Spend: Upcoming Expenses ──
  "I have ₹2.8L in expenses coming up over 90 days: School fee ₹42k (funded), Insurance ₹28k (₹11k short), Summer trip ₹1.2L (budgeted), Car service ₹15k (not planned). Help me plan.": {
    response: "**90-Day Expense Plan:**\n\n✅ **School Fee — ₹42,000** (Mar 5)\nSource: RD auto-pay. Fully funded.\n\n⚠️ **Insurance Premium — ₹28,000** (Mar 20)\nAvailable: ₹17K | Gap: **₹11K**\nFix: Transfer ₹11K from salary a/c by Mar 15\n\n✅ **Summer Trip — ₹1,20,000** (May 15)\nFlights booked. Hotel ₹45K pending but budgeted in travel fund.\n\n🔴 **Car Service — ₹15,000** (April)\nNo funding plan. Set aside from March salary.\n\n### The \"So What\"\nYour total upcoming obligation is ₹2.8L, of which **₹26,000 is unfunded** (₹11K insurance + ₹15K car). This is a relatively small gap — but if unaddressed, it forces you to either break SIPs or dip into your emergency fund, both of which create cascading damage to your long-term goals.\n\n### Risk Analysis\n1. **Insurance Lapse Risk:** If you miss the Mar 20 premium, your policy lapses. Reinstatement requires medical re-underwriting and potentially higher premiums. This is the highest-priority gap.\n2. **SIP Disruption Risk:** If you pull ₹26K from your monthly budget without a plan, March SIPs (₹35K) will likely be paused — breaking your 6-month SIP streak and costing you 200 reward points.\n3. **Emergency Fund Drain:** Using your emergency fund for planned expenses defeats its purpose and leaves you exposed to actual emergencies.\n\n### Your Choices\n1. **Targeted Transfers (Recommended):** Move ₹11K from savings → salary a/c by Mar 15 (insurance), and set aside ₹15K from March salary for car service. Both fit within your ₹17.6K February budget surplus.\n2. **Defer Car Service:** Push car service to May (after summer trip) and spread the cost. Risk: delayed maintenance may cause higher repair costs.\n3. **Micro-liquidate:** Sell ₹26K from your liquid fund — minimal impact on NAV and instant settlement.\n\n### Tax Implications\n• **Insurance Premium:** If this is a term/health insurance policy, premiums up to ₹25,000 are deductible under **Section 80D** (or ₹50K if for senior citizen parents). Your ₹28K premium likely qualifies for full deduction — saving you **₹8,400** in tax at the 30% slab.\n• **Liquid Fund Redemption:** If held <3 years, gains are taxed at slab rate. On ₹26K, the gain component is negligible (₹200-400) — effectively zero tax impact.\n• **School Fees:** Tuition portion (up to ₹1.5L/yr for 2 children) is deductible under **Section 80C**. Verify your ₹42K qualifies.",
    suggestions: ["Set up the transfers", "Can SIPs cover this?", "What about the hotel payment?"],
    followUps: {
      "Set up the transfers": {
        response: "Here's the **funding waterfall** to set up:\n\n**Transfer 1 — Insurance gap (urgent):**\n📅 Date: March 10 (5 days before policy payment)\n💸 From: HDFC Savings → Salary A/c\n💰 Amount: ₹11,000\n⏰ Set reminder: March 8\n\n**Transfer 2 — Car service fund:**\n📅 Date: March 7 (after salary credit)\n💸 From: March salary → Sweep to RD\n💰 Amount: ₹15,000\n⏰ Auto-sweep: Set ₹15K sweep rule\n\n### The \"So What\"\nBy setting up these two transfers proactively, you prevent both an insurance lapse and a SIP disruption. The total ₹26K gap is fully covered by March salary (₹85K) without touching your emergency fund or pausing any investments.\n\n### Risk Analysis\n1. **Timing Risk:** If salary is delayed past March 7, the car service transfer fails. Maintain at least ₹15K buffer in salary account as insurance.\n2. **Cascade Risk:** If you don't execute Transfer 1 by March 15, the insurance auto-debit will bounce, triggering a lapse. Set the March 8 reminder as a hard deadline.\n\n### Your Choices\n1. **Execute Both Transfers (Recommended):** Net impact on March budget: Salary ₹85K − SIP ₹35K − Car ₹15K = ₹35K remaining (enough for monthly expenses).\n2. **Execute Only Transfer 1:** Cover the insurance gap now, defer car to April. Less budget pressure in March but risks higher repair costs.\n\n### Tax Implications\n• Moving money between your own accounts (savings → salary) has **zero tax implications**.\n• The RD sweep for car service earns interest taxable at your slab rate, but on ₹15K for 1 month, the interest is ~₹75 — negligible.\n• Reminder: Ensure the insurance premium qualifies for **Section 80D** deduction (₹28K @ 30% slab = ₹8,400 tax saved).",
        suggestions: ["Set both reminders", "Will March be tight?"],
      }
    }
  },

  // ── Rewards: Gold Status ──
  "I'm a Gold member with 1,850 points, 150 away from Platinum. What's the fastest way to reach Platinum and what benefits do I unlock?": {
    response: "**Platinum is within reach!** You need just 150 more points.\n\n**Fastest paths (ranked):**\n\n🥇 **Complete challenges: +700 pts** (2-4 weeks)\n• No Spend Week: 2 more days → 500 pts\n• SIP Streak: Keep auto-SIP → 200 pts (next month)\n• Credit Builder: Pay card early → Score boost\n\n🥈 **Spending: ~₹15K on Gold card** (2% = 150 pts)\n\n🥉 **Referral: Refer 1 friend → +300 pts**\n\n**Platinum Benefits (₹13,500/yr value):**\n\n| Perk | Value |\n|------|-------|\n| 2% Flat Cashback | ~₹6,000/yr |\n| 8 Lounge Visits | ₹4,000/yr |\n| ₹5,000 Amazon Voucher | ₹5,000 (one-time) |\n| Annual Fee Waiver | ₹2,500/yr |\n| AI Priority Concierge | 24/7 access |\n\n### The \"So What\"\nPlatinum status delivers **₹13,500/yr in tangible value** vs Gold's ₹4,000/yr — a 3.4x upgrade for being just 150 points away. The No Spend Week challenge alone gives you 500 pts (3x what you need), making this the easiest high-value upgrade available.\n\n### Risk Analysis\n1. **Spending-to-earn Trap:** Path 3 (spend ₹15K) is counterproductive — you'd spend ₹15K to earn ₹150 in value. Never spend to earn rewards.\n2. **Status Maintenance:** Platinum likely requires annual re-qualification. If you miss challenges next year, you drop back to Gold and lose the 2% cashback.\n3. **Behavioral Risk:** The No Spend Week is 71% done. A single impulse purchase in the next 48 hours resets the challenge entirely.\n\n### Your Choices\n1. **Complete No Spend Week (Recommended):** 2 days of discipline = 500 pts. You overshoot Platinum by 350 pts, building a buffer.\n2. **Referral + Challenges:** Refer a friend (+300) while finishing challenges. Slowest but safest.\n3. **Passive Spending:** Let normal Gold card usage accumulate 150 pts over ~2 weeks. No effort but delayed reward.\n\n### Tax Implications\n• Reward points and tier benefits are **not taxable** — they are loyalty rewards, not income.\n• The ₹5,000 Amazon voucher at Platinum: if received as a one-time welcome benefit, it's treated as a discount/reward and is non-taxable.\n• Lounge access benefits have no tax implications as they are in-kind perks, not cash equivalents.",
    suggestions: ["Help me finish No Spend Week", "Is referral worth it?", "Compare Gold vs Platinum"],
    followUps: {
      "Help me finish No Spend Week": {
        response: "You're on **Day 5 of 7** — just 2 more days! Here's your survival plan:\n\n**Day 6 (Tomorrow):**\n☀️ Morning: Home-brewed coffee (skip Starbucks)\n🍱 Lunch: Pack from home or use office cafeteria\n🚶 Transport: WFH or walk (no Uber)\n🎬 Evening: Netflix (already paid) or free YouTube\n🍳 Dinner: Cook pasta/dal — use pantry ingredients\n\n**Day 7 (Day after):**\nRepeat Day 6! You've got this.\n\n### The \"So What\"\nTwo days of zero discretionary spend earns you **500 points** — worth more than ₹250 in direct rewards and unlocking Platinum's ₹13,500/yr benefit package. The ROI on 48 hours of discipline is extraordinary: you're effectively earning ₹6,750/day in annual benefit value.\n\n### Risk Analysis\n1. **Impulse Triggers:** Swiggy/Zomato notifications are the #1 killer of No Spend challenges. A single ₹200 coffee order resets the entire 7-day streak.\n2. **Social Pressure:** If friends suggest dinner out, you'll need to decline or suggest a free alternative. Have an excuse ready.\n3. **Subscription Traps:** Auto-renewal of an app or subscription counts as spend. Check that no auto-debits are scheduled for the next 48 hours.\n\n### Your Choices\n1. **Full Lockdown (Recommended):** Delete Swiggy/Zomato from home screen, avoid malls and Amazon. Use only pantry ingredients. Reward: 500 points → 2,350 total (Platinum + 350 buffer!).\n2. **Partial Discipline:** Allow only essential transport (auto/metro). Riskier but more realistic if you have office commute.\n\n### Tax Implications\nNo tax implications for spending discipline. However, the **saved money** (estimated ₹1,500-2,000 over 2 days of zero discretionary spend) can be redirected into investments. If routed to ELSS, it provides a micro tax benefit of ~₹500/yr.",
        suggestions: ["I slipped up, what now?", "What if I only make Day 6?"],
      },
      "Compare Gold vs Platinum": {
        response: "**Gold vs Platinum — Side by Side:**\n\n| Feature | Gold (Current) | Platinum |\n|---------|---------------|----------|\n| Cashback | 1% | **2%** |\n| Lounge | 4 domestic | **8 domestic + 2 intl** |\n| Fee | ₹1,000/yr | **Waived** |\n| Voucher | — | **₹5,000 Amazon** |\n| AI Concierge | Standard | **Priority 24/7** |\n| Insurance | ₹2L travel | **₹5L travel** |\n\n### The \"So What\"\nPlatinum delivers **₹13,500/yr** in tangible value vs Gold's **₹4,000/yr** — a 3.4x improvement. The fee waiver alone saves ₹1,000/yr, and the cashback doubling (1% → 2%) on your current spend generates an extra ₹6,000/yr automatically.\n\n### Risk Analysis\n1. **Requalification Risk:** If Platinum requires annual point thresholds, you must maintain spending/challenge activity. Dropping back to Gold loses ₹9,500/yr in benefits.\n2. **Insurance Gap:** The ₹2L → ₹5L travel insurance bump is meaningful but may overlap with your existing travel policy. Verify coverage before relying on it.\n\n### Your Choices\n1. **Sprint to Platinum (Recommended):** Finish No Spend Week (2 days, +500 pts). Instant qualification with 350-pt buffer.\n2. **Organic Upgrade:** Let normal spending accumulate 150 pts over ~2 weeks. Slower but requires zero effort.\n\n### Tax Implications\n• Tier upgrades and associated benefits (cashback, vouchers, lounges) are **non-taxable loyalty rewards**.\n• The enhanced 2% cashback at Platinum on your projected ₹3L+ annual spend generates ~₹6,000/yr in rewards — all tax-free.\n• Fee waiver saves ₹1,000 but this isn't a deductible expense unless the card is used for business purposes.",
        suggestions: ["I'm convinced, how to get there?", "What's above Platinum?"],
      }
    }
  },

  // ── Rewards: Challenges ──
  "I have 3 active challenges: No Spend Week (5/7 done), Credit Builder (pay early), and SIP Streak (6/12 months). Help me complete them all for 700 bonus points.": {
    response: "**Challenge Completion Plan — 700 pts:**\n\n**1. No Spend Week ⏰ 2 days left → 500 pts**\nYou're 71% done! This is your quickest win.\n• Avoid ALL discretionary spend for 48 more hours\n• Meal prep tonight for both days\n• Delete Swiggy/Zomato from home screen\n\n**2. Credit Builder 💳 → Score +20 pts**\nPay your HDFC Regalia ₹45K bill by March 1 (10+ days before the Mar 11 due date).\n• Improves credit utilization score\n• Sets a positive payment history signal\n\n**3. SIP Streak 📈 6/12 → 200 pts**\nKeep your March SIP on auto-debit. Just don't pause it!\n• 6 more months of unbroken SIPs\n• Tip: Ensure salary a/c balance > ₹35K on SIP date\n\n### The \"So What\"\nCompleting all 3 challenges earns 700 pts, putting you at **2,550** (Platinum + 550 buffer). But beyond points, each challenge reinforces a financial habit: spending discipline (No Spend), credit management (Credit Builder), and investment consistency (SIP Streak). The points are a bonus — the real payoff is the behavioral change.\n\n### Risk Analysis\n1. **No Spend Week (Highest Risk):** One impulse purchase kills 500 pts. The next 48 hours are critical.\n2. **Credit Builder (Medium Risk):** Requires ₹45K cash ready on March 1. If salary is late, you miss the 10-day window.\n3. **SIP Streak (Lowest Risk):** Auto-debit handles this. Only risk: insufficient balance on SIP date. Keep >₹35K buffer.\n\n### Your Choices\n1. **Priority Sequence (Recommended):** No Spend Week first (2 days, 500 pts) → Credit Builder second (pay Regalia on March 1) → SIP Streak automatically continues. Total: 700+ pts.\n2. **Cherry-pick:** Focus only on No Spend Week (500 pts alone qualifies you for Platinum).\n3. **Defer Credit Builder:** If ₹45K on March 1 is tight, pay Regalia on March 5 instead — you still get 5 days early, which may still qualify.\n\n### Tax Implications\n• Reward points earned from challenges are **non-taxable** loyalty benefits.\n• **Credit Builder benefit:** Paying Regalia early reduces utilization from 38% → 0%. A higher CIBIL score (750+) can qualify you for lower home loan interest rates — saving potentially **₹2-5L** over a 20-year mortgage. This is the single biggest indirect financial benefit.\n• SIP Streak: Unbroken SIPs in ELSS continue accumulating **Section 80C** benefits (₹46,800/yr at 30% slab).",
    suggestions: ["Help me win No Spend Week", "When to pay Regalia?", "What if I miss one SIP?"],
    followUps: {
      "When to pay Regalia?": {
        response: "**Optimal Regalia Payment Schedule:**\n\nBill generated: ~March 1\nDue date: March 11\n**Pay by: March 1** (as soon as bill hits)\n\n**Why pay immediately?**\n1. ✅ Credit Builder challenge: Needs 10+ days before due date\n2. ✅ Credit score impact: Utilization drops from 38% → 0% on Regalia\n3. ✅ Combined utilization drops: From 20% → 9% (excellent for score)\n\n### The \"So What\"\nPaying on March 1 instead of March 11 earns you the Credit Builder challenge completion AND a projected **+15-25 point CIBIL score boost** within 30-45 days. A higher CIBIL score directly translates to lower interest rates on future loans.\n\n### Risk Analysis\n1. **Cash Flow Timing:** Your salary (₹85K) hits on March 1. Paying ₹45K immediately leaves ₹40K for the rest of the month. After SIPs (₹35K), you'd have just ₹5K buffer — very tight.\n2. **Bounce Risk:** If salary is delayed by even 1 day, the ₹45K transfer will fail. Set up the payment as 'pay on credit' rather than auto-debit.\n\n### Your Choices\n1. **Pay March 1 (Recommended):** Maximum CIBIL impact + challenge completion. Requires discipline with remaining ₹40K.\n2. **Pay March 5:** Gives you 4 days of salary buffer. Still qualifies for Credit Builder (6 days before due date). Lower risk.\n\n### Tax Implications\n• Credit card payments have **zero direct tax implications** — it's repayment of your own spending.\n• **Indirect benefit:** The CIBIL score improvement from early payment can save you **0.25-0.5% on home loan interest**. On your targeted ₹20L home down-payment (implying a ₹50-80L home loan), that's **₹1.25-4L saved** over the loan tenure.",
        suggestions: ["Set March 1 reminder", "What about other cards?"],
      },
      "What if I miss one SIP?": {
        response: "If you miss **even one SIP**, the 12-month streak resets to 0. Here's how to prevent that:\n\n**Failsafe Setup:**\n\n1. **Auto-debit on salary day:** Set SIP date = salary credit date (1st of month)\n2. **Buffer rule:** Keep ₹35K minimum balance in salary account always\n3. **Backup mandate:** Set up a secondary auto-debit from savings account as backup\n4. **Alert:** I'll ping you 2 days before SIP date if balance is low\n\n### The \"So What\"\nA broken SIP streak doesn't just cost you 200 reward points — it breaks the compounding chain. Missing even one month during a market dip means you miss buying units at lower NAVs, which disproportionately hurts long-term returns. The discipline of unbroken SIPs is worth more than the reward points.\n\n### Risk Analysis\n1. **Salary Delay Risk:** If your employer delays salary by even 2 days, the SIP auto-debit bounces. This is the #1 streak killer.\n2. **Insufficient Balance:** At ₹35K SIP against ₹85K salary, you have a comfortable 2.4x margin. But after March expenses (₹45K Regalia + ₹26K upcoming expenses), March could be tight.\n3. **Behavioral Risk:** The temptation to \"pause for just one month\" during a market crash is strong. Never pause — crashes are when SIPs create the most value.\n\n### Your Choices\n1. **Triple Failsafe (Recommended):** Auto-debit + savings backup mandate + 2-day advance alert. Zero chance of missing.\n2. **Buffer Strategy:** Keep 1 month's SIP (₹35K) as a permanent untouchable buffer in salary account. This acts as SIP insurance.\n3. **Accept Risk:** Rely on salary timing alone. Cheaper but riskier.\n\n### Tax Implications\n• SIP investments themselves have no immediate tax event.\n• If your SIPs include **ELSS funds**, each monthly SIP claims Section 80C benefits — unbroken SIPs mean unbroken tax savings of ₹46,800/yr (at 30% slab on ₹1.5L).\n• SIP units held >1 year qualify for LTCG at 12.5% (after ₹1.25L exemption). Breaking the streak and restarting later doesn't change tax treatment, but it destroys compounding.",
        suggestions: ["Set up backup mandate", "I'm good, will be careful"],
      }
    }
  },

  // ── Rewards: Rewards Earned ──
  "I've earned ₹8,240 in cashback & perks this year. How can I maximize my rewards across my 3 credit cards and available offers?": {
    response: "**Rewards Optimization Report:**\n\nYou've earned **₹8,240** so far. Here's how to unlock **₹4,200 more** this year:\n\n**Card-wise Earnings & Potential:**\n\n💳 **HDFC Regalia:** ₹2,100 earned → **+₹1,800 possible**\nSwitch ALL dining & travel here (4x points vs 1x on other cards)\n\n💳 **ICICI Amazon:** ₹1,400 earned → **+₹900 possible**\nRoute every Amazon order + online purchase here (5% + 2%)\n\n💳 **Gold Member:** ₹620 earned → **+₹1,500 possible**\nUse for groceries & fuel (2% flat is better than Regalia's 1%)\n\n### The \"So What\"\nYou're currently capturing only **66% of your maximum reward potential**. The remaining ₹4,200/yr is sitting unclaimed because of misrouted card usage. That's equivalent to one month of your Child Education SIP gap — free money left on the table.\n\n### Risk Analysis\n1. **Point Devaluation Risk:** Regalia reward points can be devalued by HDFC at any time (last devaluation: 2023, ~15% reduction). Accumulated points should be redeemed regularly, not hoarded.\n2. **Offer Expiry:** SmartBuy and stacking offers change quarterly. The current Swiggy + Regalia double-dip may not last.\n3. **Complexity Risk:** Managing 3 card routing rules requires habit formation. Most users revert to single-card behavior within 2 months.\n\n### Your Choices\n1. **Full Optimization (Recommended):** Implement card routing rules + activate all hidden offers. Projected year-end total: **₹12,440** (up from ₹8,240).\n2. **Quick Wins Only:** Just activate SmartBuy offers (+₹500/yr) and route dining to Regalia (+₹1,200/yr). Partial uplift: ₹9,940.\n3. **Status Quo:** Continue current habits and accept ₹8,240.\n\n### Tax Implications\n• All cashback and reward points earned through card spending are **non-taxable** — classified as discounts, not income.\n• Amazon Pay balance loaded via ICICI card (5% + 1% UPI stack) is also non-taxable.\n• If annual rewards ever exceed ₹50,000 (unlikely at current projections), amounts above this threshold *may* attract scrutiny under 'Income from Other Sources.' You're well below this limit at ₹12,440.",
    suggestions: ["Show me the spend routing cheat sheet", "How to redeem points?", "Are there hidden offers?"],
    followUps: {
      "Show me the spend routing cheat sheet": {
        response: "**Your Personal Card Cheat Sheet:**\n\n| Category | Best Card | Cashback |\n|----------|-----------|----------|\n| 🍔 Dining & Restaurants | Regalia | 2.6% |\n| ✈️ Travel & Flights | Regalia | 2.6% |\n| 🛒 Amazon | ICICI Amazon | 5% |\n| 👗 Online Shopping | ICICI Amazon | 2% |\n| 🥦 Groceries | Gold Member | 2% |\n| ⛽ Fuel | Gold Member | 2% |\n| 💡 Utilities & Bills | Gold Member | 2% |\n| 📱 Subscriptions | ICICI Amazon | 2% |\n| 🏥 Insurance | Gold Member | 2% |\n\n### The \"So What\"\nThis single routing table, if followed consistently, generates **₹25,200/yr** vs ₹20,400 without optimization — a ₹4,800 annual uplift. Think of it as a 24% raise on your reward income, requiring zero additional spending.\n\n### Risk Analysis\n1. **Behavioral Decay:** Most reward optimization fails within 8 weeks because people forget which card to use. Save this as your phone wallpaper or set card nicknames (rename Gold to 'Groceries Card' in your wallet app).\n2. **Category Overlap:** Some merchants classify differently (e.g., Swiggy may code as 'Technology' not 'Dining'). Verify reward points post-purchase to confirm correct categorization.\n\n### Your Choices\n1. **Save & Implement (Recommended):** Follow this routing strictly. Annual rewards: ₹25,200.\n2. **Simplify to 2 Rules:** Dining/Travel → Regalia, Everything else → Gold. Easier to remember, captures 80% of the uplift.\n\n### Tax Implications\n• All cashback earned through optimized routing remains **non-taxable** — the routing doesn't change the tax treatment.\n• **Rule of thumb:** Dining/Travel → Regalia, Online → Amazon, Everything else → Gold. Following this strictly earns you ₹25,200/yr vs ₹20,400 without optimization — and every rupee is tax-free.",
        suggestions: ["Save this cheat sheet", "What about EMIs?"],
      }
    }
  },

  // ═══════════════════════════════════════
  // FlipCard Deep-Dive Query Flows
  // ═══════════════════════════════════════

  "Break down my ₹1.25Cr net worth across every asset — equity funds, gold, property, savings. What percentage is each and where am I over-concentrated?": {
    response: "Here is your detailed ₹1.25 Cr Net Worth composition.\n\n**Asset Map:**\n📊 **Equity Mutual Funds: ₹49.5L (39.6%)**\n• Parag Parikh Flexi: ₹18.2L\n• Quant Small Cap: ₹12.4L (10% of total NW)\n• HDFC MidCap: ₹8.1L\n• Others: ₹10.8L\n\n🥇 **Gold (SGB): ₹9L (7.2%)**\n📄 **Debt Funds: ₹10.5L (8.4%)**\n🏦 **Liquid + Savings: ₹12L (9.6%)**\n🏠 **Property Equity: ₹44L (35.2%)**\n\n### The \"So What\"\nYour wealth is roughly split 75% Growth (Equity + Property) and 25% Safe (Debt + Gold + Liquid). While the growth has compounding velocity, true diversification ensures that a shock to one asset class doesn't paralyze your entire net worth.\n\n### Risk Analysis\n1. **Illiquidity Risk:** Property holds 35% of your net worth. It cannot be sold quickly if you need cash.\n2. **Concentration Risk:** A staggering 10% of your *entire net worth* sits in a single, highly volatile fund (Quant Small Cap).\nIf real estate plateaus and small caps correct aggressively at the same time, your portfolio will bleed heavily without the ability to self-correct.\n\n### Your Choices\n1. **Maintain Course:** Keep the 75% growth tilt for aggressive expansion but accept severe volatility.\n2. **Trim Concentration (Recommended):** Trim your Quant Small Cap position down to 5% of NW (sell ₹6.2L) and map those funds strictly into Debt.\n\n### Tax Implications\nIf we rotate ₹6.2L from Quant Small Cap:\n• Ensure we sell units classified as Long Term (>1 year).\n• With current exemptions at ₹1.25L, your tax liability largely depends on total accrued gains. The maximum exposure here would be 12.5% on gains *exceeding* ₹1.25L. The blended tax drag on this particular restructuring equates to less than ₹2,000—an incredibly cheap price to ensure portfolio safety.",
    suggestions: ["Trim Quant exposure", "Is property risk a problem?", "What's the ideal split?"],
  },

  "My short-term bucket is only ₹9L against a target of ₹12L. Is this risky? What emergency scenarios could this fail in?": {
    response: "Running a stress test on your liquidity identifies a definitive ₹3L gap.\n\n### The \"So What\"\nYour short-term bucket (₹9L) is engineered to act as a dam, preventing you from selling long-term equity at a loss during emergencies. Right now, that dam is built too low.\n\n### Risk Analysis\n**Scenario: Job loss + Market Crash (Worst Case)**\n• If you lose your income for 6 months, you need to survive on your ₹9L. \n• At ₹45K burn/month + upcoming ₹42K school fees, the ₹9L covers you up to roughly month 5.\n• BUT, if a major appliance breaks or an uninsured medical gap of ₹2L hits simultaneously... your dam breaks. You are forced to sell equity under duress during a crashing market to cover the shortfall.\n• A fully funded ₹12L bucket guarantees zero forced-equity liquidation.\n\n### Your Choices\n1. **Do Nothing:** Accept that you are taking on hidden \"tail risk\" (unlikely but catastrophic events).\n2. **Liquidate Equity Now:** Rotate ₹3L from equity to Debt over 30 days to build the wall to ₹12L.\n3. **Pause Investments:** Pause ₹35K of equity SIPs for 8 months and stockpile the cash in liquid funds to hit ₹12L.\n\n### Tax Implications\nIf you execute choice #2 (Liquidating Equity): By spreading the ₹3L sale over two calendar months, you can exploit the ₹1.25L LTCG threshold completely, triggering literally **₹0 in tax liability** to secure your safety net.",
    suggestions: ["Fix the ₹3L gap now", "But I don't want to sell equity"],
  },

  "Quant Small Cap is +64% and my small cap allocation is 24% vs 15% target. Should I book partial profits now? How much and where to reinvest?": {
    response: "Yes, you should execute a partial profit booking right now.\n\n### The \"So What\"\nYour small cap allocation has drifted to 24% (against a target of 15%) strictly because it has overperformed so aggressively (+64%). You have effectively 'won' this trade, but leaving the money there turns a calculated risk into an outsized gamble.\n\n### Risk Analysis\nSmall caps are currently trading at peak valuations (PE of 28x). Historically, mean-reversion corrections from these levels average 15-20% and happen rapidly. If you do not lock in these gains, a market pullback could erase years of compounding in weeks.\n\n### Your Choices\n1. **Aggressive Sell (Recommended):** Sell ₹3.5L to bring allocation perfectly back to 15%. Reinvest ₹2L in HDFC Balanced Advantage and ₹1.5L in Debt.\n2. **Staggered Sell:** Sell ₹1L a month for 3 months to dollar-cost-average your exit, though this leaves you exposed to immediate crashes.\n3. **Hold:** Let it ride, accepting the statistical probability of a sharp correction.\n\n### Tax Implications\nIf you execute the ₹3.5L sell:\n• **Estimated Gains:** ~₹1.36L\n• **LTCG Exemption:** ₹1.25L\n• **Taxable Gain:** ₹11,000\n• **Total Tax:** ₹1,375 (12.5% rate).\nYou are locking in over a lakh of absolute profit by paying an effective tax rate of just 0.39%. This is phenomenally tax-efficient.",
    suggestions: ["Execute this trade", "What if Small Cap runs more?", "Show me alternatives"],
  },

  "My house down-payment goal is ₹12L short with 2.8 years left. Currently saving ₹18k/mo via SIP. Can I close this gap faster by increasing SIP or using a bonus?": {
    response: "**House Goal Acceleration Plan:**\n\n**Current trajectory:**\n• Gap: ₹6.4L | SIP: ₹18K/mo | Timeline: 2.8 yrs\n• At 10% return (safe debt fund): Reaches ₹20L by March 2029 ✅ (barely)\n\n**Faster options:**\n\n🥇 **Boost SIP to ₹23K (+₹5K/mo):**\n→ ₹20L by **Oct 2028** — 6 months early\n• Low effort, compound growth kicks in\n\n🥈 **Lump sum ₹1.5L from March bonus:**\n→ ₹20L by **Dec 2028** — 4 months early\n• One-time effort, big instant impact\n\n🏆 **Both (SIP ₹23K + ₹1.5L bonus):**\n→ ₹20L by **Jul 2028** — 9 months early!\n• Best of both worlds\n\n### The \"So What\"\nYour current ₹18K SIP reaches ₹20L with zero margin. Any SIP pause, market correction, or property price inflation eliminates the buffer entirely. Accelerating by even 6 months gives you negotiating power on property price and protects against timing risk.\n\n### Risk Analysis\n1. **Asset Allocation Risk:** If your house SIP is in equity, a 20% crash at month 30 would be devastating. Short-term goals (2-3yr) must be in Ultra Short or Short Duration debt funds.\n2. **Property Inflation:** Real estate in your target area appreciates ~5% annually. A 6-month delay adds ₹50K-1L to required down-payment.\n3. **Bonus Dependency:** Relying on March bonus assumes it's guaranteed. If deferred or reduced, Option 2 fails.\n\n### Your Choices\n1. **Both SIP + Bonus (Recommended):** Reaches ₹20L by Jul 2028 with maximum safety margin.\n2. **SIP Boost Only:** Lower risk dependency, steady progress.\n3. **Bonus Only:** One-time action, but doesn't fix the underlying pace problem.\n\n### Tax Implications\n• SIP in Ultra Short/Short Duration debt funds: Gains taxed at your slab rate regardless of holding period (post April 2023 rules for debt MFs).\n• On ₹6.4L accumulation with ~8% return, expected gains are ~₹50K. Tax at 30% slab = ₹15,000 — a small price for securing your home.\n• **₹5K extra SIP source:** Your Feb budget surplus (₹17.6K remaining) proves you can spare it.",
    suggestions: ["Set up ₹23K SIP", "Where to invest bonus?", "What debt fund is best?"],
  },

  "Break down my ₹27.4k February spending by category — Travel ₹9.6k, Food ₹6.2k, Shopping ₹5.6k, Transport ₹3.2k, Subscriptions ₹2.8k. Flag where I am over my usual average.": {
    response: "**February vs 3-Month Average:**\n\n| Category | Feb | Avg | Delta | Status |\n|----------|-----|-----|-------|--------|\n| ✈️ Travel | ₹9.6K | ₹4.1K | **+134%** | 🔴 Way over |\n| 🍔 Food | ₹6.2K | ₹4.8K | +29% | 🟡 Over |\n| 🛍️ Shopping | ₹5.6K | ₹3.2K | **+75%** | 🔴 Over |\n| 🚗 Transport | ₹3.2K | ₹3.0K | +7% | 🟢 Normal |\n| 📱 Subscriptions | ₹2.8K | ₹2.8K | 0% | 🟢 Steady |\n\n### The \"So What\"\nYour February spend of ₹27.4K is **₹9.5K above your 3-month average** of ₹17.9K. The entire overspend is concentrated in 3 discretionary categories: Travel (+134%), Shopping (+75%), and Food (+29%). Transport and Subscriptions are perfectly stable — your structural costs are fine, your discretionary discipline broke.\n\n### Risk Analysis\n1. **Lifestyle Creep:** If this pattern repeats for even 3 consecutive months, your brain resets ₹27K as the 'normal' baseline. Reversing lifestyle creep is 5x harder than preventing it.\n2. **Annual Impact:** At ₹9.5K overspend/month, that's **₹1.14L/year** — equivalent to an entire year of your Child Education SIP gap. You're literally spending Reyaan's education fund on Goa trips and Myntra sales.\n3. **The Goa Effect:** One unbudgeted weekend trip became 35% of your monthly spend. Travel needs a separate sinking fund.\n\n### Your Choices\n1. **Hard Correction (Recommended):** Freeze Travel and Shopping for the rest of Feb. Cap Food at ₹4.8K (your average). Projected finish: ₹32K — well under budget.\n2. **Create a Travel Sinking Fund:** Set aside ₹3K/mo into a dedicated travel RD. This budgets ₹36K/yr for trips without disrupting monthly cash flow.\n3. **Accept & Monitor:** Treat Feb as an anomaly and track March to see if the pattern repeats. Riskier but less restrictive.\n\n### Tax Implications\n• Discretionary spending has no direct tax implications.\n• **Opportunity Cost:** The ₹9.5K overspend, if redirected annually to ELSS, generates **₹34,200/yr in tax savings** (₹1.14L × 30% slab). You are not just overspending — you are sacrificing tax-free compounding.",
    suggestions: ["Set category budgets", "The Goa trip was worth it!", "Help me avoid impulse buys"],
  },

  "Which of my 3 cards (Regalia, Amazon, Gold) should I use for dining, shopping, travel, and groceries? Optimize for maximum rewards on each category.": {
    response: "**Card Optimization by Category:**\n\n🍔 **Dining & Restaurants → HDFC Regalia**\n• 4x reward points = ~2.6% effective cashback\n• Stack with Zomato Pro for double savings\n• Monthly dining budget: ₹6K → earns ₹156/mo\n\n👗 **Online Shopping → ICICI Amazon**\n• Amazon: 5% cashback (highest in market)\n• Other online: 2% cashback\n• Monthly shopping: ₹5.6K → earns ₹280/mo\n\n✈️ **Travel & Flights → HDFC Regalia**\n• 4x points on travel + free lounge access\n• Book via Regalia SmartBuy for extra 10x points\n• Flight ₹15K → earns ₹390 in points\n\n🥦 **Groceries & Fuel → Gold Member**\n• Flat 2% cashback (better than Regalia's 0.66%)\n• Monthly groceries ₹8K → earns ₹160/mo\n\n### The \"So What\"\nOptimized monthly rewards jump from ₹1,700 to **₹2,100** — a **₹4,800/yr boost** from simply swiping the right card at the right merchant. This is the highest-ROI financial optimization available to you because it requires zero additional spending.\n\n### Risk Analysis\n1. **SmartBuy Dependency:** Regalia SmartBuy offers (10x points on travel) change frequently. Always verify the offer is active before booking.\n2. **Merchant Miscoding:** Some restaurants code as 'Entertainment' not 'Dining,' reducing Regalia rewards. Check your statement monthly.\n3. **EMI Trap:** Never use reward-earning cards for EMI purchases — the interest cost obliterates any cashback earned.\n\n### Your Choices\n1. **Implement Full Routing (Recommended):** Follow the 4-category rule above. Annual rewards: ₹25,200.\n2. **Two-Card Simplification:** Use Regalia for everything in-person, Amazon card for everything online. Captures ~70% of the uplift with simpler execution.\n\n### Tax Implications\n• All cashback earned through optimized routing is **non-taxable** (classified as purchase discount).\n• Regalia reward points redeemed for gift cards: non-taxable up to ₹50K/yr — you're well within limits.\n• **Pro tip:** If you have business expenses, route them through the highest-reward card and claim the spending as a business deduction while keeping the tax-free rewards. Double benefit.",
    suggestions: ["Save as my card rules", "What about EMI purchases?", "Any offers I'm missing?"],
  },

  "I am 150 points from Platinum. I have 3 challenges worth 700 points total. What is the fastest way — complete challenges, earn through spending, or a combination?": {
    response: "**Speed-ranked paths to Platinum:**\n\n🥇 **Path 1: Complete No Spend Week (2 days left)**\n• Effort: Low (just don't spend for 48 hours)\n• Points: +500\n• Timeline: **2 days**\n• This alone puts you at 2,350 — well past 2,000!\n\n🥈 **Path 2: Pay Regalia bill early (Credit Builder)**\n• Effort: Medium (transfer ₹45K from salary)\n• Points: Score improvement (not direct points)\n• Timeline: As fast as today\n• Bonus: Credit score +15-25 pts\n\n🥉 **Path 3: Spend ₹15K on Gold card**\n• Effort: Passive (normal spending)\n• Points: +150 (exactly enough)\n• Timeline: ~2 weeks\n\n### The \"So What\"\nYou have 3 paths, but only 1 makes financial sense. The challenge path (No Spend Week) earns you 500 pts through **not spending** — you save money AND earn rewards. Path 3 (spending ₹15K) costs you ₹15K to earn ₹150 — a -99% ROI. The math is unambiguous: discipline beats spending every time.\n\n### Risk Analysis\n1. **Path 1 Risk:** A single discretionary purchase in 48 hours resets the streak. Probability of failure: ~30% based on behavioral data.\n2. **Path 2 Risk:** Requires ₹45K on March 1. If salary is late, the Credit Builder window closes.\n3. **Path 3 Risk:** Encourages spending to earn points — this is the #1 behavioral trap in rewards programs. The ₹15K spent today has a compounding opportunity cost of ₹45K+ over 10 years.\n\n### Your Choices\n1. **No Spend Week Sprint (Recommended):** Finish 2 remaining days. Zero cost, maximum reward (500 pts).\n2. **Challenges + Natural Spending:** Complete challenges first, let normal spending accumulate the rest. Best of both worlds.\n3. **Wait for Organic Points:** No action needed if patient. Normal spending earns 150 pts in ~2 weeks.\n\n### Tax Implications\n• Reward points from challenges and spending are **non-taxable** loyalty benefits.\n• **Don't spend just to earn points** — that defeats the purpose! The ₹15K, if invested in ELSS instead, would save ₹4,500 in tax (30% slab) — far more valuable than 150 reward points.\n• The challenge path is always better from both a rewards AND tax perspective.",
    suggestions: ["Lock in No Spend Week", "Do challenges + spending", "What's after Platinum?"],
  },

  // ═══════════════════════════════════════════
  // Dashboard, Action, Money, Spend, Rewards — Card Context Flows
  // ═══════════════════════════════════════════

  // ── Dashboard: Car Insurance ──
  "My car insurance for the Creta is expiring in 12 days. The renewal quote is ₹18,400. Should I stick with this or look for better options?": {
    response: "Your HDFC Ergo renewal quote of **₹18,400** for the Creta is on the higher side. Let's compare.\n\n**Market Comparison:**\n| Insurer | Premium | IDV | NCB | Add-ons |\n|---------|---------|-----|-----|----------|\n| HDFC Ergo (Current) | ₹18,400 | ₹7.2L | 35% | RSA, ZD |\n| ICICI Lombard | ₹14,200 | ₹7.4L | 35% | RSA, ZD, Engine |\n| Bajaj Allianz | ₹15,100 | ₹7.1L | 35% | RSA, ZD |\n\n### The \"So What\"\nYou're overpaying **₹4,200/year** with HDFC Ergo for *less* coverage. ICICI Lombard offers a higher IDV (₹7.4L vs ₹7.2L) plus engine protection — an add-on that costs ₹2K extra on HDFC Ergo — included free. Over the remaining life of your Creta, that's ₹20K+ in savings.\n\n### Risk Analysis\n1. **NCB Transfer:** Your 35% No Claim Bonus transfers seamlessly between insurers — it's mandated by IRDAI. Zero risk of losing it.\n2. **Claim Settlement Ratio:** ICICI Lombard CSR is 96.7% vs HDFC Ergo's 98.1%. Marginal difference, both are industry-leading.\n3. **Deadline Pressure:** 12 days is plenty. But don't let it lapse — driving without insurance is a ₹2,000 fine + personal liability for any accident costs.\n\n### Your Choices\n1. **Switch to ICICI Lombard (Recommended):** Save ₹4,200/yr, get better coverage. Takes 15 minutes online.\n2. **Negotiate with HDFC Ergo:** Call their retention desk and ask for a price match. They often offer 10-15% off.\n3. **Renew HDFC Ergo as-is:** Pay ₹18,400 for continuity and zero hassle.\n\n### Tax Implications\n• Car insurance premiums are **not tax-deductible** for salaried individuals (only for business vehicles under Section 37).\n• The ₹4,200 saved from switching, if invested in ELSS, generates an additional ₹1,302 tax saving (30% slab). Total annual benefit: **₹5,502**.",
    suggestions: ["Switch to ICICI Lombard", "Negotiate with HDFC Ergo", "Set renewal reminder"],
  },

  // ── Dashboard: Electricity Bill ──
  "I have an electricity bill of ₹2,840 due in 2 days. Please pay it from my salary account.": {
    response: "I'll prepare the payment for your electricity bill.\n\n**Bill Details:**\n• **Amount:** ₹2,840\n• **Due Date:** 2 days from now\n• **Source:** HDFC Salary Account (Balance: ₹85,000)\n• **Post-payment balance:** ₹82,160\n\n### The \"So What\"\nThis is a routine utility payment, but the *method* matters. Paying via your HDFC Regalia credit card instead of direct debit earns you **28 reward points** (worth ₹14) — small but free money. More importantly, Regalia gives you a 45-day float, keeping ₹2,840 in your salary account for a few extra weeks.\n\n### Risk Analysis\n1. **Late Payment Fee:** ₹100-250 surcharge if missed. Set up auto-pay for all utilities to eliminate this permanently.\n2. **Cash Flow:** ₹2,840 from an ₹85K balance is negligible (3.3%). No liquidity risk.\n\n### Your Choices\n1. **Pay via Regalia card (Recommended):** Earn 28 points + 45-day float. Pay during next billing cycle.\n2. **Direct debit from salary account:** Instant, no tracking needed. Simpler but forfeits minor rewards.\n3. **Set up auto-pay for all utilities:** One-time setup eliminates future bill-tracking entirely.\n\n### Tax Implications\n• Electricity bills are **not tax-deductible** for salaried individuals.\n• If you work from home: Under old regime, no specific electricity deduction exists. New regime also doesn't allow it.\n• Reward points earned from card payment are non-taxable.",
    suggestions: ["Pay via Regalia", "Pay from salary account", "Set up auto-pay"],
  },

  // ── Dashboard: Surplus Cash ──
  "I have ₹15,000 surplus cash in my account. You suggested investing it. What's the best fund for this right now?": {
    response: "For ₹15,000 surplus cash, the best deployment depends on your time horizon.\n\n**Quick Recommendation:**\n\n### The \"So What\"\nEvery day ₹15K sits in your savings account at 3.5%, you're losing ₹3.20/day to inflation (5.5% inflation vs 3.5% savings = 2% real loss). Over a year, that's ₹300 in purchasing power destroyed. Let's put this money to work.\n\n### Risk Analysis\n1. **If needed within 3 months:** Use a Liquid Fund (7.1% return, instant redemption up to ₹50K). Near-zero risk.\n2. **If needed in 1-3 years:** Short Duration Debt Fund (8-8.5%). Slightly less liquid but better returns.\n3. **If investing for 3+ years:** ELSS or Flexi Cap (12-18% expected CAGR). Higher volatility but tax-advantaged.\n\n### Your Choices\n1. **ELSS — Axis Long Term Equity (Recommended if 80C gap exists):** ₹15K invested closes your ₹18K 80C gap by 83%. Tax saving: ₹4,650 instantly. 3-year lock-in but strong 14% historical CAGR.\n2. **Parag Parikh Flexi Cap:** Your best-performing fund (21.7% XIRR). Add ₹15K to a winner. No lock-in.\n3. **Liquid Fund (HDFC Liquid):** Park if uncertain. Earn 7.1% while you decide. Move out any time.\n\n### Tax Implications\n• **ELSS route:** ₹15K × 31% (your slab + cess) = **₹4,650 in tax savings**. This makes the effective cost of investing just ₹10,350 while you get ₹15K working for you. Guaranteed 45% instant return.\n• **Flexi Cap route:** No immediate tax benefit. LTCG at 12.5% above ₹1.25L after 12 months.\n• **Liquid Fund:** Gains taxed at slab rate (30%+cess). On ₹15K, annual tax is ~₹330.\n• **Verdict:** If 80C gap exists → ELSS. Otherwise → Flexi Cap.",
    suggestions: ["Invest in ELSS", "Add to Parag Parikh", "Park in Liquid Fund"],
  },

  // ── Dashboard: Health Top-up ──
  "I'm interested in the ₹15L health insurance top-up for ₹267/month. Can you explain the coverage details?": {
    response: "A **Super Top-up** health policy is one of the smartest insurance purchases you can make.\n\n**Your Current Situation:**\n• Base Cover: ₹5L (HDFC Ergo)\n• Mumbai ICU Cost: ₹10-15L for major procedures\n• **Gap: ₹5-10L** of uncovered exposure\n\n**Super Top-up Details:**\n• **Coverage:** ₹15L (kicks in after base ₹5L is exhausted)\n• **Premium:** ₹267/month (₹3,204/year)\n• **Deductible:** ₹5L (your base policy covers this)\n• **Provider Recommendation:** ICICI Lombard or Star Health\n\n### The \"So What\"\nFor ₹267/month — less than your Spotify subscription — you're adding ₹15L of coverage. A single cardiac surgery in Mumbai costs ₹8-12L. Without this top-up, you'd deplete your ₹6L emergency fund AND need to liquidate investments at potentially unfavorable times. This ₹3,204/year protects ₹75L+ in invested wealth.\n\n### Risk Analysis\n1. **Deductible Dependency:** The top-up only activates after your base ₹5L is fully consumed. If your base insurer delays or rejects a claim, the top-up won't kick in. Mitigant: Choose a top-up from a different insurer than your base.\n2. **Room Rent Capping:** Some top-ups cap room rent at 1% of sum insured. ₹15L × 1% = ₹15K/day — adequate for most Mumbai hospitals.\n3. **Pre-existing Conditions:** Waiting period of 2-4 years for pre-existing conditions. Start now to get coverage earlier.\n\n### Your Choices\n1. **Buy ₹15L Super Top-up now (Recommended):** ₹267/month for total ₹20L coverage. Best value insurance product in India.\n2. **Upgrade base policy to ₹20L instead:** More expensive (₹8-12K/year) but simpler single-policy coverage.\n3. **Wait and review:** Risk of health event during uninsured period. Not recommended.\n\n### Tax Implications\n• **Section 80D Deduction:** The ₹3,204 annual premium is fully deductible. At your 30% slab, tax saved = **₹993/year**.\n• Net effective cost: ₹3,204 - ₹993 = **₹2,211/year** (₹184/month) for ₹15L coverage.\n• You're currently claiming ₹25K under 80D for self. This top-up fits within the ₹25K limit if combined with your base premium. If you've exhausted the ₹25K, the excess isn't deductible — but the coverage is still worth every rupee.",
    suggestions: ["Buy ₹15L top-up", "Compare providers", "What about family floater?"],
  },

  // ── Money: Medium Term Bucket ──
  "My medium term bucket has 73% equity allocation against a target of 30%. Help me rebalance by moving ₹1.2L from high-risk equity to debt.": {
    response: "Your medium-term bucket (2-5 year money) is dangerously overexposed to equity.\n\n**Current Allocation:**\n• Equity: 73% (₹10.95L) — Target: 30%\n• Debt: 27% (₹4.05L) — Target: 70%\n• **Overweight in Equity by:** ₹6.45L\n\n### The \"So What\"\nMoney needed in 2-5 years should be primarily in debt/fixed income because you can't afford a 20-30% drawdown right when you need the funds. Your 73% equity tilt in this bucket is essentially gambling with your near-term goals — house down payment, child education milestones — on market timing.\n\n### Risk Analysis\n1. **Sequence Risk:** If markets correct 25% in Year 3 (when you need the money), your ₹10.95L equity becomes ₹8.2L. You'd either withdraw at a loss or delay your goal by 12-18 months.\n2. **Rebalancing Pace:** Moving ₹1.2L is a start but only closes 19% of the ₹6.45L gap. You'll need systematic monthly transfers to reach the 30/70 target.\n3. **Debt Fund Selection:** Short Duration > Ultra Short > Liquid for this horizon. Avoid credit risk funds entirely.\n\n### Your Choices\n1. **Move ₹1.2L now + ₹1L/month for 5 months (Recommended):** Reaches target 30/70 by month 6. Systematic, tax-optimized.\n2. **Move ₹1.2L now only:** Brings equity to 65%. Still overweight but directionally better.\n3. **Full rebalance (₹6.45L at once):** Fastest but triggers larger capital gains. May breach ₹1.25L LTCG exemption.\n\n### Tax Implications\n• **₹1.2L equity sale:** Estimated LTCG ~₹36K (well within ₹1.25L exemption) → **Tax: ₹0**.\n• **If you move ₹6.45L at once:** Estimated LTCG ~₹1.94L. Tax on excess: (₹1.94L - ₹1.25L) × 12.5% = **₹8,625**. This is why staggering is better.\n• **Debt fund purchase:** Future gains taxed at slab rate (30%+cess) regardless of holding period. Factor this into return expectations — net return ~5.5-6% after tax.",
    suggestions: ["Start ₹1.2L + monthly plan", "Move ₹1.2L only", "Show me debt fund options"],
  },

  // ── Money: Term Insurance ──
  "I don't have any term insurance. I'm 32 with a ₹75L portfolio and dependents. What's the right term plan coverage and which provider should I pick?": {
    response: "**This is your single most critical financial gap.**\n\nAt 32 with dependents and a ₹75L portfolio, if something happens to you tomorrow, your family's financial security evaporates within 3-5 years.\n\n**Recommended Coverage:**\n• **Sum Assured:** ₹1.5 Crore minimum (10-15x annual income)\n• **Term:** Till age 60 (28 years)\n• **Premium Estimate:** ₹12,000-15,000/year\n\n**Top 3 Providers:**\n| Provider | Premium (₹1.5Cr) | CSR | Online Discount |\n|----------|------------------|-----|---------|\n| HDFC Life Click 2 Protect | ₹12,400/yr | 98.7% | Yes |\n| ICICI Pru iProtect Smart | ₹13,100/yr | 97.8% | Yes |\n| Max Life Smart Term | ₹12,800/yr | 99.3% | Yes |\n\n### The \"So What\"\nYour ₹75L portfolio seems large, but without income replacement, your family would need to draw ~₹6L/year for expenses. At that burn rate, the corpus lasts only 12-15 years — and that's before accounting for inflation, children's education (₹50L+), and medical emergencies. A ₹1.5Cr term plan ensures your family has **25+ years of income replacement** for just ₹1K/month.\n\n### Risk Analysis\n1. **Health Delays:** Every year you wait, premiums increase 5-8%. Medical conditions (even minor ones) can lead to loading or rejection. At 32, you'll likely get the cleanest underwriting.\n2. **Underinsurance:** ₹1Cr might seem enough today, but inflation erodes it. ₹1.5Cr in 2026 = ₹75L in 2040 purchasing power. Go higher if budget allows.\n3. **Single-Insurer Risk:** Consider splitting — ₹1Cr from HDFC + ₹50L from Max Life. If one insurer delays claims, the other provides interim coverage.\n\n### Your Choices\n1. **₹1.5 Crore via HDFC Life Click 2 Protect (Recommended):** Best value, highest digital claim process, ₹12,400/year.\n2. **₹2 Crore for future-proofing:** ₹16,800/year. Extra ₹4,400 buys ₹50L more coverage — excellent marginal value.\n3. **Split: ₹1Cr HDFC + ₹50L Max Life:** Two policies, two insurers, diversified claim risk.\n\n### Tax Implications\n• **Section 80C Deduction:** Term insurance premiums are deductible under 80C up to ₹1.5L. Your ₹12,400 premium directly reduces taxable income.\n• At your 30% slab: Tax saved = **₹3,844/year**. Effective premium after tax benefit: **₹8,556/year** (₹713/month).\n• **Death Benefit:** Proceeds paid to nominee are **100% tax-free** under Section 10(10D). The entire ₹1.5Cr goes to your family without any tax deduction.\n• **No term insurance = no 80C benefit.** You're currently losing this deduction every year you delay.",
    suggestions: ["Apply for HDFC Life ₹1.5Cr", "Compare ₹2Cr options", "What riders should I add?"],
  },

  // ── Money: Infra Sector ──
  "Infrastructure sector is booming. I don't hold any infra-specific funds. Should I add SBI Bluechip or an Infra thematic fund to my portfolio?": {
    response: "The infra boom is real — government capex at ₹11.1L Crore is the highest ever. But thematic investing requires discipline.\n\n**Options Compared:**\n| Fund | Type | 3Y CAGR | Expense | Risk |\n|------|------|---------|---------|------|\n| SBI Bluechip | Large Cap | 15.8% | 0.85% | Moderate |\n| ICICI Pru Infra | Thematic | 32.1% | 1.12% | High |\n| Nippon India Power & Infra | Thematic | 38.4% | 1.08% | High |\n\n### The \"So What\"\nSBI Bluechip is a large-cap diversified fund — it has infra exposure (~15%) but isn't an infra play. If you want to ride the infra cycle, you need a dedicated thematic fund. However, thematic funds are cyclical weapons — they outperform spectacularly during booms (+38%) and underperform brutally during busts (-25 to -40%). The question isn't whether infra is booming — it's whether you can stomach a 40% drawdown when the cycle turns.\n\n### Risk Analysis\n1. **Cycle Timing:** Infrastructure cycles last 5-7 years. We're approximately 3 years into the current upcycle. You may have 2-4 years of tailwind left, but entry at this point means buying at elevated valuations.\n2. **Concentration Risk:** Your portfolio already has sector concentration via Quant Small Cap (which holds L&T, ABB, etc.). Adding a dedicated infra fund may create hidden overlap.\n3. **Exit Discipline:** 90% of thematic fund investors hold too long. When the cycle turns, losses compound fast. You need a predetermined exit trigger (e.g., exit when Nifty Infra PE exceeds 35x).\n\n### Your Choices\n1. **Small tactical allocation — 5% (₹3.75L) in ICICI Pru Infrastructure (Recommended):** Enough to benefit from the tailwind without overexposing. Set a 2-year review date.\n2. **SBI Bluechip instead:** Safer, diversified, but not a true infra play. If you want broad large-cap exposure, this is better. If you specifically want infra alpha, it won't deliver.\n3. **Skip thematic, add to existing winners:** Deploy into Parag Parikh Flexi or HDFC MidCap — both have some infra exposure through diversified holdings.\n\n### Tax Implications\n• **Equity thematic funds:** Same LTCG rules — 12.5% above ₹1.25L exemption for holdings >12 months.\n• **Timing your exit:** If you plan to exit in 2-3 years when the cycle peaks, ensure you've held >12 months to qualify for LTCG (12.5%) instead of STCG (20%).\n• **Tax-loss harvesting opportunity:** If infra corrects before you exit, you can harvest the loss to offset gains from Quant Small Cap trims.",
    suggestions: ["Allocate 5% to ICICI Infra", "Stick with SBI Bluechip", "Skip thematic funds"],
  },

  // ── Rewards: Referral Program ──
  "How does the referral program work? I want to refer a friend and earn 300 points.": {
    response: "Here's how the Command referral program works:\n\n**Referral Rewards:**\n• **You earn:** 300 points per successful referral\n• **Your friend earns:** 200 points on signup\n• **Qualification:** Friend must complete KYC and link one account\n\n**Steps:**\n1. Share your unique referral link (found in Profile → Referrals)\n2. Friend signs up and completes onboarding\n3. Points credited to both within 48 hours\n\n### The \"So What\"\nAt 300 points per referral, just 5 referrals = 1,500 points — enough to push you past Platinum (you need only 150 more). This is the **highest points-per-effort activity** available. Each referral takes ~2 minutes of your time but earns points equivalent to ₹5,000 in spending.\n\n### Risk Analysis\n1. **Quality Check:** Only genuine referrals count. Duplicate accounts or self-referrals are flagged and reversed.\n2. **Point Expiry:** Referral points typically expire in 12 months. Use them or lose them.\n3. **Friend's Experience:** If your friend churns within 30 days, the referral bonus may be clawed back.\n\n### Your Choices\n1. **Refer 1 friend now (Recommended):** Gets you 300 points → instant Platinum (you're only 150 away).\n2. **Batch refer 5 friends:** 1,500 points = permanent Platinum cushion + ₹1,500 in reward value.\n\n### Tax Implications\n• Referral points are classified as **loyalty rewards** — currently non-taxable in India under standard interpretation.\n• If redeemed for cash (vs. vouchers), amounts above ₹50K aggregate may attract attention. At 300 points per referral, you're far below any threshold.",
    suggestions: ["Share my referral link", "How many can I refer?"],
  },

  // ── Rewards: KYC Update ──
  "I need to update my KYC. Walk me through the process and confirm the 100 points reward.": {
    response: "KYC update is quick and earns you **100 bonus points**.\n\n**Steps:**\n1. Go to **Profile → KYC Verification**\n2. Upload Aadhaar front & back (or DigiLocker)\n3. Take a live selfie for face match\n4. PAN verification (auto-pulled from your linked accounts)\n5. E-sign the declaration\n\n**Timeline:** 5-10 minutes. Points credited within 24 hours.\n\n### The \"So What\"\nBeyond the 100 points, KYC completion unlocks higher transaction limits, auto-pay features, and premium advisory access. It's a mandatory step for most financial actions anyway — earning points for it is a bonus.\n\n### Risk Analysis\n1. **Data Security:** KYC data is encrypted and stored per RBI/SEBI guidelines. Command doesn't share your data with third parties.\n2. **Rejection:** Blurry documents or mismatched names cause rejection. Use well-lit photos and ensure name matches across Aadhaar/PAN.\n\n### Your Choices\n1. **Complete KYC now (Recommended):** 5 minutes → 100 points + full feature access.\n2. **Defer:** You can use basic features without KYC, but investment actions and auto-tracking require it.\n\n### Tax Implications\n• KYC completion has no direct tax implications. However, it enables investment features (ELSS, NPS) that carry significant tax benefits under 80C and 80CCD(1B).\n• Think of KYC as the gateway to ₹33,600 in annual tax savings you're currently leaving on the table.",
    suggestions: ["Start KYC now", "What documents do I need?"],
  },

  // ── Rewards: Link Bank Account ──
  "I want to link my bank account for auto-tracking. What do I earn and how safe is it?": {
    response: "Linking your bank account unlocks the full power of automated financial tracking.\n\n**What You Earn:**\n• **200 points** on first account link\n• **Automated expense categorization** (no manual entry)\n• **Real-time balance alerts** and spending insights\n• **Smart bill detection** (auto-identifies upcoming payments)\n\n### The \"So What\"\nManual expense tracking has a 90% dropout rate within 30 days. Auto-tracking via account linking means Command can proactively alert you about overspending, upcoming bills, and idle cash — *before* you even think about it. The 200 points are a bonus; the real value is hands-free financial intelligence.\n\n### Risk Analysis\n1. **Security:** Account Aggregator (AA) framework regulated by RBI. Command gets **read-only access** — we can never move money or initiate transactions. Your bank credentials are never stored.\n2. **Data Scope:** Only transaction data is shared. Passwords, PINs, and card numbers are never transmitted.\n3. **Revocable:** You can unlink at any time from Settings → Linked Accounts. All historical data is deleted within 30 days.\n\n### Your Choices\n1. **Link HDFC Salary Account (Recommended):** Your primary account. Gets you 200 points + most comprehensive tracking.\n2. **Link all accounts:** HDFC + any secondary accounts for complete financial picture.\n3. **Skip for now:** Use manual entry. Less accurate, higher effort.\n\n### Tax Implications\n• Linking has no tax implications. However, the automated tracking it enables helps you identify tax-saving opportunities (like unclaimed 80C deductions, excess spending that could be redirected to ELSS, or forgotten insurance premiums eligible under 80D) that you'd otherwise miss.",
    suggestions: ["Link HDFC Account", "How secure is AA framework?"],
  },

  // ── Spend: Summer Trip Budget ──
  "I've already booked flights for my summer trip, but I need to plan for the hotel bills which I'll pay during the trip. Help me budgert for this.": {
    response: "Let's build a comprehensive summer trip budget.\n\n**Flights:** Already booked ✅\n**Estimated Hotel + On-Ground Costs:**\n• Hotels (5 nights): ₹45,000-60,000\n• Local transport: ₹8,000-12,000\n• Food & dining: ₹15,000-20,000\n• Activities & shopping: ₹10,000-15,000\n• **Total estimated: ₹78,000-₹1,07,000**\n\n### The \"So What\"\nYour summer trip spend (₹80K-1.1L) is a significant one-time outflow — roughly 2.5x your monthly budget. Without pre-planning, this hits your savings rate hard and may force you to skip a month of SIPs. A dedicated trip sinking fund prevents any disruption to your wealth-building engine.\n\n### Risk Analysis\n1. **Budget Overrun:** Trip spending typically exceeds budget by 20-30%. Plan for ₹1.1L even if you estimate ₹80K.\n2. **Currency/Dynamic Pricing:** If traveling internationally, forex spreads add 2-3% to card transactions. If domestic, hotel prices spike closer to peak season.\n3. **Credit Card Float Trap:** It's tempting to swipe everything on Regalia for points and 'pay later.' But a ₹1L Regalia bill at 3.5%/month interest (if missed) = ₹3,500 penalty.\n\n### Your Choices\n1. **Start a trip RD: ₹25K/month for 3 months (Recommended):** Accumulates ₹75K + interest by May. Top up the remaining ₹25K from monthly surplus. Zero disruption to SIPs.\n2. **Redeem ₹1.2L from Liquid Fund:** You have ₹6L in liquid. Withdrawing ₹1.2L still leaves 5.3 months of emergency cover (target is 6). Acceptable but tight.\n3. **Card + EMI:** Swipe Regalia for hotel on EMI. Avoid this — EMI costs negate cashback, and it creates a 3-6 month drag on cash flow.\n\n### Tax Implications\n• Travel expenses are **not tax-deductible** for salaried individuals.\n• **Hotel booking tip:** If booking via Regalia SmartBuy, you earn 10x reward points on hotels — worth 3.3% cashback. On ₹60K hotels, that's ₹1,980 in tax-free rewards.\n• **Don't withdraw from ELSS** for the trip — it has a 3-year lock-in, and early withdrawal isn't even possible. Plan from liquid sources only.",
    suggestions: ["Start ₹25K RD for trip", "Withdraw from Liquid Fund", "Book hotels via SmartBuy"],
  },

  // ── Spend: Netflix Subscription ──
  "You mentioned my Netflix usage is low compared to the cost. Should I cancel it or downgrade?": {
    response: "Let's look at your Netflix value analysis.\n\n**Current Plan:** Premium — ₹649/month\n**Monthly Usage:** ~3 hours (based on last 3 months average)\n**Cost per hour of viewing:** ₹216/hr\n\n**Comparison:**\n| Plan | Price | Screens | Quality | Your Cost/hr |\n|------|-------|---------|---------|------|\n| Premium (Current) | ₹649 | 4 | 4K | ₹216 |\n| Standard | ₹499 | 2 | 1080p | ₹166 |\n| Basic with Ads | ₹149 | 1 | 720p | ₹50 |\n\n### The \"So What\"\nYou're paying for 4 screens and 4K streaming but watching only 3 hours/month on presumably one device. At ₹216/hr, Netflix is your most expensive entertainment per hour — a movie ticket at PVR is cheaper at ₹150/hr. Downgrading to Basic with Ads saves you **₹6,000/year** while still giving you access to the full content library.\n\n### Risk Analysis\n1. **Usage Rebound:** Your 3-hr average might spike during a new season release (Stranger Things, etc.). But even at 10 hrs/month, Basic with Ads at ₹15/hr is still excellent value.\n2. **Family Usage:** If family members use your account, Premium's 4 screens matter. Check if others are actively using it before downgrading.\n3. **Ad Tolerance:** Basic with Ads shows 4-5 minutes of ads per hour. If this is a dealbreaker, Standard (₹499) is the middle ground.\n\n### Your Choices\n1. **Downgrade to Basic with Ads — ₹149/mo (Recommended):** Save ₹500/month (₹6,000/year). Same content, minor ads.\n2. **Downgrade to Standard — ₹499/mo:** Save ₹150/month (₹1,800/year). No ads, 1080p quality.\n3. **Cancel entirely:** Save ₹649/month (₹7,788/year). Use free alternatives (YouTube, JioCinema free tier).\n4. **Keep Premium:** If family actively uses 2+ screens, the ₹649 is justified.\n\n### Tax Implications\n• Subscription payments are **not tax-deductible**.\n• The ₹6,000/year saved from downgrading, redirected to ELSS: generates ₹1,860 in additional tax savings (₹6K × 31%). **Total annual benefit: ₹7,860** — almost the cost of a full year of Basic with Ads.",
    suggestions: ["Downgrade to Basic with Ads", "Downgrade to Standard", "Check family usage first"],
  },

  // ── Action/Advisor: Insurance Switch ──
  "I noticed you're paying ₹18k for HDFC Ergo. ICICI Lombard offers better coverage for ₹14k. Shall we switch?": {
    response: "Here's a detailed comparison to help you decide on the switch.\n\n**Side-by-Side Comparison:**\n| Feature | HDFC Ergo (Current) | ICICI Lombard |\n|---------|--------------------|---------|\n| Premium | ₹18,000/yr | ₹14,000/yr |\n| IDV | ₹7.2L | ₹7.4L |\n| NCB | 35% (transfers) | 35% (honored) |\n| RSA | ✅ | ✅ |\n| Zero Depreciation | ✅ | ✅ |\n| Engine Protection | ❌ (₹2K add-on) | ✅ Included |\n| Consumables Cover | ❌ | ✅ Included |\n| CSR | 98.1% | 96.7% |\n\n### The \"So What\"\nICICI Lombard saves you **₹4,000/year** while providing *better* coverage — higher IDV (₹7.4L vs ₹7.2L), engine protection included free, and consumables cover thrown in. You're currently paying a premium for the HDFC Ergo brand name with inferior benefits. Over 5 years of car ownership, that's **₹20,000 saved** with objectively better protection.\n\n### Risk Analysis\n1. **CSR Difference:** HDFC Ergo (98.1%) has a marginally better claim settlement ratio than ICICI Lombard (96.7%). In practice, both are top-tier — the 1.4% gap represents ~1 in 70 claims being contested, not rejected.\n2. **Switch Process:** Your NCB (No Claim Bonus) of 35% transfers automatically. IRDAI mandates it. No risk of losing your discount.\n3. **Garage Network:** Verify ICICI Lombard's cashless garage network in your area. Both have 5,000+ garages nationally, but local availability matters.\n\n### Your Choices\n1. **Switch to ICICI Lombard now (Recommended):** Same coverage + engine protection + ₹4K savings. 15-minute online process.\n2. **Negotiate with HDFC Ergo first:** Call retention desk, mention ICICI quote. They may match or offer engine protection free.\n3. **Wait for renewal date:** Switch at renewal to avoid mid-term cancellation. Usually cleaner but delays savings.\n\n### Tax Implications\n• Car insurance premiums are **not tax-deductible** for salaried individuals.\n• The ₹4,000/year saved, invested in ELSS: generates ₹1,240 in tax savings (30% slab). **Net annual benefit: ₹5,240.**\n• If you use your car for business (freelancing, Uber, etc.), the entire premium becomes deductible under Section 37(1).",
    suggestions: ["Switch to ICICI Lombard", "Negotiate with HDFC Ergo", "Compare more insurers"],
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
  const [showDetailScreen, setShowDetailScreen] = useState(!!activeItem)
  const [detailLevel, setDetailLevel] = useState(1)
  const [activeInsight, setActiveInsight] = useState(null)
  const chatEndRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Process incoming card context
  useEffect(() => {
    if (activeCard && activeCard.context && !showDetailScreen) {
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
  }, [activeCard, showDetailScreen])

  /* ─── Deep-dive options per action card ─── */
  const getDeepDives = (item) => {
    const map = {
      // ── Existing Action Card entries ──
      'rebalance': [
        { label: 'Show me the math', query: item.context },
        { label: 'Which funds to sell first?', query: 'Which specific funds should I sell first to rebalance my equity from 73% to 60%? Factor in LTCG tax impact.' },
        { label: 'How long can I wait safely?', query: 'What happens if I delay this rebalance by 3 months? What is the downside risk?' },
      ],
      'insurance-gap': [
        { label: 'How much cover exactly?', query: item.context },
        { label: 'Term vs ULIP — which wins?', query: "I'm considering term insurance. What's the fundamental difference vs ULIP and why should I choose term?" },
        { label: 'Compare top 3 plans', query: 'Compare the top 3 term insurance plans for a 32-year-old wanting ₹1Cr cover. Give premiums and claim settlement ratios.' },
      ],
      'gold-correction': [
        { label: 'Should I buy at this dip?', query: item.context },
        { label: 'SGB vs Gold ETF — right now?', query: 'SGB vs Gold ETF — which is better given the current 4% dip in gold prices?' },
        { label: "What's my ideal exposure?", query: 'Calculate my optimal gold allocation given my ₹75L portfolio and current 11% exposure in SGB.' },
      ],
      // ── Money FlipCard entries ──
      'net-worth': [
        { label: 'Break down my ₹1.25Cr', query: 'Break down my ₹1.25Cr net worth across every asset — equity funds, gold, property, savings. What percentage is each and where am I over-concentrated?' },
        { label: 'How to reach ₹2Cr faster?', query: 'I have ₹1.25Cr net worth growing at 18.4% XIRR. What is the fastest realistic path to ₹2Cr? Factor in my current SIPs and market conditions.' },
        { label: 'Am I too concentrated anywhere?', query: 'Is my ₹1.25Cr portfolio too concentrated in any single asset class or fund? Check diversification and suggest specific rebalancing moves.' },
      ],
      'portfolio-mix': [
        { label: 'Is short-term bucket dangerously low?', query: 'My short-term bucket is only ₹9L against a target of ₹12L. Is this risky? What emergency scenarios could this fail in?' },
        { label: 'Rebalance with zero tax hit', query: 'Give me a step-by-step rebalance plan to fix my 4-bucket allocation. Minimize tax impact while moving ₹3L to the short-term bucket.' },
        { label: 'Best allocation for my age & risk', query: 'What is the ideal 4-bucket allocation for a 32-year-old with moderate risk appetite, ₹75L invested, and goals including house purchase and retirement?' },
      ],
      'top-gainers': [
        { label: 'Should I book profits in small caps?', query: 'Quant Small Cap is +64% and my small cap allocation is 24% vs 15% target. Should I book partial profits now? How much and where to reinvest?' },
        { label: 'What to do about Axis Bluechip?', query: 'Axis Bluechip is at -3% return while Nifty is up 15%. Should I exit, hold, or switch to a better large cap fund? Compare alternatives.' },
        { label: 'Reinvest profits where?', query: 'If I trim ₹2L from my top gainers, where should I redeploy — debt funds, balanced advantage, or international equity? Consider current market conditions.' },
      ],
      'life-goals': [
        { label: 'How to close ₹12L house gap?', query: 'My house down-payment goal is ₹12L short with 2.8 years left. Currently saving ₹18k/mo via SIP. Can I close this gap faster by increasing SIP or using a bonus?' },
        { label: 'Is retirement SIP of ₹25k enough?', query: 'My retirement goal is ₹3Cr, currently at ₹45L (15%). Is ₹25k/mo SIP on track to reach ₹3Cr by 2050 or do I need to increase it? Show me projections.' },
        { label: 'Child education needs ₹39L more', query: 'Child education goal needs ₹39L more over 14 years. My SIP is ₹12k/mo. Is the XIRR assumption of 12% realistic? What if returns are lower?' },
      ],
      // ── Spend FlipCard entries ──
      'feb-outflow': [
        { label: 'Where exactly am I overspending?', query: 'Break down my ₹27.4k February spending by category — Travel ₹9.6k, Food ₹6.2k, Shopping ₹5.6k, Transport ₹3.2k, Subscriptions ₹2.8k. Flag where I am over my usual average.' },
        { label: 'Daily budget to stay on track', query: 'I have ₹17.6k left for 26 days in February. What is my safe daily budget? Which categories should I cut first to stay within ₹45k?' },
        { label: 'Compare with last 3 months', query: 'Compare my February spending of ₹27.4k with December, January, and November. Show me the trend and flag any escalating categories.' },
      ],
      'credit-cards': [
        { label: 'Best card for each category', query: 'Which of my 3 cards (Regalia, Amazon, Gold) should I use for dining, shopping, travel, and groceries? Optimize for maximum rewards on each category.' },
        { label: 'Am I losing rewards anywhere?', query: 'Analyze my card usage: Regalia ₹45k, Amazon ₹12.1k, Gold ₹24.75k. Am I using the wrong card for any spending category and losing potential cashback?' },
        { label: 'Should I close any card?', query: 'I have 3 credit cards with annual fees. Is each card justified? Should I close any card or consolidate spending to fewer cards?' },
      ],
      'upcoming-expenses': [
        { label: 'Fund the ₹11k insurance gap', query: 'Insurance premium needs ₹11k more by Mar 20. Where should this come from — salary account, savings, or liquid fund? What is the safest source without disrupting SIPs?' },
        { label: 'Plan the ₹15k car service', query: 'Car service is ₹15k in April with no funding planned. Help me set aside money from the next salary cycle without disrupting my ₹35k/mo SIP commitment.' },
        { label: 'Auto-fund future expenses', query: 'How can I set up automatic funding for big upcoming expenses so I am never caught short? Suggest RD, sweep-in, or goal-based saving strategies.' },
      ],
      // ── Rewards FlipCard entries ──
      'gold-status': [
        { label: 'Fastest path to Platinum', query: 'I am 150 points from Platinum. I have 3 challenges worth 700 points total. What is the fastest way — complete challenges, earn through spending, or a combination?' },
        { label: 'Is Platinum worth the effort?', query: 'Platinum gives 2% cashback, 8 lounge visits, ₹5k voucher, fee waiver, AI concierge. For my ₹1.2L annual card spend, is the total value worth pursuing?' },
        { label: 'Gold vs Platinum side-by-side', query: 'Show me a side-by-side comparison of my current Gold tier benefits vs Platinum benefits. Quantify the annual value difference in rupees.' },
      ],
      'challenges': [
        { label: 'How to win No Spend Week?', query: 'I am on day 5 of 7 in No Spend Week challenge. Give me tactical tips — meal prep, free entertainment, avoiding triggers — to survive 2 more days.' },
        { label: 'Credit Builder — pay early how?', query: 'Credit Builder challenge: pay a card bill 10+ days before due date. Which card should I pay, how much does it improve my credit score, and when is the optimal timing?' },
        { label: 'Automate SIP streak forever', query: 'SIP streak is 6/12 months. How do I ensure I never miss a month? Set up failsafes — backup mandates, alerts, buffer in salary account — so this runs on autopilot.' },
      ],
      'rewards-earned': [
        { label: 'How to earn ₹4.2k more this year', query: 'Break down exactly what actions I need to take to earn ₹4.2k more in rewards: which card for which category, which offers to activate, and points to redeem vs accumulate.' },
        { label: 'Redeem or accumulate points?', query: 'I have reward points across 3 cards. Should I redeem now for cashback or accumulate for bigger redemptions like flight upgrades or hotel nights?' },
        { label: 'Card optimization cheat sheet', query: 'Create a simple card optimization cheat sheet: for every spending category in my life, tell me which of my 3 cards to swipe for maximum rewards.' },
      ],
    }
    return map[item.id] || [
      { label: 'Analyze this for me', query: item.context },
      { label: "What's my best next step?", query: `Based on: ${item.title} — ${item.subtitle}. What is the single best next step I should take?` },
      { label: 'Show me the financial impact', query: `What is the quantified financial impact of: ${item.title}? Give me numbers and timelines.` },
    ]
  }

  /* ─── Card Visual Data (rich context per FlipCard) ─── */
  const getCardVisual = (cardId) => {
    const v = {
      'net-worth': {
        metrics: [
          { label: 'Assets', value: '₹1.40Cr', color: '#10B981' },
          { label: 'Debts', value: '₹12.4L', color: '#EF4444' },
          { label: 'XIRR', value: '18.4%', color: '#4F46E5' },
          { label: 'SIP/Mo', value: '₹35k', color: '#0EA5E9' },
        ],
        bars: [
          { label: 'Real Estate', pct: 36, color: '#E11D48', detail: '₹50L • 8.5%' },
          { label: 'Equity MFs', pct: 28, color: '#4F46E5', detail: '₹38.8L • 22.1%' },
          { label: 'FDs & Bonds', pct: 7, color: '#0EA5E9', detail: '₹10.5L • 7.4%' },
          { label: 'Gold (SGB)', pct: 4, color: '#F59E0B', detail: '₹5.5L • 14.8%' },
          { label: 'Stocks/ETFs', pct: 6, color: '#10B981', detail: '₹8L • 16.2%' },
        ],
        sparkline: [18, 22, 25, 28, 34, 42, 55, 62, 75, 88, 102, 125],
        alerts: [
          { type: 'warning', text: 'Equity at 65% — above 60% target. Rebalance ₹3.8L → debt' },
          { type: 'positive', text: '18.4% XIRR beating 12% benchmark by 6.4%' },
        ],
      },
      'portfolio-mix': {
        metrics: [
          { label: 'Liquid', value: '₹6L (8%)', color: '#10B981' },
          { label: 'Short', value: '₹9L (12%)', color: '#0EA5E9' },
          { label: 'Medium', value: '₹15L (20%)', color: '#F59E0B' },
          { label: 'Long', value: '₹45L (60%)', color: '#4F46E5' },
        ],
        segments: [
          { value: 8, color: '#10B981' },
          { value: 12, color: '#0EA5E9' },
          { value: 20, color: '#F59E0B' },
          { value: 60, color: '#4F46E5' },
        ],
        bars: [
          { label: 'Liquid (< 6mo)', pct: 8, color: '#10B981', detail: '5.2% XIRR' },
          { label: 'Short (6mo–2yr)', pct: 12, color: '#0EA5E9', detail: '7.8% XIRR' },
          { label: 'Medium (2–5yr)', pct: 20, color: '#F59E0B', detail: '12.4% XIRR' },
          { label: 'Long (5yr+)', pct: 60, color: '#4F46E5', detail: '22.1% XIRR' },
        ],
        alerts: [
          { type: 'warning', text: 'Short-term bucket needs +₹3L to hit target' },
          { type: 'warning', text: 'Medium bucket 73% equity — rebalance ₹1.2L to debt' },
        ],
      },
      'top-gainers': {
        metrics: [
          { label: 'Best Fund', value: '+64%', color: '#10B981' },
          { label: 'Alpha vs Nifty', value: '+8.2%', color: '#059669' },
          { label: 'Sharpe', value: '1.7', color: '#4F46E5' },
          { label: 'Funds in Green', value: '4 of 6', color: '#10B981' },
        ],
        funds: [
          { name: 'Quant Small Cap', ret: '+64%', val: '₹12.4L', tag: '📈 Book Profit', tagColor: '#92400E', tagBg: '#FEF3C7' },
          { name: 'HDFC MidCap', ret: '+41%', val: '₹8.1L', tag: '✅ Hold', tagColor: '#065F46', tagBg: '#ECFDF5' },
          { name: 'PPFAS Flexi', ret: '+28%', val: '₹18.2L', tag: '✅ Hold', tagColor: '#065F46', tagBg: '#ECFDF5' },
          { name: 'SGB 2028', ret: '+14%', val: '₹5.5L', tag: '🛡️ Steady', tagColor: '#475569', tagBg: '#F1F5F9' },
          { name: 'ICICI Pru Value', ret: '+4%', val: '₹3L', tag: '👀 Watch', tagColor: '#92400E', tagBg: '#FFFBEB' },
          { name: 'Axis Bluechip', ret: '-3%', val: '₹2.1L', tag: '🚫 Exit', tagColor: '#991B1B', tagBg: '#FEF2F2' },
        ],
        alerts: [
          { type: 'warning', text: 'Small Cap ₹12.4L — high concentration. Trim ₹2L' },
          { type: 'negative', text: 'Axis Bluechip negative 12mo — consider exiting' },
        ],
      },
      'life-goals': {
        metrics: [
          { label: 'Goals', value: '4 Active', color: '#4F46E5' },
          { label: 'On Track', value: '2 of 4', color: '#10B981' },
          { label: 'Monthly SIP', value: '₹55k', color: '#0EA5E9' },
          { label: 'Biggest Gap', value: '₹2.55Cr', color: '#EF4444' },
        ],
        goals: [
          { label: 'Emergency Fund', saved: '₹6L', target: '₹6L', pct: 100, color: '#10B981', status: 'Done ✓' },
          { label: 'House Down-pay', saved: '₹13.6L', target: '₹20L', pct: 68, color: '#E11D48', status: '₹6.4L away' },
          { label: 'Child Education', saved: '₹11L', target: '₹50L', pct: 22, color: '#F59E0B', status: '14 yrs left' },
          { label: 'Retirement', saved: '₹45L', target: '₹3Cr', pct: 15, color: '#4F46E5', status: '24 yrs left' },
        ],
        alerts: [
          { type: 'warning', text: 'Child Education SIP needs +₹5k/mo for 12% track' },
          { type: 'positive', text: 'House down-payment on track for Mar 2029' },
        ],
      },
      'feb-outflow': {
        metrics: [
          { label: 'Spent', value: '₹27.4k', color: '#F97316' },
          { label: 'Budget', value: '₹45k', color: '#64748B' },
          { label: 'Safe/Day', value: '₹677', color: '#10B981' },
          { label: 'vs Last Mo', value: '-12%', color: '#10B981' },
        ],
        gauge: { value: 61, label: '61% Used' },
        categories: [
          { label: 'Travel', val: 9.6, max: 12, color: '#F97316' },
          { label: 'Food & Dining', val: 6.2, max: 10, color: '#EF4444' },
          { label: 'Shopping', val: 5.6, max: 6, color: '#8B5CF6' },
          { label: 'Transport', val: 3.2, max: 5, color: '#0EA5E9' },
          { label: 'Subscriptions', val: 2.8, max: 4, color: '#10B981' },
        ],
        alerts: [
          { type: 'warning', text: 'Shopping ₹5.6k — 93% of category budget used' },
          { type: 'positive', text: '12% less than January — good trend' },
        ],
      },
      'credit-cards': {
        metrics: [
          { label: 'Used', value: '₹81.9k', color: '#4F46E5' },
          { label: 'Limit', value: '₹4L', color: '#64748B' },
          { label: 'Utilization', value: '20%', color: '#10B981' },
          { label: 'Cards', value: '3 Active', color: '#0EA5E9' },
        ],
        cards: [
          { name: 'HDFC Regalia', used: '₹45k', limit: '₹1.2L', pct: 38, color: '#3B82F6', tip: '4x dining' },
          { name: 'ICICI Amazon', used: '₹12.1k', limit: '₹80k', pct: 15, color: '#F59E0B', tip: '5% Amazon' },
          { name: 'Gold Member', used: '₹24.75k', limit: '₹2L', pct: 12, color: '#D97706', tip: '2% cashback' },
        ],
        alerts: [
          { type: 'info', text: 'Switch dining to Regalia — saves ~₹1,200/yr' },
          { type: 'positive', text: '20% utilization — excellent for credit score' },
        ],
      },
      'upcoming-expenses': {
        metrics: [
          { label: 'Total Due', value: '₹2.8L', color: '#EF4444' },
          { label: 'Funded', value: '₹1.62L', color: '#10B981' },
          { label: 'Gap', value: '₹26k', color: '#F59E0B' },
          { label: 'Timeline', value: '90 days', color: '#0EA5E9' },
        ],
        expenses: [
          { label: 'School Fee', when: 'Mar 5', amount: '₹42k', pct: 100, color: '#10B981', status: 'Funded' },
          { label: 'Insurance', when: 'Mar 20', amount: '₹28k', pct: 60, color: '#F59E0B', status: '₹11k short' },
          { label: 'Summer Trip', when: 'May', amount: '₹1.2L', pct: 100, color: '#0EA5E9', status: 'Budgeted' },
          { label: 'Car Service', when: 'Apr', amount: '₹15k', pct: 0, color: '#EF4444', status: 'Unplanned' },
        ],
        alerts: [
          { type: 'warning', text: 'Move ₹11k to salary a/c by Mar 15 for insurance' },
          { type: 'negative', text: 'Car service ₹15k completely unfunded' },
        ],
      },
      'gold-status': {
        metrics: [
          { label: 'Points', value: '1,850', color: '#D97706' },
          { label: 'Status', value: 'Gold', color: '#F59E0B' },
          { label: 'To Platinum', value: '150 pts', color: '#4F46E5' },
          { label: 'Progress', value: '92%', color: '#D97706' },
        ],
        progressBar: { value: 92, label: 'Gold → Platinum', color: '#D97706' },
        benefits: [
          { label: '2% Cashback', value: '~₹6k/yr', color: '#4F46E5' },
          { label: 'Lounge Access', value: '8 visits/yr', color: '#0EA5E9' },
          { label: '₹5k Voucher', value: 'On upgrade', color: '#10B981' },
          { label: 'Fee Waiver', value: '₹2,500', color: '#F59E0B' },
        ],
        alerts: [
          { type: 'positive', text: '92% there — complete 1 challenge to cross' },
          { type: 'info', text: 'Platinum value: ~₹13.5k/yr in perks' },
        ],
      },
      'challenges': {
        metrics: [
          { label: 'Active', value: '3', color: '#4F46E5' },
          { label: 'Points Pool', value: '700 pts', color: '#F59E0B' },
          { label: 'Closest', value: '2 days', color: '#10B981' },
          { label: 'Impact', value: 'Platinum', color: '#D97706' },
        ],
        challenges: [
          { label: 'No Spend Week', progress: 71, color: '#F59E0B', reward: '+500 pts', status: '5/7 days', tip: 'Avoid Swiggy for 2 more days' },
          { label: 'Credit Builder', progress: 40, color: '#8B5CF6', reward: 'Score+', status: 'Pay early', tip: 'Pay HDFC ₹12k by Mar 10' },
          { label: 'SIP Streak', progress: 50, color: '#4F46E5', reward: '+200 pts', status: '6/12 mo', tip: 'Keep auto-SIP running' },
        ],
        alerts: [
          { type: 'positive', text: 'No Spend Week — just 2 more days to earn 500 pts!' },
          { type: 'info', text: 'Complete all 3 → instant Platinum upgrade' },
        ],
      },
      'rewards-earned': {
        metrics: [
          { label: 'Earned', value: '₹8,240', color: '#10B981' },
          { label: 'Possible', value: '+₹4.2k', color: '#4F46E5' },
          { label: 'Best Card', value: 'Regalia', color: '#3B82F6' },
          { label: 'This Month', value: '₹1.1k', color: '#F59E0B' },
        ],
        rewards: [
          { label: 'Card Cashback', amount: '₹4,120', pct: 50, color: '#4F46E5' },
          { label: 'Offer Savings', amount: '₹2,300', pct: 28, color: '#10B981' },
          { label: 'Points Redeemed', amount: '₹1,200', pct: 15, color: '#F59E0B' },
          { label: 'Fee Waivers', amount: '₹620', pct: 7, color: '#0EA5E9' },
        ],
        alerts: [
          { type: 'info', text: 'Switch grocery to Regalia — saves ₹200/mo' },
          { type: 'positive', text: 'On track for ₹12.4k this year' },
        ],
      },
      'portfolio-rebalance': {
        metrics: [
          { label: 'Target Equity', value: '30%', color: '#10B981' },
          { label: 'Current Equity', value: '73%', color: '#EF4444' },
          { label: 'Action', value: 'Move ₹1.2L', color: '#F59E0B' },
          { label: 'Bucket', value: 'Medium', color: '#0EA5E9' },
        ],
        bars: [
          { label: 'Current Mix', pct: 73, color: '#EF4444', detail: 'Heavy Equity' },
          { label: 'Target Mix', pct: 30, color: '#10B981', detail: 'Balanced' },
        ],
        alerts: [
          { type: 'warning', text: 'High risk exposure on Medium Term goals. Protect your gains by moving ₹1.2L away from equity.' }
        ]
      },
      'rebalance': { // Alias for Money.jsx mapping
        metrics: [
          { label: 'Target Equity', value: '30%', color: '#10B981' },
          { label: 'Current Equity', value: '73%', color: '#EF4444' },
          { label: 'Action', value: 'Move ₹1.2L', color: '#F59E0B' },
        ],
        bars: [
          { label: 'Current Mix', pct: 73, color: '#EF4444', detail: 'Heavy Equity' },
          { label: 'Target Mix', pct: 30, color: '#10B981', detail: 'Balanced' },
        ],
        alerts: [
          { type: 'warning', text: 'High risk exposure on Medium Term goals. Protect your gains.' }
        ]
      },
      'insurance-gap': {
        metrics: [
          { label: 'Current Life Cover', value: '₹0', color: '#EF4444' },
          { label: 'Required Cover', value: '₹1 Cr', color: '#10B981' },
          { label: 'Est. Premium', value: '₹800/mo', color: '#0EA5E9' },
          { label: 'Dependents', value: '2', color: '#F59E0B' },
        ],
        bars: [
          { label: 'Protection Gap', pct: 100, color: '#EF4444', detail: '₹1 Cr Unfunded Exposure' },
          { label: 'Current Cover', pct: 5, color: '#F8FAFC', detail: '₹0' },
        ],
        alerts: [
          { type: 'negative', text: 'Zero life cover detected for a ₹75L portfolio owner with dependents.' },
          { type: 'info', text: 'A ₹1 Cr term plan provides total peace of mind for just ~₹800/month.' }
        ]
      },
      'tax-nps': {
        metrics: [
          { label: 'Refund Prop.', value: '₹15,600', color: '#10B981' },
          { label: 'Required Inv.', value: '₹50,000', color: '#4F46E5' },
          { label: 'Section', value: '80CCD(1B)', color: '#0EA5E9' },
          { label: 'Deadline', value: 'Mar 31', color: '#EF4444' },
        ],
        bars: [
          { label: 'Max 80CCD limit', pct: 100, color: '#10B981', detail: '₹50,000' },
          { label: 'Current NPS Inv.', pct: 0, color: '#E2E8F0', detail: '₹0' },
        ],
        alerts: [
          { type: 'positive', text: 'Investing ₹50,000 in NPS drops your tax liability instantly.' },
          { type: 'warning', text: 'Only 3 weeks remaining to claim this deduction for FY23-24.' }
        ]
      },
      'insurance-review': {
        metrics: [
          { label: 'Current Premium', value: '₹18,000', color: '#EF4444' },
          { label: 'New Premium', value: '₹14,000', color: '#10B981' },
          { label: 'Net Savings', value: '₹4,000/yr', color: '#059669' },
          { label: 'Coverage', value: 'Matched', color: '#4F46E5' },
        ],
        bars: [
          { label: 'HDFC Ergo (Current)', pct: 100, color: '#EF4444', detail: '₹18,000' },
          { label: 'ICICI Lombard (New)', pct: 77, color: '#10B981', detail: '₹14,000' },
        ],
        alerts: [
          { type: 'positive', text: 'Switching saves ₹4,000 annually with identical coverage bounds.' },
          { type: 'info', text: 'Takes ~5 mins. Zero paperwork required.' }
        ]
      },
      'idle-cash': {
        metrics: [
          { label: 'Idle Cash', value: '₹1.3L', color: '#EF4444' },
          { label: 'Savings Rate', value: '3.0%', color: '#F59E0B' },
          { label: 'Liquid Fund', value: '7.2%', color: '#10B981' },
          { label: 'Gain Gained', value: '+₹4.9k/yr', color: '#059669' },
        ],
        bars: [
          { label: 'Liquid Fund Ret.', pct: 100, color: '#10B981', detail: '7.2%' },
          { label: 'Savings A/C Ret.', pct: 41, color: '#F59E0B', detail: '3.0%' },
        ],
        alerts: [
          { type: 'warning', text: '₹1.3L is losing purchasing power against 6% inflation.' },
          { type: 'positive', text: 'Liquid funds offer identical liquidity but double the returns.' }
        ]
      },
      'zomato-spend': {
        metrics: [
          { label: 'Feb Spend', value: '₹8,420', color: '#EF4444' },
          { label: 'Trend', value: '+32%', color: '#F97316' },
          { label: 'Proposed Cap', value: '₹6k/mo', color: '#10B981' },
          { label: 'Annual Save', value: '₹24,000', color: '#4F46E5' },
        ],
        bars: [
          { label: 'February', pct: 100, color: '#EF4444', detail: '₹8,420' },
          { label: 'January', pct: 75, color: '#F59E0B', detail: '₹6,380' },
          { label: 'Target', pct: 71, color: '#10B981', detail: '₹6,000' },
        ],
        alerts: [
          { type: 'negative', text: 'Zomato/Swiggy expenses have grown for 3 straight months.' },
          { type: 'info', text: 'Capping at ₹1,500/week saves enough for an extra SIP.' }
        ]
      },
      'house-goal': {
        metrics: [
          { label: 'Target', value: '₹20L', color: '#4F46E5' },
          { label: 'Saved', value: '₹13.6L', color: '#10B981' },
          { label: 'Gap', value: '₹6.4L', color: '#EF4444' },
          { label: 'Timeline', value: 'Mar 2029', color: '#0EA5E9' },
        ],
        bars: [
          { label: 'Current Progress', pct: 68, color: '#10B981', detail: '68% Funded' },
          { label: 'Remaining Gap', pct: 32, color: '#E2E8F0', detail: '32% away' },
        ],
        alerts: [
          { type: 'positive', text: 'You are perfectly on track for the Mar 2029 deadline.' },
          { type: 'info', text: 'Continue the current ₹28k/mo SIP mapping to hit the target securely.' }
        ]
      },
      'platinum-push': {
        metrics: [
          { label: 'To Platinum', value: '150 pts', color: '#4F46E5' },
          { label: 'Current Level', value: 'Gold', color: '#D97706' },
          { label: 'Value Unlock', value: '₹13.5k/yr', color: '#10B981' },
          { label: 'Fastest Path', value: '2 days', color: '#0EA5E9' },
        ],
        bars: [
          { label: 'Progress to Platinum', pct: 92, color: '#4F46E5', detail: '1850 / 2000' },
        ],
        alerts: [
          { type: 'positive', text: 'Just 1 challenge completion away from a massive perk upgrade.' },
          { type: 'info', text: 'Finish the "No Spend Week" challenge to instantly earn 500 pts.' }
        ]
      },
      'credit-score': {
        metrics: [
          { label: 'Utilization', value: '45%', color: '#EF4444' },
          { label: 'Safe Limit', value: '<30%', color: '#10B981' },
          { label: 'Equifax Score', value: '740', color: '#F59E0B' },
          { label: 'Impact', value: 'Score Dip -15', color: '#EF4444' },
        ],
        bars: [
          { label: 'Spiked Utilization', pct: 45, color: '#EF4444', detail: 'Above 30% safe zone' },
        ],
        alerts: [
          { type: 'negative', text: 'Credit utilization breached the 30% threshold this month.' },
          { type: 'warning', text: 'Pay down ₹12,000 immediately to recover score points next cycle.' }
        ]
      },
      'small-cap-trim': {
        metrics: [
          { label: 'Fund Return', value: '+64%', color: '#10B981' },
          { label: 'Current Val', value: '₹12.4L', color: '#4F46E5' },
          { label: 'Allocation', value: '28%', color: '#EF4444' },
          { label: 'Action', value: 'Trim ₹2L', color: '#F59E0B' },
        ],
        bars: [
          { label: 'Small Cap All.', pct: 28, color: '#EF4444', detail: 'Concentration Risk' },
          { label: 'Target All.', pct: 15, color: '#10B981', detail: 'Safe Zone' },
        ],
        alerts: [
          { type: 'warning', text: 'Small Cap exposure has grown to 28% of equity due to massive rally.' },
          { type: 'positive', text: 'Booking ₹2L profit now locks in gains tax-efficiently.' }
        ]
      },
      'expenses-funding': {
        metrics: [
          { label: 'Total Needed', value: '₹1.25L', color: '#EF4444' },
          { label: 'Available', value: '₹95k', color: '#10B981' },
          { label: 'Shortfall', value: '₹30k', color: '#F59E0B' },
          { label: 'Timeline', value: 'Jun / Jul', color: '#0EA5E9' },
        ],
        bars: [
          { label: 'Funded', pct: 76, color: '#10B981', detail: '₹95,000' },
          { label: 'Shortfall', pct: 24, color: '#EF4444', detail: '₹30,000' },
        ],
        alerts: [
          { type: 'warning', text: 'Upcoming Vacation (₹80K) + Insurance (₹45K) have a ₹30K gap.' },
          { type: 'info', text: 'We can pause 1 discretionary SIP for 2 months to bridge this without debt.' }
        ]
      },
      'gold-correction': {
        metrics: [
          { label: 'SGB Price', value: '₹5,788', color: '#10B981' },
          { label: 'Correction', value: '-4.0%', color: '#EF4444' },
          { label: 'Curr. Exp.', value: '11%', color: '#F59E0B' },
          { label: 'Target Exp.', value: '15%', color: '#4F46E5' },
        ],
        bars: [
          { label: 'Target Allocation', pct: 15, color: '#10B981', detail: '15%' },
          { label: 'Current Allocation', pct: 11, color: '#F59E0B', detail: '11% (₹0.51L)' },
        ],
        alerts: [
          { type: 'positive', text: 'Gold is trading at a 4% discount from peak, offering a buying window.' },
          { type: 'info', text: 'Adding ₹20k SGB now brings exposure closer to the 15% target.' }
        ]
      },
      'portfolio': {
        metrics: [
          { label: 'Total Value', value: '₹1.25 Cr', color: '#10B981' },
          { label: 'XIRR', value: '18.4%', color: '#4F46E5' },
          { label: 'Risk Level', value: 'High', color: '#EF4444' },
          { label: 'Status', value: 'Needs Rebalance', color: '#F59E0B' },
        ],
        segments: [
          { value: 65, color: '#4F46E5' }, // Equity
          { value: 20, color: '#0EA5E9' }, // Debt
          { value: 10, color: '#F59E0B' }, // Gold
          { value: 5, color: '#10B981' },  // Cash
        ],
        alerts: [
          { type: 'warning', text: 'Equity allocation is 65%, exceeding your 50% target. High risk detected.' },
          { type: 'positive', text: 'Portfolio XIRR is beating inflation by 11.4%.' }
        ]
      },
      'tax': {
        metrics: [
          { label: 'Total Tax', value: '₹4.2L', color: '#EF4444' },
          { label: 'Saved', value: '₹1.1L', color: '#10B981' },
          { label: 'Pending Optim.', value: '₹33k', color: '#0EA5E9' },
          { label: 'Deadline', value: 'Mar 31', color: '#EF4444' },
        ],
        bars: [
          { label: '80C Filled', pct: 100, color: '#10B981', detail: '₹1.5L / ₹1.5L' },
          { label: '80CCD(1B)', pct: 0, color: '#E2E8F0', detail: '₹0 / ₹50k' },
        ],
        alerts: [
          { type: 'info', text: 'You still have ₹50k headroom in NPS and ₹25k in Health Insurance.' },
          { type: 'warning', text: 'Act before March 31st to claim the remaining ₹33k in refunds.' }
        ]
      },
      'spend': {
        metrics: [
          { label: 'This Month', value: '₹27.4k', color: '#F59E0B' },
          { label: 'Budget', value: '₹45k', color: '#10B981' },
          { label: 'Trend', value: '-12%', color: '#0EA5E9' },
          { label: 'Flag', value: 'Dining Spk', color: '#EF4444' },
        ],
        bars: [
          { label: 'Travel', pct: 80, color: '#F97316', detail: '₹9.6k' },
          { label: 'Dining', pct: 95, color: '#EF4444', detail: '₹8.4k' },
        ],
        alerts: [
          { type: 'negative', text: 'Food delivery expenses are 32% higher than your 3-month average.' },
          { type: 'positive', text: 'Overall spending is well under the ₹45k budget for February.' }
        ]
      },
      'goals': {
        metrics: [
          { label: 'Active Goals', value: '4', color: '#4F46E5' },
          { label: 'On Track', value: '2', color: '#10B981' },
          { label: 'At Risk', value: '1', color: '#EF4444' },
          { label: 'Total SIP', value: '₹55k', color: '#0EA5E9' },
        ],
        bars: [
          { label: 'House Downpayment', pct: 68, color: '#10B981', detail: 'On track' },
          { label: 'Child Education', pct: 22, color: '#F59E0B', detail: 'Lagging' },
        ],
        alerts: [
          { type: 'warning', text: 'Child Education SIP needs an extra ₹5k/mo to catch up to inflation.' },
          { type: 'info', text: 'Emergency fund is 100% complete and fully deployed in Liquid Funds.' }
        ]
      },
    }

    // Default Fallback for Action Items and Insights
    const actionFallback = {
      metrics: [
        { label: 'Status', value: 'Action Required', color: '#F59E0B' },
        { label: 'Impact', value: 'High', color: '#10B981' },
      ],
      alerts: [
        { type: 'info', text: 'This action is based on your recent financial data.' }
      ]
    }

    if (!v[cardId]) {
      // Map known actions to some basic visual structure so the UI isn't blank
      if (cardId === 'insurance-review') {
        return {
          metrics: [
            { label: 'Current Premium', value: '₹18,000', color: '#EF4444' },
            { label: 'New Premium', value: '₹14,000', color: '#10B981' },
            { label: 'Net Savings', value: '₹4,000/yr', color: '#059669' },
            { label: 'Coverage', value: 'Matched', color: '#4F46E5' },
          ],
          bars: [
            { label: 'HDFC Ergo (Current)', pct: 100, color: '#EF4444', detail: '₹18,000' },
            { label: 'ICICI Lombard (New)', pct: 77, color: '#10B981', detail: '₹14,000' },
          ],
          alerts: [
            { type: 'positive', text: 'Switching saves ₹4,000 annually with identical coverage bounds.' },
            { type: 'info', text: 'Takes ~5 mins. Zero paperwork required.' },
          ]
        }
      }
      if (cardId === 'rebalance') {
        return {
          metrics: [
            { label: 'Target Equity', value: '30%', color: '#10B981' },
            { label: 'Current Equity', value: '73%', color: '#EF4444' },
            { label: 'Action', value: 'Move ₹1.2L', color: '#F59E0B' },
          ],
          bars: [
            { label: 'Current Mix', pct: 73, color: '#EF4444', detail: 'Heavy Equity' },
            { label: 'Target Mix', pct: 30, color: '#10B981', detail: 'Balanced' },
          ],
          alerts: [
            { type: 'warning', text: 'High risk exposure on Medium Term goals. Protect your gains.' }
          ]
        }
      }
      return actionFallback
    }

    return v[cardId]
  }

  /* ─── Intent Paths: Why did the customer tap this card? ─── */
  const getIntentPaths = (cardId) => {
    const paths = {
      'net-worth': [
        { label: 'Am I growing fast enough?', sublabel: 'Growth vs inflation & peers', query: 'Am I building wealth fast enough? Compare my 18.4% XIRR against inflation, Nifty, and peers.' },
        { label: 'Where should I invest next?', sublabel: 'Best allocation for next ₹1L', query: 'Given 65% equity, 7% gold, 17% debt — where should I deploy my next ₹1L for best risk-adjusted returns?' },
        { label: 'How safe is my portfolio?', sublabel: 'Crash stress-test', query: 'Stress test my ₹1.25Cr portfolio. What happens in a 20% market crash?' },
      ],
      'portfolio-mix': [
        { label: 'Is my allocation optimal?', sublabel: 'Risk vs returns balance', query: 'Is my 4-bucket allocation optimal? Liquid 8%, Short 12%, Medium 20%, Long 60% — should I rebalance?' },
        { label: 'Short-term bucket too low?', sublabel: 'Should I add ₹3L', query: 'My short-term bucket is ₹3L below target. Should I move money from long-term, or deploy fresh capital?' },
        { label: 'What if I need money in 3 years?', sublabel: 'Liquidity planning', query: 'If I need ₹10L in 3 years for a house, which buckets should I pull from?' },
      ],
      'top-gainers': [
        { label: 'Should I book profits?', sublabel: 'Quant +64% — too high?', query: 'Quant Small Cap is +64%. Should I book partial profits? What are the tax implications?' },
        { label: 'What about the losers?', sublabel: 'Axis -3% — exit or hold?', query: 'Axis Bluechip is -3% for 12 months. Should I exit, switch to another fund, or keep holding?' },
        { label: 'Am I too concentrated?', sublabel: 'Small Cap exposure check', query: 'My small cap is ₹12.4L. Am I overexposed to high-risk funds? What should my ideal allocation be?' },
      ],
      'life-goals': [
        { label: 'Will I reach my house goal?', sublabel: '₹20L by Mar 2029', query: 'I need ₹20L for house down-payment by Mar 2029, saved ₹13.6L so far. Am I on track at current SIP rate?' },
        { label: 'Is retirement realistic?', sublabel: '₹3Cr with ₹45L saved', query: 'My retirement goal is ₹3Cr by 2050, I have ₹45L. Is my ₹25k SIP enough, or do I need to increase?' },
        { label: 'Should I adjust my SIPs?', sublabel: 'Optimize across 4 goals', query: 'I\'m running ₹55k in SIPs across 4 goals. Help me optimize the split — should I prioritize one over another?' },
      ],
      'feb-outflow': [
        { label: 'Where am I overspending?', sublabel: 'Category-wise analysis', query: 'My February spending is ₹27.4k with Travel at ₹9.6k. Where exactly am I overspending compared to my budget?' },
        { label: 'Can I stay within budget?', sublabel: '₹17.6k for 26 days', query: 'I have ₹17.6k left for 26 days (₹677/day). Give me a realistic daily plan to stay within budget.' },
        { label: 'How does this compare?', sublabel: 'vs last 3 months', query: 'Compare my February spending to the last 3 months — am I trending better or worse?' },
      ],
      'credit-cards': [
        { label: 'Which card for what?', sublabel: 'Optimize rewards by category', query: 'I have 3 credit cards. Tell me which card to use for dining, shopping, travel, and online — maximize rewards.' },
        { label: 'Is my utilization healthy?', sublabel: 'Impact on credit score', query: 'My credit card utilization is 20% overall. Is this optimal for my credit score? Should I adjust?' },
        { label: 'Any hidden fees I\'m paying?', sublabel: 'Annual fee & charge audit', query: 'Audit all charges across my 3 credit cards — annual fees, late charges, foreign exchange fees. Am I overpaying?' },
      ],
      'upcoming-expenses': [
        { label: 'How to fund the gap?', sublabel: '₹26k needs to come from somewhere', query: 'I have ₹26k unfunded across upcoming expenses. Should I use savings, redeem investments, or adjust budget?' },
        { label: 'Set up auto-funding', sublabel: 'Never be caught short again', query: 'Help me set up automatic funding for recurring expenses — school fees, insurance, etc. What accounts should I use?' },
        { label: 'What if trip costs more?', sublabel: 'Summer trip buffer', query: 'My summer trip is budgeted at ₹1.2L but hotel is pending ₹45k. What if total goes to ₹1.5L — where does the extra come from?' },
      ],
      'gold-status': [
        { label: 'How to reach Platinum fastest?', sublabel: '150 pts away', query: 'I need 150 more points for Platinum. What\'s the fastest way — spend more, complete challenges, or referrals?' },
        { label: 'Is Platinum worth it?', sublabel: '₹13.5k/yr in perks', query: 'Is Platinum status actually worth it for my spending pattern? Break down the ₹13.5k value claim.' },
        { label: 'How do I keep it?', sublabel: 'Retention requirements', query: 'Once I reach Platinum, what do I need to do to keep it next year? What are the retention criteria?' },
      ],
      'challenges': [
        { label: 'Help me finish No Spend Week', sublabel: '2 days left — stay strong', query: 'I\'m on day 5 of No Spend Week. Give me a survival plan for the last 2 days — meal ideas, entertainment, transport.' },
        { label: 'When should I pay my card?', sublabel: 'Credit Builder challenge', query: 'For the Credit Builder challenge, I need to pay 10 days early. When exactly should I pay my HDFC card and how much?' },
        { label: 'Are SIPs auto-running?', sublabel: 'Check streak status', query: 'Is my SIP streak still intact? Check if March SIP is scheduled and no pauses are pending.' },
      ],
      'rewards-earned': [
        { label: 'How to earn ₹4.2k more?', sublabel: 'Unlock remaining potential', query: 'I have ₹4.2k in unclaimed reward potential. Break it down — what exactly do I need to do to earn each part?' },
        { label: 'Best card per category', sublabel: 'Maximize cashback routing', query: 'Show me which credit card gives the best return for each spending category — dining, shopping, travel, groceries.' },
        { label: 'Should I redeem points now?', sublabel: 'Hold or spend', query: 'I have accumulated reward points. Is it better to redeem now or save for a bigger reward? What are my options?' },
      ],
      'insurance-review': [
        { label: 'Walk me through the switch', sublabel: 'Step-by-step', query: "How do I switch from HDFC Ergo to ICICI Lombard without losing my No Claim Bonus?" },
        { label: 'Is ICICI Lombard good?', sublabel: 'Claim settlement ratio', query: 'What is the claim settlement ratio and reviews for ICICI Lombard car insurance compared to HDFC Ergo?' },
      ],
      'rebalance': [
        { label: 'Why am I moving to Debt?', sublabel: 'Risk analysis', query: "Why is 73% equity risky for my medium term bucket? Why move ₹1.2L to debt now?" },
        { label: 'Which Debt fund to choose?', sublabel: 'Safe parking', query: "If I move ₹1.2L from equity, which debt fund or instrument should I move it into for safety and decent returns?" },
      ],
      'portfolio-rebalance': [
        { label: 'Why am I moving to Debt?', sublabel: 'Risk analysis', query: "Why is 73% equity risky for my medium term bucket? Why move ₹1.2L to debt now?" },
        { label: 'Which Debt fund to choose?', sublabel: 'Safe parking', query: "If I move ₹1.2L from equity, which debt fund or instrument should I move it into for safety and decent returns?" },
      ],
      'insurance-gap': [
        { label: 'How much cover do I need?', sublabel: 'Calculation', query: "How did you arrive at the ₹1 Cr cover recommendation? What factors are considered?" },
        { label: 'Suggest term plans', sublabel: 'Best options', query: "Suggest the top 3 term insurance plans available for a ₹1 Cr cover with a premium around ₹800/mo." },
      ],
      'tax-nps': [
        { label: 'How does 80CCD(1B) work?', sublabel: 'Tax rules explained', query: "Explain Section 80CCD(1B) and how investing ₹50K gives me a ₹15.6K refund." },
        { label: 'How to open an NPS account?', sublabel: 'Step-by-step setup', query: "What is the fastest way to open an NPS Tier 1 account online before the deadline?" },
      ],
      'idle-cash': [
        { label: 'Liquid Fund vs FD', sublabel: 'Which is better?', query: "Why are you suggesting a Liquid Fund giving 7.2% instead of just booking a 1-year Fixed Deposit?" },
        { label: 'How fast can I withdraw?', sublabel: 'Liquidity check', query: "If I have an emergency and need this ₹1.3L cash, how soon will the liquid fund credit it back to my bank account?" },
      ],
      'zomato-spend': [
        { label: 'Where is the money going?', sublabel: 'Detailed breakdown', query: "Show me a detailed breakdown of my ₹8,420 food delivery spend. How much went to delivery fees vs food?" },
        { label: 'Create a budget rule', sublabel: 'Action plan', query: "Set up a strict ₹1,500/week budget rule for food delivery and notify me when I reach 80%." },
      ],
      'house-goal': [
        { label: 'What if property prices rise?', sublabel: 'Inflation check', query: "Property prices in Pune are rising. If the house cost goes up from ₹20L down-payment to ₹25L, how do I adjust my SIPs?" },
        { label: 'Can I reach it faster?', sublabel: 'Accelerate goal', query: "I want to buy the house in Dec 2027 instead of Mar 2029. How much extra SIP do I need to start now?" },
      ],
      'platinum-push': [
        { label: 'What is "No Spend Week"?', sublabel: 'Challenge details', query: "Explain the 'No Spend Week' challenge. What counts as spending and what doesn't?" },
        { label: 'Are Platinum perks worth it?', sublabel: 'Deep dive', query: "Break down the exact ₹13.5k/yr value of Platinum status based on my personal spending habits." },
      ],
      'credit-score': [
        { label: 'How long to recover my score?', sublabel: 'Timeline impact', query: "If I pay down the ₹12,000 today, when will my Equifax score update and recover the lost 15 points?" },
        { label: 'Should I ask for a limit increase?', sublabel: 'Permanent fix', query: "Instead of paying early, should I just request HDFC to increase my credit limit from ₹1.2L to ₹2L to lower utilization?" },
      ],
      'small-cap-trim': [
        { label: 'Are there exit loads or taxes?', sublabel: 'Cost of selling', query: "If I book ₹2L profit from Quant Small Cap now, what are the exact exit loads and long-term capital gains tax implications?" },
        { label: 'Where do I reinvest the ₹2L?', sublabel: 'Next steps', query: "After I withdraw the ₹2L profit from Small Cap, where exactly should I park or reinvest it?" },
      ],
      'expenses-funding': [
        { label: 'Which SIPs should I pause?', sublabel: 'Optimization', query: "Which specific SIPs should I pause for 2 months to find the ₹30K gap, without ruining my long-term goals?" },
        { label: 'Should I use idle cash instead?', sublabel: 'Alternative', query: "I have ₹1.3L idle cash in my savings account. Should I use that to fund the ₹30K gap instead of pausing my SIPs?" },
      ],
      'gold-correction': [
        { label: 'SGB vs physical gold', sublabel: 'Comparison', query: "Why are you suggesting buying SGB instead of digital gold or physical gold coins on this dip?" },
        { label: 'When is the next SGB issue?', sublabel: 'Timeline', query: "When is the government launching the next SGB tranche, or should I buy from the secondary market now?" },
      ],
      'portfolio': [
        { label: 'Run full health check', sublabel: 'Risk analysis', query: "Give me a quick health check of my investment portfolio — XIRR, allocation balance, and any risk flags." },
        { label: 'How to rebalance?', sublabel: 'Action steps', query: "My equity seems high. How exactly do I rebalance back to my 50% target?" },
      ],
      'tax': [
        { label: 'Find hidden deductions', sublabel: 'Get up to ₹33k', query: "Help me find any unclaimed tax deductions I can still use this financial year — 80C, 80CCD, 80D etc." },
        { label: 'NPS vs ELSS', sublabel: 'Comparison', query: "For my pending tax optimization, should I invest the remaining amount in NPS or an ELSS Mutual Fund?" },
      ],
      'spend': [
        { label: 'Audit my spending', sublabel: 'Where did it go?', query: "Do a full audit of my monthly spending — categorize it, flag overspends, and suggest savings." },
        { label: 'Set a dining budget', sublabel: 'Control Spikes', query: "My dining and Swiggy spends are too high. Help me set up a realistic weekly budget." },
      ],
      'goals': [
        { label: 'Check my progress', sublabel: 'Goal tracking', query: "Am I on track for my financial goals? Check my ₹1Cr target, emergency fund, and school fee planning." },
        { label: 'Fix my lagging goals', sublabel: 'Intervention', query: "My child education goal is at risk. How much extra SIP do I need to start today to fix it?" },
      ]
    }

    if (!paths[cardId]) {
      // Generic fallback intents for actions
      return [
        { label: 'Tell me more', sublabel: 'Detailed breakdown', query: "Can you give me a detailed breakdown of this action item?" },
        { label: 'Help me execute this', sublabel: 'Step by step guide', query: "What are the exact steps I need to take to complete this recommendation?" },
        { label: 'Show financial impact', sublabel: 'Numbers \& Timelines', query: "What is the quantified financial impact of doing this? Give me numbers." },
      ]
    }

    return paths[cardId]
  }

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
          {(showDetailScreen || hasStartedChat) && (
            <motion.button 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={() => {
                if (showDetailScreen && detailLevel > 1) {
                  setDetailLevel(1)
                  setActiveInsight(null)
                } else if (showDetailScreen) {
                  navigate(-1)
                } else if (activeCard && !activeItem) {
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
            {!hasStartedChat && !showDetailScreen && (
              <h1 style={{ fontSize: 38, fontWeight: 900, letterSpacing: -1.5, color: '#0F172A', lineHeight: 1.05 }}>
                Command<span style={{ color: '#7C3AED' }}>.</span>
              </h1>
            )}
            {showDetailScreen && activeCard && (
              <>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: -0.5 }}>
                  {detailLevel > 1 ? 'Insight Detail' : 'Advisor'}
                </h1>
                <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>
                  {activeCard.title}
                </span>
              </>
            )}
            {hasStartedChat && !showDetailScreen && (
              <>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: -0.5 }}>
                  Advisor
                </h1>
                <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>
                  {activeCard ? <>Helping with <span style={{ fontWeight: 700, color: '#4F46E5' }}>{activeCard.title}</span></> : 'Analyzing your finances'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* ─── MAIN CONTENT ─── */}
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100 }} className="hide-scroll">
          
          {showDetailScreen && activeCard ? (
            /* ─── RICH DETAIL / CONTEXT SCREEN ─── */
            <motion.div
              key={`detail-${detailLevel}`}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              style={{ paddingTop: 8 }}
            >
              {detailLevel === 1 ? (() => {
                const visual = getCardVisual(activeCard.id)
                const intents = getIntentPaths(activeCard.id)
                return (
                  <>
                    {/* ── Compact Hero: Icon + Title + Benefit ── */}
                    <div style={{
                      display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20,
                      background: `linear-gradient(140deg, ${activeCard.color}12 0%, ${activeCard.color}04 100%)`,
                      border: `1.5px solid ${activeCard.color}25`,
                      borderRadius: 22, padding: '18px 20px'
                    }}>
                      <div style={{
                        width: 52, height: 52, borderRadius: 16,
                        background: `${activeCard.color}18`, border: `1.5px solid ${activeCard.color}35`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>
                        {activeCard.icon && <activeCard.icon size={26} color={activeCard.color} strokeWidth={2} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', letterSpacing: -0.5, marginBottom: 4, lineHeight: 1.2 }}>
                          {activeCard.title}
                        </h2>
                        <p style={{ fontSize: 13, color: '#64748B', fontWeight: 500, lineHeight: 1.4, marginBottom: activeCard.benefit ? 8 : 0,
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {activeCard.subtitle}
                        </p>
                        {activeCard.benefit && (
                          <div style={{
                            display: 'inline-flex', background: activeCard.color, color: 'white',
                            borderRadius: 100, padding: '4px 12px', fontSize: 11, fontWeight: 800, letterSpacing: 0.3
                          }}>
                            {activeCard.benefit}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ── Metrics Grid (4 KPIs) ── */}
                    {visual?.metrics && (
                      <div style={{
                        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20,
                      }}>
                        {visual.metrics.map((m, i) => (
                          <div key={i} style={{
                            background: '#fff', borderRadius: 16, padding: '14px 16px',
                            border: '1px solid rgba(0,0,0,0.05)',
                          }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>
                              {m.label}
                            </div>
                            <div style={{ fontSize: 22, fontWeight: 900, color: m.color, letterSpacing: -0.8, lineHeight: 1 }}>
                              {m.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ── Card-Specific Visual Data ── */}
                    <div style={{
                      background: '#fff', borderRadius: 22, padding: '18px 18px 14px',
                      border: '1px solid rgba(0,0,0,0.05)', marginBottom: 20
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
                        {activeCard.id === 'top-gainers' ? 'Fund Verdicts' :
                         activeCard.id === 'life-goals' ? 'Goal Progress' :
                         activeCard.id === 'feb-outflow' ? 'Category Breakdown' :
                         activeCard.id === 'credit-cards' ? 'Card Utilization' :
                         activeCard.id === 'upcoming-expenses' ? 'Expense Timeline' :
                         activeCard.id === 'gold-status' ? 'Platinum Benefits' :
                         activeCard.id === 'challenges' ? 'Active Quests' :
                         activeCard.id === 'rewards-earned' ? 'Reward Sources' :
                         'Breakdown'}
                      </div>

                      {/* Segment bar for portfolio-mix */}
                      {visual?.segments && (
                        <div style={{ marginBottom: 16 }}>
                          <SegmentBar height={12} segments={visual.segments} />
                        </div>
                      )}

                      {/* Gauge for feb-outflow */}
                      {visual?.gauge && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                          <GaugeArc value={visual.gauge.value} max={100} size={120} stroke={10} color={activeCard.color} track="rgba(0,0,0,0.06)">
                            <span style={{ fontSize: 16, fontWeight: 900, color: activeCard.color }}>{visual.gauge.label}</span>
                          </GaugeArc>
                        </div>
                      )}

                      {/* Progress bar for gold-status */}
                      {visual?.progressBar && (
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>{visual.progressBar.label}</span>
                            <span style={{ fontSize: 13, fontWeight: 800, color: visual.progressBar.color }}>{visual.progressBar.value}%</span>
                          </div>
                          <Bar value={visual.progressBar.value} max={100} color={visual.progressBar.color} h={10} />
                        </div>
                      )}

                      {/* Sparkline for net-worth */}
                      {visual?.sparkline && (
                        <div style={{ marginBottom: 12 }}>
                          <Sparkline data={visual.sparkline} width={260} height={48} color={activeCard.color} strokeW={2.5} />
                          <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, marginTop: 4, textAlign: 'center' }}>12-month growth trend</div>
                        </div>
                      )}

                      {/* Generic bars (net-worth, portfolio-mix) */}
                      {visual?.bars && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {visual.bars.map((b, i) => (
                            <div key={i}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <div style={{ width: 8, height: 8, borderRadius: 4, background: b.color, flexShrink: 0 }} />
                                  <span style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>{b.label}</span>
                                </div>
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>{b.detail}</span>
                              </div>
                              <Bar value={b.pct} max={100} color={b.color} h={5} delay={i * 0.08} />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Fund list (top-gainers) */}
                      {visual?.funds && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {visual.funds.map((f, i) => (
                            <div key={i} style={{
                              display: 'flex', alignItems: 'center', gap: 10,
                              padding: '10px 12px', background: '#F8FAFC', borderRadius: 14
                            }}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>{f.name}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                                  <span style={{ fontSize: 16, fontWeight: 900, color: f.ret.startsWith('-') ? '#DC2626' : '#059669' }}>{f.ret}</span>
                                  <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{f.val}</span>
                                </div>
                              </div>
                              <div style={{ background: f.tagBg, padding: '5px 10px', borderRadius: 10, fontSize: 11, fontWeight: 800, color: f.tagColor, whiteSpace: 'nowrap', flexShrink: 0 }}>{f.tag}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Goal progress (life-goals) */}
                      {visual?.goals && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {visual.goals.map((g, i) => (
                            <div key={i} style={{ padding: '10px 12px', background: '#F8FAFC', borderRadius: 14 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <div style={{ width: 8, height: 8, borderRadius: 4, background: g.color }} />
                                  <span style={{ fontSize: 14, fontWeight: 800 }}>{g.label}</span>
                                </div>
                                <span style={{ fontSize: 13, fontWeight: 800, color: g.color }}>{g.saved}<span style={{ color: '#64748B', fontWeight: 500, fontSize: 11 }}> / {g.target}</span></span>
                              </div>
                              <Bar value={g.pct} max={100} color={g.color} h={5} delay={i * 0.1} />
                              <div style={{ fontSize: 11, fontWeight: 700, color: g.pct >= 100 ? '#10B981' : '#64748B', marginTop: 4, textAlign: 'right' }}>{g.status}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Spend categories (feb-outflow) */}
                      {visual?.categories && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {visual.categories.map((c, i) => (
                            <div key={i}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                <span style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>{c.label}</span>
                                <span style={{ fontSize: 13, fontWeight: 800, color: c.color }}>₹{c.val}k</span>
                              </div>
                              <Bar value={c.val} max={c.max} color={c.color} h={6} delay={i * 0.1} />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Credit cards (credit-cards) */}
                      {visual?.cards && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {visual.cards.map((c, i) => (
                            <div key={i} style={{ padding: '10px 12px', background: '#F8FAFC', borderRadius: 14 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <div style={{ width: 8, height: 8, borderRadius: 4, background: c.color }} />
                                  <span style={{ fontSize: 14, fontWeight: 800 }}>{c.name}</span>
                                </div>
                                <span style={{ fontSize: 12, fontWeight: 800, color: c.pct > 30 ? '#F59E0B' : '#10B981' }}>{c.pct}%</span>
                              </div>
                              <Bar value={c.pct} max={100} color={c.color} h={6} delay={i * 0.15} />
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                                <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{c.used} / {c.limit}</span>
                                <span style={{ fontSize: 11, fontWeight: 700, color: c.color }}>{c.tip}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Upcoming expenses */}
                      {visual?.expenses && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {visual.expenses.map((e, i) => (
                            <div key={i} style={{ padding: '10px 12px', background: '#F8FAFC', borderRadius: 14 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <div style={{ width: 8, height: 8, borderRadius: 4, background: e.color }} />
                                  <span style={{ fontSize: 14, fontWeight: 800 }}>{e.label}</span>
                                  <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{e.when}</span>
                                </div>
                                <span style={{ fontSize: 14, fontWeight: 800, color: e.color }}>{e.amount}</span>
                              </div>
                              <Bar value={Math.max(e.pct, 3)} max={100} color={e.color} h={5} delay={i * 0.1} />
                              <div style={{ fontSize: 11, fontWeight: 700, color: e.pct >= 100 ? '#10B981' : e.pct > 0 ? '#F59E0B' : '#EF4444', marginTop: 4, textAlign: 'right' }}>{e.status}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Platinum benefits (gold-status) */}
                      {visual?.benefits && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {visual.benefits.map((b, i) => (
                            <div key={i} style={{
                              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                              padding: '10px 12px', background: '#F8FAFC', borderRadius: 14
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 8, height: 8, borderRadius: 4, background: b.color }} />
                                <span style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>{b.label}</span>
                              </div>
                              <span style={{ fontSize: 12, fontWeight: 700, color: b.color }}>{b.value}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Active challenges */}
                      {visual?.challenges && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {visual.challenges.map((c, i) => (
                            <div key={i} style={{ padding: '10px 12px', background: '#F8FAFC', borderRadius: 14 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <div style={{ width: 8, height: 8, borderRadius: 4, background: c.color }} />
                                  <span style={{ fontSize: 14, fontWeight: 800 }}>{c.label}</span>
                                </div>
                                <span style={{ fontSize: 12, fontWeight: 800, color: c.color }}>{c.reward}</span>
                              </div>
                              <Bar value={c.progress} max={100} color={c.color} h={6} delay={i * 0.1} />
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                                <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{c.status}</span>
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#0F172A' }}>{c.tip}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reward breakdown */}
                      {visual?.rewards && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {visual.rewards.map((r, i) => (
                            <div key={i}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                <span style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>{r.label}</span>
                                <span style={{ fontSize: 13, fontWeight: 800, color: r.color }}>{r.amount}</span>
                              </div>
                              <Bar value={r.pct} max={100} color={r.color} h={5} delay={i * 0.1} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* ── Proactive Insights: What I Already Know ── */}
                    {visual?.alerts && visual.alerts.length > 0 && (
                      <div style={{ marginBottom: 24 }}>
                        <h3 style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                          What I Already Know
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {visual.alerts.map((alert, i) => (
                            <motion.button
                              key={i}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => { setDetailLevel(2); setActiveInsight(alert) }}
                              style={{
                                background: alert.type === 'warning' ? '#FFFBEB' : alert.type === 'negative' ? '#FEF2F2' : alert.type === 'positive' ? '#ECFDF5' : '#EFF6FF',
                                border: `1.5px solid ${alert.type === 'warning' ? '#FDE68A' : alert.type === 'negative' ? '#FECACA' : alert.type === 'positive' ? '#A7F3D0' : '#BFDBFE'}`,
                                borderRadius: 16, padding: '14px 16px',
                                display: 'flex', alignItems: 'center', gap: 12,
                                cursor: 'pointer', textAlign: 'left', width: '100%'
                              }}
                            >
                              <span style={{ fontSize: 18, flexShrink: 0 }}>
                                {alert.type === 'warning' ? '⚠️' : alert.type === 'negative' ? '🚨' : alert.type === 'positive' ? '✅' : '💡'}
                              </span>
                              <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', lineHeight: 1.35, flex: 1 }}>
                                {alert.text}
                              </span>
                              <ChevronRight size={16} color="#94A3B8" style={{ flexShrink: 0 }} />
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ── Why You're Here: Intent-Aware Paths ── */}
                    {intents.length > 0 && (
                      <div style={{ marginBottom: 24 }}>
                        <h3 style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                          How Can I Help?
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {intents.map((intent, i) => (
                            <motion.button
                              key={i}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => { setShowDetailScreen(false); handleUserMessage(intent.query, true) }}
                              style={{
                                background: 'white', border: '1px solid #E2E8F0',
                                borderRadius: 18, padding: '14px 18px',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                cursor: 'pointer', textAlign: 'left', width: '100%'
                              }}
                            >
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', lineHeight: 1.3, marginBottom: 2 }}>{intent.label}</div>
                                <div style={{ fontSize: 12, fontWeight: 500, color: '#94A3B8' }}>{intent.sublabel}</div>
                              </div>
                              <ChevronRight size={18} color="#94A3B8" style={{ flexShrink: 0, marginLeft: 12 }} />
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ── Full Analysis CTA ── */}
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { setShowDetailScreen(false); handleUserMessage(activeCard.context, true) }}
                      style={{
                        width: '100%', padding: '18px 24px', borderRadius: 24,
                        background: '#0F172A', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        border: 'none', cursor: 'pointer',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                      }}
                    >
                      <span style={{ fontSize: 17, fontWeight: 800 }}>Start Full Analysis</span>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'white', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ArrowRight size={18} strokeWidth={3} />
                      </div>
                    </motion.button>
                  </>
                )
              })() : (
                /* ─── LEVEL 2: Focused Insight Detail ─── */
                (() => {
                  const visual = getCardVisual(activeCard.id)
                  const deepDives = getDeepDives(activeCard)
                  return (
                    <>
                      {/* Insight Hero */}
                      <div style={{
                        background: activeInsight?.type === 'warning' ? 'linear-gradient(140deg, #FFFBEB, #FEF3C7)' :
                                    activeInsight?.type === 'negative' ? 'linear-gradient(140deg, #FEF2F2, #FFE4E6)' :
                                    activeInsight?.type === 'positive' ? 'linear-gradient(140deg, #ECFDF5, #D1FAE5)' :
                                    'linear-gradient(140deg, #EFF6FF, #DBEAFE)',
                        borderRadius: 24, padding: 24, marginBottom: 24,
                        border: `1.5px solid ${activeInsight?.type === 'warning' ? '#FDE68A' : activeInsight?.type === 'negative' ? '#FECACA' : activeInsight?.type === 'positive' ? '#A7F3D0' : '#BFDBFE'}`
                      }}>
                        <div style={{ fontSize: 36, marginBottom: 12 }}>
                          {activeInsight?.type === 'warning' ? '⚠️' : activeInsight?.type === 'negative' ? '🚨' : activeInsight?.type === 'positive' ? '✅' : '💡'}
                        </div>
                        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', letterSpacing: -0.8, lineHeight: 1.3, marginBottom: 12 }}>
                          {activeInsight?.text}
                        </h2>
                        <p style={{ fontSize: 14, color: '#475569', fontWeight: 500, lineHeight: 1.5 }}>
                          {activeInsight?.type === 'warning' ? 'This needs your attention. Here\'s what the data shows and what I recommend.' :
                           activeInsight?.type === 'negative' ? 'This is a red flag. Let me show you the details and my suggested action.' :
                           activeInsight?.type === 'positive' ? 'Good news — here\'s why this is working well and how to maintain it.' :
                           'Here\'s a deeper look at this insight and what you can do about it.'}
                        </p>
                      </div>

                      {/* Supporting Data */}
                      <div style={{
                        background: '#fff', borderRadius: 20, padding: 18, marginBottom: 20,
                        border: '1px solid rgba(0,0,0,0.05)'
                      }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
                          Supporting Data
                        </div>
                        {/* Show relevant metrics */}
                        {visual?.metrics && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                            {visual.metrics.slice(0, 4).map((m, i) => (
                              <div key={i} style={{ padding: '10px 12px', background: '#F8FAFC', borderRadius: 12 }}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>{m.label}</div>
                                <div style={{ fontSize: 18, fontWeight: 900, color: m.color, letterSpacing: -0.5 }}>{m.value}</div>
                              </div>
                            ))}
                          </div>
                        )}
                        {/* Show top 3 bars if available */}
                        {visual?.bars && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {visual.bars.slice(0, 3).map((b, i) => (
                              <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>{b.label}</span>
                                  <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>{b.detail}</span>
                                </div>
                                <Bar value={b.pct} max={100} color={b.color} h={5} delay={i * 0.08} />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Advisor Recommendation */}
                      <div style={{
                        background: `linear-gradient(140deg, ${activeCard.color}10, ${activeCard.color}05)`,
                        border: `1.5px solid ${activeCard.color}25`,
                        borderRadius: 20, padding: 20, marginBottom: 24
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                          <Sparkles size={16} color={activeCard.color} strokeWidth={2.5} />
                          <span style={{ fontSize: 12, fontWeight: 800, color: activeCard.color, textTransform: 'uppercase', letterSpacing: 1 }}>Advisor Recommendation</span>
                        </div>
                        <p style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', lineHeight: 1.5 }}>
                          {activeInsight?.type === 'warning' ? `I recommend addressing this soon. Tap below and I'll walk you through the exact steps to fix it, including specific amounts and timelines.` :
                           activeInsight?.type === 'negative' ? `This requires action. Let me analyze this in full detail and give you a concrete plan with alternatives.` :
                           activeInsight?.type === 'positive' ? `This is working well — let's make sure it stays that way. I can show you how to optimize further or protect these gains.` :
                           `I have specific suggestions for you. Tap below and I'll lay out a detailed plan tailored to your situation.`}
                        </p>
                      </div>

                      {/* Deep Dive Actions */}
                      <div style={{ marginBottom: 20 }}>
                        <h3 style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                          Explore Further
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {deepDives.map((dive, i) => (
                            <motion.button
                              key={i}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => { setShowDetailScreen(false); setDetailLevel(1); setActiveInsight(null); handleUserMessage(dive.query, true) }}
                              style={{
                                background: 'white', border: '1px solid #E2E8F0',
                                borderRadius: 16, padding: '12px 16px',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                cursor: 'pointer', textAlign: 'left', width: '100%'
                              }}
                            >
                              <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>{dive.label}</span>
                              <ChevronRight size={16} color="#94A3B8" style={{ flexShrink: 0, marginLeft: 12 }} />
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Discuss This CTA */}
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          setShowDetailScreen(false); setDetailLevel(1); setActiveInsight(null)
                          handleUserMessage(`About "${activeInsight?.text}" — ${activeCard.context}`, true)
                        }}
                        style={{
                          width: '100%', padding: '18px 24px', borderRadius: 24,
                          background: activeCard.color, color: 'white',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          border: 'none', cursor: 'pointer',
                          boxShadow: `0 8px 24px ${activeCard.color}40`
                        }}
                      >
                        <span style={{ fontSize: 17, fontWeight: 800 }}>Discuss This With Me</span>
                        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ArrowRight size={18} strokeWidth={3} />
                        </div>
                      </motion.button>
                    </>
                  )
                })()
              )}
            </motion.div>
          ) : !hasStartedChat ? (
            /* ─── COMMAND CENTER LANDING ─── */
            <motion.div
              variants={stagger.container} initial="hidden" animate="show"
            >
              {/* Grand AI Greeting */}
              <motion.div variants={stagger.item} style={{ marginBottom: 32, marginTop: 16 }}>
                <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', letterSpacing: -1, lineHeight: 1.2, marginBottom: 8 }}>
                  Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, Ankur.
                </h2>
                <p style={{ fontSize: 16, color: '#64748B', fontWeight: 500, lineHeight: 1.4 }}>
                  Your money copilot — always on your side. What should we figure out together?
                </p>
              </motion.div>

              {/* Suggested Topics (Chips) */}
              <motion.div variants={stagger.item} style={{ marginBottom: 36 }}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {quickTopics.map((topic) => {
                    const Icon = topic.icon
                    return (
                      <motion.button
                        key={topic.id}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleTopicClick(topic)}
                        style={{
                          background: 'white', borderRadius: 100, padding: '10px 18px',
                          cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                          border: `1px solid ${topic.color}20`,
                          display: 'flex', alignItems: 'center', gap: 8
                        }}
                      >
                        <Icon size={16} color={topic.color} strokeWidth={2.5} />
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{topic.title}</span>
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>

              {/* ─── Proactive Insights (Horizontal Scroll) ─── */}
              <motion.div variants={stagger.item}>
                <SectionLabel>Proactive Insights</SectionLabel>
                <ScrollRow gap={12} style={{ paddingBottom: 10 }}>
                  {urgentActions.slice(0, 4).map((action) => (
                    <motion.div
                      key={action.id}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleUserMessage(action.query, true)}
                      style={{
                        width: 240, flexShrink: 0,
                        background: '#fff', borderRadius: 20, padding: 18,
                        boxShadow: 'none', borderLeft: '1px solid rgba(0,0,0,0.08)', borderRight: '1px solid rgba(0,0,0,0.08)', borderBottom: '1px solid rgba(0,0,0,0.08)',
                        borderTop: `4px solid ${action.color}`,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 10, background: `${action.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <action.icon size={16} color={action.color} />
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 800, color: action.color, textTransform: 'uppercase', letterSpacing: 1 }}>
                          {action.impact}
                        </div>
                      </div>
                      <h4 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', marginBottom: 6, lineHeight: 1.3 }}>
                        {action.title}
                      </h4>
                      <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {action.detail}
                      </p>
                    </motion.div>
                  ))}
                </ScrollRow>
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
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16, paddingLeft: 4 }}>
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
          width: 'min(calc(100% - 32px), 400px)', 
          maxWidth: 400, 
          zIndex: 50
        }}>
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: 12,
            background: '#FFFFFF', 
            borderRadius: 32, 
            padding: '10px 10px 10px 24px',
            boxShadow: '0 24px 48px -12px rgba(0,0,0,0.25), 0 0 0 2px rgba(255,255,255,0.8) inset, 0 8px 16px rgba(0,0,0,0.1)',
            border: '1px solid #E2E8F0'
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything..."
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontSize: 17, color: '#0F172A', fontWeight: 600, fontFamily: 'inherit',
                minWidth: 0,
                letterSpacing: -0.3
              }}
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSend}
              style={{
                width: 48, height: 48, borderRadius: 24,
                background: input.trim() ? '#4F46E5' : '#0F172A',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
                boxShadow: input.trim() ? '0 8px 16px rgba(79, 70, 229, 0.4)' : '0 4px 12px rgba(15, 23, 42, 0.2)'
              }}
            >
              <Send size={20} color="white" strokeWidth={2.5} style={{ marginLeft: 2 }} />
            </motion.button>
          </div>
        </div>
      </div>
    </Page>
  )
}
