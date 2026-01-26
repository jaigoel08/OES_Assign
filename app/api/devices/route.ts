import { NextResponse } from 'next/server';
import { getDevices, getMetrics } from '@/lib/db';

export async function GET() {
  try {
    const devices = await getDevices();
    const metrics = await getMetrics();

    return NextResponse.json({
      devices,
      metrics,
    });
  } catch (error) {
    console.error('[v0] Failed to fetch devices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch devices' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.type || !data.location) {
      return NextResponse.json(
        { error: 'Missing required fields: name, type, location' },
        { status: 400 }
      );
    }

    // Here you would save to database
    // For now, we'll return a success response
    return NextResponse.json({
      success: true,
      device: {
        id: `device-${Date.now()}`,
        ...data,
        status: 'active',
        metrics: { temperature: 0, humidity: 0, pressure: 0 },
        lastUpdate: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[v0] Failed to create device:', error);
    return NextResponse.json(
      { error: 'Failed to create device' },
      { status: 500 }
    );
  }
}
