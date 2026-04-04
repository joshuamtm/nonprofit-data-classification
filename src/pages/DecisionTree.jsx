import { useState } from 'react';
import { Link } from 'react-router-dom';

const tierInfo = {
  T1: {
    name: 'T1 — Public',
    color: 'green',
    bg: 'bg-green-50',
    border: 'border-green-300',
    badge: 'bg-green-600 text-white',
    text: 'text-green-800',
    description: 'Information intended for public consumption. No special handling required beyond accuracy.',
    examples: 'Annual reports, press releases, public event details, published research, marketing materials.',
  },
  T2: {
    name: 'T2 — Internal',
    color: 'blue',
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    badge: 'bg-blue-600 text-white',
    text: 'text-blue-800',
    description: 'General internal information not intended for public release. Disclosure would be inconvenient but not harmful.',
    examples: 'Internal memos, meeting notes, org charts, operational procedures, internal project plans.',
  },
  T3: {
    name: 'T3 — Confidential',
    color: 'amber',
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    badge: 'bg-amber-600 text-white',
    text: 'text-amber-800',
    description: 'Sensitive information whose disclosure could cause harm to the organization or individuals. Requires access controls and careful handling.',
    examples: 'Donor lists with giving history, employee performance reviews, strategic plans, financial statements, legal correspondence.',
  },
  T4: {
    name: 'T4 — Restricted',
    color: 'red',
    bg: 'bg-red-50',
    border: 'border-red-300',
    badge: 'bg-red-600 text-white',
    text: 'text-red-800',
    description: 'Highly sensitive data protected by law/regulation or whose disclosure could cause significant harm. Strictest controls required.',
    examples: 'Social Security numbers, health records (HIPAA), student records (FERPA), credit card numbers, abuse/safety case files.',
  },
};

const questions = [
  {
    id: 'q1',
    text: 'Is this information intended for public consumption?',
    helpText: 'Think: would this appear on your website, in a press release, or in publicly available documents?',
    yesResult: 'T1',
    noNext: 'q2',
  },
  {
    id: 'q2',
    text: 'Does this data identify a specific individual?',
    helpText: 'Names, SSNs, email addresses, photos, addresses, phone numbers, biometric data, or any combination that could identify someone.',
    yesNext: 'q3',
    noNext: 'q5',
  },
  {
    id: 'q3',
    text: 'Is this personal data protected by law or regulation?',
    helpText: 'HIPAA (health), FERPA (education), state privacy laws, PCI DSS (payment cards), or other regulatory frameworks.',
    yesResult: 'T4',
    noNext: 'q4',
  },
  {
    id: 'q4',
    text: 'Could disclosure cause significant harm to an individual?',
    helpText: 'Physical safety risk, substantial financial harm, severe reputational damage, or risk of discrimination.',
    yesResult: 'T4',
    noResult: 'T3',
  },
  {
    id: 'q5',
    text: 'Is this sensitive organizational information?',
    helpText: 'Strategic plans, detailed financials, legal matters, board executive session materials, security configurations.',
    yesResult: 'T3',
    noNext: 'q6',
  },
  {
    id: 'q6',
    text: 'Would disclosure cause embarrassment or competitive disadvantage?',
    helpText: 'Draft proposals, internal debates, salary data, vendor negotiations, or information that could be taken out of context.',
    yesResult: 'T3',
    noResult: 'T2',
  },
];

function getQuestionById(id) {
  return questions.find(q => q.id === id);
}

function ResultCard({ tierId }) {
  const tier = tierInfo[tierId];
  return (
    <div className={`${tier.bg} ${tier.border} border-2 rounded-2xl p-6 shadow-sm`}>
      <div className="flex items-center gap-3 mb-4">
        <span className={`${tier.badge} px-3 py-1.5 rounded-lg text-sm font-bold`}>{tier.name}</span>
      </div>
      <p className={`${tier.text} font-medium text-lg mb-2`}>This data should be classified as {tier.name}.</p>
      <p className="text-stone-600 text-sm leading-relaxed mb-4">{tier.description}</p>
      <div className="mb-4">
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">Common examples</p>
        <p className="text-sm text-stone-500">{tier.examples}</p>
      </div>
      <Link
        to="/guide/tiers"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 no-underline"
      >
        View full tier details and handling requirements
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </Link>
    </div>
  );
}

