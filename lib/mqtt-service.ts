// MQTT Service for IoT Dashboard
// This service handles MQTT connections and message processing

import { saveTelemetry, updateDeviceStatus } from './db';

interface MqttMessage {
  deviceId: string;
  timestamp: string;
  metrics: {
    temperature: number;
    humidity: number;
    pressure: number;
  };
  status?: 'active' | 'inactive' | 'error';
}

class MqttService {
  private messageHandlers: ((message: MqttMessage) => Promise<void>)[] = [];

  /**
   * Process incoming MQTT message
   * Expected MQTT topic format: devices/{deviceId}/telemetry
   * Expected payload format: JSON with temperature, humidity, pressure
   */
  async processMessage(topic: string, payload: Buffer): Promise<void> {
    try {
      const parsed = JSON.parse(payload.toString());

      // Extract deviceId from topic
      // Expected format: devices/{deviceId}/telemetry
      const topicParts = topic.split('/');
      if (topicParts.length < 3 || topicParts[0] !== 'devices') {
        console.error('[v0] Invalid MQTT topic format:', topic);
        return;
      }

      const deviceId = topicParts[1];
      const messageType = topicParts[2];

      if (messageType === 'telemetry') {
        await this.processTelemetry(deviceId, parsed);
      } else if (messageType === 'status') {
        await this.processStatus(deviceId, parsed);
      }

      // Call registered handlers
      for (const handler of this.messageHandlers) {
        await handler({
          deviceId,
          timestamp: new Date().toISOString(),
          metrics: parsed.metrics || { temperature: 0, humidity: 0, pressure: 0 },
          status: parsed.status,
        });
      }
    } catch (error) {
      console.error('[v0] Failed to process MQTT message:', error);
    }
  }

  private async processTelemetry(deviceId: string, data: any): Promise<void> {
    try {
      // Validate metrics
      if (!data.temperature || !data.humidity || !data.pressure) {
        console.error('[v0] Invalid telemetry data:', data);
        return;
      }

      // Save telemetry to database
      await saveTelemetry({
        deviceId,
        timestamp: new Date(data.timestamp || Date.now()),
        temperature: Number(data.temperature),
        humidity: Number(data.humidity),
        pressure: Number(data.pressure),
      });

      // Update device status to active
      await updateDeviceStatus(deviceId, 'active');

      console.log(`[v0] Telemetry saved for device ${deviceId}:`, data);
    } catch (error) {
      console.error('[v0] Failed to process telemetry:', error);
    }
  }

  private async processStatus(deviceId: string, data: any): Promise<void> {
    try {
      const status = data.status || 'active';
      await updateDeviceStatus(deviceId, status);
      console.log(`[v0] Device ${deviceId} status updated to ${status}`);
    } catch (error) {
      console.error('[v0] Failed to process status:', error);
    }
  }

  /**
   * Register a handler for MQTT messages
   */
  onMessage(handler: (message: MqttMessage) => Promise<void>): void {
    this.messageHandlers.push(handler);
  }

  /**
   * Generate sample MQTT payload for testing
   */
  generateSamplePayload(deviceId: string) {
    const now = new Date();
    return {
      deviceId,
      timestamp: now.toISOString(),
      temperature: 20 + Math.random() * 10,
      humidity: 40 + Math.random() * 30,
      pressure: 1010 + Math.random() * 10,
      status: Math.random() > 0.95 ? 'error' : 'active',
    };
  }
}

export const mqttService = new MqttService();
