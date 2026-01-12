export interface HabitData {
    age: number;
    phoneHours: number;
    sleepHours: number;
    productiveHours: number;
    activityMinutes: number;
    stressLevel: number;
    mood: string;
}

export interface LifeScores {
    focus: number;
    energy: number;
    health: number;
    learning: number;
    emotional: number;
    growth: number;
    overall: number;
}

export interface PathSimulation {
    name: string;
    description: string;
    scores: LifeScores;
    color: string;
}

export interface AnalysisResult {
    currentPath: PathSimulation;
    improvementPath: PathSimulation;
    optimalPath: PathSimulation;
    risks: string[];
    positives: string[];
    suggestions: string[];
}

const moodScoreMap: Record<string, number> = {
    happy: 9,
    calm: 8,
    neutral: 5,
    worried: 3,
    sad: 2
};

function calculateScore(value: number, optimal: number, weight: number = 1): number {
    const distance = Math.abs(value - optimal);
    const maxDistance = Math.max(optimal, 24 - optimal);
    const normalizedScore = Math.max(0, 10 - (distance / maxDistance) * 10);
    return normalizedScore * weight;
}

function analyzeHabits(data: HabitData): LifeScores {
    const { age, phoneHours, sleepHours, productiveHours, activityMinutes, stressLevel, mood } = data;

    // Age-specific optimal values
    const optimalSleep = age < 18 ? 9 : age < 30 ? 8 : age < 60 ? 7.5 : 8;
    const optimalActivity = age < 13 ? 60 : age < 18 ? 60 : age < 60 ? 30 : 30;

    // Calculate individual scores
    const sleepScore = calculateScore(sleepHours, optimalSleep);
    const phoneScore = Math.max(0, 10 - phoneHours * 1.2); // Less is better
    const activityScore = Math.min(10, (activityMinutes / optimalActivity) * 10);
    const stressScore = Math.max(0, 10 - stressLevel);
    const moodScore = moodScoreMap[mood] || 5;
    const productiveScore = Math.min(10, (productiveHours / 6) * 10);

    // Calculate composite scores
    const focus = Math.round((sleepScore * 0.3 + phoneScore * 0.4 + productiveScore * 0.3) * 10) / 10;
    const energy = Math.round((sleepScore * 0.3 + activityScore * 0.4 + stressScore * 0.3) * 10) / 10;
    const health = Math.round((sleepScore * 0.25 + activityScore * 0.5 + stressScore * 0.25) * 10) / 10;
    const learning = Math.round((focus * 0.5 + productiveScore * 0.3 + energy * 0.2) * 10) / 10;
    const emotional = Math.round((moodScore * 0.4 + stressScore * 0.4 + activityScore * 0.2) * 10) / 10;
    const growth = Math.round((learning * 0.3 + emotional * 0.3 + productiveScore * 0.4) * 10) / 10;
    const overall = Math.round(((focus + energy + health + learning + emotional + growth) / 6) * 10) / 10;

    return { focus, energy, health, learning, emotional, growth, overall };
}

export function simulateFuture(data: HabitData): AnalysisResult {
    const currentScores = analyzeHabits(data);

    // Simulate improvement path (moderate changes)
    const improvedData: HabitData = {
        ...data,
        phoneHours: Math.max(1, data.phoneHours - 1),
        sleepHours: Math.min(9, data.sleepHours + 0.5),
        activityMinutes: Math.min(90, data.activityMinutes + 15),
        stressLevel: Math.max(1, data.stressLevel - 2)
    };
    const improvementScores = analyzeHabits(improvedData);

    // Simulate optimal path
    const optimalSleep = data.age < 18 ? 9 : data.age < 30 ? 8 : 7.5;
    const optimalData: HabitData = {
        ...data,
        phoneHours: 2,
        sleepHours: optimalSleep,
        activityMinutes: 60,
        stressLevel: 3,
        productiveHours: Math.max(data.productiveHours, 5)
    };
    const optimalScores = analyzeHabits(optimalData);

    // Identify risks and positives
    const risks: string[] = [];
    const positives: string[] = [];
    const suggestions: string[] = [];

    if (data.phoneHours > 4) {
        risks.push('High screen time may reduce focus and sleep quality over time');
        suggestions.push('Try reducing phone use by 1 hour, especially before bedtime');
    }

    if (data.sleepHours < 7) {
        risks.push('Low sleep can decrease energy, memory, and emotional stability');
        suggestions.push('Aim to sleep 30 minutes earlier each night');
    } else if (data.sleepHours >= 7.5) {
        positives.push('Good sleep duration supports brain health and energy');
    }

    if (data.activityMinutes < 20) {
        risks.push('Limited physical activity may impact mood and long-term health');
        suggestions.push('Start with just 10-15 minutes of light movement daily');
    } else if (data.activityMinutes >= 30) {
        positives.push('Regular movement boosts mood, energy, and health');
    }

    if (data.stressLevel > 7) {
        risks.push('High stress can affect focus, sleep, and overall well-being');
        suggestions.push('Try simple breathing exercises or short breaks during the day');
    }

    if (data.productiveHours >= 4) {
        positives.push('Consistent focus time builds skills and progress');
    }

    if (suggestions.length < 3) {
        suggestions.push('Keep a simple daily routine to build positive momentum');
    }

    if (risks.length === 0) {
        positives.push('Your habits are creating a solid foundation for growth');
    }

    return {
        currentPath: {
            name: 'Current Direction',
            description: 'If nothing changes',
            scores: currentScores,
            color: 'var(--color-warning)'
        },
        improvementPath: {
            name: 'Small Steps',
            description: 'With small improvements',
            scores: improvementScores,
            color: 'var(--color-primary)'
        },
        optimalPath: {
            name: 'Best Self',
            description: 'With healthy habits',
            scores: optimalScores,
            color: 'var(--color-success)'
        },
        risks,
        positives,
        suggestions: suggestions.slice(0, 5)
    };
}
