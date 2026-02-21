import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import BottomNav from './components/BottomNav'
import Action from './pages/Action'
import Dashboard from './pages/Dashboard'
import Money from './pages/Money'
import Spend from './pages/Spend'
import Advisor from './pages/Advisor'
import Rewards from './pages/Rewards'

export default function App() {
  const loc = useLocation()
  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={loc} key={loc.pathname}>
          <Route path="/" element={<Action />} />
          <Route path="/overview" element={<Dashboard />} />
          <Route path="/money" element={<Money />} />
          <Route path="/spend" element={<Spend />} />
          <Route path="/advisor" element={<Advisor />} />
          <Route path="/rewards" element={<Rewards />} />
        </Routes>
      </AnimatePresence>
      <BottomNav />
    </>
  )
}
