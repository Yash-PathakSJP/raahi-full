import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { trips } from '../data/siteContent.js'
import { IconArrowLeft, IconArrowRight, IconStar, IconCalendar, IconMapPin, IconBalloon } from './Icons.jsx'
import './TripsShowcase.css'

export default function TripsShowcase() {
  const scrollerRef = useRef(null)

  const scrollByCard = (dir) => {
    const node = scrollerRef.current
    if (!node) return
    const card = node.querySelector('.trip-card')
    const amount = card ? card.offsetWidth + 24 : 320
    node.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  return (
    <section className="section trips">
      <div className="container">
        <div className="trips-head">
          <div>
            <span className="eyebrow">Trips</span>
            <h2 className="section-title">
              Trips That
              <br />
              Create <span className="text-gradient">Stories</span>
            </h2>
            <p className="section-sub">Join exciting trips or create your own. Adventure is always better together.</p>
          </div>
          <div className="trips-nav">
            <button type="button" aria-label="Previous trips" onClick={() => scrollByCard(-1)}>
              <IconArrowLeft width="18" height="18" />
            </button>
            <button type="button" aria-label="Next trips" onClick={() => scrollByCard(1)}>
              <IconArrowRight width="18" height="18" />
            </button>
          </div>
        </div>

        <div className="trips-row">
          <div className="trips-balloon" aria-hidden="true">
            <IconBalloon width="56" height="56" />
          </div>

          <div className="trips-scroller" ref={scrollerRef}>
            {trips.map((trip) => (
              <article className="trip-card card" key={trip.title}>
                <div className="trip-image">
                  <img src={trip.image} alt={`${trip.title} in ${trip.location}`} loading="lazy" />
                </div>
                <div className="trip-body">
                  <h3 className="trip-title">{trip.title}</h3>
                  <p className="trip-meta">
                    <IconCalendar width="14" height="14" />
                    {trip.dates}
                  </p>
                  <p className="trip-meta">
                    <IconMapPin width="14" height="14" />
                    {trip.location}
                  </p>
                  <div className="trip-footer">
                    <div className="trip-avatars">
                      {trip.avatars.map((src, i) => (
                        <img src={src} alt="" key={i} className="trip-avatar" style={{ '--i': i }} />
                      ))}
                    </div>
                    <span className="trip-rating">
                      <IconStar width="14" height="14" />
                      {trip.rating} <span className="trip-reviews">({trip.reviews})</span>
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="trips-cta">
          <Link to="/signup" className="btn btn-primary">View All Trips</Link>
        </div>
      </div>
    </section>
  )
}
