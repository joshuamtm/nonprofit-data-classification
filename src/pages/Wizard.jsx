import { useState, useMemo, useCallback } from 'react'
import taxonomy from '../data/nonprofit-data-taxonomy.json'
import { generatePolicy } from '../lib/generatePolicy'

/* ─── Constants ──────────────────────────────────────────────────────── */

const STEPS = [
  { id: 1, label: 'Organization' },
  { id: 2, label: 'Platform' },
  { id: 3, label: 'Data Inventory' },
  { id: 4, label: 'Regulations' },
  { id: 5, label: 'Review' },
  { id: 6, label: 'Generate' },
]

const STAFF_SIZES = ['1-10', '11-25', '26-50', '51-100', '101-250', '250+']

const SECTORS = [
  { id: 'all', label: 'General / Human Services' },
  { id: 'health', label: 'Health' },
  { id: 'education', label: 'Education' },
  { id: 'housing', label: 'Housing' },
  { id: 'advocacy', label: 'Advocacy / Policy' },
  { id: 'arts', label: 'Arts & Culture' },
  { id: 'environment', label: 'Environment' },
  { id: 'religious', label: 'Religious' },
]

const WORKSPACE_TIERS = [
  { id: 'free', label: 'Free / Google for Nonprofits' },
  { id: 'business_standard', label: 'Business Standard' },
  { id: 'business_plus', label: 'Business Plus' },
  { id: 'enterprise_standard', label: 'Enterprise Standard' },
]

const TIER_COLORS = {
  T1: 'bg-green-100 text-green-800 border-green-300',
  T2: 'bg-blue-100 text-blue-800 border-blue-300',
  T3: 'bg-amber-100 text-amber-800 border-amber-300',
  T4: 'bg-red-100 text-red-800 border-red-300',
}

const TIER_DOT = {
  T1: 'bg-green-500',
  T2: 'bg-blue-500',
  T3: 'bg-amber-500',
  T4: 'bg-red-500',
}

const REGULATION_INFO = {
  HIPAA: {
    name: 'HIPAA -- Health Insurance Portability and Accountability Act',
    description: 'Requires safeguards for protected health information (PHI). Your organization must have privacy policies, security controls, and staff training for any health data you collect or process.',
  },
  '42_CFR_PART_2': {
    name: '42 CFR Part 2 -- Substance Use Disorder Records',
    description: 'Federal regulation providing extra privacy protections for substance use disorder treatment records. Stricter than HIPAA -- requires specific written consent before any disclosure.',
  },
  'PCI-DSS': {
    name: 'PCI-DSS -- Payment Card Industry Data Security Standard',
    description: 'Applies when you accept, process, or store credit card data. Requires specific security controls, network segmentation, and regular compliance validation.',
  },
  STATE_PRIVACY: {
    name: 'State Privacy Laws',
    description: 'Your state may have specific privacy laws governing how personal information is collected, stored, and shared. Common examples include the CCPA (California), SHIELD Act (New York), and similar state-level requirements.',
  },
  GDPR: {
    name: 'GDPR -- General Data Protection Regulation',
    description: 'Applies if you have donors, supporters, or clients in the European Union. Requires lawful basis for data processing, data subject rights, and potentially a Data Protection Officer.',
  },
  FERPA: {
    name: 'FERPA -- Family Educational Rights and Privacy Act',
    description: 'Protects the privacy of student education records. Applies when your organization collects or receives education records from schools or educational institutions.',
  },
  VAWA: {
    name: 'VAWA -- Violence Against Women Act',
    description: 'Provides strict confidentiality requirements for domestic violence programs. Victim information cannot be disclosed without written, informed consent.',
  },
  HMIS: {
    name: 'HMIS -- Homeless Management Information System Standards',
    description: 'Federal data standards for homeless services data. Requires specific privacy notices, data quality standards, and security controls for HMIS data.',
  },
  FCRA: {
    name: 'FCRA -- Fair Credit Reporting Act',
    description: 'Governs background checks and consumer reports. Requires specific consent, disclosure, and adverse action procedures when using background check results.',
  },
  ADA: {
    name: 'ADA -- Americans with Disabilities Act',
    description: 'Requires that medical and disability information be kept confidential and stored separately from general personnel files.',
  },
  COPPA: {
    name: 'COPPA -- Children\'s Online Privacy Protection Act',
    description: 'Applies when collecting personal information from children under 13 online. Requires verifiable parental consent and specific privacy notice provisions.',
  },
  'CAN-SPAM': {
    name: 'CAN-SPAM Act',
    description: 'Governs commercial email communications. Requires opt-out mechanisms, accurate sender information, and honest subject lines for bulk email.',
  },
  SOX: {
    name: 'SOX -- Sarbanes-Oxley Act (Whistleblower Provisions)',
    description: 'While primarily a corporate regulation, the whistleblower protection provisions apply to nonprofits. Prohibits retaliation against employees who report fraud or misconduct.',
  },
}

