'use client';

import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/dashboard/header';
import DeviceGrid from '@/components/dashboard/device-grid';
import MetricsOverview from '@/components/dashboard/metrics-overview';
import DeviceSimulator from '@/components/dashboard/device-simulator';
import { useDeviceData } from '@/hooks/use-device-data';

export default function Dashboard() {
  const { devices, metrics, loading } = useDeviceData();
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Overview Section */}
        <section className="mb-8">
          <MetricsOverview metrics={metrics} loading={loading} />
        </section>

        {/* Devices Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-foreground">Connected Devices</h2>
          <DeviceGrid 
            devices={devices} 
            loading={loading}
            selectedDevice={selectedDevice}
            onSelectDevice={setSelectedDevice}
          />
        </section>

        {/* Simulator Section */}
        <section className="mt-8">
          <DeviceSimulator devices={devices} />
        </section>
      </main>
    </div>
  );
}
