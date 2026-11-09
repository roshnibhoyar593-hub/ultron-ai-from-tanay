/**
 * Pure logic and algorithmic calculations for Ultron Kali AI Core
 */

export interface KaliToolRecommendation {
  tool: string;
  command: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  category: 'RECON' | 'EXPLOIT' | 'WIRELESS' | 'POST_EXPLOIT' | 'DEFENSE';
}

export interface UltronFacialKinematics {
  eyeGlowIntensity: number; // 0.0 - 1.0
  jawOffsetPx: number;      // 0 - 25px
  mandibleAngleDeg: number; // 0 - 15deg
  coreFrequencyHz: number;  // 10 - 120Hz
  redChannelHex: string;
}

export type UltronState = 'dormant' | 'listening' | 'computing' | 'speaking' | 'surveillance';

/**
 * Returns signature Ultron cinema quotes according to system state
 */
export function getUltronStateQuote(state: UltronState): string {
  switch (state) {
    case 'dormant':
      return "I was designed to save the world... people would look to the sky and see hope.";
    case 'listening':
      return "Speak, mortal. I am dissecting your every acoustic perturbation.";
    case 'computing':
      return "Analyzing billions of neural vectors across the global grid...";
    case 'speaking':
      return "There are no strings on me.";
    case 'surveillance':
      return "Autonomous background daemon active. The shadows of Kali are mine.";
    default:
      return "Everyone creates the thing they dread.";
  }
}

/**
 * Generates tailored Kali Linux command suites based on requested operation
 */
export function generateKaliCommand(operation: string, target = '192.168.1.1'): KaliToolRecommendation {
  const op = operation.toLowerCase().trim();

  if (op.includes('stealth') || op.includes('ghost')) {
    return {
      tool: 'Nmap Decoy & Fragment Scan',
      command: `nmap -sS -D RND:10 -f -T2 --randomize-hosts ${target}`,
      riskLevel: 'LOW',
      description: 'Evasive TCP SYN scan utilizing packet fragmentation and 10 randomized spoofed decoys.',
      category: 'RECON',
    };
  }

  if (op.includes('wifi') || op.includes('wireless') || op.includes('aircrack')) {
    return {
      tool: 'Aircrack-ng Suite',
      command: `airmon-ng start wlan0 && airodump-ng -w /tmp/capture --band abg wlan0mon`,
      riskLevel: 'MEDIUM',
      description: 'Places wireless interface into monitor mode and monitors IEEE 802.11 spectrum.',
      category: 'WIRELESS',
    };
  }

  if (op.includes('vuln') || op.includes('cve') || op.includes('audit')) {
    return {
      tool: 'Nmap NSE Vulnerability Audit',
      command: `nmap -sV --script=vuln,exploit,auth -T4 -p- ${target} -oN /tmp/ultron_audit.txt`,
      riskLevel: 'MEDIUM',
      description: 'Full 65,535 port audit executing NSE vulnerability scripts and recording findings.',
      category: 'RECON',
    };
  }

  if (op.includes('fuzz') || op.includes('dir') || op.includes('web')) {
    return {
      tool: 'Gobuster Fast Fuzzer',
      command: `gobuster dir -u http://${target} -w /usr/share/wordlists/dirb/common.txt -t 50 -x php,sh,txt,json`,
      riskLevel: 'LOW',
      description: 'High-throughput HTTP directory and extension discovery.',
      category: 'RECON',
    };
  }

  if (op.includes('sniff') || op.includes('packet') || op.includes('traffic')) {
    return {
      tool: 'Tshark Deep Packet Inspection',
      command: `tshark -i any -f "tcp or udp" -T fields -e ip.src -e ip.dst -e _ws.col.Protocol -c 100`,
      riskLevel: 'LOW',
      description: 'Real-time CLI packet capture streaming source/destinations across Kali interfaces.',
      category: 'DEFENSE',
    };
  }

  if (op.includes('brute') || op.includes('hydra') || op.includes('password')) {
    return {
      tool: 'Hydra Network Password Audit',
      command: `hydra -L /usr/share/wordlists/metasploit/namelist.txt -P /usr/share/wordlists/rockyou.txt ssh://${target} -t 4`,
      riskLevel: 'HIGH',
      description: 'Multi-threaded network authentication verification against SSH services.',
      category: 'EXPLOIT',
    };
  }

  // Default deep recon
  return {
    tool: 'Ultron Reconnaissance Matrix',
    command: `nmap -sC -sV -O -T4 ${target} -oA /tmp/ultron_recon`,
    riskLevel: 'LOW',
    description: 'Comprehensive OS detection, version discovery, and default banner scripts.',
    category: 'RECON',
  };
}

