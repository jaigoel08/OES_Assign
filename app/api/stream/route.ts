import { NextResponse } from 'next/server';
import { WSEventTypes } from '@/lib/websocket-service';

/**
 * Server-Sent Events (SSE) endpoint for real-time updates
 * Clients can subscribe to receive live device updates
 */
export async function GET(request: Request) {
  const encoder = new TextEncoder();

  const customReadable = new ReadableStream({
    async start(controller) {
      try {
        // Send connection established event
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: WSEventTypes.CONNECTION,
              timestamp: new Date().toISOString(),
              data: { message: 'Connected to real-time updates' },
            })}\n\n`
          )
        );

        // Simulate periodic updates
        let messageCounter = 0;
        const interval = setInterval(async () => {
          try {
            messageCounter++;

            // Fetch latest device data
            const devicesResponse = await fetch(
              `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/devices`,
              { cache: 'no-store' }
            );

            if (devicesResponse.ok) {
              const data = await devicesResponse.json();

              // Send metrics update
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    type: WSEventTypes.METRICS_UPDATE,
                    timestamp: new Date().toISOString(),
                    data: data.metrics,
                  })}\n\n`
                )
              );

              // Send device updates
              if (data.devices && data.devices.length > 0) {
                const randomDevice = data.devices[Math.floor(Math.random() * data.devices.length)];
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({
                      type: WSEventTypes.DEVICE_UPDATE,
                      timestamp: new Date().toISOString(),
                      data: {
                        deviceId: randomDevice.id,
                        metrics: randomDevice.metrics,
                        status: randomDevice.status,
                      },
                    })}\n\n`
                  )
                );
              }
            }

            // Stop after 5 minutes to allow reconnection
            if (messageCounter > 60) {
              clearInterval(interval);
              controller.close();
            }
          } catch (error) {
            console.error('[v0] Stream error:', error);
            clearInterval(interval);
            controller.close();
          }
        }, 5000);

        // Cleanup on client disconnect
        request.signal.addEventListener('abort', () => {
          clearInterval(interval);
          controller.close();
        });
      } catch (error) {
        console.error('[v0] Stream setup error:', error);
        controller.close();
      }
    },
  });

  return new NextResponse(customReadable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
