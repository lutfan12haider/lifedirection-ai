import { NextRequest, NextResponse } from 'next/server';
import { simulateFuture, type HabitData } from '@/lib/analysis';

export async function POST(request: NextRequest) {
    try {
        const data: HabitData = await request.json();

        // Validate input
        if (!data.age || data.age < 8 || data.age > 70) {
            return NextResponse.json(
                { error: 'Invalid age' },
                { status: 400 }
            );
        }

        // Perform analysis
        const result = simulateFuture(data);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Analysis error:', error);
        return NextResponse.json(
            { error: 'Failed to analyze data' },
            { status: 500 }
        );
    }
}
