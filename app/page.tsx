import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--gradient-soft)' }}>
      <main className="max-w-2xl w-full text-center">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full"
            style={{
              background: 'var(--color-bg-card)',
              boxShadow: 'var(--shadow-sm)'
            }}>
            <span className="text-2xl">🧭</span>
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              LifeDirection AI
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight"
            style={{ color: 'var(--color-text-primary)' }}>
            See Where Your Life<br />Is{' '}
            <span style={{
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Heading
            </span>
          </h1>

          <p className="text-lg md:text-xl mb-2 max-w-xl mx-auto"
            style={{ color: 'var(--color-text-secondary)' }}>
            We don&apos;t predict your future. We show the direction your life is moving.
          </p>

          <p className="text-base mb-8 max-w-lg mx-auto"
            style={{ color: 'var(--color-text-muted)' }}>
            Based on your habits, routine, and mindset, discover three possible paths and how small changes can create a better direction.
          </p>
        </div>

        {/* CTA Button */}
        <Link href="/questionnaire">
          <button
            className="group relative px-8 py-4 text-lg font-semibold text-white rounded-full overflow-hidden transform hover:scale-105 transition-all duration-300"
            style={{
              background: 'var(--gradient-primary)',
              boxShadow: 'var(--shadow-md)'
            }}>
            <span className="relative z-10 flex items-center gap-2">
              See My Life Direction
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </Link>

        <p className="mt-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          ⏱️ Takes less than 1 minute • No signup required
        </p>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4 mt-16">
          {[
            { emoji: '👶', title: 'For All Ages', desc: 'From 8 to 70 years old' },
            { emoji: '🎯', title: 'Simple & Visual', desc: 'Easy to understand insights' },
            { emoji: '💚', title: 'Non-Judgmental', desc: 'Supportive and encouraging' }
          ].map((feature, idx) => (
            <div key={idx}
              className="p-6 rounded-2xl"
              style={{
                background: 'var(--color-bg-card)',
                boxShadow: 'var(--shadow-sm)'
              }}>
              <div className="text-3xl mb-2">{feature.emoji}</div>
              <h3 className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                {feature.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
