/**
 * Simples Logger Estruturado.
 * Para uso em produção, pode ser substituído por pino ou winston.
 * Os logs estruturados (JSON) facilitam a ingestão em ferramentas como Datadog, ELK, Sentry, etc.
 */
export const logger = {
  info: (message: string, context?: any) => {
    console.log(JSON.stringify({ level: 'info', timestamp: new Date().toISOString(), message, context }));
  },
  warn: (message: string, context?: any) => {
    console.warn(JSON.stringify({ level: 'warn', timestamp: new Date().toISOString(), message, context }));
  },
  error: (message: string, error?: any, context?: any) => {
    console.error(JSON.stringify({ 
      level: 'error', 
      timestamp: new Date().toISOString(), 
      message, 
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      context 
    }));
  },
};
