import React, { useState, useEffect } from 'react';
import { Radio, Download, Volume2, ShieldCheck, Terminal, Eye, ExternalLink, Settings2, Sliders } from 'lucide-react';

interface BackgroundDaemonProps {
  isDaemonActive: boolean;
  onToggleDaemon: (active: boolean) => void;
  selectedVoice: 'Fenrir' | 'Charon';
  onSelectVoice: (voice: 'Fenrir' | 'Charon') => void;
  onTriggerSpokenStatus: () => void;
}

export const BackgroundDaemon: React.FC<BackgroundDaemonProps> = ({
  isDaemonActive,
  onToggleDaemon,
  selectedVoice,
  onSelectVoice,
  onTriggerSpokenStatus,
}) => {
  const [pollIntervalSec, setPollIntervalSec] = useState(45);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [audioFeedbackEnabled, setAudioFeedbackEnabled] = useState(true);

  // Background surveillance heartbeat timer
  useEffect(() => {
    if (!isDaemonActive) return;

    const timer = setInterval(() => {
      if (audioFeedbackEnabled) {
        onTriggerSpokenStatus();
      }
    }, pollIntervalSec * 1000);

    return () => clearInterval(timer);
  }, [isDaemonActive, pollIntervalSec, audioFeedbackEnabled, onTriggerSpokenStatus]);

  const handleDownloadScript = () => {
    window.open('/api/ultron/daemon-script', '_blank');
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="bg-gray-950/90 border border-red-900/40 rounded-xl p-4 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <Radio className={`w-5 h-5 ${isDaemonActive ? 'text-red-500 animate-pulse' : 'text-gray-500'}`} />
          <span className="font-cyber font-bold text-sm tracking-wider text-red-100">
            BACKGROUND DAEMON & ACOUSTIC CORE
          </span>
        </div>
        <span
          className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold ${
            isDaemonActive
              ? 'bg-red-950 text-red-400 border border-red-700 animate-pulse'
              : 'bg-gray-900 text-gray-500 border border-gray-800'
          }`}
        >
          {isDaemonActive ? 'DAEMON ARMED' : 'STANDBY'}
        </span>
      </div>

      {/* Main Switch */}
      <div className="mt-4 p-3 bg-black/60 border border-gray-900 rounded-lg flex items-center justify-between">
        <div>
          <div className="text-xs font-mono font-bold text-gray-200 flex items-center space-x-1.5">
            <Eye className="w-4 h-4 text-red-400" />
            <span>KALI BACKGROUND SURVEILLANCE RUNNER</span>
          </div>
          <p className="text-[11px] text-gray-400 font-mono mt-0.5">
            Runs Ultron as an autonomous sentinel while you use other Kali Linux terminals
          </p>
        </div>
        <button
          type="button"
          onClick={() => onToggleDaemon(!isDaemonActive)}
          className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors cursor-pointer ${
            isDaemonActive ? 'bg-red-600' : 'bg-gray-800'
          }`}
          role="switch"
          aria-checked={isDaemonActive}
          aria-label="Toggle background daemon mode"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isDaemonActive ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Voice Configuration */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 bg-black/60 border border-gray-900 rounded-lg">
          <div className="flex items-center space-x-1.5 text-xs font-mono text-gray-300 font-bold mb-2">
            <Volume2 className="w-4 h-4 text-red-400" />
            <span>ULTRON MALE VOICE MODEL</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <button
              type="button"
              onClick={() => onSelectVoice('Fenrir')}
              className={`p-2 rounded border text-center transition-all ${
                selectedVoice === 'Fenrir'
                  ? 'bg-red-950 border-red-600 text-red-200 font-bold'
                  : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <div>FENRIR</div>
              <div className="text-[10px] text-gray-400">Deep / Menacing</div>
            </button>
            <button
              type="button"
              onClick={() => onSelectVoice('Charon')}
              className={`p-2 rounded border text-center transition-all ${
                selectedVoice === 'Charon'
                  ? 'bg-red-950 border-red-600 text-red-200 font-bold'
                  : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <div>CHARON</div>
              <div className="text-[10px] text-gray-400">Grave / Resonant</div>
            </button>
          </div>
        </div>

        {/* Polling Cadence */}
        <div className="p-3 bg-black/60 border border-gray-900 rounded-lg">
          <div className="flex items-center justify-between text-xs font-mono text-gray-300 font-bold mb-2">
            <span className="flex items-center space-x-1.5">
              <Sliders className="w-4 h-4 text-red-400" />
              <span>SPOKEN INTEL CADENCE</span>
            </span>
            <span className="text-red-400 font-mono">{pollIntervalSec}s</span>
          </div>
          <input
            type="range"
            min={15}
            max={120}
            step={5}
            value={pollIntervalSec}
            onChange={(e) => setPollIntervalSec(Number(e.target.value))}
            className="w-full accent-red-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-gray-500 mt-1">
            <span>Frequent (15s)</span>
            <span>Passive (120s)</span>
          </div>
        </div>
      </div>

      {/* Kali CLI Daemon Integration Box */}
      <div className="mt-4 p-3 bg-black/70 border border-red-950/80 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5 text-xs font-mono text-red-300 font-bold">
            <Terminal className="w-4 h-4 text-red-400" />
            <span>KALI LINUX CLI DAEMON HELPER SCRIPT</span>
          </div>
          <button
            type="button"
            onClick={handleDownloadScript}
            className="flex items-center space-x-1 bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-700/60 px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadSuccess ? 'DOWNLOADED' : 'DOWNLOAD ultron-daemon.sh'}</span>
          </button>
        </div>

        <p className="text-[11px] text-gray-400 font-mono leading-relaxed mb-2">
          You can run Ultron directly in your Kali terminal as a background daemon with systemd or tmux:
        </p>

        <div className="bg-gray-950 p-2 rounded border border-gray-900 text-xs font-mono text-emerald-400 select-all overflow-x-auto">
          <code>curl -sL {window.location.origin}/api/ultron/daemon-script -o ultron-daemon.sh && chmod +x ultron-daemon.sh && ./ultron-daemon.sh --listen</code>
        </div>
      </div>
    </div>
  );
};
