import packageJson from '@/package.json';

export const APP_NAME = 'Tranquility Task Tracker';

export function getAppBuildInfo() {
  return {
    name: APP_NAME,
    version: packageJson.version,
    buildTimestamp:
      process.env.NEXT_PUBLIC_BUILD_TIMESTAMP ??
      process.env.BUILD_TIMESTAMP ??
      new Date().toISOString(),
  };
}
