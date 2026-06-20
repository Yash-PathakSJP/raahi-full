import { Link } from 'react-router-dom'
import { travelers, discoverPerks } from '../data/siteContent.js'
import { IconCheckCircle } from './Icons.jsx'
import './DiscoverTravelers.css'

export default function DiscoverTravelers() {
  return (
    <section className="section discover">
      <div className="container discover-inner">
        <div className="discover-copy">
          <span className="eyebrow">Discover</span>
          <h2 className="section-title">
            Discover Travelers
            <br />
            <span className="text-gradient">Like You</span>
          </h2>
          <p className="section-sub">
            Find and connect with awesome people who love to travel just like you.
          </p>

          <ul className="discover-list">
            {discoverPerks.map((perk) => (
              <li key={perk} className="discover-item">
                <IconCheckCircle width="20" height="20" className="discover-check" />
                <span>{perk}</span>
              </li>
            ))}
          </ul>

          <Link to="/signup" className="btn btn-primary">Explore Travelers</Link>
        </div>

        <div className="discover-stack">
          {travelers.map((traveler, i) => (
            <div
              className={`traveler-card ${traveler.featured ? 'is-featured' : ''}`}
              key={traveler.name}
              style={{ '--i': i }}
            >
              {traveler.badge && <span className="traveler-badge">{traveler.badge}</span>}
              <img src={traveler.image} alt={`${traveler.name}, ${traveler.age}, ${traveler.location}`} loading="lazy" />
              <div className="traveler-info">
                <p className="traveler-name">{traveler.name}, {traveler.age}</p>
                <p className="traveler-location">{traveler.location}</p>
                <div className="traveler-tags">
                  {traveler.tags.map((tag) => (
                    <span className="traveler-tag" key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
