import { NUDL_IDE_BUILD, NUDL_IDE_VERSION } from './version';

export const NUDL_IDE_DEVELOPER = 'Stephen Lloyd-Lyons Jr';
export const NUDL_IDE_BUILD_NUMBER = 1;
export const NUDL_IDE_BUILD_ID = `NUDL-NOODLE-${NUDL_IDE_VERSION.toUpperCase()}-TEST1`;

export const NUDL_IDE_BUILD_IDENTITY = {
  developer: NUDL_IDE_DEVELOPER,
  version: NUDL_IDE_VERSION,
  buildDate: NUDL_IDE_BUILD,
  buildNumber: NUDL_IDE_BUILD_NUMBER,
  testNumber: 1,
  buildId: NUDL_IDE_BUILD_ID,
} as const;