function AnswerHistoryItem({ question, answer, index }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-stone-200 text-stone-500 text-xs font-bold flex items-center justify-center mt-0.5">
        {index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-stone-600">{question}</p>
        <span className={`inline-block text-xs font-semibold mt-1 px-2 py-0.5 rounded-full ${
          answer === 'yes' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {answer === 'yes' ? 'Yes' : 'No'}
        </span>
      </div>
    </div>
  );
}

function FlowchartNode({ text, type, className = '' }) {
  const styles = {
    question: 'bg-white border-2 border-stone-300 rounded-xl',
    T1: `${tierInfo.T1.bg} border-2 ${tierInfo.T1.border} rounded-xl`,
    T2: `${tierInfo.T2.bg} border-2 ${tierInfo.T2.border} rounded-xl`,
    T3: `${tierInfo.T3.bg} border-2 ${tierInfo.T3.border} rounded-xl`,
    T4: `${tierInfo.T4.bg} border-2 ${tierInfo.T4.border} rounded-xl`,
  };

  return (
    <div className={`px-4 py-2.5 text-sm font-medium text-center ${styles[type] || styles.question} ${className}`}>
      {text}
    </div>
  );
}

function FlowchartArrow({ label, direction = 'down' }) {
  if (direction === 'down') {
    return (
      <div className="flex flex-col items-center">
        <div className="w-px h-6 bg-stone-300" />
        {label && (
          <span className="text-xs font-semibold text-stone-400 bg-white px-1.5 -my-1 relative z-10">{label}</span>
        )}
        {label && <div className="w-px h-2 bg-stone-300" />}
        <svg className="w-3 h-3 text-stone-400" viewBox="0 0 12 12" fill="currentColor">
          <path d="M6 9L1 4h10z" />
        </svg>
      </div>
    );
  }
  return (
    <div className="flex items-center">
      <div className="h-px w-6 bg-stone-300" />
      {label && (
        <span className="text-xs font-semibold text-stone-400 bg-white px-1.5 -mx-1 relative z-10">{label}</span>
      )}
      {label && <div className="h-px w-2 bg-stone-300" />}
      <svg className="w-3 h-3 text-stone-400" viewBox="0 0 12 12" fill="currentColor">
        <path d="M9 6L4 1v10z" />
      </svg>
    </div>
  );
}

function StaticFlowchart() {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[500px] max-w-2xl mx-auto">
        {/* Q1 */}
        <FlowchartNode text="Is it intended for public consumption?" type="question" />
        <div className="flex">
          <div className="flex-1 flex flex-col items-center">
            <FlowchartArrow label="YES" />
            <FlowchartNode text="T1 — Public" type="T1" />
          </div>
          <div className="flex-1 flex flex-col items-center">
            <FlowchartArrow label="NO" />
            {/* Q2 */}
            <FlowchartNode text="Does it identify an individual?" type="question" />
            <div className="flex w-full">
              <div className="flex-1 flex flex-col items-center">
                <FlowchartArrow label="YES" />
                {/* Q3 */}
                <FlowchartNode text="Protected by law/regulation?" type="question" className="text-xs" />
                <div className="flex w-full">
                  <div className="flex-1 flex flex-col items-center">
                    <FlowchartArrow label="YES" />
                    <FlowchartNode text="T4 — Restricted" type="T4" className="text-xs" />
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <FlowchartArrow label="NO" />
                    {/* Q4 */}
                    <FlowchartNode text="Could cause significant harm?" type="question" className="text-xs" />
                    <div className="flex w-full">
                      <div className="flex-1 flex flex-col items-center">
                        <FlowchartArrow label="YES" />
                        <FlowchartNode text="T4" type="T4" className="text-xs" />
                      </div>
                      <div className="flex-1 flex flex-col items-center">
                        <FlowchartArrow label="NO" />
                        <FlowchartNode text="T3" type="T3" className="text-xs" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <FlowchartArrow label="NO" />
                {/* Q5 */}
                <FlowchartNode text="Sensitive org info?" type="question" className="text-xs" />
                <div className="flex w-full">
                  <div className="flex-1 flex flex-col items-center">
                    <FlowchartArrow label="YES" />
                    <FlowchartNode text="T3 — Confidential" type="T3" className="text-xs" />
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <FlowchartArrow label="NO" />
                    {/* Q6 */}
                    <FlowchartNode text="Embarrassment or disadvantage?" type="question" className="text-xs" />
                    <div className="flex w-full">
                      <div className="flex-1 flex flex-col items-center">
                        <FlowchartArrow label="YES" />
                        <FlowchartNode text="T3" type="T3" className="text-xs" />
                      </div>
                      <div className="flex-1 flex flex-col items-center">
                        <FlowchartArrow label="NO" />
                        <FlowchartNode text="T2 — Internal" type="T2" className="text-xs" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DecisionTree() {
  const [currentQuestionId, setCurrentQuestionId] = useState('q1');
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState(null);

  const currentQuestion = getQuestionById(currentQuestionId);

  function handleAnswer(answer) {
    const q = currentQuestion;
    const newHistory = [...history, { questionText: q.text, answer }];
    setHistory(newHistory);

    if (answer === 'yes') {
      if (q.yesResult) {
        setResult(q.yesResult);
        setCurrentQuestionId(null);
      } else if (q.yesNext) {
        setCurrentQuestionId(q.yesNext);
      }
    } else {
      if (q.noResult) {
        setResult(q.noResult);
        setCurrentQuestionId(null);
      } else if (q.noNext) {
        setCurrentQuestionId(q.noNext);
      }
    }
  }

  function handleReset() {
    setCurrentQuestionId('q1');
    setHistory([]);
    setResult(null);
  }

  const questionNumber = history.length + 1;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">Data Classification Decision Tree</h1>
        <p className="text-stone-500 text-lg">
          Answer a few questions about your data to determine the right classification tier.
        </p>
      </div>

      {/* Interactive Section */}
      <div className="mb-16">
        <h2 className="text-lg font-semibold text-stone-700 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
          Interactive Classifier
        </h2>

        {/* Answer History */}
        {history.length > 0 && (
          <div className="mb-6 space-y-3 border-l-2 border-stone-200 pl-4">
            {history.map((item, idx) => (
              <AnswerHistoryItem
                key={idx}
                question={item.questionText}
                answer={item.answer}
                index={idx}
              />
            ))}
          </div>
        )}

        {/* Current Question */}
        {currentQuestion && !result && (
          <div className="bg-white border-2 border-emerald-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
                Question {questionNumber} of 6
              </span>
            </div>
            <h3 className="text-xl font-semibold text-stone-800 mb-2">{currentQuestion.text}</h3>
            {currentQuestion.helpText && (
              <p className="text-sm text-stone-400 mb-6 leading-relaxed">{currentQuestion.helpText}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => handleAnswer('yes')}
                className="flex-1 py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors cursor-pointer text-sm"
              >
                Yes
              </button>
              <button
                onClick={() => handleAnswer('no')}
                className="flex-1 py-3 px-6 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl transition-colors cursor-pointer text-sm"
              >
                No
              </button>
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="space-y-4">
            <ResultCard tierId={result} />
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
              </svg>
              Start Over
            </button>
          </div>
        )}

        {/* Initial state prompt */}
        {history.length === 0 && !result && (
          <p className="text-xs text-stone-400 mt-3">
            Your answers are not stored. This tool runs entirely in your browser.
          </p>
        )}
      </div>

      {/* Static Flowchart Reference */}
      <div>
        <h2 className="text-lg font-semibold text-stone-700 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" />
          </svg>
          Quick Reference Flowchart
        </h2>
        <p className="text-sm text-stone-400 mb-6">
          A visual overview of the complete classification decision flow.
        </p>
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6">
          <StaticFlowchart />
        </div>
        <p className="text-xs text-stone-400 mt-3 text-center">
          When in doubt, classify at the higher (more restrictive) tier. You can always declassify later.
        </p>
      </div>
    </div>
  );
}
