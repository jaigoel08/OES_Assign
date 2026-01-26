'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCw } from 'lucide-react';

interface Device {
  id: string;
  name: string;
}

interface SimulationState {
  deviceId: string | null;
  isRunning: boolean;
  messageCount: number;
  interval: number;
}

export default function DeviceSimulator({ devices }: { devices: Device[] }) {
  const [simulations, setSimulations] = useState<Map<string, SimulationState>>(new Map());
  const [isLoading, setIsLoading] = useState(false);

  const startSimulation = async (deviceId: string) => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/mqtt/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId,
          temperature: 20 + Math.random() * 10,
          humidity: 40 + Math.random() * 30,
          pressure: 1010 + Math.random() * 10,
        }),
      });

      if (response.ok) {
        // Update simulation state
        setSimulations((prev) => {
          const newMap = new Map(prev);
          const existing = newMap.get(deviceId) || {
            deviceId,
            isRunning: false,
            messageCount: 0,
            interval: 5000,
          };
          newMap.set(deviceId, {
            ...existing,
            isRunning: true,
            messageCount: existing.messageCount + 1,
          });
          return newMap;
        });

        // Continue simulation at intervals
        const intervalId = setInterval(async () => {
          await fetch('/api/mqtt/publish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              deviceId,
              temperature: 20 + Math.random() * 10,
              humidity: 40 + Math.random() * 30,
              pressure: 1010 + Math.random() * 10,
            }),
          });

          setSimulations((prev) => {
            const newMap = new Map(prev);
            const existing = newMap.get(deviceId);
            if (existing) {
              newMap.set(deviceId, {
                ...existing,
                messageCount: existing.messageCount + 1,
              });
            }
            return newMap;
          });
        }, 5000);

        // Store interval ID for cleanup
        (window as any)[`sim-${deviceId}`] = intervalId;
      }
    } catch (error) {
      console.error('[v0] Simulation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stopSimulation = (deviceId: string) => {
    const intervalId = (window as any)[`sim-${deviceId}`];
    if (intervalId) {
      clearInterval(intervalId);
      delete (window as any)[`sim-${deviceId}`];
    }

    setSimulations((prev) => {
      const newMap = new Map(prev);
      const existing = newMap.get(deviceId);
      if (existing) {
        newMap.set(deviceId, { ...existing, isRunning: false });
      }
      return newMap;
    });
  };

  const resetSimulation = (deviceId: string) => {
    stopSimulation(deviceId);
    setSimulations((prev) => {
      const newMap = new Map(prev);
      const existing = newMap.get(deviceId);
      if (existing) {
        newMap.set(deviceId, { ...existing, messageCount: 0 });
      }
      return newMap;
    });
  };

  if (devices.length === 0) return null;

  return (
    <Card className="mt-6 border-border">
      <CardHeader>
        <CardTitle>IoT Device Simulator</CardTitle>
        <CardDescription>
          Simulate real-time data from IoT devices for testing the end-to-end data flow
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {devices.map((device) => {
            const sim = simulations.get(device.id);
            const isRunning = sim?.isRunning ?? false;
            const messageCount = sim?.messageCount ?? 0;

            return (
              <div
                key={device.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/30"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">{device.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Messages sent: {messageCount}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={isRunning ? 'default' : 'secondary'}>
                    {isRunning ? 'Running' : 'Stopped'}
                  </Badge>

                  {isRunning ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => stopSimulation(device.id)}
                      disabled={isLoading}
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Stop
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => startSimulation(device.id)}
                      disabled={isLoading}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => resetSimulation(device.id)}
                    disabled={isLoading}
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
