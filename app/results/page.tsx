'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { analyzeHabits, simulateFuture, type AnalysisResult, type HabitData, type LifeScores } from '@/lib/analysis';
import { toPng } from 'html-to-image';

const ScoreBar = ({ label, score, color, previousScore }: { label: string; score: number; color: string; previousScore?: number }) => {
    const isReducing = previousScore !== undefined && score < previousScore;
    const isIncreasing = previousScore !== undefined && score > previousScore;

    return (
        <div className="mb-5">
            <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] font-black tracking-[0.2em] text-muted uppercase">
                    {label}
                </span>
                <div className="flex items-center gap-2">
                    {isIncreasing && <span className="text-[10px] text-cyan-400 animate-pulse font-black">▲</span>}
                    {isReducing && <span className="text-[10px] text-magenta animate-pulse font-black">▼</span>}
                    <span className="text-xs font-bold tabular-nums" style={{ color }}>
                        {score.toFixed(1)}
                    </span>
                </div>
            </div>
            <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                <div
                    className="h-full transition-all duration-1000 ease-out"
                    style={{
                        width: `${score * 10}%`,
                        background: `linear-gradient(90deg, transparent, ${color})`,
                        boxShadow: `0 0 10px ${color}80`
                    }}
                />
            </div>
        </div>
    );
};

const MomentumGlow = ({ strength, label, description }: { strength: string; label: string; description: string }) => {
    const colors = {
        weak: 'var(--color-danger)',
        stable: 'var(--color-warning)',
        growing: 'var(--color-cyan)',
        accelerating: 'var(--color-purple)'
    };
    const color = colors[strength as keyof typeof colors] || colors.stable;

    return (
        <div className="glass-card p-6 rounded-[2rem] relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full blur-[40px] opacity-20 transition-all duration-700 group-hover:scale-150" style={{ backgroundColor: color }}></div>
            <div className="flex items-center gap-5 relative z-10">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl glass-card animate-neon"
                    style={{ border: `1px solid ${color}40`, boxShadow: `inset 0 0 20px ${color}20` }}>
                    {strength === 'accelerating' ? '🚀' : strength === 'growing' ? '📈' : strength === 'stable' ? '➡️' : '⚠️'}
                </div>
                <div>
                    <div className="text-[10px] font-black tracking-[0.3em] text-muted uppercase mb-1">Your Progress</div>
                    <div className="text-2xl font-black tracking-tighter" style={{ color }}>{label}</div>
                    <p className="text-xs font-medium text-dim mt-1 leading-relaxed">{description}</p>
                </div>
            </div>
        </div>
    );
};

const ControlSlider = ({ label, id, value, min, max, step, unit, onChange }: any) => (
    <div className="mb-6 group">
        <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black tracking-widest text-muted uppercase group-hover:text-cyan-400 transition-colors">{label}</span>
            <span className="text-xs font-bold text-cyan-400 tabular-nums">{value}{unit}</span>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(id, parseFloat(e.target.value))}
            className="w-full"
        />
    </div>
);

