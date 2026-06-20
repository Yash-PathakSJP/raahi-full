import Logo from './Logo';

const FEATURES = [
  {
    icon: '🧑‍🤝‍🧑',
    title: 'Find Your People',
    desc: 'Connect with like-minded travelers around the world.',
  },
  {
    icon: '🗺️',
    title: 'Plan & Explore',
    desc: 'Plan trips, share itineraries and explore new destinations.',
  },
  {
    icon: '🎒',
    title: 'Travel Together',
    desc: 'Create unforgettable memories with the right travel buddies.',
  },
];

export default function AuthSidePanel({ heading, highlight, sub }) {
  return (
    <div className="relative hidden h-full flex-col justify-between overflow-hidden bg-navy-gradient p-10 text-white lg:flex">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-brand-600/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-accent-pink/10 blur-3xl" />

      <Logo light size="lg" />

      <div className="relative z-10 max-w-md">
        <h1 className="font-display text-4xl font-extrabold leading-tight">
          {heading} <span className="bg-gradient-to-r from-brand-400 to-accent-pink bg-clip-text text-transparent">{highlight}</span>
        </h1>
        <p className="mt-3 text-gray-400">{sub}</p>

        <div className="mt-10 space-y-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl">
                {f.icon}
              </div>
              <div>
                <p className="font-semibold text-white">{f.title}</p>
                <p className="text-sm text-gray-400">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 rounded-xl border border-white/10 bg-white/5 p-4 text-sm italic text-gray-300">
        “The world is big and beautiful, but it's better with the right people.” 💜
      </div>
    </div>
  );
}
