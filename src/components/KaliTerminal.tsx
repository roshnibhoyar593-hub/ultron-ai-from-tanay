import React, { useState } from 'react';
import { Terminal, Shield, Crosshair, Copy, Check, Play, Zap, AlertTriangle, FileCode } from 'lucide-react';
import { generateKaliCommand, KaliToolRecommendation } from '../utils/ultronLogic';

interface KaliTerminalProps {
  onExecuteCommand: (cmd: KaliToolRecommendation) => void;
  onAskUltron: (prompt: string) => void;
  activeLogs: string[];
}

const PRESET_OPERATIONS = [
  { label: 'Stealth Ghost Scan', query: 'stealth ghost scan', icon: Crosshair },
  { label: 'NSE Vuln Audit', query: 'vulnerability audit cve', icon: AlertTriangle },
  { label: 'Wi-Fi Air Surveillance', query: 'wifi air audit', icon: Zap },
  { label: 'Web Directory Fuzz', query: 'gobuster directory fuzz', icon: FileCode },
  { label: 'Hydra SSH Verification', query: 'hydra brute force', icon: Shield },
  { label: 'Deep Packet Inspection', query: 'packet sniff traffic', icon: Terminal },
];

export const KaliTerminal: React.FC<KaliTerminalProps> = ({
  onExecuteCommand,
  onAskUltron,
  activeLogs,
}) => {
  const [targetHost, setTargetHost] = useState('192.168.1.1/24');
  const [selectedOperation, setSelectedOperation] = useState('stealth ghost scan');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');

  const currentTool = generateKaliCommand(selectedOperation, targetHost);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleRun = () => {
    onExecuteCommand(currentTool);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    onAskUltron(customPrompt);
    setCustomPrompt('');
  };

  return (
    <div className="bg-gray-950/90 border border-red-900/40 rounded-xl p-4 flex flex-col h-full shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Background Cyber Watermark */}
      <div className="absolute right-2 -bottom-10 opacity-5 pointer-events-none select-none text-9xl font-black text-red-600 font-cyber">
        KALI
      </div>

      {/* Terminal Title Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-red-500" />
          <span className="font-cyber font-bold text-sm tracking-wider text-red-100">
            KALI OFFENSIVE TACTICAL CONSOLE
          </span>
          <span className="text-xs bg-red-950/80 text-red-400 border border-red-800/50 px-2 py-0.5 rounded font-mono">
            ROOT@ULTRON
          </span>
        </div>
        <div className="flex items-center space-x-1.5 text-xs text-gray-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>NETLINK SYNCED</span>
        </div>
      </div>

      {/* Preset Action Selector */}
      <div className="mt-3">
        <label className="text-xs font-mono text-gray-400 mb-1.5 block">
          OPERATIONAL PAYLOAD MODULES
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PRESET_OPERATIONS.map((preset) => {
            const Icon = preset.icon;
            const isSelected = selectedOperation === preset.query;
            return (
              <button
                key={preset.query}
                type="button"
                onClick={() => setSelectedOperation(preset.query)}
                className={`flex items-center space-x-2 text-left p-2 rounded border text-xs font-mono transition-all ${
                  isSelected
                    ? 'bg-red-950/70 border-red-600 text-red-200 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                    : 'bg-gray-900/60 border-gray-800 text-gray-300 hover:border-gray-700 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-red-400' : 'text-gray-400'}`} />
                <span className="truncate">{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Specifier */}
      <div className="mt-3 flex items-center space-x-2">
        <div className="flex-1">
          <label className="text-xs font-mono text-gray-400 block mb-1">
            TARGET VECTOR / IP / CIDR
          </label>
          <input
            type="text"
            value={targetHost}
            onChange={(e) => setTargetHost(e.target.value)}
            className="w-full bg-black/80 border border-gray-800 rounded px-3 py-1.5 text-xs font-mono text-red-300 focus:outline-none focus:border-red-600"
            placeholder="e.g. 192.168.1.1 or target.local"
          />
        </div>
        <div className="pt-4">
          <button
            type="button"
            onClick={handleRun}
            className="flex items-center space-x-1.5 bg-red-700 hover:bg-red-600 text-white text-xs px-4 py-2 rounded font-mono font-semibold transition-colors shadow-lg shadow-red-950/80 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>DEPLOY VECTOR</span>
          </button>
        </div>
      </div>

      {/* Active Tactical Tool Preview Box */}
      <div className="mt-3 bg-black/90 border border-red-950 rounded-lg p-3 relative group">
        <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
          <span className="text-red-400 font-bold flex items-center space-x-1">
            <span>TOOL:</span>
            <span className="text-gray-200">{currentTool.tool}</span>
          </span>
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
              currentTool.riskLevel === 'HIGH'
                ? 'bg-red-950 text-red-400 border border-red-700'
                : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
            }`}
          >
            {currentTool.riskLevel} IMPACT
          </span>
        </div>

        <p className="text-xs text-gray-400 mb-2 font-mono leading-relaxed">
          {currentTool.description}
        </p>

        {/* Executable Bash Command with copy button */}
        <div className="flex items-center justify-between bg-gray-900/80 border border-gray-800 rounded p-2 text-xs font-mono text-emerald-400">
          <code className="select-all overflow-x-auto whitespace-nowrap mr-2">
            $ {currentTool.command}
          </code>
          <button
            type="button"
            onClick={() => handleCopy(currentTool.command, 999)}
            className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800 transition-colors shrink-0"
            title="Copy command to clipboard for Kali Linux terminal"
          >
            {copiedIndex === 999 ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Live Cyber Telemetry Log Stream */}
      <div className="mt-3 flex-1 min-h-[120px] bg-black/95 border border-gray-900 rounded-lg p-2.5 font-mono text-xs overflow-y-auto max-h-44 space-y-1">
        <div className="text-[11px] text-gray-500 border-b border-gray-900 pb-1 mb-1">
          // KALI KERNEL TELEMETRY & SYSTEM SURVEILLANCE LOGS
        </div>
        {activeLogs.length === 0 ? (
          <div className="text-gray-600 italic">No network alerts logged yet. Perimeter quiet.</div>
        ) : (
          activeLogs.map((log, idx) => (
            <div
              key={idx}
              className={`leading-tight ${
                log.includes('ALERT') || log.includes('DANGER')
                  ? 'text-red-400'
                  : log.includes('WARN')
                  ? 'text-amber-400'
                  : 'text-gray-400'
              }`}
            >
              {log}
            </div>
          ))
        )}
      </div>

      {/* Direct Cyber Query Form to Ultron */}
      <form onSubmit={handleCustomSubmit} className="mt-3 flex space-x-2">
        <input
          type="text"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Ask Ultron for Kali exploit vectors, scripts, or bypass..."
          className="flex-1 bg-black/80 border border-gray-800 rounded px-3 py-2 text-xs font-mono text-white placeholder-gray-600 focus:outline-none focus:border-red-600"
        />
        <button
          type="submit"
          className="bg-gray-900 hover:bg-red-950 text-red-400 hover:text-red-200 border border-red-900 px-3 py-2 rounded text-xs font-mono font-bold transition-colors cursor-pointer"
        >
          QUERY
        </button>
      </form>
    </div>
  );
};
