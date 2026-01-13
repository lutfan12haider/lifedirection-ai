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

export interface MomentumInfo {
    strength: 'weak' | 'stable' | 'growing' | 'accelerating';
    label: string;
    description: string;
}

export interface MicroAction {
    task: string;
    duration: string;
    impactArea: keyof LifeScores;
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
    momentum: MomentumInfo;
    explanation: string;
    weakestArea: {
        name: string;
        explanation: string;
    };
    microActions: MicroAction[];
    emotionallyIntelligentSummary: string;
    risks: string[];
    positives: string[];
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

export function analyzeHabits(data: HabitData): LifeScores {
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

function getMomentum(score: number): MomentumInfo {
    if (score < 4) return { strength: 'weak', label: 'Needs Focus', description: 'Things could be clearer, but small changes can help a lot.' };
    if (score < 6) return { strength: 'stable', label: 'Steady', description: 'You are doing okay and keeping your path steady.' };
    if (score < 8) return { strength: 'growing', label: 'Growing', description: 'Your good habits are starting to make a real difference.' };
    return { strength: 'accelerating', label: 'Great!', description: 'Your habits are building strong momentum for a great future.' };
}

function getMicroActions(weakestArea: string): MicroAction[] {
    const actions: Record<string, MicroAction[]> = {
        focus: [
            { task: 'Set a 1-hour focus timer', duration: '60 mins', impactArea: 'focus' },
            { task: 'Phone-free meal', duration: '20 mins', impactArea: 'focus' },
            { task: 'Write down top 3 priorities', duration: '5 mins', impactArea: 'focus' }
        ],
        energy: [
            { task: 'Quick sunlight walk', duration: '10 mins', impactArea: 'energy' },
            { task: 'Rest with a power nap', duration: '15 mins', impactArea: 'energy' },
            { task: 'Full glass of water now', duration: '1 min', impactArea: 'energy' }
        ],
        health: [
            { task: 'Gentle stretching', duration: '10 mins', impactArea: 'health' },
            { task: 'Stand up and move every hour', duration: '5 mins', impactArea: 'health' },
            { task: 'Eat a healthy snack', duration: '5 mins', impactArea: 'health' }
        ],
        learning: [
            { task: 'Read 2 pages of a book', duration: '5 mins', impactArea: 'learning' },
            { task: 'Watch one helpful video', duration: '10 mins', impactArea: 'learning' },
            { task: 'Think about one new thing learned', duration: '3 mins', impactArea: 'learning' }
        ],
        emotional: [
            { task: 'Slow breathing (4 times)', duration: '2 mins', impactArea: 'emotional' },
            { task: 'Text a friend or family', duration: '2 mins', impactArea: 'emotional' },
            { task: 'Write one thing you are thankful for', duration: '1 min', impactArea: 'emotional' }
        ],
        growth: [
            { task: 'Check your progress', duration: '5 mins', impactArea: 'growth' },
            { task: 'Think about your future goals', duration: '5 mins', impactArea: 'growth' },
            { task: 'Try one small new thing today', duration: '10 mins', impactArea: 'growth' }
        ]
    };
    return actions[weakestArea] || actions['focus'];
}

function getSummary(data: HabitData, scores: LifeScores): string {
    const { age } = data;
    const name = age < 13 ? 'Explorer' : age < 20 ? 'Rising Star' : age < 60 ? 'Steward of Life' : 'Guide';

    if (scores.overall > 7.5) {
        return `As a ${name}, your current habits are creating a bright, clear path. You are building a great life for the future.`;
    }
    if (scores.overall > 5) {
        return `As a ${name}, you are staying on a steady path. A few small changes could give you more energy and focus.`;
    }
    return `As a ${name}, life might feel a bit hard right now. Remember, you can change your path—one small change today can help a lot.`;
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

    // Find weakest area
    const areas: (keyof LifeScores)[] = ['focus', 'energy', 'health', 'learning', 'emotional', 'growth'];
    let weakestArea = areas[0];
    let minScore = currentScores[weakestArea];

    areas.forEach(area => {
        if (currentScores[area] < minScore) {
            minScore = currentScores[area];
            weakestArea = area;
        }
    });

    const explanations: Record<string, string> = {
        focus: "It's hard to get things done when you can't focus. Focusing better will make your life easier.",
        energy: "You are low on energy. Getting more rest will help you stay on track.",
        health: "Moving your body is very important. It helps you stay healthy and feel better.",
        learning: "Learning new things keeps your mind sharp. Life is more exciting when you keep growing.",
        emotional: "Being calm is a great skill. It helps you handle hard times much easier.",
        growth: "Small improvements add up over time. Consistency is the key to a better life."
    };

    const risks: string[] = [];
    const positives: string[] = [];

    if (data.phoneHours > 4) risks.push('High screen time may reduce focus and sleep quality over time');
    if (data.sleepHours < 7) risks.push('Low sleep can decrease energy, memory, and emotional stability');
    if (data.activityMinutes < 20) risks.push('Limited physical activity may impact mood and long-term health');
    if (data.stressLevel > 7) risks.push('High stress can affect focus, sleep, and overall well-being');

    if (data.sleepHours >= 7.5) positives.push('Good sleep duration supports brain health and energy');
    if (data.activityMinutes >= 30) positives.push('Regular movement boosts mood, energy, and health');
    if (data.productiveHours >= 4) positives.push('Consistent focus time builds skills and progress');

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
        momentum: getMomentum(currentScores.overall),
        explanation: "Your trajectory is a reflection of today's choices, not a fixed point in the future.",
        weakestArea: {
            name: weakestArea.charAt(0).toUpperCase() + weakestArea.slice(1),
            explanation: explanations[weakestArea]
        },
        microActions: getMicroActions(weakestArea),
        emotionallyIntelligentSummary: getSummary(data, currentScores),
        risks,
        positives
    };
}

