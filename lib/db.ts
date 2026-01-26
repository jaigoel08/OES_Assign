// In-memory database simulation for demonstration
// In production, this would connect to MySQL/PostgreSQL

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

interface TelemetryData {
  deviceId: string;
  timestamp: Date;
  temperature: number;
  humidity: number;
  pressure: number;
}

interface Metrics {
  totalDevices: number;
  activeDevices: number;
  totalReadings: number;
  avgTemperature: number;
}

// In-memory storage
const devicesStore = new Map<string, Device>();
const telemetryStore = new Map<string, TelemetryData[]>();

// Initialize with sample devices
export async function initializeDatabase() {
  const sampleDevices: Device[] = [
    {
      id: 'device-001',
      name: 'Warehouse Sensor A',
      type: 'Temperature & Humidity',
      location: 'Warehouse Building 1',
      status: 'active',
      lastUpdate: new Date().toISOString(),
      metrics: { temperature: 22.5, humidity: 45, pressure: 1013.25 },
      readings: generateMockReadings(),
    },
    {
      id: 'device-002',
      name: 'Server Room Monitor',
      type: 'Temperature & Pressure',
      location: 'Server Room B2',
      status: 'active',
      lastUpdate: new Date().toISOString(),
      metrics: { temperature: 18.3, humidity: 40, pressure: 1013.5 },
      readings: generateMockReadings(),
    },
    {
      id: 'device-003',
      name: 'Environmental Sensor',
      type: 'Multi-Sensor',
      location: 'Outdoor Station 1',
      status: 'active',
      lastUpdate: new Date().toISOString(),
      metrics: { temperature: 25.1, humidity: 55, pressure: 1012.8 },
      readings: generateMockReadings(),
    },
    {
      id: 'device-004',
      name: 'Plant Growth Monitor',
      type: 'Humidity & Light',
      location: 'Greenhouse C',
      status: 'inactive',
      lastUpdate: new Date(Date.now() - 3600000).toISOString(),
      metrics: { temperature: 26.0, humidity: 75, pressure: 1011.2 },
      readings: generateMockReadings(),
    },
    {
      id: 'device-005',
      name: 'Pressure Sensor',
      type: 'Pressure Monitor',
      location: 'Pipeline Section D',
      status: 'error',
      lastUpdate: new Date(Date.now() - 7200000).toISOString(),
      metrics: { temperature: 0, humidity: 0, pressure: 0 },
      readings: [],
    },
    {
      id: 'device-006',
      name: 'Cold Chain Monitor',
      type: 'Temperature Logger',
      location: 'Cold Storage E',
      status: 'active',
      lastUpdate: new Date().toISOString(),
      metrics: { temperature: 2.1, humidity: 30, pressure: 1013.0 },
      readings: generateMockReadings(),
    },
  ];

  sampleDevices.forEach((device) => {
    devicesStore.set(device.id, device);
    telemetryStore.set(device.id, device.readings.map((r) => ({
      deviceId: device.id,
      timestamp: new Date(r.timestamp),
      temperature: r.value,
      humidity: device.metrics.humidity,
      pressure: device.metrics.pressure,
    })));
  });
}

function generateMockReadings(count = 10) {
  const readings = [];
  const now = Date.now();
  for (let i = count - 1; i >= 0; i--) {
    readings.push({
      timestamp: new Date(now - i * 300000).toISOString(),
      value: Math.round((20 + Math.random() * 10) * 10) / 10,
    });
  }
  return readings;
}

export async function getDevices(): Promise<Device[]> {
  return Array.from(devicesStore.values());
}

export async function getDeviceById(id: string): Promise<Device | undefined> {
  return devicesStore.get(id);
}

export async function createDevice(device: Omit<Device, 'readings' | 'lastUpdate' | 'metrics'>): Promise<Device> {
  const newDevice: Device = {
    ...device,
    lastUpdate: new Date().toISOString(),
    metrics: { temperature: 0, humidity: 0, pressure: 0 },
    readings: [],
  };
  devicesStore.set(device.id, newDevice);
  telemetryStore.set(device.id, []);
  return newDevice;
}

export async function saveTelemetry(data: TelemetryData): Promise<void> {
  const readings = telemetryStore.get(data.deviceId) || [];
  readings.push(data);
  
  // Keep only last 100 readings
  if (readings.length > 100) {
    readings.shift();
  }
  
  telemetryStore.set(data.deviceId, readings);

  // Update device metrics
  const device = devicesStore.get(data.deviceId);
  if (device) {
    device.metrics = {
      temperature: data.temperature,
      humidity: data.humidity,
      pressure: data.pressure,
    };
    device.lastUpdate = data.timestamp.toISOString();
    device.readings = readings.map((r) => ({
      timestamp: r.timestamp.toISOString(),
      value: r.temperature,
    }));
  }
}

export async function updateDeviceStatus(
  deviceId: string,
  status: 'active' | 'inactive' | 'error'
): Promise<void> {
  const device = devicesStore.get(deviceId);
  if (device) {
    device.status = status;
  }
}

export async function getMetrics(): Promise<Metrics> {
  const devices = Array.from(devicesStore.values());
  const totalDevices = devices.length;
  const activeDevices = devices.filter((d) => d.status === 'active').length;
  const totalReadings = Array.from(telemetryStore.values()).reduce((sum, readings) => sum + readings.length, 0);
  
  const temperatures = devices
    .filter((d) => d.metrics.temperature > 0)
    .map((d) => d.metrics.temperature);
  
  const avgTemperature =
    temperatures.length > 0
      ? Math.round((temperatures.reduce((a, b) => a + b, 0) / temperatures.length) * 10) / 10
      : 0;

  return {
    totalDevices,
    activeDevices,
    totalReadings,
    avgTemperature,
  };
}

export async function getTelemetry(
  deviceId: string,
  limit: number = 100
): Promise<TelemetryData[]> {
  const readings = telemetryStore.get(deviceId) || [];
  return readings.slice(-limit);
}

export async function deleteDevice(deviceId: string): Promise<void> {
  devicesStore.delete(deviceId);
  telemetryStore.delete(deviceId);
}
