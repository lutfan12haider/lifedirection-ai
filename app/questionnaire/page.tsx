'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
    age: number;
    phoneHours: number;
    sleepHours: number;
    productiveHours: number;
    activityMinutes: number;
    stressLevel: number;
    mood: string;
}

const moodOptions = [
    { emoji: '😊', label: 'Happy', value: 'happy' },
    { emoji: '😌', label: 'Calm', value: 'calm' },
    { emoji: '😐', label: 'Neutral', value: 'neutral' },
    { emoji: '😟', label: 'Worried', value: 'worried' },
    { emoji: '😢', label: 'Sad', value: 'sad' }
];

export default function Questionnaire() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState<FormData>({
        age: 25,
        phoneHours: 3,
        sleepHours: 7,
        productiveHours: 4,
        activityMinutes: 30,
        stressLevel: 5,
        mood: 'neutral'
    });

    const getAgeGroup = () => {
        if (formData.age < 13) return 'child';
        if (formData.age < 18) return 'teen';
        if (formData.age < 30) return 'young_adult';
        if (formData.age < 50) return 'adult';
        return 'senior';
    };

    const getProductiveLabel = () => {
        const group = getAgeGroup();
        if (group === 'child' || group === 'teen') return 'study or learning';
        return 'work or focused tasks';
    };

    const questions = [
        {
            id: 'age',
            question: 'How old are you?',
            min: 8,
            max: 70,
            step: 1,
            unit: 'years',
            emoji: '🎂'
        },
        {
            id: 'phoneHours',
            question: 'How many hours do you spend on your phone daily?',
            min: 0,
            max: 16,
            step: 0.5,
            unit: 'hours',
            emoji: '📱'
        },
        {
            id: 'sleepHours',
            question: 'How many hours do you sleep each night?',
            min: 3,
            max: 12,
            step: 0.5,
            unit: 'hours',
            emoji: '😴'
        },
        {
            id: 'productiveHours',
            question: `How many hours do you spend on ${getProductiveLabel()} daily?`,
            min: 0,
            max: 16,
            step: 0.5,
            unit: 'hours',
            emoji: getAgeGroup() === 'child' || getAgeGroup() === 'teen' ? '📚' : '💼'
        },
        {
            id: 'activityMinutes',
            question: 'How many minutes of physical activity do you do daily?',
            min: 0,
            max: 180,
            step: 5,
            unit: 'minutes',
            emoji: '🏃'
        },
        {
            id: 'stressLevel',
            question: 'How stressed do you feel lately?',
            min: 1,
            max: 10,
            step: 1,
            unit: '',
            emoji: '💭',
            labels: { 1: 'Very Calm', 10: 'Very Stressed' }
        }
    ];

    const currentQuestion = questions[step];

    const handleSliderChange = (value: number) => {
        setFormData({ ...formData, [currentQuestion.id]: value });
    };

    const handleNext = () => {
        if (step < questions.length) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    const handleSubmit = async () => {
        // Store data in sessionStorage and navigate to results
        sessionStorage.setItem('lifeDirectionData', JSON.stringify(formData));
        router.push('/results');
    };

    const progress = ((step + 1) / (questions.length + 1)) * 100;

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8"
            style={{ background: 'var(--gradient-soft)' }}>
            <div className="max-w-2xl w-full">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="h-2 rounded-full overflow-hidden"
                        style={{ background: 'var(--color-bg-secondary)' }}>
                        <div
                            className="h-full transition-all duration-500"
                            style={{
                                width: `${progress}%`,
                                background: 'var(--gradient-primary)'
                            }}
                        />
                    </div>
                    <p className="text-sm mt-2 text-center" style={{ color: 'var(--color-text-muted)' }}>
                        Question {step + 1} of {questions.length + 1}
                    </p>
                </div>

                {/* Question Card */}
                <div className="p-8 rounded-3xl"
                    style={{
                        background: 'var(--color-bg-card)',
                        boxShadow: 'var(--shadow-lg)'
                    }}>
                    {step < questions.length ? (
                        <>
                            <div className="text-6xl text-center mb-6">
                                {currentQuestion.emoji}
                            </div>

                            <h2 className="text-2xl font-semibold mb-8 text-center"
                                style={{ color: 'var(--color-text-primary)' }}>
                                {currentQuestion.question}
                            </h2>

                            <div className="mb-8">
                                <div className="text-center mb-4">
                                    <span className="text-5xl font-bold"
                                        style={{
                                            background: 'var(--gradient-primary)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text'
                                        }}>
                                        {formData[currentQuestion.id as keyof FormData]}
                                    </span>
                                    <span className="text-xl ml-2" style={{ color: 'var(--color-text-secondary)' }}>
                                        {currentQuestion.unit}
                                    </span>
                                </div>

                                <input
                                    type="range"
                                    min={currentQuestion.min}
                                    max={currentQuestion.max}
                                    step={currentQuestion.step}
                                    value={formData[currentQuestion.id as keyof FormData] as number}
                                    onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
                                    className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                                    style={{
                                        background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${((formData[currentQuestion.id as keyof FormData] as number - currentQuestion.min) / (currentQuestion.max - currentQuestion.min)) * 100}%, var(--color-bg-secondary) ${((formData[currentQuestion.id as keyof FormData] as number - currentQuestion.min) / (currentQuestion.max - currentQuestion.min)) * 100}%, var(--color-bg-secondary) 100%)`
                                    }}
                                />

                                {currentQuestion.labels && (
                                    <div className="flex justify-between mt-2 text-sm"
                                        style={{ color: 'var(--color-text-muted)' }}>
                                        <span>{currentQuestion.labels[currentQuestion.min as keyof typeof currentQuestion.labels]}</span>
                                        <span>{currentQuestion.labels[currentQuestion.max as keyof typeof currentQuestion.labels]}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4">
                                {step > 0 && (
                                    <button
                                        onClick={handleBack}
                                        className="flex-1 px-6 py-3 rounded-full font-semibold transition-all"
                                        style={{
                                            background: 'var(--color-bg-secondary)',
                                            color: 'var(--color-text-primary)'
                                        }}>
                                        Back
                                    </button>
                                )}
                                <button
                                    onClick={handleNext}
                                    className="flex-1 px-6 py-3 rounded-full font-semibold text-white transition-all transform hover:scale-105"
                                    style={{
                                        background: 'var(--gradient-primary)',
                                        boxShadow: 'var(--shadow-md)'
                                    }}>
                                    Continue
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Mood Selection */}
                            <div className="text-6xl text-center mb-6">💚</div>

                            <h2 className="text-2xl font-semibold mb-8 text-center"
                                style={{ color: 'var(--color-text-primary)' }}>
                                How do you feel most of the time?
                            </h2>

                            <div className="grid grid-cols-5 gap-3 mb-8">
                                {moodOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setFormData({ ...formData, mood: option.value })}
                                        className="flex flex-col items-center p-4 rounded-2xl transition-all transform hover:scale-105"
                                        style={{
                                            background: formData.mood === option.value
                                                ? 'var(--gradient-primary)'
                                                : 'var(--color-bg-secondary)',
                                            color: formData.mood === option.value
                                                ? 'white'
                                                : 'var(--color-text-primary)'
                                        }}>
                                        <span className="text-3xl mb-1">{option.emoji}</span>
                                        <span className="text-xs font-medium">{option.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={handleBack}
                                    className="flex-1 px-6 py-3 rounded-full font-semibold transition-all"
                                    style={{
                                        background: 'var(--color-bg-secondary)',
                                        color: 'var(--color-text-primary)'
                                    }}>
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 px-6 py-3 rounded-full font-semibold text-white transition-all transform hover:scale-105"
                                    style={{
                                        background: 'var(--gradient-success)',
                                        boxShadow: 'var(--shadow-md)'
                                    }}>
                                    See My Direction
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