/* ─── Helper: sector-based pre-selection ─────────────────────────────── */

function getPreselectedDataTypes(sectors) {
  const selected = []
  const sectorIds = sectors.length === 0 ? ['all'] : sectors

  for (const category of taxonomy.categories) {
    for (const dt of category.dataTypes) {
      const dtSectors = dt.sectors || []
      const shouldSelect =
        dtSectors.includes('all') ||
        dtSectors.some((s) => sectorIds.includes(s))
      if (shouldSelect) {
        selected.push({
          categoryId: category.id,
          dataTypeName: dt.name,
          tier: dt.tier,
        })
      }
    }
  }
  return selected
}

/* ─── Main Component ─────────────────────────────────────────────────── */

export default function Wizard() {
  const [step, setStep] = useState(1)
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  const [state, setState] = useState({
    orgName: '',
    staffSize: '',
    sectors: [],
    primaryState: '',
    platform: '',
    workspaceTier: '',
    selectedDataTypes: [],
    additionalRegulations: [],
  })

  /* field updater */
  const update = useCallback((field, value) => {
    setState((prev) => ({ ...prev, [field]: value }))
  }, [])

  /* sector toggle */
  const toggleSector = useCallback((id) => {
    setState((prev) => {
      const next = prev.sectors.includes(id)
        ? prev.sectors.filter((s) => s !== id)
        : [...prev.sectors, id]
      return { ...prev, sectors: next }
    })
  }, [])

  /* data type toggle */
  const toggleDataType = useCallback((categoryId, dataTypeName, tier) => {
    setState((prev) => {
      const exists = prev.selectedDataTypes.some(
        (d) => d.categoryId === categoryId && d.dataTypeName === dataTypeName
      )
      const next = exists
        ? prev.selectedDataTypes.filter(
            (d) =>
              !(d.categoryId === categoryId && d.dataTypeName === dataTypeName)
          )
        : [...prev.selectedDataTypes, { categoryId, dataTypeName, tier }]
      return { ...prev, selectedDataTypes: next }
    })
  }, [])

  /* pre-select data types when entering step 3 */
  const goToStep = useCallback(
    (target) => {
      if (target === 3 && step < 3 && state.selectedDataTypes.length === 0) {
        const preselected = getPreselectedDataTypes(state.sectors)
        setState((prev) => ({ ...prev, selectedDataTypes: preselected }))
      }
      setStep(target)
    },
    [step, state.sectors, state.selectedDataTypes.length]
  )

  /* detected regulations */
  const detectedRegulations = useMemo(() => {
    const regMap = {}
    for (const sel of state.selectedDataTypes) {
      const cat = taxonomy.categories.find((c) => c.id === sel.categoryId)
      if (!cat) continue
      const dt = cat.dataTypes.find((d) => d.name === sel.dataTypeName)
      if (!dt || !dt.regulations) continue
      for (const reg of dt.regulations) {
        if (!regMap[reg]) regMap[reg] = []
        regMap[reg].push(sel.dataTypeName)
      }
    }
    return regMap
  }, [state.selectedDataTypes])

  /* tier counts */
  const tierCounts = useMemo(() => {
    const counts = { T1: 0, T2: 0, T3: 0, T4: 0 }
    for (const dt of state.selectedDataTypes) {
      if (counts[dt.tier] !== undefined) counts[dt.tier]++
    }
    return counts
  }, [state.selectedDataTypes])

  /* step validation */
  const canAdvance = useMemo(() => {
    switch (step) {
      case 1:
        return state.orgName.trim() !== '' && state.staffSize !== ''
      case 2:
        return (
          state.platform !== '' &&
          (state.platform !== 'google' || state.workspaceTier !== '')
        )
      case 3:
        return state.selectedDataTypes.length > 0
      case 4:
        return true
      case 5:
        return true
      default:
        return true
    }
  }, [step, state])

  /* generate handler */
  const handleGenerate = async () => {
    setGenerating(true)
    try {
      await generatePolicy(state)
      setGenerated(true)
    } catch (err) {
      console.error('Policy generation failed:', err)
      alert('Something went wrong generating your policy. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  /* ─── Render ─────────────────────────────────────────────────────── */
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-stone-800">
          Data Classification Policy Wizard
        </h1>
        <p className="text-stone-500 mt-2">
          Answer a few questions and generate a customized data classification
          policy for your nonprofit.
        </p>
      </div>

      {/* Progress bar */}
      <ProgressBar current={step} steps={STEPS} onStepClick={goToStep} />

      {/* Step content */}
      <div className="mt-8 bg-white border border-stone-200 rounded-xl p-6 sm:p-8 shadow-sm">
        {step === 1 && (
          <StepOrganization state={state} update={update} toggleSector={toggleSector} />
        )}
        {step === 2 && <StepPlatform state={state} update={update} />}
        {step === 3 && (
          <StepDataInventory
            state={state}
            toggleDataType={toggleDataType}
            tierCounts={tierCounts}
          />
        )}
        {step === 4 && (
          <StepRegulations
            detectedRegulations={detectedRegulations}
            additionalRegulations={state.additionalRegulations}
            update={update}
          />
        )}
        {step === 5 && (
          <StepReview state={state} tierCounts={tierCounts} detectedRegulations={detectedRegulations} goToStep={goToStep} />
        )}
        {step === 6 && (
          <StepGenerate
            generating={generating}
            generated={generated}
            onGenerate={handleGenerate}
            platform={state.platform}
          />
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => goToStep(step - 1)}
          disabled={step === 1}
          className="px-5 py-2.5 rounded-lg text-sm font-medium border border-stone-300 text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        {step < 6 ? (
          <button
            onClick={() => goToStep(step + 1)}
            disabled={!canAdvance}
            className="px-5 py-2.5 rounded-lg text-sm font-medium bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        ) : null}
      </div>
    </div>
  )
}

/* ─── Progress Bar ───────────────────────────────────────────────────── */

function ProgressBar({ current, steps, onStepClick }) {
  return (
    <div className="flex items-center justify-between gap-1">
      {steps.map((s, i) => {
        const isActive = s.id === current
        const isComplete = s.id < current
        return (
          <button
            key={s.id}
            onClick={() => {
              if (s.id < current) onStepClick(s.id)
            }}
            className={`flex-1 text-center py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              isActive
                ? 'bg-emerald-700 text-white shadow-md'
                : isComplete
                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  : 'bg-stone-100 text-stone-400 cursor-default'
            }`}
            disabled={s.id > current}
          >
            <span className="hidden sm:inline">{s.label}</span>
            <span className="sm:hidden">{s.id}</span>
          </button>
        )
      })}
    </div>
  )
}

/* ─── Step 1: Organization Basics ────────────────────────────────────── */

function StepOrganization({ state, update, toggleSector }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-stone-800 mb-1">
          Organization Basics
        </h2>
        <p className="text-sm text-stone-500">
          Tell us about your organization so we can tailor the policy.
        </p>
      </div>

      {/* Org name */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          Organization Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={state.orgName}
          onChange={(e) => update('orgName', e.target.value)}
          placeholder="e.g., Community Health Alliance"
          className="w-full px-4 py-2.5 border border-stone-300 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      {/* Staff size */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          Staff Size <span className="text-red-500">*</span>
        </label>
        <select
          value={state.staffSize}
          onChange={(e) => update('staffSize', e.target.value)}
          className="w-full px-4 py-2.5 border border-stone-300 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
        >
          <option value="">Select staff size...</option>
          {STAFF_SIZES.map((size) => (
            <option key={size} value={size}>
              {size} employees
            </option>
          ))}
        </select>
      </div>

      {/* Sectors */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Sector(s) — select all that apply
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SECTORS.map((sector) => {
            const isSelected = sector.id === 'all' || state.sectors.includes(sector.id)
            return (
              <button
                key={sector.id}
                onClick={() => {
                  if (sector.id === 'all') return // "General" is always active contextually
                  toggleSector(sector.id)
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  sector.id === 'all'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 cursor-default'
                    : isSelected
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                      : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                {sector.label}
              </button>
            )
          })}
        </div>
        <p className="text-xs text-stone-400 mt-1">
          "General / Human Services" data types are always included.
        </p>
      </div>

      {/* Primary state */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          Primary State of Operation
        </label>
        <input
          type="text"
          value={state.primaryState}
          onChange={(e) => update('primaryState', e.target.value)}
          placeholder="e.g., New York"
          className="w-full px-4 py-2.5 border border-stone-300 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
        <p className="text-xs text-stone-400 mt-1">
          Used for state-specific privacy law guidance in your policy.
        </p>
      </div>
    </div>
  )
}

/* ─── Step 2: Platform ───────────────────────────────────────────────── */

function StepPlatform({ state, update }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-stone-800 mb-1">
          Workspace Platform
        </h2>
        <p className="text-sm text-stone-500">
          Your platform determines which security controls are available to you.
        </p>
      </div>

      {/* Platform radio */}
      <div className="space-y-2">
        {[
          { id: 'google', label: 'Google Workspace' },
          { id: 'microsoft', label: 'Microsoft 365' },
          { id: 'other', label: 'Other / Mixed' },
        ].map((opt) => (
          <label
            key={opt.id}
            className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
              state.platform === opt.id
                ? 'bg-emerald-50 border-emerald-400'
                : 'bg-white border-stone-200 hover:border-stone-300'
            }`}
          >
            <input
              type="radio"
              name="platform"
              value={opt.id}
              checked={state.platform === opt.id}
              onChange={() => update('platform', opt.id)}
              className="accent-emerald-700"
            />
            <span className="text-sm font-medium text-stone-700">
              {opt.label}
            </span>
          </label>
        ))}
      </div>

      {/* Google tier */}
      {state.platform === 'google' && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Google Workspace Tier <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {WORKSPACE_TIERS.map((tier) => (
              <label
                key={tier.id}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  state.workspaceTier === tier.id
                    ? 'bg-blue-50 border-blue-400'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="workspaceTier"
                  value={tier.id}
                  checked={state.workspaceTier === tier.id}
                  onChange={() => update('workspaceTier', tier.id)}
                  className="accent-blue-600"
                />
                <span className="text-sm text-stone-700">{tier.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Step 3: Data Inventory ─────────────────────────────────────────── */

function StepDataInventory({ state, toggleDataType, tierCounts }) {
  const [expandedCategories, setExpandedCategories] = useState({})

  const toggleCategory = (catId) => {
    setExpandedCategories((prev) => ({ ...prev, [catId]: !prev[catId] }))
  }

  const totalSelected = state.selectedDataTypes.length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-stone-800 mb-1">
          Data Inventory
        </h2>
        <p className="text-sm text-stone-500">
          Select the data types your organization handles. We have pre-selected
          common types based on your sector.
        </p>
      </div>

      {/* Counter */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-stone-50 rounded-lg border border-stone-200">
        <span className="text-sm font-medium text-stone-700">
          {totalSelected} selected:
        </span>
        {['T1', 'T2', 'T3', 'T4'].map((tier) => (
          <span
            key={tier}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${TIER_COLORS[tier]}`}
          >
            <span className={`w-2 h-2 rounded-full ${TIER_DOT[tier]}`} />
            {tierCounts[tier]} {taxonomy.tiers[tier].label}
          </span>
        ))}
      </div>

      {/* Categories */}
      <div className="space-y-2">
        {taxonomy.categories.map((category) => {
          const isExpanded = expandedCategories[category.id]
          const catSelectedCount = state.selectedDataTypes.filter(
            (d) => d.categoryId === category.id
          ).length

          return (
            <div
              key={category.id}
              className="border border-stone-200 rounded-lg overflow-hidden"
            >
              {/* Category header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between p-4 bg-stone-50 hover:bg-stone-100 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <svg
                    className={`w-4 h-4 text-stone-400 transition-transform ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                  <span className="font-medium text-stone-800">
                    {category.name}
                  </span>
                </div>
                <span className="text-xs text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200">
                  {catSelectedCount} / {category.dataTypes.length}
                </span>
              </button>

              {/* Data types */}
              {isExpanded && (
                <div className="divide-y divide-stone-100">
                  {category.dataTypes.map((dt) => {
                    const isChecked = state.selectedDataTypes.some(
                      (d) =>
                        d.categoryId === category.id &&
                        d.dataTypeName === dt.name
                    )
                    return (
                      <label
                        key={dt.name}
                        className="flex items-start gap-3 p-3 px-4 hover:bg-stone-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            toggleDataType(category.id, dt.name, dt.tier)
                          }
                          className="mt-0.5 accent-emerald-700"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-stone-700">
                              {dt.name}
                            </span>
                            <span
                              className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${TIER_COLORS[dt.tier]}`}
                            >
                              {taxonomy.tiers[dt.tier].label}
                            </span>
                          </div>
                        </div>
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Step 4: Regulatory Check ───────────────────────────────────────── */

function StepRegulations({ detectedRegulations, additionalRegulations, update }) {
  const [manualInput, setManualInput] = useState('')
  const regKeys = Object.keys(detectedRegulations)

  const addManualRegulation = () => {
    const trimmed = manualInput.trim()
    if (trimmed && !additionalRegulations.includes(trimmed)) {
      update('additionalRegulations', [...additionalRegulations, trimmed])
      setManualInput('')
    }
  }

  const removeManualRegulation = (reg) => {
    update(
      'additionalRegulations',
      additionalRegulations.filter((r) => r !== reg)
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-stone-800 mb-1">
          Regulatory Check
        </h2>
        <p className="text-sm text-stone-500">
          Based on your selected data types, here are the regulations that may
          apply to your organization.
        </p>
      </div>

      {regKeys.length === 0 ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 font-medium">
            No specific regulatory requirements detected beyond general best
            practices.
          </p>
          <p className="text-xs text-green-600 mt-1">
            This does not mean you have no compliance obligations. Consult
            qualified counsel for your specific situation.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {regKeys.map((regId) => {
            const info = REGULATION_INFO[regId]
            if (!info) return null
            const triggeringTypes = detectedRegulations[regId]

            return (
              <div
                key={regId}
                className="p-4 bg-white border border-stone-200 rounded-lg"
              >
                <h3 className="font-semibold text-stone-800 text-sm">
                  {info.name}
                </h3>
                <p className="text-sm text-stone-600 mt-1">
                  {info.description}
                </p>
                <div className="mt-3">
                  <p className="text-xs font-medium text-stone-500 mb-1">
                    Triggered by your data types:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {triggeringTypes.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Manual add */}
      <div className="border-t border-stone-200 pt-4">
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Know of other regulations that apply?
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addManualRegulation()}
            placeholder="e.g., CCPA, NY SHIELD Act"
            className="flex-1 px-4 py-2 border border-stone-300 rounded-lg text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          <button
            onClick={addManualRegulation}
            className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-medium hover:bg-emerald-800 transition-colors"
          >
            Add
          </button>
        </div>
        {additionalRegulations.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {additionalRegulations.map((reg) => (
              <span
                key={reg}
                className="inline-flex items-center gap-1 px-2 py-1 bg-stone-100 text-stone-700 text-sm rounded-lg border border-stone-200"
              >
                {reg}
                <button
                  onClick={() => removeManualRegulation(reg)}
                  className="text-stone-400 hover:text-stone-600 ml-1"
                >
                  x
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Step 5: Review ─────────────────────────────────────────────────── */

function StepReview({ state, tierCounts, detectedRegulations, goToStep }) {
  const regKeys = Object.keys(detectedRegulations)
  const allRegulations = [
    ...regKeys.map((r) => REGULATION_INFO[r]?.name || r),
    ...state.additionalRegulations,
  ]

  const platformLabel =
    state.platform === 'google'
      ? 'Google Workspace'
      : state.platform === 'microsoft'
        ? 'Microsoft 365'
        : 'Other / Mixed'

  const tierLabel =
    WORKSPACE_TIERS.find((t) => t.id === state.workspaceTier)?.label || ''

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-stone-800 mb-1">
          Review Your Selections
        </h2>
        <p className="text-sm text-stone-500">
          Confirm everything looks correct before generating your policy.
        </p>
      </div>

      {/* Organization */}
      <ReviewSection title="Organization" onEdit={() => goToStep(1)}>
        <ReviewRow label="Name" value={state.orgName} />
        <ReviewRow label="Staff Size" value={state.staffSize} />
        <ReviewRow
          label="Sectors"
          value={
            state.sectors.length === 0
              ? 'General / Human Services'
              : [
                  'General / Human Services',
                  ...state.sectors
                    .filter((s) => s !== 'all')
                    .map(
                      (s) =>
                        SECTORS.find((sec) => sec.id === s)?.label || s
                    ),
                ].join(', ')
          }
        />
        {state.primaryState && (
          <ReviewRow label="Primary State" value={state.primaryState} />
        )}
      </ReviewSection>

      {/* Platform */}
      <ReviewSection title="Platform" onEdit={() => goToStep(2)}>
        <ReviewRow label="Platform" value={platformLabel} />
        {state.platform === 'google' && (
          <ReviewRow label="Tier" value={tierLabel} />
        )}
      </ReviewSection>

      {/* Data Inventory */}
      <ReviewSection title="Data Inventory" onEdit={() => goToStep(3)}>
        <div className="flex flex-wrap gap-2">
          {['T1', 'T2', 'T3', 'T4'].map((tier) => (
            <span
              key={tier}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${TIER_COLORS[tier]}`}
            >
              <span className={`w-2 h-2 rounded-full ${TIER_DOT[tier]}`} />
              {tierCounts[tier]} {taxonomy.tiers[tier].label}
            </span>
          ))}
        </div>
        <p className="text-sm text-stone-600 mt-1">
          {state.selectedDataTypes.length} total data types selected across{' '}
          {
            new Set(state.selectedDataTypes.map((d) => d.categoryId)).size
          }{' '}
          categories
        </p>
      </ReviewSection>

      {/* Regulations */}
      <ReviewSection title="Applicable Regulations" onEdit={() => goToStep(4)}>
        {allRegulations.length === 0 ? (
          <p className="text-sm text-stone-500">
            No specific regulations detected.
          </p>
        ) : (
          <ul className="space-y-1">
            {allRegulations.map((r) => (
              <li key={r} className="text-sm text-stone-700">
                {r}
              </li>
            ))}
          </ul>
        )}
      </ReviewSection>

      {/* Handling highlights */}
      {tierCounts.T4 > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-semibold text-red-800 text-sm mb-1">
            Your policy will include Restricted-tier controls
          </h3>
          <p className="text-xs text-red-700">
            You have {tierCounts.T4} Restricted data types. Your policy will
            require the strictest handling controls including encrypted storage,
            named-individual access, audit logging, and verified data
            destruction.
          </p>
        </div>
      )}
    </div>
  )
}

function ReviewSection({ title, onEdit, children }) {
  return (
    <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-stone-800 text-sm">{title}</h3>
        <button
          onClick={onEdit}
          className="text-xs font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
        >
          Edit
        </button>
      </div>
      {children}
    </div>
  )
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-stone-500 min-w-[100px]">{label}:</span>
      <span className="text-stone-800 font-medium">{value}</span>
    </div>
  )
}

/* ─── Step 6: Generate ───────────────────────────────────────────────── */

function StepGenerate({ generating, generated, onGenerate, platform }) {
  if (generated) {
    return (
      <div className="text-center space-y-6 py-4">
        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-stone-800">
            Your policy has been downloaded!
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Check your downloads folder for the Word document.
          </p>
        </div>

        <div className="bg-stone-50 rounded-lg border border-stone-200 p-5 text-left max-w-md mx-auto">
          <h3 className="font-semibold text-stone-800 text-sm mb-3">
            Recommended Next Steps
          </h3>
          <ol className="space-y-2 text-sm text-stone-600">
            <li className="flex gap-2">
              <span className="text-emerald-700 font-bold">1.</span>
              Review and customize the policy for your organization
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-700 font-bold">2.</span>
              Share with leadership and get board approval
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-700 font-bold">3.</span>
              Distribute to all staff with training
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-700 font-bold">4.</span>
              Schedule an annual policy review
            </li>
            {platform === 'google' && (
              <li className="flex gap-2">
                <span className="text-emerald-700 font-bold">5.</span>
                Set up Google Workspace labels and DLP rules to enforce
                classification
              </li>
            )}
          </ol>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="text-sm text-emerald-700 hover:text-emerald-800 hover:underline font-medium"
        >
          Start over with a new policy
        </button>
      </div>
    )
  }

  return (
    <div className="text-center space-y-6 py-4">
      <div>
        <h2 className="text-xl font-semibold text-stone-800 mb-1">
          Generate Your Policy
        </h2>
        <p className="text-sm text-stone-500">
          We will generate a comprehensive Word document tailored to your
          organization.
        </p>
      </div>

      <div className="bg-stone-50 rounded-lg border border-stone-200 p-5 text-left max-w-md mx-auto">
        <h3 className="font-semibold text-stone-800 text-sm mb-2">
          Your document will include:
        </h3>
        <ul className="space-y-1 text-sm text-stone-600">
          <li>Purpose and scope statement</li>
          <li>Classification tier definitions</li>
          <li>Your customized data inventory</li>
          <li>Handling requirements matrix</li>
          <li>Platform-specific security controls</li>
          <li>Roles and responsibilities</li>
          <li>Labeling and incident procedures</li>
          <li>Staff acknowledgment form</li>
        </ul>
      </div>

      <button
        onClick={onGenerate}
        disabled={generating}
        className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-700 text-white rounded-lg font-medium hover:bg-emerald-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-base shadow-md"
      >
        {generating ? (
          <>
            <svg
              className="animate-spin w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Generating...
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            Generate Your Policy
          </>
        )}
      </button>
    </div>
  )
}
