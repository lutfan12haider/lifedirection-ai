'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const MoodEmoji = ({ mood, selected, onSelect }: { mood: string; selected: boolean; onSelect: (m: string) => void }) => {
    const emojis: Record<string, string> = {
        'Happy': '🚀',
        'Balanced': '⚖️',
        'Stressed': '🌪️',
        'Tired': '🔋',
        'Anxious': '🪐'
    };

    return (
        <button
            onClick={() => onSelect(mood)}
            className={`flex flex-col items-center gap-2 p-5 rounded-[2rem] transition-all duration-500 border-2 ${selected
                    ? 'glass-card border-cyan-400/50 scale-105 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                    : 'bg-white/5 border-transparent hover:bg-white/10'
                }`}
        >
            <span className={`text-4xl transition-transform duration-500 ${selected ? 'scale-110 drop-shadow-[0_0_10px_var(--color-cyan-glow)]' : ''}`}>
                {emojis[mood]}
            </span>
            <span className={`text-xs font-bold tracking-widest uppercase ${selected ? 'text-cyan-400' : 'text-muted'}`}>
                {mood}
            </span>
        </button>
    );
};

export default function Questionnaire() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({
        age: 25,
        phoneHours: 4,
        sleepHours: 7,
        productiveHours: 4,
        activityMinutes: 30,
        stressLevel: 5,
        mood: 'Balanced'
    });

    const steps = [
        {
            title: 'Your Age',
            label: 'Tell us your age to see your future path.',
            field: 'age',
            min: 8,
            max: 75,
            unit: ' Years',
            desc: 'Your age helps us understand your energy and health needs.'
        },
        {
            title: 'Phone Use',
            label: 'How much time do you spend on your phone?',
            field: 'phoneHours',
            min: 0,
            max: 12,
            unit: ' Hours',
            desc: 'Using your phone too much can make it hard to focus.'
        },
        {
            title: 'Sleep',
            label: 'How many hours do you sleep each night?',
            field: 'sleepHours',
            min: 3,
            max: 10,
            unit: ' Hours',
            desc: 'Sleep is very important for your brain and body to rest.'
        },
        {
            title: 'Focus & Work',
            label: 'How many hours of focused work do you do daily?',
            field: 'productiveHours',
            min: 0,
            max: 10,
            unit: ' Hours',
            desc: 'Focused time helps you get important things done.'
        },
        {
            title: 'Activity',
            label: 'How many minutes do you move or exercise?',
            field: 'activityMinutes',
            min: 0,
            max: 120,
            unit: ' Min',
            desc: 'Moving your body helps you feel better and stay healthy.'
        },
        {
            title: 'Stress',
            label: 'How stressed do you feel right now?',
            field: 'stressLevel',
            min: 1,
            max: 10,
            unit: ' / 10',
            desc: 'High stress can make it harder to reach your goals.'
        },
        {
            title: 'Mood',
            label: 'How are you feeling right now?',
            field: 'mood'
        }
    ];

    const currentStep = steps[step];

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            handleComplete();
        }
    };

    const handleBack = () => {
        if (step > 0) setStep(step - 1);
    };

    const handleComplete = () => {
        setIsLoading(true);
        sessionStorage.setItem('lifeDirectionData', JSON.stringify(data));
        // Simulate "neural scanning"
        setTimeout(() => {
            router.push('/results');
        }, 2000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#050505] overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[20%] w-[1px] h-[60%] bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent"></div>
                <div className="absolute top-[30%] right-[30%] w-[1px] h-[40%] bg-gradient-to-b from-transparent via-purple-500/20 to-transparent"></div>
            </div>

            <div className="w-full max-w-xl relative z-10">
                {/* Progress Particle Bar */}
                <div className="mb-12 flex items-center gap-4">
                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                        ></div>
                    </div>
                    <span className="text-[10px] font-black tracking-widest text-cyan-400 uppercase">
                        Step {step + 1} / {steps.length}
                    </span>
                </div>

                <div className="glass-card rounded-[2.5rem] p-8 md:p-12 animate-in fade-in zoom-in-95 duration-500">
                    <div className="mb-10 text-center">
                        <h2 className="text-sm font-black tracking-[0.4em] text-muted uppercase mb-4 animate-pulse">
                            {currentStep.title}
                        </h2>
                        <h1 className="text-3xl font-bold text-bright mb-4 tracking-tight leading-tight">
                            {currentStep.label}
                        </h1>
                        <p className="text-sm text-muted/80 font-medium">
                            {currentStep.desc}
                        </p>
                    </div>

                    <div className="mb-12">
                        {currentStep.field === 'mood' ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {['Happy', 'Balanced', 'Stressed', 'Tired', 'Anxious'].map((m) => (
                                    <MoodEmoji
                                        key={m}
                                        mood={m}
                                        selected={data.mood === m}
                                        onSelect={(val) => setData({ ...data, mood: val })}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="px-4">
                                <div className="flex justify-between items-end mb-6">
                                    <span className="text-xs font-bold text-muted uppercase tracking-widest">Your Answer</span>
                                    <span className="text-5xl font-black text-cyan-400 tracking-tighter tabular-nums drop-shadow-[0_0_10px_var(--color-cyan-glow)]">
                                        {(data as any)[currentStep.field]}
                                        <span className="text-sm font-bold uppercase tracking-widest text-muted ml-2">{currentStep.unit}</span>
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min={currentStep.min}
                                    max={currentStep.max}
                                    value={(data as any)[currentStep.field]}
                                    onChange={(e) => setData({ ...data, [currentStep.field]: parseInt(e.target.value) })}
                                    className="w-full"
                                />
                                <div className="flex justify-between mt-4 text-[10px] font-bold text-muted/40 uppercase tracking-widest">
                                    <span>{currentStep.min}{currentStep.unit}</span>
                                    <span>{currentStep.max}{currentStep.unit}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4">
                        {step > 0 && (
                            <button
                                onClick={handleBack}
                                className="flex-1 py-5 rounded-2xl bg-white/5 text-bright font-bold border border-white/10 hover:bg-white/10 transition-all uppercase tracking-widest text-xs"
                            >
                                Go Back
                            </button>
                        ) || (
                                <div className="flex-1" />
                            )}
                        <button
                            onClick={handleNext}
                            disabled={isLoading}
                            className="flex-[2] py-5 rounded-2xl bg-cyan-500 text-black font-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] uppercase tracking-widest text-xs disabled:opacity-50"
                        >
                            {isLoading ? 'Calculating...' : step === steps.length - 1 ? 'See My Results' : 'Next Step'}
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center text-[10px] font-bold text-muted/30 uppercase tracking-[0.2em]">
                    LifeDirection v4.0 • Analyzing your path
                </div>
            </div>

            {/* Scanning Overlay */}
            {isLoading && (
                <div className="fixed inset-0 z-50 bg-[#050505]/80 backdrop-blur-xl flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
                    <div className="w-64 h-1 bg-white/10 rounded-full mb-8 relative overflow-hidden">
                        <div className="absolute inset-0 bg-cyan-500 animate-[loading_2s_ease-in-out_infinite]"></div>
                    </div>
                    <h2 className="text-lg font-black tracking-[0.3em] text-cyan-400 uppercase animate-pulse">
                        Finding Your Path
                    </h2>
                    <p className="mt-4 text-[10px] font-bold text-muted uppercase tracking-widest">
                        Comparing your habits against many possible futures
                    </p>
                </div>
            )}

            <style jsx>{`
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}
