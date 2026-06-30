import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const isPusherMock = !process.env.NEXT_PUBLIC_PUSHER_KEY || process.env.NEXT_PUBLIC_PUSHER_KEY === "MOCK";

// ==========================================
// SERVER SIDE PUSHER INSTANCE
// ==========================================
export const pusherServer = isPusherMock 
  ? null 
  : new PusherServer({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      useTLS: true,
    });

// ==========================================
// CLIENT SIDE PUSHER HELPER
// ==========================================
let pusherClientInstance: PusherClient | null = null;

export const getPusherClient = () => {
  if (isPusherMock) return null;
  
  // Singleton pattern to prevent multiple connections on the client
  if (!pusherClientInstance) {
    pusherClientInstance = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
  }
  return pusherClientInstance;
};
