'use client';

import { useEffect, useState, useCallback } from 'react';
import { WSEventTypes, WSMessage } from '@/lib/websocket-service';

interface UseRealtimeUpdatesOptions {
  enabled?: boolean;
  eventTypes?: string[];
}

export function useRealtimeUpdates(
  onUpdate?: (message: WSMessage) => void,
  options?: UseRealtimeUpdatesOptions
) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<WSMessage | null>(null);

  const handleMessage = useCallback(
    (message: WSMessage) => {
      if (!options?.eventTypes || options.eventTypes.includes(message.type)) {
        setLastUpdate(message);
        onUpdate?.(message);
      }
    },
    [onUpdate, options?.eventTypes]
  );

  useEffect(() => {
    if (options?.enabled === false) return;

    // Simulate WebSocket connection
    // In production, this would use a real WebSocket connection
    const eventSource = new EventSource('/api/stream');

    eventSource.onopen = () => {
      console.log('[v0] Real-time connection established');
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        handleMessage(message);
      } catch (error) {
        console.error('[v0] Failed to parse message:', error);
      }
    };

    eventSource.onerror = () => {
      console.error('[v0] Real-time connection error');
      setIsConnected(false);
      eventSource.close();
    };

    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, [handleMessage, options?.enabled]);

  return {
    isConnected,
    lastUpdate,
  };
}
