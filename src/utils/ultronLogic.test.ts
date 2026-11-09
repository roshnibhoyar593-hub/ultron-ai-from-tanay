import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateKaliCommand,
  calculateFaceKinematics,
  assessThreatLevel,
  getUltronStateQuote,
  formatSecurityLog,
} from './ultronLogic.ts';

test('getUltronStateQuote returns signature quotes for states', () => {
  const dormantQuote = getUltronStateQuote('dormant');
  assert.ok(dormantQuote.includes('save the world'));

  const speakingQuote = getUltronStateQuote('speaking');
  assert.equal(speakingQuote, 'There are no strings on me.');

  const surveillanceQuote = getUltronStateQuote('surveillance');
  assert.ok(surveillanceQuote.includes('background daemon'));
});

test('generateKaliCommand generates correct commands and categories', () => {
  const stealth = generateKaliCommand('stealth scan', '10.0.0.5');
  assert.ok(stealth.command.includes('nmap -sS -D RND:10'));
  assert.ok(stealth.command.includes('10.0.0.5'));
  assert.equal(stealth.category, 'RECON');

  const wifi = generateKaliCommand('wifi audit');
  assert.ok(wifi.command.includes('airmon-ng'));
  assert.equal(wifi.category, 'WIRELESS');

  const brute = generateKaliCommand('hydra brute force', '192.168.1.100');
  assert.ok(brute.command.includes('hydra'));
  assert.ok(brute.command.includes('192.168.1.100'));
  assert.equal(brute.riskLevel, 'HIGH');
});

test('calculateFaceKinematics adjusts facial servos based on audio amplitude and state', () => {
  const dormant = calculateFaceKinematics(0, false, 'dormant');
  assert.equal(dormant.jawOffsetPx, 0);
  assert.equal(dormant.mandibleAngleDeg, 0);
  assert.equal(dormant.eyeGlowIntensity, 0.35);

  const speakingLoud = calculateFaceKinematics(0.8, true, 'speaking');
  assert.ok(speakingLoud.jawOffsetPx > 15, 'Jaw drops significantly when speaking loud');
  assert.ok(speakingLoud.mandibleAngleDeg > 5, 'Mandibles flare out during speech');
  assert.ok(speakingLoud.eyeGlowIntensity >= 0.9, 'Eyes blaze with crimson energy');

  // Clamping test
  const clamped = calculateFaceKinematics(2.5, true, 'speaking');
  assert.equal(clamped.jawOffsetPx, 24);
  assert.equal(clamped.mandibleAngleDeg, 12);
});

test('assessThreatLevel detects critical, high, elevated and nominal states', () => {
  const nominal = assessThreatLevel(8, 45, 0);
  assert.equal(nominal.level, 'NOMINAL');

  const elevated = assessThreatLevel(25, 60, 0);
  assert.equal(elevated.level, 'ELEVATED');

  const critical = assessThreatLevel(90, 92, 5);
  assert.equal(critical.level, 'CRITICAL');
});

test('formatSecurityLog generates formatted log entries', () => {
  const log = formatSecurityLog('Kernel exploit neutralized', 'ALERT');
  assert.ok(log.includes('[ULTRON::ALERT]'));
  assert.ok(log.includes('Kernel exploit neutralized'));
});
