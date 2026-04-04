import { Link } from 'react-router-dom';
import taxonomy from '../data/nonprofit-data-taxonomy.json';

const tierOrder = ['T1', 'T2', 'T3', 'T4'];

const tierStyles = {
  T1: {
    border: 'border-green-300',
    bg: 'bg-green-50',
    headerBg: 'bg-green-600',
    badge: 'bg-green-100 text-green-800',
    dot: 'bg-green-500',
    lightBg: 'bg-green-50',
  },
  T2: {
    border: 'border-blue-300',
    bg: 'bg-blue-50',
    headerBg: 'bg-blue-600',
    badge: 'bg-blue-100 text-blue-800',
    dot: 'bg-blue-500',
    lightBg: 'bg-blue-50',
  },
  T3: {
    border: 'border-amber-300',
    bg: 'bg-amber-50',
    headerBg: 'bg-amber-600',
    badge: 'bg-amber-100 text-amber-800',
    dot: 'bg-amber-500',
    lightBg: 'bg-amber-50',
  },
  T4: {
    border: 'border-red-300',
    bg: 'bg-red-50',
    headerBg: 'bg-red-600',
    badge: 'bg-red-100 text-red-800',
    dot: 'bg-red-500',
    lightBg: 'bg-red-50',
  },
};

const handlingSummaries = {
  T1: 'Can be shared freely. No special storage or access controls required. Suitable for websites, annual reports, and public communications.',
  T2: 'Share within the organization. Store on standard internal systems (Google Drive with org-wide access). No external sharing without review.',
  T3: 'Need-to-know access only. Store in access-controlled folders. Encrypt in transit. Review sharing permissions regularly. Log access where possible.',
  T4: 'Explicit authorization required for every access. Encrypt at rest and in transit. Audit all access. Minimize retention. Breach notification may be legally required.',
};

/**
 * Collect example data types from taxonomy.categories for each tier.
 * Returns up to `limit` examples per tier.
 */
function getExamplesForTier(tierId, limit = 5) {
  const examples = [];
  for (const category of taxonomy.categories) {
    for (const dt of category.dataTypes) {
      if (dt.tier === tierId) {
        examples.push({
          name: dt.name,
          category: category.name,
        });
        if (examples.length >= limit) return examples;
      }
    }
  }
  return examples;
}

export default function TierOverview() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-stone-800 to-stone-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
          <Link
            to="/"
            className="inline-flex items-center text-stone-400 hover:text-white text-sm mb-6 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Classification Tiers
          </h1>
          <p className="text-stone-300 text-lg max-w-2xl leading-relaxed">
            Every piece of data your nonprofit handles falls into one of four
            sensitivity tiers. Understanding these tiers is the foundation of a
            practical data protection strategy.
          </p>
        </div>
      </section>

      {/* Tier Cards */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="space-y-10">
          {tierOrder.map((tierId) => {
            const tier = taxonomy.tiers[tierId];
            const styles = tierStyles[tierId];
            const examples = getExamplesForTier(tierId, 5);

            return (
              <article
                key={tierId}
                className={`rounded-xl border-2 ${styles.border} overflow-hidden bg-white shadow-sm`}
              >
                {/* Card Header */}
                <div className={`${styles.headerBg} px-6 py-4 flex items-center gap-3`}>
                  <span className="w-3 h-3 rounded-full bg-white/30" />
                  <h2 className="text-xl font-bold text-white">
                    {tierId} &mdash; {tier.label}
                  </h2>
                </div>

                <div className="p-6 md:p-8">
                  {/* Description */}
                  <p className="text-stone-700 leading-relaxed mb-6 text-base">
                    {tier.description}
                  </p>

                  {/* Key Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className={`${styles.lightBg} rounded-lg p-4`}>
                      <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">
                        Risk if Disclosed
                      </p>
                      <p className="text-stone-800 font-medium">
                        {tier.riskIfDisclosed}
                      </p>
                    </div>
                    <div className={`${styles.lightBg} rounded-lg p-4`}>
                      <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">
                        Default Access
                      </p>
                      <p className="text-stone-800 font-medium">
                        {tier.accessDefault}
                      </p>
                    </div>
                    <div className={`${styles.lightBg} rounded-lg p-4`}>
                      <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">
                        Handling Summary
                      </p>
                      <p className="text-stone-700 text-sm leading-relaxed">
                        {handlingSummaries[tierId]}
                      </p>
                    </div>
                  </div>

                  {/* Example Data Types */}
                  <div>
                    <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wide mb-3">
                      Example Data Types
                    </h3>
                    <ul className="space-y-2">
                      {examples.map((ex, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span
                            className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${styles.dot}`}
                          />
                          <div>
                            <span className="text-stone-800 text-sm">
                              {ex.name}
                            </span>
                            <span className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-full ${styles.badge}`}>
                              {ex.category}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Link to handling matrix */}
                  <div className="mt-6 pt-5 border-t border-stone-100">
                    <Link
                      to="/handling-matrix"
                      className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                    >
                      View full handling requirements for {tier.label} data &rarr;
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-stone-100 border-t border-stone-200">
        <div className="max-w-5xl mx-auto px-6 py-12 text-center">
          <h2 className="text-2xl font-bold text-stone-800 mb-3">
            Not sure where your data falls?
          </h2>
          <p className="text-stone-500 mb-8 max-w-md mx-auto">
            Use the decision tree to classify specific data types, or browse
            the full taxonomy by category.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/decision-tree"
              className="inline-flex items-center justify-center px-6 py-3 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-colors shadow-sm"
            >
              Use the Decision Tree
            </Link>
            <Link
              to="/guide"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-stone-300 text-stone-700 font-semibold rounded-lg hover:border-stone-400 hover:bg-stone-50 transition-colors"
            >
              Read the Full Guide
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
