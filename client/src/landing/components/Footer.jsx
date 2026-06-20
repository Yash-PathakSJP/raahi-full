import { footerLinks } from '../data/siteContent.js'
import { IconInstagram, IconFacebook, IconTwitter, IconYoutube } from './Icons.jsx'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#home" className="brand">
              <span className="brand-mark" aria-hidden="true">
                <svg viewBox="0 0 32 32" width="30" height="30">
                  <defs>
                    <linearGradient id="footerBrandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#A855F7" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                  </defs>
                  <rect width="32" height="32" rx="9" fill="url(#footerBrandGrad)" />
                  <path d="M9 21 L16 8 L23 21 L16 17 Z" fill="white" />
                </svg>
              </span>
              <span className="brand-name footer-brand-name">RAAHI</span>
            </a>
            <p className="footer-tagline">
              Find your people.
              <br />
              Explore the world.
              <br />
              Create memories.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Raahi on Instagram"><IconInstagram width="17" height="17" /></a>
              <a href="#" aria-label="Raahi on Facebook"><IconFacebook width="17" height="17" /></a>
              <a href="#" aria-label="Raahi on Twitter"><IconTwitter width="17" height="17" /></a>
              <a href="#" aria-label="Raahi on YouTube"><IconYoutube width="17" height="17" /></a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <nav className="footer-col" aria-label={heading} key={heading}>
              <h4>{heading}</h4>
              <ul>
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="footer-bottom">
          <p>&copy; {year} Raahi. All rights reserved.</p>
          <p className="footer-made-with">Made with <span className="footer-heart">&hearts;</span> for travelers everywhere.</p>
        </div>
      </div>
    </footer>
  )
}
