import React, { useState } from 'react';
import { Cpu, Server, Check, RefreshCw, AlertCircle, Zap } from 'lucide-react';

interface OllamaSettingsProps {
  ollamaEndpoint: string;
  onUpdateEndpoint: (endpoint: string) => void;
  ollamaModel: string;
  onUpdateModel: (model: string) => void;
}

export const OllamaSettings: React.FC<OllamaSettingsProps> = ({
  ollamaEndpoint,
  onUpdateEndpoint,
  ollamaModel,
  onUpdateModel,
}) => {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [modelsList, setModelsList] = useState<string[]>([]);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const cleanEndpoint = ollamaEndpoint.trim().replace(/\/$/, '');
      if (!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(cleanEndpoint)) {
        throw new Error('Use localhost:11434 for Ollama running on this computer.');
      }
      const res = await fetch(`${cleanEndpoint}/api/tags`);
      if (!res.ok) throw new Error(`Ollama returned HTTP ${res.status}`);
      const data = await res.json();
      const names = Array.isArray(data.models) ? data.models.map((m: any) => m.name).filter(Boolean) : [];
      setModelsList(names);
      setTestResult({
        success: true,
        message: names.length
          ? `Connected. Installed models: ${names.join(', ')}`
          : 'Ollama is running, but no models are installed. Run: ollama pull llama3.2',
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Connection failed: ${err.message || 'Start Ollama and allow this website origin in OLLAMA_ORIGINS.'}`,
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-gray-950/90 border border-red-900/40 rounded-xl p-4 shadow-2xl backdrop-blur-md space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-red-500" />
          <span className="font-cyber font-bold text-sm tracking-wider text-red-100">
            OLLAMA LOCAL AI
          </span>
        </div>
        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-700">
          OLLAMA ONLY
        </span>
      </div>

      <div className="p-3 bg-black/60 border border-gray-900 rounded-lg">
        <div className="text-xs font-mono font-bold text-gray-200">LOCAL AI ENGINE</div>
        <p className="text-[11px] text-gray-400 font-mono mt-1">
          ULTRON uses Ollama on this computer. No Gemini API key or cloud AI account is used.
        </p>
      </div>

      <div className="p-3 bg-black/80 border border-emerald-950 rounded-lg space-y-3 font-mono text-xs">
        <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
          <Server className="w-4 h-4" />
          <span>LOCAL OLLAMA CONNECTION</span>
        </div>
        <div>
          <label className="text-[11px] text-gray-400 block mb-1">OLLAMA API ENDPOINT</label>
          <input
            type="text"
            value={ollamaEndpoint}
            onChange={(e) => onUpdateEndpoint(e.target.value)}
            className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-emerald-300 font-mono focus:outline-none focus:border-emerald-600"
            placeholder="http://localhost:11434"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">MODEL (DEFAULT: llama3.2)</label>
            <input
              type="text"
              value={ollamaModel}
              onChange={(e) => onUpdateModel(e.target.value)}
              className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-emerald-300 font-mono focus:outline-none focus:border-emerald-600"
              placeholder="llama3.2"
              list="ollama-model-options"
            />
            <datalist id="ollama-model-options">
              {modelsList.map((model) => <option key={model} value={model} />)}
            </datalist>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing}
              className="w-full bg-emerald-800 hover:bg-emerald-700 disabled:bg-gray-800 text-white font-bold py-2 px-3 rounded transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              <span>{testing ? 'TESTING...' : 'TEST CONNECTION'}</span>
            </button>
          </div>
        </div>

        {testResult && (
          <div className={`p-2.5 rounded border text-[11px] flex items-start space-x-2 ${testResult.success ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-red-950/60 border-red-800 text-red-300'}`}>
            {testResult.success ? <Check className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
            <div>{testResult.message}</div>
          </div>
        )}

        <div className="p-2.5 bg-gray-900/60 border border-gray-800 rounded text-[10px] text-gray-400 space-y-1">
          <div className="font-bold text-gray-300">Setup on Linux / Kali:</div>
          <div>1. Install Ollama from <span className="text-emerald-400">ollama.com/download</span></div>
          <div>2. Download a model: <code className="text-emerald-400">ollama pull llama3.2</code></div>
          <div>3. Start Ollama: <code className="text-emerald-400">ollama serve</code></div>
          <div>4. Allow this app's exact origin in <code className="text-emerald-400">OLLAMA_ORIGINS</code>. Avoid wildcard origins on public computers.</div>
        </div>
      </div>
    </div>
  );
};
