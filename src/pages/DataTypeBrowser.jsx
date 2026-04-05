import { useState, useMemo, useEffect } from 'react'
import taxonomy from '../data/nonprofit-data-taxonomy.json'

const CATEGORY_ICONS = {
  'heart': '❤️',
  'users': '👥',
  'briefcase': '💼',
  'dollar-sign': '💰',
  'scale': '⚖️',
  'megaphone': '📣',
  'file-text': '📄',
  'hand-helping': '🤝',
  'clipboard': '📋',
  'microscope': '🔬',
}

const REGULATION_COLORS = {
  'HIPAA': 'bg-red-100 text-red-700 border-red-200',
  'PCI-DSS': 'bg-orange-100 text-orange-700 border-orange-200',
  'FERPA': 'bg-blue-100 text-blue-700 border-blue-200',
  'GDPR': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'STATE_PRIVACY': 'bg-purple-100 text-purple-700 border-purple-200',
  'COPPA': 'bg-pink-100 text-pink-700 border-pink-200',
  'SOX': 'bg-amber-100 text-amber-700 border-amber-200',
  'VAWA': 'bg-rose-100 text-rose-700 border-rose-200',
  '42_CFR_PART_2': 'bg-red-100 text-red-800 border-red-200',
  'HMIS': 'bg-teal-100 text-teal-700 border-teal-200',
  'ADA': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  'CAN-SPAM': 'bg-lime-100 text-lime-700 border-lime-200',
  'FCRA': 'bg-emerald-100 text-emerald-700 border-emerald-200',
}

const tierIds = ['T1', 'T2', 'T3', 'T4']

function TierBadge({ tier }) {
  const t = taxonomy.tiers[tier]
  if (!t) return null
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border"
      style={{
        color: t.color,
        backgroundColor: t.bgColor,
        borderColor: t.borderColor,
      }}
    >
      {tier} — {t.label}
    </span>
  )
}

function RegulationBadge({ regulation }) {
  const colorClass = REGULATION_COLORS[regulation] || 'bg-stone-100 text-stone-600 border-stone-200'
  const display = regulation.replace(/_/g, ' ')
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colorClass}`}>
      {display}
    </span>
  )
}

function ChevronIcon({ expanded }) {
  return (
    <svg
      className={`w-5 h-5 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}

