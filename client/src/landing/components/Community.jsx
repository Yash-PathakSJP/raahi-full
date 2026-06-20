import { Link } from 'react-router-dom'
import { communityStats } from '../data/siteContent.js'
import { IconPlay } from './Icons.jsx'
import './Community.css'

export default function Community() {
  return (
    <section className="community">
      <div className="community-photo">
        <img
          src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=1600&h=700&fit=crop"
          alt="A group of friends cheering with arms raised at a mountain viewpoint"
          loading="lazy"
        />
        <div className="community-overlay" />
      </div>

      <div className="container community-content">
        <span className="eyebrow eyebrow-on-dark">Community</span>
        <h2 className="section-title community-title">
          More Than an App.
          <br />
          It&rsquo;s a <span className="text-gradient">Community.</span>
        </h2>
        <p className="community-desc">
          Raahi isn&rsquo;t just about trips. It&rsquo;s about people, connections and experiences for a lifetime.
        </p>

        <dl className="community-stats">
          {communityStats.map((stat) => (
            <div className="community-stat" key={stat.label}>
              <dt>{stat.value}</dt>
              <dd>{stat.label}</dd>
            </div>
          ))}
        </dl>

        <div className="community-cta" id="contact">
          <div className="community-cta-text">
            <h3>Ready for your next adventure?</h3>
            <p>Join Raahi today and start exploring with amazing people.</p>
          </div>
          <div className="community-cta-actions">
            <Link to="/signup" className="btn btn-primary">Get Started Free</Link>
            <button type="button" className="btn btn-dark-outline">
              <IconPlay width="15" height="15" />
              Watch Video
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
