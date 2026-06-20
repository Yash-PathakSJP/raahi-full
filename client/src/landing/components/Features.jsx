import { features } from '../data/siteContent.js'
import { IconCompass, IconUserCheck, IconMap, IconShield } from './Icons.jsx'
import './Features.css'

const iconMap = {
  compass: IconCompass,
  userCheck: IconUserCheck,
  map: IconMap,
  shield: IconShield,
}

export default function Features() {
  return (
    <section id="features" className="section features">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Features</span>
          <h2 className="section-title">
            Travel Better <span className="text-gradient">Together</span>
          </h2>
          <p className="section-sub">
            Raahi makes it easy to find the perfect travel companions based on your vibe, interests and travel style.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature) => {
            const Icon = iconMap[feature.icon]
            return (
              <div className="feature-card card" key={feature.title}>
                <span className="feature-icon">
                  <Icon width="22" height="22" />
                </span>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            )
          })}
        </div>

        <div className="features-banner">
          <img
            src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=1400&h=420&fit=crop"
            alt="Two travelers with backpacks looking out over a mountain valley at golden hour"
            loading="lazy"
          />
          <div className="features-banner-overlay" />
        </div>
      </div>
    </section>
  )
}
