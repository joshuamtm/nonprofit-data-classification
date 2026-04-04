import { useState } from 'react';
import m365Data from '../data/m365-features.json';

const featureLabels = {
  dlp: 'Data Loss Prevention (Purview DLP)',
  sensitivityLabels: 'Sensitivity Labels (Manual)',
  autoLabeling: 'Auto-Labeling Policies',
  sharingControls: 'SharePoint/OneDrive Sharing Controls',
  domainRestrictions: 'Domain Allowlist/Blocklist',
  sitePermissions: 'Per-Site Sharing Restrictions',
  securityGroups: 'Security Groups & Access Control',
  conditionalAccess: 'Conditional Access (Entra ID)',
  ome: 'Message Encryption (OME)',
  irm: 'Information Rights Management (IRM)',
  irmAutoApply: 'IRM Auto-Apply via DLP',
  ediscovery: 'eDiscovery & Content Search',
  intune: 'Device Management (Intune)',
  securityCenter: 'Security Center / Defender',
  smime: 'S/MIME Email Encryption',
};

const featureKeys = Object.keys(featureLabels);

const tierColors = {
  businessBasic: { bg: 'bg-green-50', border: 'border-green-300', active: 'bg-green-600 text-white', ring: 'ring-green-300' },
  businessStandard: { bg: 'bg-blue-50', border: 'border-blue-300', active: 'bg-blue-600 text-white', ring: 'ring-blue-300' },
  businessPremium: { bg: 'bg-amber-50', border: 'border-amber-300', active: 'bg-amber-600 text-white', ring: 'ring-amber-300' },
  e3: { bg: 'bg-purple-50', border: 'border-purple-300', active: 'bg-purple-600 text-white', ring: 'ring-purple-300' },
  e5: { bg: 'bg-rose-50', border: 'border-rose-300', active: 'bg-rose-600 text-white', ring: 'ring-rose-300' },
};

