
/* ─── Market Context Stories ─── */
const marketStories = [
  {
    id: 10, emoji: '📉', title: 'Fed Rates', subtitle: '50bps cut',
    storyTitle: "Cheap money is back.",
    storyText: "The US Fed just cut rates by 0.50%. Historically, when rates drop, foreign money (FII) floods into emerging markets like India. We've seen ₹12K Cr inflow just this week.",
    visual: {
      type: 'bars', label: 'FII Inflows vs Rate Cut',
      data: [
        { label: 'Before Cut', value: 200, suffix: 'Cr(avg)' },
        { label: 'After Cut', value: 12400, suffix: 'Cr', highlight: true, flag: 'Flood' },
      ],
    },
    cta: 'Stay Invested in Nifty 50', bg1: '#3B82F6', bg2: '#2563EB',
    save: 'Growth ↑', saveLabel: 'Equity outlook',
    gradient: 'linear-gradient(45deg, #3B82F6, #2563EB)',
    impactText: "Your Nifty 50 Index fund captures this FII wave directly."
  },
  {
    id: 11, emoji: '🏗️', title: 'Infra Boom', subtitle: 'Budget 2026',
    storyTitle: "India is under construction.",
    storyText: "Budget 2026 allocated record capex to railways and defense. Order books for L&T and HAL are at all-time highs. The manufacturing cycle is real.",
    visual: {
      type: 'breakdown', label: 'Sector Performance (1Y)',
      data: [
        { label: 'Infra', value: 28, color: '#F97316' },
        { label: 'IT', value: 12, color: '#64748B' },
        { label: 'Banks', value: 16, color: '#0EA5E9' },
      ],
    },
    cta: 'View Infra Trends', bg1: '#F97316', bg2: '#EA580C',
    save: 'Strong', saveLabel: 'Sector rating',
    gradient: 'linear-gradient(45deg, #F97316, #EA580C)',
    impactText: "Your SBI Bluechip fund has 18% exposure to these industrial giants."
  },
  {
    id: 12, emoji: '🛢️', title: 'Oil Drop', subtitle: '$64/barrel',
    storyTitle: "Oil crashes. India saves billions.",
    storyText: "Brent Crude fell below $65. For an oil-importer like India, this lowers inflation and boosts corporate margins, especially for FMCG and Paints.",
    visual: {
      type: 'table', headers: ['', 'Oil $80', 'Oil $64'],
      rows: [
        { label: 'Inflation', values: ['5.4%', '4.2%'], highlight: 1 },
        { label: 'Corp Margins', values: ['14%', '18%'], highlight: 1 },
        { label: 'Current A/C', values: ['Deficit', 'Surplus'], highlight: 1 },
      ],
    },
    cta: 'Watch Asian Paints', bg1: '#10B981', bg2: '#059669',
    save: 'Margins ↑', saveLabel: 'Corporate profits',
    gradient: 'linear-gradient(45deg, #10B981, #059669)',
    impactText: "Benefits your Flexi Cap fund which holds heavy FMCG stocks."
  },
]