export default function DataTypeBrowser() {
  const [search, setSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedTiers, setSelectedTiers] = useState([])
  const [expandedCategories, setExpandedCategories] = useState(
    () => new Set(taxonomy.categories.map(c => c.id))
  )

  const toggleCategory = (catId) => {
    setSelectedCategories(prev =>
      prev.includes(catId)
        ? prev.filter(c => c !== catId)
        : [...prev, catId]
    )
  }

  const toggleTier = (tierId) => {
    setSelectedTiers(prev =>
      prev.includes(tierId)
        ? prev.filter(t => t !== tierId)
        : [...prev, tierId]
    )
  }

  const toggleExpanded = (catId) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(catId)) {
        next.delete(catId)
      } else {
        next.add(catId)
      }
      return next
    })
  }

  const expandAll = () => {
    setExpandedCategories(new Set(taxonomy.categories.map(c => c.id)))
  }

  const collapseAll = () => {
    setExpandedCategories(new Set())
  }

  const filteredCategories = useMemo(() => {
    const searchLower = search.toLowerCase().trim()

    return taxonomy.categories
      .filter(cat => {
        if (selectedCategories.length > 0 && !selectedCategories.includes(cat.id)) {
          return false
        }
        return true
      })
      .map(cat => {
        const filteredTypes = cat.dataTypes.filter(dt => {
          if (selectedTiers.length > 0 && !selectedTiers.includes(dt.tier)) {
            return false
          }
          if (searchLower) {
            const matchesName = dt.name.toLowerCase().includes(searchLower)
            const matchesRationale = dt.rationale.toLowerCase().includes(searchLower)
            const matchesRegulation = dt.regulations.some(r =>
              r.toLowerCase().replace(/_/g, ' ').includes(searchLower)
            )
            if (!matchesName && !matchesRationale && !matchesRegulation) {
              return false
            }
          }
          return true
        })
        return { ...cat, dataTypes: filteredTypes }
      })
      .filter(cat => cat.dataTypes.length > 0)
  }, [search, selectedCategories, selectedTiers])

  const totalResults = filteredCategories.reduce(
    (sum, cat) => sum + cat.dataTypes.length,
    0
  )

  const totalAll = taxonomy.categories.reduce(
    (sum, cat) => sum + cat.dataTypes.length,
    0
  )

  const hasActiveFilters = search || selectedCategories.length > 0 || selectedTiers.length > 0

  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 600)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">
          Data Type Browser
        </h1>
        <p className="text-stone-500 text-lg">
          Search and filter {totalAll} data types across {taxonomy.categories.length} categories
          to find classification guidance for your organization's information.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-stone-50 rounded-xl border border-stone-200 p-5 mb-6 space-y-4">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-stone-700 mb-1">
            Search data types
          </label>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="search"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, rationale, or regulation..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Tier Filters */}
        <div>
          <span className="block text-sm font-medium text-stone-700 mb-2">Filter by tier</span>
          <div className="flex flex-wrap gap-2">
            {tierIds.map(id => {
              const t = taxonomy.tiers[id]
              const active = selectedTiers.includes(id)
              return (
                <button
                  key={id}
                  onClick={() => toggleTier(id)}
                  className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-all ${
                    active
                      ? 'shadow-sm'
                      : 'opacity-60 hover:opacity-80'
                  }`}
                  style={{
                    color: t.color,
                    backgroundColor: active ? t.bgColor : 'white',
                    borderColor: active ? t.color : t.borderColor,
                  }}
                >
                  {id} — {t.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Category Filters */}
        <div>
          <span className="block text-sm font-medium text-stone-700 mb-2">Filter by category</span>
          <div className="flex flex-wrap gap-2">
            {taxonomy.categories.map(cat => {
              const active = selectedCategories.includes(cat.id)
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                    active
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm'
                      : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <span>{CATEGORY_ICONS[cat.icon] || '📁'}</span>
                  <span className="hidden sm:inline">{cat.name}</span>
                  <span className="sm:hidden">{cat.name.split(' ')[0]}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-stone-200">
            <span className="text-sm text-stone-500">
              Showing <span className="font-semibold text-stone-700">{totalResults}</span> of {totalAll} data types
              {filteredCategories.length < taxonomy.categories.length && (
                <> across <span className="font-semibold text-stone-700">{filteredCategories.length}</span> categories</>
              )}
            </span>
            <button
              onClick={() => {
                setSearch('')
                setSelectedCategories([])
                setSelectedTiers([])
              }}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Expand/Collapse All */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-stone-500">
          {!hasActiveFilters && (
            <><span className="font-semibold text-stone-700">{totalResults}</span> data types in {filteredCategories.length} categories</>
          )}
        </p>
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="text-xs text-stone-500 hover:text-stone-700 font-medium px-2 py-1 rounded hover:bg-stone-100"
          >
            Expand all
          </button>
          <button
            onClick={collapseAll}
            className="text-xs text-stone-500 hover:text-stone-700 font-medium px-2 py-1 rounded hover:bg-stone-100"
          >
            Collapse all
          </button>
        </div>
      </div>

      {/* Results */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-16 bg-stone-50 rounded-xl border border-stone-200">
          <svg className="w-12 h-12 mx-auto text-stone-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-stone-500 text-lg font-medium">No data types match your filters</p>
          <p className="text-stone-400 text-sm mt-1">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCategories.map(cat => {
            const isExpanded = expandedCategories.has(cat.id)
            return (
              <div key={cat.id} className="border border-stone-200 rounded-xl overflow-hidden">
                {/* Category Header */}
                <button
                  onClick={() => toggleExpanded(cat.id)}
                  className="w-full flex items-center gap-3 px-5 py-4 bg-white hover:bg-stone-50 transition-colors text-left"
                >
                  <ChevronIcon expanded={isExpanded} />
                  <span className="text-xl">{CATEGORY_ICONS[cat.icon] || '📁'}</span>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-semibold text-stone-800">{cat.name}</h2>
                    <p className="text-sm text-stone-400 truncate">{cat.description}</p>
                  </div>
                  <span className="text-sm font-medium text-stone-400 bg-stone-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                    {cat.dataTypes.length} type{cat.dataTypes.length !== 1 ? 's' : ''}
                  </span>
                </button>

                {/* Data Types */}
                {isExpanded && (
                  <div className="border-t border-stone-100">
                    {cat.dataTypes.map((dt, i) => (
                      <div
                        key={i}
                        className={`px-5 py-3.5 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 ${
                          i > 0 ? 'border-t border-stone-100' : ''
                        } hover:bg-stone-50/50 transition-colors`}
                      >
                        {/* Name and rationale */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-stone-800">{dt.name}</p>
                          <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">{dt.rationale}</p>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 sm:flex-shrink-0">
                          <TierBadge tier={dt.tier} />
                          {dt.regulations.map(reg => (
                            <RegulationBadge key={reg} regulation={reg} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Back to top */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-emerald-700 text-white shadow-lg hover:bg-emerald-800 transition-colors flex items-center justify-center z-40"
          aria-label="Back to top"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </div>
  )
}
