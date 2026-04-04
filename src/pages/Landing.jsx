import { Link } from 'react-router-dom';
import taxonomy from '../data/nonprofit-data-taxonomy.json';

const tierOrder = ['T1', 'T2', 'T3', 'T4'];

const tierCardStyles = {
  T1: {
    border: 'border-green-300',
    bg: 'bg-green-50',
    badge: 'bg-green-600 text-white',
    icon: '🟢',
  },
  T2: {
    border: 'border-blue-300',
    bg: 'bg-blue-50',
    badge: 'bg-blue-600 text-white',
    icon: '🔵',
  },
  T3: {
    border: 'border-amber-300',
    bg: 'bg-amber-50',
    badge: 'bg-amber-600 text-white',
    icon: '🟡',
  },
  T4: {
    border: 'border-red-300',
    bg: 'bg-red-50',
    badge: 'bg-red-600 text-white',
    icon: '🔴',
  },
};

const getStartedCards = [
  {
    title: 'Read the Guide',
    description:
      'Understand data classification fundamentals, why it matters for nonprofits, and how to build a culture of data stewardship.',
    link: '/guide',
    linkText: 'Start Reading',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    title: 'Decision Tree',
    description:
      'Answer a few simple questions about your data and get an instant classification recommendation with handling guidance.',
    link: '/decision-tree',
    linkText: 'Classify Data',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
      </svg>
    ),
  },
  {
    title: 'Policy Wizard',
    description:
      'Generate a customized data classification policy document tailored to your nonprofit, ready to adapt and adopt.',
    link: '/wizard',
    linkText: 'Generate Policy',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
          <p className="text-emerald-200 text-sm font-semibold uppercase tracking-widest mb-4">
            Free Nonprofit Resource
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Protect Your Mission by{' '}
            <span className="text-emerald-300">Protecting Your Data</span>
          </h1>
          <p className="text-lg md:text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed mb-10">
            A free, practical guide to classifying and handling sensitive
            information in your nonprofit &mdash; built for Google Workspace
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/guide"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-emerald-800 font-semibold rounded-lg shadow-lg hover:bg-emerald-50 transition-colors"
            >
              Read the Guide
            </Link>
            <Link
              to="/tiers"
              className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-emerald-300 text-white font-semibold rounded-lg hover:bg-emerald-600/30 transition-colors"
            >
              Explore the Tiers
            </Link>
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-stone-800">
            What Is Data Classification?
          </h2>
          <p className="mt-4 text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Data classification is the practice of organizing your
            organization's information into tiers based on sensitivity. Each
            tier has clear rules for who can access it, how it should be stored,
            and what happens if it's exposed. It turns vague anxiety about data
            security into concrete, actionable guidance your whole team can
            follow.
          </p>
        </div>
      </section>

      {/* Tier Cards */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-stone-800 text-center mb-2">
          Four Tiers of Sensitivity
        </h2>
        <p className="text-stone-500 text-center mb-10 max-w-xl mx-auto">
          Every piece of data in your nonprofit maps to one of these tiers.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tierOrder.map((tierId) => {
            const tier = taxonomy.tiers[tierId];
            const styles = tierCardStyles[tierId];
            return (
              <Link
                key={tierId}
                to="/tiers"
                className={`block rounded-xl border-2 ${styles.border} ${styles.bg} p-6 hover:shadow-lg transition-shadow group`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{styles.icon}</span>
                  <span
                    className={`text-xs font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full ${styles.badge}`}
                  >
                    {tier.label}
                  </span>
                </div>
                <p className="text-stone-700 text-sm leading-relaxed mb-3">
                  {tier.description}
                </p>
                <div className="text-xs text-stone-500">
                  <span className="font-semibold">Risk if disclosed:</span>{' '}
                  {tier.riskIfDisclosed}
                </div>
                <div className="text-xs text-stone-500 mt-1">
                  <span className="font-semibold">Default access:</span>{' '}
                  {tier.accessDefault}
                </div>
                <p className="mt-4 text-sm font-medium text-emerald-700 group-hover:text-emerald-800 transition-colors">
                  Learn more &rarr;
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Get Started */}
      <section className="bg-stone-100 border-t border-stone-200">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-stone-800 text-center mb-3">
            Get Started
          </h2>
          <p className="text-stone-500 text-center mb-12 max-w-lg mx-auto">
            Three ways to put data classification to work at your organization.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {getStartedCards.map((card) => (
              <Link
                key={card.title}
                to={card.link}
                className="bg-white rounded-xl border border-stone-200 p-8 hover:shadow-lg hover:border-emerald-300 transition-all group"
              >
                <div className="w-14 h-14 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5 group-hover:bg-emerald-200 transition-colors">
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold text-stone-800 mb-2">
                  {card.title}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-4">
                  {card.description}
                </p>
                <span className="text-sm font-semibold text-emerald-700 group-hover:text-emerald-800 transition-colors">
                  {card.linkText} &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer note */}
      <footer className="max-w-5xl mx-auto px-6 py-10 text-center">
        <p className="text-stone-400 text-sm">
          Built for nonprofit professionals who want to protect their people and
          their mission. No login required. No data collected.
        </p>
      </footer>
    </div>
  );
}