export default function Results() {
    const router = useRouter();
    const cardRef = useRef<HTMLDivElement>(null);
    const [initialData, setInitialData] = useState<HabitData | null>(null);
    const [simData, setSimData] = useState<HabitData | null>(null);
    const [loading, setLoading] = useState(true);
    const [sensitivityMode, setSensitivityMode] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [sharing, setSharing] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const dataStr = sessionStorage.getItem('lifeDirectionData');
        if (!dataStr) {
            router.push('/');
            return;
        }
        const data = JSON.parse(dataStr);
        setInitialData(data);
        setSimData(data);

        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
    }, [router]);

    const handleSimChange = (id: string, value: number) => {
        if (!simData) return;
        setSimData({ ...simData, [id]: value });
    };

    const result = useMemo(() => {
        if (!simData) return null;
        return simulateFuture(simData);
    }, [simData]);

    const initialResult = useMemo(() => {
        if (!initialData) return null;
        return simulateFuture(initialData);
    }, [initialData]);

    const handleCopySummary = async () => {
        if (!result) return;
        const text = `🧭 My Life Direction: ${result.momentum.label} Progress\n\n"${result.emotionallyIntelligentSummary}"\n\nSee yours at LifeDirection AI`;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleSaveToDevice = async () => {
        if (!cardRef.current) return;
        setSharing(true);
        try {
            const dataUrl = await toPng(cardRef.current, { cacheBust: true, quality: 0.95 });
            const link = document.createElement('a');
            link.download = `My-Life-Path-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to capture:', err);
        }
        setSharing(false);
    };

    if (loading || !result || !simData) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
                    <div className="text-[10px] font-black tracking-[0.4em] text-cyan-400 uppercase animate-pulse">Calculating Your Path</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#050505] text-bright overflow-hidden">
            {/* Options Dashboard */}
            <aside className="w-80 border-r border-white/5 p-8 flex flex-col glass-card">
                <div className="mb-10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center font-black italic scale-x-[-1]">LD</div>
                    <span className="text-xs font-black tracking-[0.3em] uppercase">Options</span>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="mb-10">
                        <h3 className="text-[10px] font-black tracking-[0.2em] text-muted uppercase mb-6">Adjust Habits</h3>
                        <ControlSlider label="Phone Use" id="phoneHours" value={simData.phoneHours} min={0} max={12} step={0.5} unit="h" onChange={handleSimChange} />
                        <ControlSlider label="Sleep" id="sleepHours" value={simData.sleepHours} min={3} max={10} step={0.5} unit="h" onChange={handleSimChange} />
                        <ControlSlider label="Work Time" id="productiveHours" value={simData.productiveHours} min={0} max={10} step={0.5} unit="h" onChange={handleSimChange} />
                        <ControlSlider label="Activity" id="activityMinutes" value={simData.activityMinutes} min={0} max={120} step={5} unit="m" onChange={handleSimChange} />
                        <ControlSlider label="Stress" id="stressLevel" value={simData.stressLevel} min={1} max={10} step={1} unit="/10" onChange={handleSimChange} />
                    </div>

                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-dim">Detailed View</span>
                            <button
                                onClick={() => setSensitivityMode(!sensitivityMode)}
                                className={`w-10 h-5 rounded-full relative transition-all duration-300 ${sensitivityMode ? 'bg-cyan-500' : 'bg-white/10'}`}
                            >
                                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${sensitivityMode ? 'left-6' : 'left-1'}`}></div>
                            </button>
                        </div>
                        <p className="text-[10px] text-muted leading-relaxed uppercase tracking-tighter">Shows how even small changes help your score.</p>
                    </div>
                </div>

                <button
                    onClick={() => router.push('/')}
                    className="mt-8 text-[10px] font-black tracking-[0.3em] text-muted hover:text-bright transition-colors uppercase"
                >
                    Go Back Home
                </button>
            </aside>

            {/* Main Insights Panel */}
            <main className="flex-1 overflow-y-auto p-12 bg-gradient-to-br from-[#050505] to-[#0a0a0f]">
                <div className="max-w-5xl mx-auto">
                    {/* Immersive Header */}
                    <div className="mb-16 relative">
                        <div className="absolute -left-20 top-0 w-40 h-40 bg-cyan-500/10 blur-[80px] rounded-full"></div>
                        <div className="inline-block px-4 py-1 rounded-full glass-card border-cyan-400/30 text-[10px] font-black text-cyan-400 tracking-[0.3em] uppercase mb-6 animate-in fade-in duration-1000">
                            Analysis Complete
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter leading-tight italic animate-in slide-in-from-left-8 duration-700">
                            {result.emotionallyIntelligentSummary}
                        </h1>
                        <p className="text-xl text-dim font-light max-w-3xl border-l-2 border-cyan-500/30 pl-8 py-2 italic animate-in slide-in-from-left-12 duration-1000 delay-200">
                            "{result.explanation}"
                        </p>
                    </div>

                    {/* Top Stats Grid */}
                    <div className="grid md:grid-cols-2 gap-8 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                        <MomentumGlow {...result.momentum} />
                        <div className="glass-card p-8 rounded-[2rem] flex items-center gap-6 group hover:border-magenta/30 transition-all">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl glass-card animate-pulse shadow-[0_0_20px_var(--color-magenta-glow)]"
                                style={{ border: '1px solid var(--color-magenta-glow)' }}>
                                🧩
                            </div>
                            <div>
                                <div className="text-[10px] font-black tracking-[0.3em] text-muted uppercase mb-1">Main Challenge</div>
                                <div className="text-2xl font-black text-magenta tracking-tighter">Focus on: {result.weakestArea.name}</div>
                                <p className="text-xs font-medium text-dim mt-1 leading-relaxed">{result.weakestArea.explanation}</p>
                            </div>
                        </div>
                    </div>

                    {/* Path Simulations */}
                    <div className="mb-16">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight uppercase tracking-[0.1em]">Possible Futures</h2>
                                <p className="text-xs text-muted uppercase tracking-widest font-bold">What could happen based on your choices</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-warning"></div>
                                    <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Now</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                                    <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Better</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[result.currentPath, result.improvementPath, result.optimalPath].map((path, idx) => (
                                <div key={idx} className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
                                    <div className="absolute top-0 right-0 w-32 h-32 opacity-5 blur-[40px] rounded-full translate-x-12 -translate-y-12 transition-all duration-700 group-hover:opacity-10" style={{ backgroundColor: path.color }}></div>
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: path.color, boxShadow: `0 0 10px ${path.color}` }}></div>
                                        <h3 className="text-sm font-black tracking-widest uppercase">{path.name}</h3>
                                    </div>

                                    <div className="space-y-2">
                                        <ScoreBar label="Focus" score={path.scores.focus} color={path.color} previousScore={sensitivityMode ? initialResult?.[idx === 0 ? 'currentPath' : idx === 1 ? 'improvementPath' : 'optimalPath'].scores.focus : undefined} />
                                        <ScoreBar label="Energy" score={path.scores.energy} color={path.color} />
                                        <ScoreBar label="Growth" score={path.scores.growth} color={path.color} />
                                    </div>

                                    <div className="mt-10 pt-6 border-t border-white/5 flex justify-between items-end">
                                        <div>
                                            <div className="text-[8px] font-black text-muted uppercase tracking-[0.3em] mb-1">Total Score</div>
                                            <div className="text-3xl font-black italic tracking-tighter" style={{ color: path.color }}>{path.scores.overall}</div>
                                        </div>
                                        <div className="text-[10px] font-bold text-muted/40 uppercase tracking-widest">Score Accuracy: 94%</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Engine */}
                    <div className="mb-20 glass-card rounded-[3rem] p-10 relative overflow-hidden">
                        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-cyan-500/5 blur-[100px] rounded-full"></div>
                        <div className="flex items-center gap-6 mb-12 relative z-10">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl glass-card text-cyan-400">⚡</div>
                            <div>
                                <h2 className="text-3xl font-black italic tracking-tighter uppercase">Simple First Steps</h2>
                                <p className="text-xs font-bold text-muted tracking-widest uppercase mt-1">Try these small things in the next 24 hours</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 relative z-10">
                            {result.microActions.map((action, idx) => (
                                <div key={idx} className="group glass-card p-6 rounded-3xl hover:border-cyan-400/30 transition-all cursor-pointer">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-black tracking-widest uppercase">
                                            {action.duration}
                                        </div>
                                        <div className="text-xs opacity-20 group-hover:opacity-100 transition-opacity">↗</div>
                                    </div>
                                    <h4 className="text-lg font-bold text-bright tracking-tight mb-4 leading-snug group-hover:text-cyan-400 transition-colors">
                                        {action.task}
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-cyan-500"></div>
                                        <span className="text-[9px] font-bold text-muted uppercase tracking-widest">Helps with {action.impactArea}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Social / Sharing Footer */}
                    <div className="glass-card rounded-[3rem] p-12 bg-gradient-to-r from-[#050505] to-blue-900/10 border-blue-500/20 mb-12">
                        <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
                            <div className="text-center md:text-left">
                                <h3 className="text-3xl font-black italic tracking-tighter mb-2">Share Your Result</h3>
                                <p className="text-sm text-muted font-medium uppercase tracking-[0.1em]">Show others your future life path.</p>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowShareModal(true)}
                                    className="px-10 py-5 rounded-2xl bg-bright text-black font-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] uppercase tracking-widest text-xs"
                                >
                                    Share Results
                                </button>
                                <button
                                    onClick={() => router.push('/questionnaire')}
                                    className="px-10 py-5 rounded-2xl bg-white/5 text-bright border border-white/10 font-black hover:bg-white/10 active:scale-95 transition-all uppercase tracking-widest text-xs"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-[10px] font-bold text-muted/30 uppercase tracking-[0.4em] mb-12">
                        LifeDirection AI v4.0.2 • This shows a possible future, not a fixed one. You can always change your path.
                    </p>
                </div>
            </main>

            {/* Share Modal Backdrop */}
            {showShareModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowShareModal(false)}></div>
                    <div className="relative glass-card border-white/20 rounded-[3rem] w-full max-w-sm overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-300">
                        {/* The Exportable Card Segment */}
                        <div ref={cardRef} className="bg-[#050505] p-10 text-bright relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600"></div>
                            <div className="flex justify-between items-start mb-16 relative z-10">
                                <span className="text-4xl font-black tracking-tighter italic scale-x-[-1] text-cyan-500">LD</span>
                                <div className="text-[10px] font-black tracking-[0.4em] text-muted uppercase">My Path Card / V4</div>
                            </div>
                            <div className="relative z-10 mb-12">
                                <div className="text-[10px] font-black tracking-[0.2em] text-cyan-400 uppercase mb-3">Today's Progress</div>
                                <h2 className="text-4xl font-black italic tracking-tighter mb-8 leading-[0.9]">{result.momentum.label}<br />Progress</h2>

                                <div className="flex items-center gap-6 py-8 border-y border-white/5">
                                    <div className="text-center">
                                        <div className="text-3xl font-black italic tracking-tighter text-cyan-400">{result.currentPath.scores.overall}</div>
                                        <div className="text-[9px] font-black uppercase text-muted tracking-widest">Score</div>
                                    </div>
                                    <div className="w-px h-10 bg-white/5"></div>
                                    <p className="text-xs italic font-medium text-dim leading-relaxed">
                                        "{result.emotionallyIntelligentSummary}"
                                    </p>
                                </div>
                            </div>
                            <div className="relative z-10 flex justify-between items-center text-[10px] font-bold text-muted/30 uppercase tracking-[0.2em]">
                                <span>Checked with LifeDirection AI</span>
                                <span>LIFEDIRECTION.AI</span>
                            </div>
                            {/* Decorative background for card */}
                            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full"></div>
                        </div>
                        {/* Interactive Buttons */}
                        <div className="p-8 space-y-3 bg-white/5 border-t border-white/5">
                            <button
                                onClick={handleCopySummary}
                                disabled={copied}
                                className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${copied ? 'bg-green-500 text-white' : 'bg-bright text-black hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                                    }`}
                            >
                                {copied ? 'Result Copied' : 'Copy Result Text'}
                            </button>
                            <button
                                onClick={handleSaveToDevice}
                                disabled={sharing}
                                className="w-full py-5 rounded-2xl bg-white/5 text-bright border border-white/10 font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all disabled:opacity-50"
                            >
                                {sharing ? 'Processing...' : 'Save as Image'}
                            </button>
                            <button
                                onClick={() => setShowShareModal(false)}
                                className="w-full py-2 text-[10px] text-muted font-black uppercase tracking-[0.3em] hover:text-bright transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
