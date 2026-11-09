import React, { useMemo } from 'react';
import { calculateFaceKinematics, UltronState } from '../utils/ultronLogic';

interface UltronFaceProps {
  state: UltronState;
  audioAmplitude: number; // 0.0 to 1.0
  isSpeaking: boolean;
  onFaceClick?: () => void;
  scale?: number;
}

export const UltronFace: React.FC<UltronFaceProps> = ({
  state,
  audioAmplitude,
  isSpeaking,
  onFaceClick,
  scale = 1,
}) => {
  const kinematics = useMemo(
    () => calculateFaceKinematics(audioAmplitude, isSpeaking, state),
    [audioAmplitude, isSpeaking, state]
  );

  // Dynamic eye glow calculations
  const glowOpacity = kinematics.eyeGlowIntensity;
  const eyeColor = kinematics.redChannelHex;
  const jawDrop = kinematics.jawOffsetPx;
  const mandibleDeg = kinematics.mandibleAngleDeg;

  return (
    <div
      onClick={onFaceClick}
      className="relative flex flex-col items-center justify-center cursor-pointer select-none group"
      style={{ transform: `scale(${scale})` }}
      title="ULTRON Prime Cybernetic Core - Click to stimulate neural nexus"
      role="button"
      tabIndex={0}
      aria-label="Ultron Cybernetic Core Face - Click to trigger awakening vocalization"
    >
      {/* Outer Cyber Radar & Energy Ring */}
      <div className="absolute w-84 h-84 md:w-96 md:h-96 rounded-full border border-red-950/40 pointer-events-none flex items-center justify-center">
        {/* Revolving Targeting Arc */}
        <div
          className={`absolute inset-0 rounded-full border-t border-r border-red-600/40 ${
            state === 'computing' || isSpeaking ? 'animate-radar' : 'opacity-30'
          }`}
        />
        {/* Subtle Inner Ring */}
        <div className="w-72 h-72 rounded-full border border-red-900/30 border-dashed" />
        {/* Cardinal calibration marks */}
        <div className="absolute top-0 w-2 h-0.5 bg-red-600/60" />
        <div className="absolute bottom-0 w-2 h-0.5 bg-red-600/60" />
        <div className="absolute left-0 w-0.5 h-2 bg-red-600/60" />
        <div className="absolute right-0 w-0.5 h-2 bg-red-600/60" />
      </div>

      {/* Atmospheric Crimson Glow Behind Skull */}
      <div
        className="absolute w-64 h-64 rounded-full blur-3xl pointer-events-none transition-all duration-300"
        style={{
          backgroundColor: eyeColor,
          opacity: isSpeaking ? 0.35 + audioAmplitude * 0.3 : 0.18,
          transform: `scale(${1 + audioAmplitude * 0.25})`,
        }}
      />

      {/* Ultron Authentic Mechanical Skull SVG */}
      <svg
        className="w-68 h-80 md:w-76 md:h-88 relative z-10 transition-transform duration-200 group-hover:scale-[1.02]"
        viewBox="0 0 320 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Metallic Armor Gradients */}
          <linearGradient id="metalDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1f242d" />
            <stop offset="50%" stopColor="#0f131a" />
            <stop offset="100%" stopColor="#07090c" />
          </linearGradient>

          <linearGradient id="metalPlate" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#374151" />
            <stop offset="35%" stopColor="#1e2430" />
            <stop offset="100%" stopColor="#111827" />
          </linearGradient>

          <linearGradient id="titaniumSheen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#111827" />
            <stop offset="30%" stopColor="#4b5563" />
            <stop offset="50%" stopColor="#9ca3af" />
            <stop offset="70%" stopColor="#374151" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          <linearGradient id="redCoreGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff2a2a" />
            <stop offset="60%" stopColor="#b91c1c" />
            <stop offset="100%" stopColor="#450a0a" />
          </linearGradient>

          {/* Eye Slit Filter */}
          <filter id="eyeGlowFilter" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="coreAura" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. CRANIUM & CRANIAL DOME */}
        <g id="cranium">
          {/* Main Head Base Shell */}
          <path
            d="M75 140 C60 80, 110 30, 160 30 C210 30, 260 80, 245 140 C240 165, 230 190, 220 215 L100 215 C90 190, 80 165, 75 140 Z"
            fill="url(#metalDark)"
            stroke="#374151"
            strokeWidth="2"
          />

          {/* Crown Forehead Plate */}
          <path
            d="M100 55 C125 40, 195 40, 220 55 L210 105 C185 95, 135 95, 110 105 Z"
            fill="url(#metalPlate)"
            stroke="#4b5563"
            strokeWidth="1.5"
          />

          {/* Central Neural Nexus / Crest */}
          <path
            d="M152 40 L168 40 L164 100 L156 100 Z"
            fill="#090d16"
            stroke="#ef4444"
            strokeWidth="1"
            opacity={0.8}
          />
          {/* Neural Core Jewel */}
          <polygon
            points="160,52 165,65 160,78 155,65"
            fill={eyeColor}
            filter="url(#coreAura)"
            opacity={glowOpacity}
          />

          {/* Lateral Brow Flanges */}
          <path
            d="M85 95 L115 110 L110 135 L80 120 Z"
            fill="url(#metalDark)"
            stroke="#374151"
            strokeWidth="1.2"
          />
          <path
            d="M235 95 L205 110 L210 135 L240 120 Z"
            fill="url(#metalDark)"
            stroke="#374151"
            strokeWidth="1.2"
          />

          {/* Mechanical Temple Hinges */}
          <circle cx="70" cy="155" r="14" fill="#111827" stroke="#4b5563" strokeWidth="2" />
          <circle cx="70" cy="155" r="6" fill="#030712" stroke={eyeColor} strokeWidth="1.5" />
          <circle cx="250" cy="155" r="14" fill="#111827" stroke="#4b5563" strokeWidth="2" />
          <circle cx="250" cy="155" r="6" fill="#030712" stroke={eyeColor} strokeWidth="1.5" />
        </g>

        {/* 2. BROW & EYE HOUSING (The Menacing Ultron Scowl) */}
        <g id="eyebrow_and_nose">
          {/* Fierce angled eyebrow plates */}
          <path
            d="M82 145 L150 162 L154 172 L92 160 Z"
            fill="url(#titaniumSheen)"
            stroke="#1f2937"
            strokeWidth="1.5"
          />
          <path
            d="M238 145 L170 162 L166 172 L228 160 Z"
            fill="url(#titaniumSheen)"
            stroke="#1f2937"
            strokeWidth="1.5"
          />

          {/* Glabella / Center bridge */}
          <polygon
            points="150,162 170,162 165,195 155,195"
            fill="url(#metalDark)"
            stroke="#4b5563"
            strokeWidth="1.2"
          />

          {/* Internal Eye Socket Cavities */}
          <path
            d="M96 168 L146 177 L138 190 L102 184 Z"
            fill="#050508"
            stroke="#262626"
            strokeWidth="1"
          />
          <path
            d="M224 168 L174 177 L182 190 L218 184 Z"
            fill="#050508"
            stroke="#262626"
            strokeWidth="1"
          />

          {/* ULTRON SIGNATURE RED GLOWING OPTRONIC EYES */}
          {/* Left Eye Slit */}
          <g filter="url(#eyeGlowFilter)">
            <path
              d="M102 174 L142 181 L136 185 L106 180 Z"
              fill={eyeColor}
              opacity={glowOpacity}
            />
            {/* Supercharged inner eye filament */}
            <line
              x1="106"
              y1="176"
              x2="138"
              y2="182"
              stroke="#ffffff"
              strokeWidth={isSpeaking ? 1.8 : 1.2}
              opacity={glowOpacity}
            />
          </g>

          {/* Right Eye Slit */}
          <g filter="url(#eyeGlowFilter)">
            <path
              d="M218 174 L178 181 L184 185 L214 180 Z"
              fill={eyeColor}
              opacity={glowOpacity}
            />
            {/* Supercharged inner eye filament */}
            <line
              x1="214"
              y1="176"
              x2="182"
              y2="182"
              stroke="#ffffff"
              strokeWidth={isSpeaking ? 1.8 : 1.2}
              opacity={glowOpacity}
            />
          </g>

          {/* Nasal intake / Midface structural plate */}
          <path
            d="M152 195 L168 195 L164 225 L156 225 Z"
            fill="url(#metalPlate)"
            stroke="#374151"
            strokeWidth="1"
          />
        </g>

        {/* 3. CHEEKS & MAXILLA */}
        <g id="cheeks">
          {/* Left Cheek Armor Flange */}
          <path
            d="M80 185 L135 200 L130 235 L75 210 Z"
            fill="url(#metalPlate)"
            stroke="#374151"
            strokeWidth="1.5"
          />
          {/* Right Cheek Armor Flange */}
          <path
            d="M240 185 L185 200 L190 235 L245 210 Z"
            fill="url(#metalPlate)"
            stroke="#374151"
            strokeWidth="1.5"
          />

          {/* Cheek Ventilation Slits with Red Underglow */}
          <line x1="88" y1="195" x2="115" y2="202" stroke={eyeColor} strokeWidth="1" opacity={glowOpacity * 0.7} />
          <line x1="86" y1="205" x2="110" y2="212" stroke={eyeColor} strokeWidth="1" opacity={glowOpacity * 0.7} />
          <line x1="232" y1="195" x2="205" y2="202" stroke={eyeColor} strokeWidth="1" opacity={glowOpacity * 0.7} />
          <line x1="234" y1="205" x2="210" y2="212" stroke={eyeColor} strokeWidth="1" opacity={glowOpacity * 0.7} />
        </g>

        {/* 4. INTERNAL MOUTH CAVITY & VOCAL CHAMBER (Fixed behind the moving jaw) */}
        <g id="vocalChamber">
          {/* Dark mouth throat recess */}
          <path
            d="M120 230 L200 230 L188 275 L132 275 Z"
            fill="#06080d"
            stroke="#1f242d"
            strokeWidth="1"
          />

          {/* Pulsing Red Vocal Energy Grille */}
          <g filter="url(#eyeGlowFilter)">
            {/* Glowing horizontal acoustic teeth/bars */}
            <line x1="128" y1="242" x2="192" y2="242" stroke={eyeColor} strokeWidth="2.5" opacity={glowOpacity} />
            <line x1="133" y1="252" x2="187" y2="252" stroke={eyeColor} strokeWidth="2.5" opacity={glowOpacity} />
            <line x1="138" y1="262" x2="182" y2="262" stroke={eyeColor} strokeWidth="2" opacity={glowOpacity * 0.8} />

            {/* Glowing vertical intake ribs */}
            <line x1="145" y1="236" x2="145" y2="268" stroke={eyeColor} strokeWidth="1.2" opacity={glowOpacity * 0.9} />
            <line x1="160" y1="234" x2="160" y2="270" stroke={eyeColor} strokeWidth="1.8" opacity={glowOpacity} />
            <line x1="175" y1="236" x2="175" y2="268" stroke={eyeColor} strokeWidth="1.2" opacity={glowOpacity * 0.9} />
          </g>
        </g>

        {/* 5. ARTICULATED MOVING MANDIBLES & JAW (Synchronized with speech audio!) */}
        <g
          id="articulatedJaw"
          style={{
            transform: `translateY(${jawDrop}px)`,
            transition: 'transform 0.06s ease-out',
          }}
        >
          {/* Left Lateral Mandible Wing (flares out as audio peaks) */}
          <g
            style={{
              transform: `rotate(${-mandibleDeg}deg)`,
              transformOrigin: '95px 245px',
              transition: 'transform 0.06s ease-out',
            }}
          >
            <path
              d="M90 230 L132 245 L125 295 L80 270 Z"
              fill="url(#metalPlate)"
              stroke="#374151"
              strokeWidth="1.5"
            />
            {/* Servo Joint */}
            <circle cx="95" cy="245" r="5" fill="#111827" stroke="#6b7280" strokeWidth="1.5" />
          </g>

          {/* Right Lateral Mandible Wing */}
          <g
            style={{
              transform: `rotate(${mandibleDeg}deg)`,
              transformOrigin: '225px 245px',
              transition: 'transform 0.06s ease-out',
            }}
          >
            <path
              d="M230 230 L188 245 L195 295 L240 270 Z"
              fill="url(#metalPlate)"
              stroke="#374151"
              strokeWidth="1.5"
            />
            {/* Servo Joint */}
            <circle cx="225" cy="245" r="5" fill="#111827" stroke="#6b7280" strokeWidth="1.5" />
          </g>

          {/* Central Chin & Lower Jaw Armor Matrix */}
          <path
            d="M125 245 L195 245 L180 320 L160 335 L140 320 Z"
            fill="url(#titaniumSheen)"
            stroke="#4b5563"
            strokeWidth="2"
          />

          {/* Chin Split Ingot & Red Line */}
          <path
            d="M157 265 L163 265 L162 328 L158 328 Z"
            fill="#0b0f19"
            stroke={eyeColor}
            strokeWidth="0.8"
            opacity={glowOpacity}
          />

          {/* Lower Lip Hydraulic Segment */}
          <path
            d="M136 248 L184 248 L176 262 L144 262 Z"
            fill="url(#metalDark)"
            stroke="#374151"
            strokeWidth="1"
          />
        </g>

        {/* 6. NECK STRUTS & HYDRAULIC PISTONS */}
        <g id="neckHydraulics">
          <rect x="135" y="325" width="10" height="35" rx="3" fill="#1e293b" stroke="#334155" />
          <rect x="175" y="325" width="10" height="35" rx="3" fill="#1e293b" stroke="#334155" />
          <rect x="154" y="332" width="12" height="32" rx="4" fill="#0f172a" stroke="#475569" />
          {/* Hydraulic wires */}
          <path d="M110 320 C115 345, 125 355, 140 365" stroke="#7f1d1d" strokeWidth="2" fill="none" opacity={0.6} />
          <path d="M210 320 C205 345, 195 355, 180 365" stroke="#7f1d1d" strokeWidth="2" fill="none" opacity={0.6} />
        </g>
      </svg>

      {/* Dynamic Status HUD Readout Below Face */}
      <div className="mt-3 flex items-center space-x-3 text-xs tracking-wider font-mono">
        <span className="flex items-center space-x-1.5 bg-black/60 px-2.5 py-1 rounded border border-red-900/40">
          <span
            className="w-2 h-2 rounded-full transition-colors duration-200"
            style={{
              backgroundColor: eyeColor,
              boxShadow: `0 0 8px ${eyeColor}`,
            }}
          />
          <span className="text-gray-300 uppercase font-semibold">
            {state === 'speaking'
              ? 'VOCALIZING'
              : state === 'listening'
              ? 'ACOUSTIC RECEPTOR ACTIVE'
              : state === 'computing'
              ? 'NEURAL TRANSMISSION'
              : state === 'surveillance'
              ? 'STEALTH DAEMON RUNNING'
              : 'IDLE DORMANT CORE'}
          </span>
        </span>
        {isSpeaking && (
          <span className="text-red-400 font-bold animate-pulse">
            {(audioAmplitude * 100).toFixed(0)}% AMPLITUDE
          </span>
        )}
      </div>
    </div>
  );
};
