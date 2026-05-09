import { NextResponse } from 'next/server';
import { getAppBuildInfo } from '@/lib/build-info';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const build = getAppBuildInfo();
  let database: 'ok' | 'error' = 'ok';

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    database = 'error';
  }

  return NextResponse.json({
    status: 'ok',
    app: build.name,
    timestamp: new Date().toISOString(),
    database,
  });
}
