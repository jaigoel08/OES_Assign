-- Create Devices Table
CREATE TABLE IF NOT EXISTS devices (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'error')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_reading TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- Create Telemetry Table
CREATE TABLE IF NOT EXISTS telemetry (
  id INT AUTO_INCREMENT PRIMARY KEY,
  device_id VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  temperature DECIMAL(6, 2) NOT NULL,
  humidity DECIMAL(5, 2) NOT NULL,
  pressure DECIMAL(8, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
  INDEX idx_device_id (device_id),
  INDEX idx_timestamp (timestamp),
  INDEX idx_device_timestamp (device_id, timestamp)
);

-- Create Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  device_id VARCHAR(255) NOT NULL,
  alert_type VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  severity VARCHAR(50) DEFAULT 'warning' CHECK (severity IN ('info', 'warning', 'critical')),
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL,
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
  INDEX idx_device_id (device_id),
  INDEX idx_severity (severity),
  INDEX idx_is_resolved (is_resolved),
  INDEX idx_created_at (created_at)
);

-- Create Device History Table
CREATE TABLE IF NOT EXISTS device_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  device_id VARCHAR(255) NOT NULL,
  action VARCHAR(100) NOT NULL,
  previous_status VARCHAR(50),
  new_status VARCHAR(50),
  details JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
  INDEX idx_device_id (device_id),
  INDEX idx_created_at (created_at)
);
