import { useState, useMemo } from 'react'
import matrixData from '../data/handling-matrix.json'
import taxonomy from '../data/nonprofit-data-taxonomy.json'

const tierIds = ['T1', 'T2', 'T3', 'T4']

const REQUIREMENT_STYLES = {
  none: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    dot: 'bg-green-500',
    label: 'No requirement',
  },
  optional: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
    label: 'Optional',
  },
  recommended: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    label: 'Recommended',
  },
  required: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-500',
    label: 'Required',
  },
  prohibited: {
    bg: 'bg-red-100',
    text: 'text-red-900',
    border: 'border-red-300',
    dot: 'bg-red-800',
    label: 'Prohibited',
  },
}

function Legend() {
  return (
    <div className="bg-stone-50 rounded-xl border border-stone-200 p-5 mb-6">
      <h2 className="text-sm font-semibold text-stone-700 mb-3">Requirement Levels</h2>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {Object.entries(REQUIREMENT_STYLES).map(([key, style]) => (
          <div key={key} className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${style.dot}`} />
            <span className="text-sm text-stone-600">
              <span className="font-medium capitalize">{key === 'none' ? 'None' : key}</span>
              {' '}&mdash; {style.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TierHeader({ tierId }) {
  const t = taxonomy.tiers[tierId]
  return (
    <th
      className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide border-b-2"
      style={{
        color: t.color,
        backgroundColor: t.bgColor,
        borderBottomColor: t.color,
      }}
    >
      {tierId}
      <br />
      <span className="font-normal normal-case tracking-normal">{t.label}</span>
    </th>
  )
}

function MatrixCell({ control, tierId, expandedCell, setExpandedCell }) {
  const tierData = control.tiers[tierId]
  const style = REQUIREMENT_STYLES[tierData.requirement] || REQUIREMENT_STYLES.none
  const cellKey = `${control.id}-${tierId}`
  const isExpanded = expandedCell === cellKey

  return (
    <td
      className={`px-3 py-2.5 text-center border-r border-stone-100 last:border-r-0 cursor-pointer transition-colors ${style.bg} hover:opacity-80`}
      onClick={() => setExpandedCell(isExpanded ? null : cellKey)}
    >
      <div className="flex flex-col items-center gap-1">
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${style.text}`}>
          <span className={`w-2 h-2 rounded-full ${style.dot}`} />
          {tierData.label}
        </span>
        {isExpanded && (
          <p className="text-xs text-stone-600 mt-1 text-left leading-relaxed max-w-xs">
            {tierData.detail}
          </p>
        )}
      </div>
    </td>
  )
}

/* Mobile card for a single control */
function MobileControlCard({ control, expandedCell, setExpandedCell }) {
  return (
    <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-stone-100">
        <h4 className="text-sm font-semibold text-stone-800">{control.name}</h4>
        <p className="text-xs text-stone-400 mt-0.5">{control.description}</p>
      </div>
      <div className="divide-y divide-stone-100">
        {tierIds.map(tierId => {
          const tierData = control.tiers[tierId]
          const t = taxonomy.tiers[tierId]
          const style = REQUIREMENT_STYLES[tierData.requirement] || REQUIREMENT_STYLES.none
          const cellKey = `${control.id}-${tierId}`
          const isExpanded = expandedCell === cellKey

          return (
            <button
              key={tierId}
              onClick={() => setExpandedCell(isExpanded ? null : cellKey)}
              className={`w-full flex items-start gap-3 px-4 py-2.5 text-left transition-colors hover:bg-stone-50 ${style.bg}`}
            >
              <span
                className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-bold mt-0.5 shrink-0"
                style={{ color: t.color, backgroundColor: t.bgColor, border: `1px solid ${t.borderColor}` }}
              >
                {tierId}
              </span>
              <div className="flex-1 min-w-0">
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${style.text}`}>
                  <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                  {tierData.label}
                </span>
                {isExpanded && (
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {tierData.detail}
                  </p>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function HandlingMatrix() {
  const [expandedCell, setExpandedCell] = useState(null)

  const groupedControls = useMemo(() => {
    const groups = {}
    matrixData.controls.forEach(control => {
      if (!groups[control.category]) {
        groups[control.category] = []
      }
      groups[control.category].push(control)
    })
    return groups
  }, [])

  const categoryOrder = useMemo(() => {
    const seen = []
    matrixData.controls.forEach(c => {
      if (!seen.includes(c.category)) seen.push(c.category)
    })
    return seen
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">
          Handling Controls Matrix
        </h1>
        <p className="text-stone-500 text-lg">
          Security and handling requirements for each data classification tier.
          Click any cell to see detailed guidance.
        </p>
      </div>

      <Legend />

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-xl border border-stone-200 overflow-hidden">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide bg-stone-50 border-b border-stone-200 w-72">
                Control
              </th>
              {tierIds.map(id => (
                <TierHeader key={id} tierId={id} />
              ))}
            </tr>
          </thead>
          <tbody>
            {categoryOrder.map(category => (
              <>
                {/* Category separator row */}
                <tr key={`cat-${category}`}>
                  <td
                    colSpan={5}
                    className="px-4 py-2.5 bg-stone-100 border-y border-stone-200"
                  >
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                      {category}
                    </span>
                  </td>
                </tr>
                {groupedControls[category].map(control => (
                  <tr key={control.id} className="border-b border-stone-100 last:border-b-0">
                    <td className="px-4 py-3 align-top">
                      <p className="text-sm font-medium text-stone-800">{control.name}</p>
                      <p className="text-xs text-stone-400 mt-0.5">{control.description}</p>
                    </td>
                    {tierIds.map(tierId => (
                      <MatrixCell
                        key={tierId}
                        control={control}
                        tierId={tierId}
                        expandedCell={expandedCell}
                        setExpandedCell={setExpandedCell}
                      />
                    ))}
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-6">
        {categoryOrder.map(category => (
          <div key={category}>
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3 px-1">
              {category}
            </h3>
            <div className="space-y-3">
              {groupedControls[category].map(control => (
                <MobileControlCard
                  key={control.id}
                  control={control}
                  expandedCell={expandedCell}
                  setExpandedCell={setExpandedCell}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
