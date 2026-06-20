import { howItWorks } from '../data/siteContent.js'
import { IconUserCheck, IconUsers, IconMap } from './Icons.jsx'
import './HowItWorks.css'

const iconMap = {
  userCheck: IconUserCheck,
  users: IconUsers,
  map: IconMap,
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section how-it-works">
      <div className="how-glow" aria-hidden="true" />
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow">How it Works</span>
          <h2 className="section-title">
            Travel in <span className="text-gradient">3 Simple Steps</span>
          </h2>
          <p className="section-sub" style={{ marginInline: 'auto' }}>
            From matching to memories, Raahi makes the journey simple.
          </p>
        </div>

        <div className="steps">
          <svg className="steps-path" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true">
            <path d="M120 30 Q 350 -10 500 30 T 880 30" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 8" />
          </svg>
          {howItWorks.map((step) => {
            const Icon = iconMap[step.icon]
            return (
              <div className="step" key={step.number}>
                <div className="step-icon-wrap">
                  <span className="step-number">{step.number}</span>
                  <span className="step-icon">
                    <Icon width="26" height="26" />
                  </span>
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
