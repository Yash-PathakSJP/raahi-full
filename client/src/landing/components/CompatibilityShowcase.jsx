import { compatibilityMatch } from '../data/siteContent.js'
import { IconSparkle, IconCheck, IconHeartHandshake } from './Icons.jsx'
import './CompatibilityShowcase.css'

export default function CompatibilityShowcase() {
  const { score, label, personA, personB, signals, reasons } = compatibilityMatch
  const circumference = 2 * Math.PI * 42

  return (
    <section id="pricing" className="section compatibility">
      <div className="container compatibility-inner">
        <div className="compatibility-copy">
          <span className="eyebrow">AI</span>
          <h2 className="section-title">
            AI Compatibility
            <br />
            That Gets <span className="text-gradient">You</span>{' '}
            <IconSparkle width="22" height="22" className="compatibility-sparkle" />
          </h2>
          <p className="section-sub">
            Our AI looks beyond basics to find your perfect travel partner.
          </p>

          <ul className="compatibility-signals">
            {signals.map((signal) => (
              <li key={signal}>
                <IconCheck width="14" height="14" />
                {signal}
              </li>
            ))}
          </ul>
        </div>

        <div className="compatibility-card-wrap">
          <div className="match-card">
            <div className="match-people">
              <div className="match-person">
                <img src={personA.image} alt={personA.name} />
                <p className="match-name">{personA.name}</p>
                <p className="match-location">{personA.location}</p>
              </div>

              <div className="match-score">
                <svg viewBox="0 0 100 100" width="92" height="92">
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#A855F7" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border-subtle)" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke="url(#scoreGrad)" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - score / 100)}
                    transform="rotate(-90 50 50)"
                  />
                  <text x="50" y="48" textAnchor="middle" fontSize="22" fontWeight="800" fill="var(--text-primary)">{score}%</text>
                  <text x="50" y="64" textAnchor="middle" fontSize="8" fill="var(--text-tertiary)">match</text>
                </svg>
                <p className="match-label">
                  <IconHeartHandshake width="14" height="14" />
                  {label}
                </p>
              </div>

              <div className="match-person">
                <img src={personB.image} alt={personB.name} />
                <p className="match-name">{personB.name}</p>
                <p className="match-location">{personB.location}</p>
              </div>
            </div>

            <div className="match-reasons">
              <p className="match-reasons-title">Why you match?</p>
              <ul>
                {reasons.map((reason) => (
                  <li key={reason}>
                    <IconCheck width="13" height="13" />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <p className="compatibility-footnote">Higher compatibility. Better journeys.</p>
    </section>
  )
}
