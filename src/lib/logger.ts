import pino from "pino";


export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  // Transport is disabled. Next.js 15 Webpack and Pino worker threads (thread-stream) 
  // conflict and crash randomly in dev mode. We log raw JSON safely.
  base: {
    env: process.env.NODE_ENV,
  },
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});
