# IoT Device Dashboard Project

## Overview
This project is a full-stack IoT Device Dashboard built with Next.js, TypeScript, and React. It provides real-time monitoring, simulation, and management of IoT devices, including 3D visualization, telemetry, and MQTT-based communication. The dashboard is designed for scalability, modern UI/UX, and extensibility for future IoT applications.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Key Components & Functionality](#key-components--functionality)
- [How It Works](#how-it-works)
- [Interview Questions & Answers](#interview-questions--answers)
- [Possible Improvements](#possible-improvements)
- [License](#license)

---

## Features
- **Real-time IoT device monitoring**
- **3D device visualization**
- **Device simulation and telemetry**
- **MQTT integration for device communication**
- **WebSocket support for live updates**
- **Modern, responsive dashboard UI**
- **Reusable UI components**
- **TypeScript for type safety**

---

## Tech Stack
- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API routes
- **MQTT:** For device communication (via `lib/mqtt-service.ts`)
- **WebSockets:** For real-time updates (via `lib/websocket-service.ts`)
- **Database:** (Pluggable, see `lib/db.ts`)
- **3D Visualization:** (Likely Three.js or similar, see `components/Iot3DModel.jsx`)
- **State Management:** React hooks

---

## Project Structure
```
app/                # Next.js app directory (pages, API routes)
components/         # Reusable React components (UI, dashboard, 3D model)
hooks/              # Custom React hooks (device data, real-time updates)
lib/                # Utility libraries (MQTT, WebSocket, DB, helpers)
public/             # Static assets
scripts/            # Database initialization scripts
styles/             # Global styles
```

---

## Setup & Installation
1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd <project-folder>
   ```
2. **Install dependencies:**
   ```bash
   pnpm install
   # or
   npm install
   ```
3. **Configure environment variables:**
   - Add any required `.env` variables (MQTT broker, DB connection, etc.)
4. **Initialize the database (optional):**
   - Run the SQL script in `scripts/init-db.sql` if using a database.
5. **Run the development server:**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```
6. **Open the app:**
   - Visit [http://localhost:3000](http://localhost:3000)

---

## Key Components & Functionality
- **3D IoT Model:** `components/Iot3DModel.jsx` and `Iot3DModelClient.tsx` for device visualization.
- **Dashboard:** `app/dashboard/page.tsx` and `components/dashboard/` for device grid, metrics, and simulation.
- **Device Simulator:** Simulates device data for testing (see `device-simulator.tsx`).
- **MQTT Service:** Handles publish/subscribe to MQTT topics (`lib/mqtt-service.ts`).
- **WebSocket Service:** Real-time updates to the UI (`lib/websocket-service.ts`).
- **API Routes:**
  - `app/api/devices/route.ts`: Device CRUD/API
  - `app/api/mqtt/publish/route.ts`: MQTT publish endpoint
  - `app/api/telemetry/route.ts`: Telemetry data endpoint
  - `app/api/stream/route.ts`: Streaming data
  - `app/api/init/route.ts`: Initialization logic
- **Custom Hooks:**
  - `hooks/use-device-data.ts`: Fetches and manages device data
  - `hooks/use-realtime-updates.ts`: Subscribes to real-time events
  - `hooks/use-toast.ts`: Notification system

---

## How It Works
1. **Device Data Flow:**
   - Devices (real or simulated) send telemetry via MQTT.
   - Backend API receives, processes, and stores data.
   - WebSocket service pushes updates to the dashboard in real time.
2. **3D Visualization:**
   - Device state and metrics are rendered in a 3D model for intuitive monitoring.
3. **Simulation:**
   - Simulate device data for development/testing without real hardware.
4. **UI/UX:**
   - Responsive, modern dashboard with reusable UI components.

---

## Interview Questions & Answers
### 1. **What is the architecture of your project?**
- Modular, component-based frontend (React/Next.js)
- API routes for backend logic (Next.js serverless functions)
- MQTT for device communication
- WebSockets for real-time UI updates
- Custom hooks for state management

### 2. **How do you handle real-time data?**
- MQTT for device-to-server communication
- WebSocket service for server-to-client real-time updates
- React hooks to update UI on new data

### 3. **How is the 3D visualization implemented?**
- Likely using Three.js or a similar library in `Iot3DModel.jsx`
- Device state is mapped to 3D model properties

### 4. **How do you simulate devices?**
- `device-simulator.tsx` generates mock telemetry data
- Data is sent via MQTT/WebSocket to mimic real devices

### 5. **How is the project structured?**
- Clear separation of concerns: UI, hooks, API, services, and utilities
- Reusable UI components for consistency

### 6. **How do you ensure scalability and maintainability?**
- Modular codebase
- TypeScript for type safety
- Reusable hooks and components
- API-first design

### 7. **What are the main challenges you faced?**
- Integrating real-time data with React state
- Managing MQTT/WebSocket connections efficiently
- 3D visualization performance

### 8. **How would you extend this project?**
- Add authentication/authorization
- Integrate with a real database (e.g., PostgreSQL, MongoDB)
- Add device management features (firmware updates, alerts)
- Enhance 3D visualization (animations, more device types)

---

## Possible Improvements
- Add user authentication and role-based access
- Integrate advanced analytics and reporting
- Support for more device protocols (CoAP, HTTP, etc.)
- Deploy to cloud (Vercel, AWS, etc.)
- Add unit and integration tests

---

## License
This project is for educational and demonstration purposes.
