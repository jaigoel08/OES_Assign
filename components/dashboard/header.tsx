'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Bell, MoreVertical, Wifi } from 'lucide-react';

export default function DashboardHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Wifi className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">IoT Dashboard</h1>
              <p className="text-sm text-muted-foreground">Real-time device monitoring</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
