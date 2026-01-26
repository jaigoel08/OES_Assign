import { NextResponse } from 'next/server';
import { saveTelemetry, updateDeviceStatus } from '@/lib/db';

interface TelemetryPayload {
  deviceId: string;
  timestamp: string;
  metrics: {
    temperature: number;
    humidity: number;
    pressure: number;
  };
  status?: 'active' | 'inactive' | 'error';
}

export async function POST(request: Request) {
  try {
    const data: TelemetryPayload = await request.json();

    // Validate required fields
    if (!data.deviceId || !data.timestamp || !data.metrics) {
      return NextResponse.json(
        { error: 'Missing required fields: deviceId, timestamp, metrics' },
        { status: 400 }
      );
    }

    // Validate metrics
    if (
      typeof data.metrics.temperature !== 'number' ||
      typeof data.metrics.humidity !== 'number' ||
      typeof data.metrics.pressure !== 'number'
    ) {
      return NextResponse.json(
        { error: 'Invalid metrics format' },
        { status: 400 }
      );
    }

    // Save telemetry data
    await saveTelemetry({
      deviceId: data.deviceId,
      timestamp: new Date(data.timestamp),
      temperature: data.metrics.temperature,
      humidity: data.metrics.humidity,
      pressure: data.metrics.pressure,
    });

    // Update device status if provided
    if (data.status) {
      await updateDeviceStatus(data.deviceId, data.status);
    }

    return NextResponse.json({
      success: true,
      message: 'Telemetry data saved',
    });
  } catch (error) {
    console.error('[v0] Failed to save telemetry:', error);
    return NextResponse.json(
      { error: 'Failed to save telemetry' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const deviceId = url.searchParams.get('deviceId');
    const limit = parseInt(url.searchParams.get('limit') || '100');

    if (!deviceId) {
      return NextResponse.json(
        { error: 'Missing deviceId parameter' },
        { status: 400 }
      );
    }

    // Here you would fetch telemetry data from database
    // For now, return empty array
    return NextResponse.json({
      deviceId,
      data: [],
    });
  } catch (error) {
    console.error('[v0] Failed to fetch telemetry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch telemetry' },
      { status: 500 }
    );
  }
}
