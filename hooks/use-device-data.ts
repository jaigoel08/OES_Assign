'use client';

import { useState, useEffect } from 'react';

interface DeviceReading {
  timestamp: string;
  value: number;
}

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
  readings: DeviceReading[];
}

interface Metrics {
  totalDevices: number;
  activeDevices: number;
  totalReadings: number;
  avgTemperature: number;
}

export function useDeviceData() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    totalDevices: 0,
    activeDevices: 0,
    totalReadings: 0,
    avgTemperature: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAndFetch = async () => {
      try {
        setLoading(true);
        
        // Initialize database on first load
        try {
          await fetch('/api/init', { method: 'POST' });
        } catch {
          // Initialization may fail if already initialized, continue
        }

        // Fetch devices
        const response = await fetch('/api/devices');
        if (response.ok) {
          const data = await response.json();
          setDevices(data.devices);
          setMetrics(data.metrics);
        }
      } catch (error) {
        console.error('[v0] Failed to fetch devices:', error);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    initAndFetch();

    // Set up polling for real-time updates (every 5 seconds)
    const interval = setInterval(() => {
      fetch('/api/devices')
        .then(res => res.json())
        .then(data => {
          setDevices(data.devices);
          setMetrics(data.metrics);
        })
        .catch(err => console.error('[v0] Polling error:', err));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return { devices, metrics, loading };
}
