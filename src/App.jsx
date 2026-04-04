import { Routes, Route, Link, NavLink, Navigate, useLocation } from 'react-router-dom'
import Landing from './pages/Landing'
import TierOverview from './pages/TierOverview'
import DataTypeBrowser from './pages/DataTypeBrowser'
import HandlingMatrix from './pages/HandlingMatrix'
import WorkspaceGuide from './pages/WorkspaceGuide'
import DecisionTree from './pages/DecisionTree'
import Wizard from './pages/Wizard'
import M365Guide from './pages/M365Guide'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/guide/tiers', label: 'Tiers' },
  { to: '/guide/data-types', label: 'Data Types' },
  { to: '/guide/handling', label: 'Handling' },
  { to: '/guide/workspace', label: 'Google Workspace' },
  { to: '/guide/m365', label: 'Microsoft 365' },
  { to: '/decision-tree', label: 'Decision Tree' },
  { to: '/wizard', label: 'Policy Wizard' },
]

function Nav() {
  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-emerald-800 text-lg no-underline">
            <span className="text-2xl">🛡️</span>
            <span className="hidden sm:inline">Data Classification Guide</span>
          </Link>
          <div className="flex items-center gap-1 overflow-x-auto">
            {navLinks.slice(1).map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap no-underline ${
                    isActive
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'text-stone-500 hover:text-stone-700 hover:bg-stone-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

function Footer() {
  return (
    <footer className="bg-stone-50 border-t border-stone-200 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-stone-400 text-sm">
          A free resource from{' '}
          <a href="https://nptogether.org" className="text-emerald-600 hover:text-emerald-700 font-medium" target="_blank" rel="noopener noreferrer">
            Nonprofits Together
          </a>
          {' '}&{' '}
          <a href="https://mtm.now" className="text-emerald-600 hover:text-emerald-700 font-medium" target="_blank" rel="noopener noreferrer">
            Meet the Moment
          </a>
        </p>
        <p className="text-stone-300 text-xs mt-2">
          Based on NIST SP 800-60, CIS Controls v8.1, and nonprofit sector best practices.
          Not legal advice — consult qualified counsel for your specific situation.
        </p>
      </div>
    </footer>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  if (typeof window !== 'undefined') {
    window.scrollTo(0, 0)
  }
  return null
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Nav />
      <ScrollToTop />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/guide" element={<Navigate to="/guide/tiers" replace />} />
          <Route path="/handling-matrix" element={<Navigate to="/guide/handling" replace />} />
          <Route path="/guide/tiers" element={<TierOverview />} />
          <Route path="/guide/data-types" element={<DataTypeBrowser />} />
          <Route path="/guide/handling" element={<HandlingMatrix />} />
          <Route path="/guide/workspace" element={<WorkspaceGuide />} />
          <Route path="/guide/m365" element={<M365Guide />} />
          <Route path="/decision-tree" element={<DecisionTree />} />
          <Route path="/wizard" element={<Wizard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
