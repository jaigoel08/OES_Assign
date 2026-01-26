// WebSocket Service for Real-time Updates
// This service manages WebSocket connections and broadcasts updates

type MessageHandler = (message: any) => void;

interface WebSocketClient {
  id: string;
  handlers: MessageHandler[];
}

class WebSocketService {
  private clients = new Map<string, WebSocketClient>();
  private messageQueues = new Map<string, any[]>();

  /**
   * Register a client connection
   */
  registerClient(clientId: string): void {
    if (!this.clients.has(clientId)) {
      this.clients.set(clientId, {
        id: clientId,
        handlers: [],
      });
      this.messageQueues.set(clientId, []);
      console.log(`[v0] Client registered: ${clientId}`);
    }
  }

  /**
   * Unregister a client connection
   */
  unregisterClient(clientId: string): void {
    this.clients.delete(clientId);
    this.messageQueues.delete(clientId);
    console.log(`[v0] Client unregistered: ${clientId}`);
  }

  /**
   * Subscribe to messages for a client
   */
  subscribe(clientId: string, handler: MessageHandler): () => void {
    const client = this.clients.get(clientId);
    if (client) {
      client.handlers.push(handler);
      console.log(`[v0] Handler subscribed for client: ${clientId}`);

      // Return unsubscribe function
      return () => {
        const idx = client.handlers.indexOf(handler);
        if (idx !== -1) {
          client.handlers.splice(idx, 1);
        }
      };
    }
    return () => {};
  }

  /**
   * Broadcast message to all clients
   */
  broadcastToAll(message: any): void {
    this.clients.forEach((client) => {
      client.handlers.forEach((handler) => {
        try {
          handler(message);
        } catch (error) {
          console.error('[v0] Error in message handler:', error);
        }
      });
    });
  }

  /**
   * Broadcast message to specific client
   */
  broadcastToClient(clientId: string, message: any): void {
    const client = this.clients.get(clientId);
    if (client) {
      client.handlers.forEach((handler) => {
        try {
          handler(message);
        } catch (error) {
          console.error('[v0] Error in message handler:', error);
        }
      });
    }
  }

  /**
   * Queue message if no subscribers
   */
  queueMessage(clientId: string, message: any): void {
    const queue = this.messageQueues.get(clientId);
    if (queue) {
      queue.push(message);
      // Keep only last 100 messages
      if (queue.length > 100) {
        queue.shift();
      }
    }
  }

  /**
   * Get queued messages for a client
   */
  getQueuedMessages(clientId: string): any[] {
    const queue = this.messageQueues.get(clientId);
    if (queue) {
      const messages = [...queue];
      queue.length = 0; // Clear queue
      return messages;
    }
    return [];
  }

  /**
   * Get number of connected clients
   */
  getConnectedClientsCount(): number {
    return this.clients.size;
  }

  /**
   * Get client IDs
   */
  getConnectedClientIds(): string[] {
    return Array.from(this.clients.keys());
  }
}

export const wsService = new WebSocketService();

/**
 * Event types for WebSocket messages
 */
export const WSEventTypes = {
  DEVICE_UPDATE: 'device:update',
  TELEMETRY_UPDATE: 'telemetry:update',
  DEVICE_STATUS_CHANGE: 'device:status_change',
  ALERT_CREATED: 'alert:created',
  ALERT_RESOLVED: 'alert:resolved',
  METRICS_UPDATE: 'metrics:update',
  CONNECTION: 'connection:established',
  DISCONNECT: 'connection:disconnected',
} as const;

export interface WSMessage {
  type: string;
  timestamp: string;
  data: any;
}
