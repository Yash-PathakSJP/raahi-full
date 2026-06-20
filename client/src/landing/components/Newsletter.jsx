import { useState } from 'react'
import { IconGlobe, IconPlane } from './Icons.jsx'
import './Newsletter.css'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong. Please try again.')
      }

      setStatus('success')
      setMessage(data.message || "You're subscribed! Watch your inbox for travel tips.")
      setEmail('')
    } catch (err) {
      setStatus('error')
      setMessage(err.message || 'Could not subscribe right now. Please try again.')
    }
  }

  return (
    <section className="section newsletter-section">
      <div className="container">
        <div className="newsletter-band">
          <div className="newsletter-copy">
            <span className="eyebrow">Get Started</span>
            <h2 className="section-title">
              Your Journey
              <br />
              <span className="text-gradient">Starts Here</span> <IconPlane width="22" height="22" className="newsletter-plane-icon" />
            </h2>
            <p className="section-sub">Sign up now and find your perfect travel companion.</p>
          </div>

          <div className="newsletter-globe" aria-hidden="true">
            <IconGlobe width="84" height="84" />
            <span className="newsletter-globe-plane">
              <IconPlane width="22" height="22" />
            </span>
          </div>

          <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
            <h3>Join the Raahi Community</h3>
            <p>Get travel tips, updates and exclusive offers.</p>
            <div className="newsletter-input-row">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
              />
              <button type="submit" className="btn btn-primary btn-sm" disabled={status === 'loading'}>
                {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
              </button>
            </div>
            {message && (
              <p className={`newsletter-message ${status === 'error' ? 'is-error' : 'is-success'}`} role="status">
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
