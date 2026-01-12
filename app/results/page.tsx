'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AnalysisResult, LifeScores } from '@/lib/analysis';

const ScoreBar = ({ label, score, color }: { label: string; score: number; color: string }) => (
    <div className="mb-4">
        <div className="flex justify-between mb-1">
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                {label}
            </span>
            <span className="text-sm font-semibold" style={{ color }}>
                {score.toFixed(1)}/10
            </span>
        </div>
        <div className="h-3 rounded-full overflow-hidden"
            style={{ background: 'var(--color-bg-secondary)' }}>
            <div
                className="h-full transition-all duration-1000 ease-out"
                style={{
                    width: `${score * 10}%`,
                    background: color
                }}
            />
        </div>
    </div>
);

const PathCard = ({
    name,
    description,
    scores,
    color,
    delay
}: {
    name: string;
    description: string;
    scores: LifeScores;
    color: string;
    delay: number;
}) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setVisible(true), delay);
    }, [delay]);

    return (
        <div
            className={`p-6 rounded-2xl transition-all duration-700 transform ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{
                background: 'var(--color-bg-card)',
                boxShadow: 'var(--shadow-md)',
                border: `2px solid ${color}20`
            }}>
            <div className="flex items-center gap-3 mb-4">
                <div
                    className="w-4 h-4 rounded-full"
                    style={{ background: color }}
                />
                <div>
                    <h3 className="font-bold text-lg" style={{ color: 'var(--color-text-primary)' }}>
                        {name}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        {description}
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                <ScoreBar label="Focus" score={scores.focus} color={color} />
                <ScoreBar label="Energy" score={scores.energy} color={color} />
                <ScoreBar label="Health" score={scores.health} color={color} />
                <ScoreBar label="Learning" score={scores.learning} color={color} />
                <ScoreBar label="Emotional" score={scores.emotional} color={color} />
                <ScoreBar label="Growth" score={scores.growth} color={color} />
            </div>

            <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--color-bg-secondary)' }}>
                <div className="flex justify-between items-center">
                    <span className="font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
                        Overall Direction
                    </span>
                    <span className="text-2xl font-bold" style={{ color }}>
                        {scores.overall.toFixed(1)}/10
                    </span>
                </div>
            </div>
        </div>
    );
};

export default function Results() {
    const router = useRouter();
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const dataStr = sessionStorage.getItem('lifeDirectionData');
        if (!dataStr) {
            router.push('/');
            return;
        }

        // Simulate API call delay for better UX
        setTimeout(async () => {
            try {
                const response = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: dataStr
                });

                if (!response.ok) throw new Error('Analysis failed');

                const analysisResult = await response.json();
                setResult(analysisResult);
            } catch (error) {
                console.error('Error:', error);
                router.push('/');
            } finally {
                setLoading(false);
            }
        }, 1000);
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center"
                style={{ background: 'var(--gradient-soft)' }}>
                <div className="text-center">
                    <div className="text-6xl mb-4 animate-bounce">🔮</div>
                    <h2 className="text-2xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                        Analyzing Your Life Direction...
                    </h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        This will just take a moment
                    </p>
                </div>
            </div>
        );
    }

    if (!result) return null;

    return (
        <div className="min-h-screen px-4 py-8"
            style={{ background: 'var(--gradient-soft)' }}>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full"
                        style={{
                            background: 'var(--color-bg-card)',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                        <span className="text-xl">🧭</span>
                        <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                            Your Life Direction
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold mb-4"
                        style={{ color: 'var(--color-text-primary)' }}>
                        Three Possible Paths
                    </h1>

                    <p className="text-lg max-w-2xl mx-auto"
                        style={{ color: 'var(--color-text-secondary)' }}>
                        Based on your current habits, here&apos;s where your life is heading and how small changes can shift your direction.
                    </p>
                </div>

                {/* Path Comparisons */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <PathCard {...result.currentPath} delay={200} />
                    <PathCard {...result.improvementPath} delay={400} />
                    <PathCard {...result.optimalPath} delay={600} />
                </div>

                {/* Insights Section */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Positives */}
                    {result.positives.length > 0 && (
                        <div className="p-6 rounded-2xl"
                            style={{
                                background: 'var(--color-bg-card)',
                                boxShadow: 'var(--shadow-md)'
                            }}>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-2xl">✨</span>
                                <h3 className="font-bold text-xl" style={{ color: 'var(--color-text-primary)' }}>
                                    What&apos;s Working
                                </h3>
                            </div>
                            <ul className="space-y-2">
                                {result.positives.map((positive, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <span className="text-green-500 mt-1">•</span>
                                        <span style={{ color: 'var(--color-text-secondary)' }}>{positive}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Risks */}
                    {result.risks.length > 0 && (
                        <div className="p-6 rounded-2xl"
                            style={{
                                background: 'var(--color-bg-card)',
                                boxShadow: 'var(--shadow-md)'
                            }}>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-2xl">💭</span>
                                <h3 className="font-bold text-xl" style={{ color: 'var(--color-text-primary)' }}>
                                    Things to Consider
                                </h3>
                            </div>
                            <ul className="space-y-2">
                                {result.risks.map((risk, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <span className="text-orange-500 mt-1">•</span>
                                        <span style={{ color: 'var(--color-text-secondary)' }}>{risk}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Suggestions */}
                <div className="p-8 rounded-3xl mb-8"
                    style={{
                        background: 'var(--gradient-primary)',
                        boxShadow: 'var(--shadow-lg)'
                    }}>
                    <h3 className="font-bold text-2xl mb-2 text-white">
                        💡 Small Steps, Better Direction
                    </h3>
                    <p className="mb-6 text-white opacity-90">
                        Here are simple, achievable actions to shift toward a better path:
                    </p>
                    <div className="grid md:grid-cols-2 gap-3">
                        {result.suggestions.map((suggestion, idx) => (
                            <div key={idx}
                                className="p-4 rounded-xl text-white"
                                style={{ background: 'rgba(255, 255, 255, 0.15)' }}>
                                <div className="flex items-start gap-2">
                                    <span className="font-bold">{idx + 1}.</span>
                                    <span>{suggestion}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="p-6 rounded-2xl text-center mb-8"
                    style={{
                        background: 'var(--color-bg-card)',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        ℹ️ This is a <strong>direction simulation</strong>, not a prediction or medical advice.
                        Your future is shaped by the choices you make. Small improvements can create meaningful change over time.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => router.push('/questionnaire')}
                        className="px-6 py-3 rounded-full font-semibold transition-all"
                        style={{
                            background: 'var(--color-bg-card)',
                            color: 'var(--color-text-primary)',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                        Try Again
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 rounded-full font-semibold text-white transition-all transform hover:scale-105"
                        style={{
                            background: 'var(--gradient-primary)',
                            boxShadow: 'var(--shadow-md)'
                        }}>
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}
