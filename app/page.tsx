import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 bg-[#050505]">
      {/* Immersive Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-cyan-600/10 blur-[120px] animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      </div>

      <main className="relative z-10 max-w-4xl w-full text-center">
        {/* Futuristic Badge */}
        <div className="inline-flex items-center gap-3 mb-8 px-5 py-2 rounded-full glass-card animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="text-xl animate-pulse">✨</span>
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-cyan-400">
            Advanced Life Analysis
          </span>
        </div>

        <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000">
          SEE YOUR<br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent italic">
            FUTURE PATH
          </span>
        </h1>

        <p className="text-lg md:text-2xl mb-12 max-w-2xl mx-auto text-dim font-light leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
          Discover where your life is heading.
          Get clear insights based on your daily habits.
        </p>

        {/* CTA Group */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          <Link href="/questionnaire">
            <button className="group relative px-10 py-5 bg-cyan-500 text-black font-bold rounded-2xl overflow-hidden hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(34,211,238,0.4)]">
              <span className="relative z-10 flex items-center gap-3 text-lg uppercase tracking-wider">
                Start Now
                <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </Link>

          <div className="text-muted text-sm font-medium tracking-widest uppercase">
            <span className="text-cyan-400">●</span> 1-Minute Quiz
          </div>
        </div>

        {/* Futuristic Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
          {[
            { label: 'Precision', value: 'Smart AI Analysis', glow: 'var(--color-cyan)' },
            { label: 'Privacy', value: 'Safe & Private', glow: 'var(--color-purple)' },
            { label: 'Interface', value: 'Easy To Use', glow: 'var(--color-magenta)' }
          ].map((item, idx) => (
            <div key={idx} className="glass-card p-6 rounded-3xl group hover:border-white/20 transition-all text-left">
              <div className="w-1.5 h-1.5 rounded-full mb-4 animate-pulse" style={{ backgroundColor: item.glow, boxShadow: `0 0 10px ${item.glow}` }}></div>
              <div className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-1">{item.label}</div>
              <div className="text-lg font-bold text-bright tracking-tight">{item.value}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
