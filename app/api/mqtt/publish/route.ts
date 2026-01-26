import { NextResponse } from 'next/server';
import { mqttService } from '@/lib/mqtt-service';

interface MqttPublishRequest {
  deviceId: string;
  topic?: string;
  temperature?: number;
  humidity?: number;
  pressure?: number;
  status?: 'active' | 'inactive' | 'error';
}

/**
 * Simulate MQTT message publishing
 * In production, this would accept real MQTT messages from a broker
 */
export async function POST(request: Request) {
  try {
    const data: MqttPublishRequest = await request.json();

    if (!data.deviceId) {
      return NextResponse.json(
        { error: 'Missing deviceId' },
        { status: 400 }
      );
    }

    // Construct MQTT topic
    const topic = data.topic || `devices/${data.deviceId}/telemetry`;

    // Create payload
    const payload = {
      timestamp: new Date().toISOString(),
      temperature: data.temperature ?? 20 + Math.random() * 10,
      humidity: data.humidity ?? 40 + Math.random() * 30,
      pressure: data.pressure ?? 1010 + Math.random() * 10,
      status: data.status,
    };

    // Process message
    await mqttService.processMessage(topic, Buffer.from(JSON.stringify(payload)));

    return NextResponse.json({
      success: true,
      message: 'MQTT message processed',
      topic,
      payload,
    });
  } catch (error) {
    console.error('[v0] Failed to publish MQTT message:', error);
    return NextResponse.json(
      { error: 'Failed to publish MQTT message' },
      { status: 500 }
    );
  }
}

/**
 * Simulate continuous MQTT data from a device
 */
export async function PUT(request: Request) {
  try {
    const { deviceId, interval = 5000, count = 10 } = await request.json();

    if (!deviceId) {
      return NextResponse.json(
        { error: 'Missing deviceId' },
        { status: 400 }
      );
    }

    // Return a streaming response for continuous updates
    const simulateData = async () => {
      for (let i = 0; i < count; i++) {
        const payload = mqttService.generateSamplePayload(deviceId);
        await mqttService.processMessage(
          `devices/${deviceId}/telemetry`,
          Buffer.from(JSON.stringify(payload))
        );
        
        if (i < count - 1) {
          await new Promise((resolve) => setTimeout(resolve, interval));
        }
      }
    };

    // Start simulation in background
    simulateData().catch((err) => {
      console.error('[v0] Simulation error:', err);
    });

    return NextResponse.json({
      success: true,
      message: `Simulation started for device ${deviceId}`,
      count,
      interval,
    });
  } catch (error) {
    console.error('[v0] Failed to start simulation:', error);
    return NextResponse.json(
      { error: 'Failed to start simulation' },
      { status: 500 }
    );
  }
}
