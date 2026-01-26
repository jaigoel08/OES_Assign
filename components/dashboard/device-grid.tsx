'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Wifi, AlertTriangle } from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'error';
  location: string;
  lastUpdate: string;
  metrics: {
    temperature: number;
    humidity: number;
    pressure: number;
  };
  readings: Array<{
    timestamp: string;
    value: number;
  }>;
}

interface DeviceGridProps {
  devices: Device[];
  loading: boolean;
  selectedDevice: string | null;
  onSelectDevice: (id: string | null) => void;
}

export default function DeviceGrid({
  devices,
  loading,
  selectedDevice,
  onSelectDevice,
}: DeviceGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-6 bg-muted rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <Card className="border-border">
        <CardContent className="pt-16 pb-16">
          <div className="text-center">
            <Wifi className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No devices connected yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {devices.map((device) => (
        <Card
          key={device.id}
          className={`border-border cursor-pointer transition-all ${
            selectedDevice === device.id
              ? 'ring-2 ring-primary'
              : 'hover:border-primary/50'
          }`}
          onClick={() => onSelectDevice(device.id)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{device.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{device.location}</p>
              </div>
              <Badge
                variant={
                  device.status === 'active'
                    ? 'default'
                    : device.status === 'error'
                      ? 'destructive'
                      : 'secondary'
                }
              >
                {device.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Device Type */}
            <div className="text-sm">
              <span className="text-muted-foreground">Type: </span>
              <span className="font-medium">{device.type}</span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-muted p-2 rounded text-center">
                <p className="text-xs text-muted-foreground">Temp</p>
                <p className="font-bold text-foreground">{device.metrics.temperature}°C</p>
              </div>
              <div className="bg-muted p-2 rounded text-center">
                <p className="text-xs text-muted-foreground">Humidity</p>
                <p className="font-bold text-foreground">{device.metrics.humidity}%</p>
              </div>
              <div className="bg-muted p-2 rounded text-center">
                <p className="text-xs text-muted-foreground">Pressure</p>
                <p className="font-bold text-foreground">{device.metrics.pressure}mb</p>
              </div>
            </div>

            {/* Mini Chart */}
            {device.readings.length > 0 && (
              <div className="h-16 -mx-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={device.readings.slice(-6)}
                    margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <Bar dataKey="value" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Last Update */}
            <div className="text-xs text-muted-foreground border-t border-border pt-2">
              Last update: {new Date(device.lastUpdate).toLocaleTimeString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
