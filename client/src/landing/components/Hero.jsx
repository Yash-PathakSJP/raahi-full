import { Link } from 'react-router-dom'
import { heroStats, trustedBrands } from '../data/siteContent.js'
import { IconSparkle, IconUsers, IconMapPin } from './Icons.jsx'
import './Hero.css'

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-glow" aria-hidden="true" />
      <div className="container hero-inner">
        <div className="hero-copy">
          <span className="hero-badge">
            <span className="hero-badge-new">New</span>
            AI Matching is here! Find your perfect travel buddy.
          </span>

          <h1 className="hero-title">
            Find Your People.
            <br />
            <span className="text-gradient">Explore the World.</span>
          </h1>

          <p className="hero-desc">
            Raahi connects you with like-minded travelers. Plan trips, share adventures, create memories.
          </p>

          <div className="hero-actions">
            <Link to="/signup" className="btn btn-primary">
              <IconUsers width="18" height="18" />
              Find Travel Buddy
            </Link>
            <a href="#features" className="btn btn-dark-outline">
              Explore Trips
            </a>
          </div>

          <dl className="hero-stats">
            {heroStats.map((stat) => (
              <div className="hero-stat" key={stat.label}>
                <dt className="hero-stat-value">{stat.value}</dt>
                <dd className="hero-stat-label">{stat.label}</dd>
              </div>
            ))}
          </dl>

          <div className="hero-trusted">
            <span>Trusted by explorers from</span>
            <div className="hero-trusted-logos">
              {trustedBrands.map((brand) => (
                <span key={brand} className="hero-trusted-logo">{brand}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-globe-wrap">
            <svg className="hero-globe" viewBox="0 0 420 420" width="100%" height="100%">
              <defs>
                <radialGradient id="globeGrad" cx="35%" cy="30%" r="75%">
                  <stop offset="0%" stopColor="#A855F7" />
                  <stop offset="55%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#4C1D95" />
                </radialGradient>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F0ABFC" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
              <circle cx="210" cy="210" r="150" fill="url(#globeGrad)" />
              <g stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="none">
                <ellipse cx="210" cy="210" rx="150" ry="46" />
                <ellipse cx="210" cy="210" rx="150" ry="95" />
                <ellipse cx="210" cy="210" rx="60" ry="150" />
                <ellipse cx="210" cy="210" rx="110" ry="150" />
                <line x1="60" y1="210" x2="360" y2="210" />
              </g>
              <ellipse cx="210" cy="210" rx="190" ry="56" fill="none" stroke="url(#ringGrad)" strokeWidth="2" strokeDasharray="3 7" opacity="0.8" transform="rotate(-12 210 210)" />
              <circle cx="160" cy="160" r="3" fill="#fff" opacity="0.9" />
              <circle cx="260" cy="180" r="2.4" fill="#fff" opacity="0.7" />
              <circle cx="230" cy="260" r="2.8" fill="#fff" opacity="0.8" />
            </svg>
            <div className="hero-plane">
              <svg viewBox="0 0 24 24" width="46" height="46" fill="#fff">
                <path d="M21 16v-2l-8-5V4.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V18l-2.5 2v1.5L11 21l3.5.5V20l-2.5-2v-4.5L21 16z" />
              </svg>
            </div>
            <div className="hero-cloud hero-cloud-1">
              <CloudSvg />
            </div>
            <div className="hero-cloud hero-cloud-2">
              <CloudSvg />
            </div>
            <div className="hero-pin hero-pin-1">
              <IconMapPin width="20" height="20" />
            </div>
            <div className="hero-sparkle hero-sparkle-1">
              <IconSparkle width="20" height="20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CloudSvg() {
  return (
    <svg viewBox="0 0 64 36" width="64" height="36" fill="rgba(255,255,255,0.55)">
      <ellipse cx="18" cy="22" rx="14" ry="11" />
      <ellipse cx="34" cy="14" rx="16" ry="13" />
      <ellipse cx="50" cy="22" rx="13" ry="10" />
      <rect x="10" y="20" width="44" height="12" rx="6" />
    </svg>
  )
}
