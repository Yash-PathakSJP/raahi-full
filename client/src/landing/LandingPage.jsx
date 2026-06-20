import { ThemeProvider } from './context/ThemeContext.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Features from './components/Features.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import DiscoverTravelers from './components/DiscoverTravelers.jsx';
import TripsShowcase from './components/TripsShowcase.jsx';
import CompatibilityShowcase from './components/CompatibilityShowcase.jsx';
import Testimonials from './components/Testimonials.jsx';
import Community from './components/Community.jsx';
import Newsletter from './components/Newsletter.jsx';
import Footer from './components/Footer.jsx';

import './styles/global.css';

// The .raahi-landing wrapper scopes all of the landing page's plain-CSS
// resets and component styles so they can't leak into the Tailwind-based
// dashboard, which shares this same single-page app.
export default function LandingPage() {
  return (
    <ThemeProvider>
      <div className="raahi-landing">
        <Header />
        <main>
          <Hero />
          <Features />
          <HowItWorks />
          <DiscoverTravelers />
          <TripsShowcase />
          <CompatibilityShowcase />
          <Testimonials />
          <Community />
          <Newsletter />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