function AvailabilityBadge({ feature }) {
  if (feature.available === true && feature.label.toLowerCase().includes('partial')) {
    return (
      <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full text-sm font-medium">
        <span className="w-2 h-2 rounded-full bg-amber-500" />
        Partial
      </span>
    );
  }
  if (feature.available === true && feature.label.toLowerCase().includes('limited')) {
    return (
      <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full text-sm font-medium">
        <span className="w-2 h-2 rounded-full bg-amber-500" />
        Limited
      </span>
    );
  }
  if (feature.available) {
    return (
      <span className="inline-flex items-center gap-1.5 text-green-700 bg-green-100 px-2.5 py-1 rounded-full text-sm font-medium">
        <span className="w-2 h-2 rounded-full bg-green-500" />
        {feature.label}
      </span>
    );
  }
  if (feature.label === 'Limited') {
    return (
      <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full text-sm font-medium">
        <span className="w-2 h-2 rounded-full bg-amber-500" />
        Limited
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-red-700 bg-red-100 px-2.5 py-1 rounded-full text-sm font-medium">
      <span className="w-2 h-2 rounded-full bg-red-500" />
      {feature.label}
    </span>
  );
}

function ComparisonBadge({ available, label }) {
  if (label === 'Limited') {
    return (
      <div className="flex items-center justify-center">
        <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
    );
  }
  if (available) {
    return (
      <div className="flex items-center justify-center">
        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center">
      <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  );
}

function ChecklistStep({ step }) {
  const [open, setOpen] = useState(false);
  const isReference = step.path.startsWith('See ');

  return (
    <div className={`border rounded-lg transition-colors ${open ? 'border-blue-300 bg-blue-50/50' : 'border-stone-200 bg-white'}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-3 p-4 text-left cursor-pointer"
      >
        <span className={`mt-0.5 flex-shrink-0 transition-transform ${open ? 'rotate-90' : ''}`}>
          <svg className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </span>
        <div className="flex-1">
          <p className={`font-medium ${isReference ? 'text-stone-500 italic' : 'text-stone-800'}`}>{step.step}</p>
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 pl-11 space-y-2">
          {step.path && !step.path.startsWith('N/A') && !isReference && (
            <div className="flex items-start gap-2">
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider mt-0.5 flex-shrink-0">Path:</span>
              <code className="text-sm text-blue-700 bg-blue-100 px-2 py-0.5 rounded font-mono break-all">{step.path}</code>
            </div>
          )}
          {step.path && step.path.startsWith('N/A') && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold bg-stone-200 text-stone-600 px-2 py-0.5 rounded-full">
                {step.path.includes('training') ? 'Training Activity' : step.path.includes('documentation') ? 'Documentation' : 'Process'}
              </span>
            </div>
          )}
          <p className="text-sm text-stone-600 leading-relaxed">{step.detail}</p>
        </div>
      )}
    </div>
  );
}

export default function M365Guide() {
  const [selectedTierId, setSelectedTierId] = useState('businessBasic');
  const [showComparison, setShowComparison] = useState(false);

  const selectedTier = m365Data.tiers.find(t => t.id === selectedTierId);
  const availableCount = featureKeys.filter(k => selectedTier.features[k]?.available).length;
  const totalCount = featureKeys.length;
  const checklist = m365Data.implementationChecklist[selectedTierId] || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">Microsoft 365 Implementation Guide</h1>
        <p className="text-stone-500 text-lg max-w-3xl">
          Practical guidance for implementing data classification controls in Microsoft 365,
          matched to your nonprofit's license tier.
        </p>
      </div>

      {/* Tier Selector */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3 mb-4">
          {m365Data.tiers.map(tier => {
            const colors = tierColors[tier.id];
            const isActive = tier.id === selectedTierId;
            return (
              <button
                key={tier.id}
                onClick={() => { setSelectedTierId(tier.id); setShowComparison(false); }}
                className={`px-5 py-3 rounded-xl border-2 transition-all font-medium text-sm cursor-pointer ${
                  isActive
                    ? `${colors.active} border-transparent shadow-md ring-2 ${colors.ring} ring-offset-1`
                    : `${colors.bg} ${colors.border} text-stone-700 hover:shadow-sm`
                }`}
              >
                <span className="block">{tier.name}</span>
                <span className={`block text-xs mt-0.5 ${isActive ? 'opacity-80' : 'text-stone-400'}`}>
                  {tier.pricePerUser}/user/mo
                  {tier.userCap ? ` (max ${tier.userCap})` : ''}
                </span>
              </button>
            );
          })}
        </div>

        {/* Comparison toggle */}
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1.5 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" />
          </svg>
          {showComparison ? 'Hide comparison' : 'Compare all tiers side by side'}
        </button>
      </div>

      {/* Upgrade recommendation for free tiers */}
      {(selectedTierId === 'businessBasic' || selectedTierId === 'businessStandard') && !showComparison && (
        <div className="mb-8 border border-amber-200 bg-amber-50 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div>
              <h3 className="font-semibold text-amber-800 mb-1">Significant security gap at this tier</h3>
              <p className="text-sm text-amber-700 leading-relaxed mb-3">
                {selectedTierId === 'businessBasic'
                  ? 'Business Basic and Business Standard have identical security features — neither includes sensitivity labels, DLP, Conditional Access, or device management. If your organization handles confidential or restricted data, upgrading is strongly recommended.'
                  : 'Business Standard adds desktop Office apps but no additional security features over Basic. The security gap between Standard and Premium is the largest jump in the Microsoft 365 lineup.'
                }
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="bg-white border border-amber-200 rounded-lg px-3 py-1.5 text-amber-800">
                  <strong>Business Premium</strong> ($5.50/user/mo) adds sensitivity labels, DLP, Conditional Access, and Intune
                </span>
                <span className="bg-white border border-amber-200 rounded-lg px-3 py-1.5 text-amber-800">
                  <strong>E3</strong> ($9/user/mo) adds eDiscovery Standard and removes the 300-user cap
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison */}
      {showComparison && (
        <div className="mb-10 overflow-x-auto">
          <div className="border border-stone-200 rounded-xl overflow-hidden min-w-[800px]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50">
                  <th className="text-left py-3 px-4 font-semibold text-stone-600 border-b border-stone-200 w-1/5">Feature</th>
                  {m365Data.tiers.map(tier => (
                    <th key={tier.id} className="text-center py-3 px-3 font-semibold text-stone-600 border-b border-stone-200">
                      <span className="block">{tier.name.replace(' (Donated)', '').replace('Enterprise ', '')}</span>
                      <span className="block text-xs font-normal text-stone-400">{tier.pricePerUser}/user</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {featureKeys.map((key, idx) => (
                  <tr key={key} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'}>
                    <td className="py-2.5 px-4 text-stone-700 font-medium border-r border-stone-100">
                      {featureLabels[key]}
                    </td>
                    {m365Data.tiers.map(tier => (
                      <td key={tier.id} className="py-2.5 px-3 border-r border-stone-100 last:border-r-0" title={tier.features[key]?.detail}>
                        <ComparisonBadge available={tier.features[key]?.available} label={tier.features[key]?.label} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-stone-400 mt-2">Hover over icons to see details. Feature availability from Microsoft documentation. Pricing reflects nonprofit rates as of early 2026.</p>
        </div>
      )}

      {/* Single Tier View */}
      {!showComparison && (
        <div className="space-y-8">
          {/* Feature Grid */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-stone-800">Feature Availability</h2>
              <span className="text-sm text-stone-400">
                {availableCount} of {totalCount} features available
              </span>
            </div>
            <div className="border border-stone-200 rounded-xl overflow-hidden">
              {featureKeys.map((key, idx) => {
                const feature = selectedTier.features[key];
                if (!feature) return null;
                return (
                  <div
                    key={key}
                    className={`flex items-start justify-between gap-4 px-5 py-3.5 ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'
                    } ${idx < featureKeys.length - 1 ? 'border-b border-stone-100' : ''}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-stone-800 text-sm">{featureLabels[key]}</p>
                      <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">{feature.detail}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <AvailabilityBadge feature={feature} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Tier info note */}
          {selectedTier.nonprofitNote && (
            <div className="flex items-start gap-2 text-sm text-stone-500 bg-stone-50 rounded-lg px-4 py-3 border border-stone-200">
              <svg className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              <span>{selectedTier.nonprofitNote}{selectedTier.userCap ? `. Business plans are capped at ${selectedTier.userCap} users — larger organizations should consider E3 or E5.` : ''}</span>
            </div>
          )}

          {/* Recommendations */}
          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-4">Recommendations for {selectedTier.name}</h2>
            <div className="grid gap-3">
              {selectedTier.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                  <span className="text-blue-500 font-bold text-sm mt-0.5 flex-shrink-0">{idx + 1}.</span>
                  <p className="text-sm text-stone-700 leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Implementation Checklist */}
          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-2">Implementation Checklist</h2>
            <p className="text-sm text-stone-400 mb-4">
              Click each step to see the admin portal path and implementation details.
            </p>
            <div className="space-y-2">
              {checklist.map((step, idx) => (
                <ChecklistStep key={idx} step={step} />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
