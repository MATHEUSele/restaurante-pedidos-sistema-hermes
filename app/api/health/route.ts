import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { logger } from '../../utils/logger';

export async function GET() {
  try {
    // Tenta conectar ao banco
    await prisma.$queryRaw`SELECT 1`;
    
    logger.info('Health check executado com sucesso', { database: 'connected' });
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected'
    }, { status: 200 });
  } catch (error) {
    logger.error('Falha no Health check', error, { database: 'disconnected' });
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 503 });
  }
}
