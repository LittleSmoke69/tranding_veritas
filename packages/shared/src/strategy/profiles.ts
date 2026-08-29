export type RobotProfileCode = 'conservative' | 'moderate' | 'aggressive';

export type RobotProfile = {
  code: RobotProfileCode;
  name: string;
  targetMinBps: number;
  targetMaxBps: number;
  stakeBps: number;
  stopLossBps: number;
  intervalSec: 15 | 60 | 300;
  expirationSec: number;
  cooldownSec: number;
  maxTradesDay: number;
  confirmationLevel: 1 | 2 | 3;
};

export const ROBOT_PROFILES: Record<RobotProfileCode, RobotProfile> = {
  conservative: {
    code: 'conservative',
    name: 'Conservador',
    targetMinBps: 50,
    targetMaxBps: 100,
    stakeBps: 100,
    stopLossBps: 200,
    intervalSec: 300,
    expirationSec: 300,
    cooldownSec: 900,
    maxTradesDay: 10,
    confirmationLevel: 3,
  },
  moderate: {
    code: 'moderate',
    name: 'Moderado',
    targetMinBps: 200,
    targetMaxBps: 400,
    stakeBps: 250,
    stopLossBps: 500,
    intervalSec: 60,
    expirationSec: 120,
    cooldownSec: 300,
    maxTradesDay: 25,
    confirmationLevel: 2,
  },
  aggressive: {
    code: 'aggressive',
    name: 'Agressivo',
    targetMinBps: 500,
    targetMaxBps: 800,
    stakeBps: 500,
    stopLossBps: 1000,
    intervalSec: 15,
    expirationSec: 60,
    cooldownSec: 120,
    maxTradesDay: 50,
    confirmationLevel: 1,
  },
};
