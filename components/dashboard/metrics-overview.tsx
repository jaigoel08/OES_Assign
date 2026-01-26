'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, AlertTriangle, Zap, TrendingUp } from 'lucide-react';

interface MetricsOverviewProps {
  metrics: {
    totalDevices: number;
    activeDevices: number;
    totalReadings: number;
    avgTemperature: number;
  };
  loading: boolean;
}

export default function MetricsOverview({ metrics, loading }: MetricsOverviewProps) {
  const metricCards = [
    {
      label: 'Total Devices',
      value: metrics.totalDevices,
      icon: Activity,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    },
    {
      label: 'Active Devices',
      value: metrics.activeDevices,
      icon: Zap,
      color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
    },
    {
      label: 'Total Readings',
      value: metrics.totalReadings,
      icon: TrendingUp,
      color: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
    },
    {
      label: 'Avg Temperature',
      value: `${metrics.avgTemperature}°C`,
      icon: AlertTriangle,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricCards.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index} className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </CardTitle>
                <div className={`p-2 rounded-lg ${metric.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {loading ? '...' : metric.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