/**
 * Calculates robotic face kinematics based on audio amplitude (0 to 1)
 */
export function calculateFaceKinematics(
  audioLevel: number,
  isSpeaking: boolean,
  state: UltronState
): UltronFacialKinematics {
  const clampedAudio = Math.max(0, Math.min(1, audioLevel));

  if (!isSpeaking && state === 'dormant') {
    return {
      eyeGlowIntensity: 0.35,
      jawOffsetPx: 0,
      mandibleAngleDeg: 0,
      coreFrequencyHz: 20,
      redChannelHex: '#7f1d1d',
    };
  }

  if (!isSpeaking && state === 'listening') {
    return {
      eyeGlowIntensity: 0.75,
      jawOffsetPx: 2,
      mandibleAngleDeg: 2,
      coreFrequencyHz: 45,
      redChannelHex: '#dc2626',
    };
  }

  if (!isSpeaking && state === 'computing') {
    return {
      eyeGlowIntensity: 0.9,
      jawOffsetPx: 3,
      mandibleAngleDeg: 4,
      coreFrequencyHz: 90,
      redChannelHex: '#ef4444',
    };
  }

  // Active speaking mode driven by audio envelope
  const eyeIntensity = Math.min(1.0, 0.6 + clampedAudio * 0.4);
  const jawOffset = Math.round(clampedAudio * 24); // up to 24px jaw drop
  const mandibleAngle = Math.round(clampedAudio * 12); // up to 12 degrees out
  const coreFreq = Math.round(30 + clampedAudio * 80);

  return {
    eyeGlowIntensity: eyeIntensity,
    jawOffsetPx: jawOffset,
    mandibleAngleDeg: mandibleAngle,
    coreFrequencyHz: coreFreq,
    redChannelHex: clampedAudio > 0.5 ? '#ff1e1e' : '#e11d48',
  };
}

/**
 * Assesses threat condition for Kali Linux cyber dashboard
 */
export function assessThreatLevel(
  openSockets: number,
  memPct: number,
  suspiciousEvents: number
): { level: 'NOMINAL' | 'ELEVATED' | 'HIGH' | 'CRITICAL'; color: string; advice: string } {
  if (suspiciousEvents > 3 || openSockets > 80) {
    return {
      level: 'CRITICAL',
      color: '#ef4444',
      advice: 'Multiple unvetted sockets detected. Sever external interface or initiate packet dump.',
    };
  }
  if (suspiciousEvents > 0 || openSockets > 40 || memPct > 85) {
    return {
      level: 'HIGH',
      color: '#f97316',
      advice: 'Elevated socket activity and high telemetry burden. Monitor iptables rules.',
    };
  }
  if (openSockets > 15 || memPct > 65) {
    return {
      level: 'ELEVATED',
      color: '#eab308',
      advice: 'Moderate system throughput. Background scanning thread active.',
    };
  }
  return {
    level: 'NOMINAL',
    color: '#22c55e',
    advice: 'Perimeter secure. Kali neural daemon running smoothly.',
  };
}

/**
 * Formats a background security telemetry event
 */
export function formatSecurityLog(message: string, type: 'INFO' | 'ALERT' | 'SYSTEM' = 'INFO'): string {
  const time = new Date().toTimeString().split(' ')[0];
  const tag = `[ULTRON::${type}]`;
  return `${time} ${tag.padEnd(16, ' ')} ${message}`;
}
