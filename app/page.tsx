"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

// 3D model (client-only)
const Iot3DModelClient = dynamic(
  () => import("../components/Iot3DModel"),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-slate-900 overflow-x-hidden">

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur border-b border-slate-200 shadow-sm">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-xl tracking-tight text-blue-700">
              IoT Dashboard
            </span>
          </div>
          <div className="flex items-center gap-6 text-base font-medium">
            <Link href="#about" className="hover:text-blue-600 transition">About</Link>
            <Link href="#usecases" className="hover:text-blue-600 transition">Use Cases</Link>
            <Link href="#features" className="hover:text-blue-600 transition">Features</Link>
            <Link
              href="/dashboard"
              className="px-5 py-2 bg-gradient-to-r from-blue-500 to-sky-500 text-white rounded-full shadow hover:scale-105 transition"
            >
              Dashboard
            </Link>
          </div>
        </nav>
      </header>

      {/* ================= HERO ================= */}
      <section
        className="min-h-[80vh] bg-cover bg-center relative flex items-center"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/1472443/pexels-photo-1472443.jpeg')",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-14 items-center text-white">
          
          {/* TEXT */}
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-xl">
              Smart <span className="text-sky-400">IoT Dashboard</span>
            </h1>
            <p className="text-xl text-slate-200 mb-10 max-w-xl">
              Monitor, simulate and control IoT devices in real time using MQTT,
              WebSockets and modern cloud technologies.
            </p>
            <a
              href="/dashboard"
              className="inline-block px-10 py-4 bg-gradient-to-r from-blue-500 to-sky-500 rounded-full font-semibold shadow-xl hover:scale-105 transition"
            >
              Go to Dashboard
            </a>
          </div>

          {/* 3D MODEL */}
          <div className="h-[420px] bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 flex items-center justify-center">
            <Iot3DModelClient />
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section
        id="about"
        className="py-24 bg-gradient-to-br from-blue-50 via-white to-blue-100"
      >
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <img
            src="https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg"
            alt="IoT Devices"
            className="rounded-3xl shadow-2xl hover:scale-105 transition"
          />
          <div>
            <h2 className="text-4xl font-bold mb-6 text-blue-800">
              What is this platform?
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed">
              This dashboard enables real-time monitoring of connected devices,
              MQTT-based communication, live analytics, and device simulation.
              Built for students, engineers, and smart-system developers.
            </p>
          </div>
        </div>
      </section>

      {/* ================= USE CASES ================= */}
      <section
        id="usecases"
        className="py-24 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg')",
        }}
      >
        <div className="absolute inset-0 bg-blue-900/70" />

        <div className="relative max-w-6xl mx-auto px-6 text-white text-center">
          <h2 className="text-4xl font-bold mb-16">
            Where it can be used
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-lg font-semibold">
            {[
              "Smart Homes",
              "Industrial IoT",
              "Smart Cities",
              "Healthcare Monitoring",
              "Agriculture Systems",
              "Energy Management",
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:scale-105 transition border border-white/20"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-slate-800">
            Core Features
          </h2>

          <div className="grid md:grid-cols-2 gap-10">
            {[
              "Live MQTT & WebSocket communication",
              "Real-time dashboards & metrics",
              "Device simulation & testing",
              "Responsive modern UI",
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-5 bg-blue-50 rounded-2xl p-6 shadow hover:shadow-lg transition border border-blue-100"
              >
                <span className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold shadow">
                  ✓
                </span>
                <p className="text-lg text-slate-700">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-sky-500 text-white text-center">
        <h2 className="text-4xl font-bold mb-6 drop-shadow-xl">
          Ready to explore smart systems?
        </h2>
        <p className="text-lg mb-10 opacity-90">
          Launch the dashboard and start building real-time IoT solutions.
        </p>
        <a
          href="/dashboard"
          className="inline-block px-12 py-4 bg-white text-blue-700 rounded-full font-semibold shadow-xl hover:scale-105 transition"
        >
          Launch Dashboard
        </a>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-8 text-center text-slate-500 text-sm">
        © 2026 IoT Dashboard · MQTT · WebSockets · Cloud
      </footer>
    </div>
  );
}
