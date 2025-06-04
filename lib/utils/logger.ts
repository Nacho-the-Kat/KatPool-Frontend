import rTracer from 'cls-rtracer';

const { DATADOG_SECRET, DATADOG_LOG_URL } = process.env;

interface LogContext {
  [key: string]: any;
  requestId?: string;
}

const sendLog = async (level: string, message: string, context: LogContext = {}) => {
  const requestId: string = String(rTracer.id());
  const logData = {
    ddsource: 'nodejs',
    service: 'dev-katpool-frontend',
    level,
    message,
    requestId: requestId.toString(),
    ...context,
    timestamp: new Date().toISOString(),
  };

  try {
    const response = await fetch(DATADOG_LOG_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'DD-API-KEY': DATADOG_SECRET!,
      },
      body: JSON.stringify(logData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to send log to Datadog:', error);
    // Don't throw the error to prevent middleware from failing
    // Just log it to console as a fallback
  }
};

const logger = {
  info: (message: string, context?: LogContext) => sendLog('info', message, context),
  error: (message: string, context?: LogContext) => sendLog('error', message, context),
  warn: (message: string, context?: LogContext) => sendLog('warn', message, context),
};

export default logger;
