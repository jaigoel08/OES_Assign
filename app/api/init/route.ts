import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db';

export async function POST() {
  try {
    await initializeDatabase();
    return NextResponse.json({
      success: true,
      message: 'Database initialized with sample devices',
    });
  } catch (error) {
    console.error('[v0] Failed to initialize database:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database' },
      { status: 500 }
    );
  }
}
