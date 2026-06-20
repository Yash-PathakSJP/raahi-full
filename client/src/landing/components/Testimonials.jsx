import { testimonials } from '../data/siteContent.js'
import { IconStar } from './Icons.jsx'
import './Testimonials.css'

export default function Testimonials() {
  return (
    <section id="testimonials" className="section testimonials">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Testimonials</span>
          <h2 className="section-title">
            Loved by <span className="text-gradient">Explorers</span> ♡
          </h2>
          <p className="section-sub">Real stories from real travelers who found their tribe with Raahi.</p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <figure className="testimonial-card card" key={t.name}>
              <div className="testimonial-stars" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <IconStar key={i} width="16" height="16" />
                ))}
              </div>
              <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption>
                <img src={t.image} alt="" loading="lazy" />
                <div>
                  <p className="testimonial-name">{t.name}</p>
                  <p className="testimonial-location">{t.location}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
