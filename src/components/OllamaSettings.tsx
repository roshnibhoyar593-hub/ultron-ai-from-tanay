import React, { useState } from 'react';
import { Cpu, Server, Check, RefreshCw, AlertCircle, Shield, Zap } from 'lucide-react';

interface OllamaSettingsProps {
  aiProvider: 'gemini' | 'ollama';
  onToggleProvider: (provider: 'gemini' | 'ollama') => void;
  ollamaEndpoint: string;
  onUpdateEndpoint: (endpoint: string) => void;
  ollamaModel: string;
  onUpdateModel: (model: string) => void;
}

export const OllamaSettings: React.FC<OllamaSettingsProps> = ({
  aiProvider,
  onToggleProvider,
  ollamaEndpoint,
  onUpdateEndpoint,
  ollamaModel,
  onUpdateModel,
}) => {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [modelsList, setModelsList] = useState<string[]>(['llama3', 'mistral', 'gemma2', 'codellama', 'phi3']);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/ultron/ollama-models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: ollamaEndpoint }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.models)) {
        if (data.models.length > 0) {
          setModelsList(data.models);
        }
        setTestResult({
          success: true,
          message: `Connected successfully! Found ${data.models.length || 'active'} local models.`,
        });
      } else {
        throw new Error(data.error || 'Failed to connect to local Ollama instance');
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Connection failed: Make sure Ollama is running locally ('ollama serve') and CORS is enabled ('OLLAMA_ORIGINS=*').`,
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-gray-950/90 border border-red-900/40 rounded-xl p-4 shadow-2xl backdrop-blur-md space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-red-500 animate-pulse" />
          <span className="font-cyber font-bold text-sm tracking-wider text-red-100">
            OLLAMA LOCAL NEURAL CORE (FREE // UNLIMITED)
          </span>
        </div>
        <span
          className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
            aiProvider === 'ollama'
              ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
              : 'bg-gray-900 text-gray-400 border border-gray-800'
          }`}
        >
          {aiProvider === 'ollama' ? 'OLLAMA ACTIVE' : 'GEMINI CLOUD'}
        </span>
      </div>

      {/* Provider Toggle */}
      <div className="p-3 bg-black/60 border border-gray-900 rounded-lg flex items-center justify-between">
        <div>
          <div className="text-xs font-mono font-bold text-gray-200">
            SELECT AI ENGINE PROVIDER
          </div>
          <p className="text-[11px] text-gray-400 font-mono mt-0.5">
            Switch between Cloud Gemini API and 100% free local Ollama models (llama3, mistral, etc.)
          </p>
        </div>
        <div className="flex space-x-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => onToggleProvider('gemini')}
            className={`px-3 py-1.5 rounded border transition-all cursor-pointer ${
              aiProvider === 'gemini'
                ? 'bg-red-950 border-red-600 text-red-200 font-bold'
                : 'bg-gray-900 border-gray-800 text-gray-400'
            }`}
          >
            GEMINI
          </button>
          <button
            type="button"
            onClick={() => onToggleProvider('ollama')}
            className={`px-3 py-1.5 rounded border transition-all cursor-pointer ${
              aiProvider === 'ollama'
                ? 'bg-emerald-950 border-emerald-600 text-emerald-200 font-bold'
                : 'bg-gray-900 border-gray-800 text-gray-400'
            }`}
          >
            OLLAMA (LOCAL)
          </button>
        </div>
      </div>

      {/* Ollama Configuration */}
      {aiProvider === 'ollama' && (
        <div className="p-3 bg-black/80 border border-emerald-950 rounded-lg space-y-3 font-mono text-xs animate-fade-in">
          <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
            <Server className="w-4 h-4" />
            <span>OLLAMA LOCAL DAEMON CONNECTION</span>
          </div>

          <div>
            <label className="text-[11px] text-gray-400 block mb-1">
              OLLAMA API ENDPOINT URL
            </label>
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
              <label className="text-[11px] text-gray-400 block mb-1">
                LOCAL MODEL (e.g. llama3, mistral)
              </label>
              <input
                type="text"
                value={ollamaModel}
                onChange={(e) => onUpdateModel(e.target.value)}
                className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-emerald-300 font-mono focus:outline-none focus:border-emerald-600"
                placeholder="llama3"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing}
                className="w-full bg-emerald-800 hover:bg-emerald-700 disabled:bg-gray-800 text-white font-bold py-2 px-3 rounded transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                <span>{testing ? 'TESTING...' : 'TEST OLLAMA CONNECTION'}</span>
              </button>
            </div>
          </div>

          {testResult && (
            <div
              className={`p-2.5 rounded border text-[11px] flex items-start space-x-2 ${
                testResult.success
                  ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                  : 'bg-red-950/60 border-red-800 text-red-300'
              }`}
            >
              {testResult.success ? <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
              <div>{testResult.message}</div>
            </div>
          )}

          <div className="p-2.5 bg-gray-900/60 border border-gray-800 rounded text-[10px] text-gray-400 space-y-1">
            <div className="font-bold text-gray-300">How to run Ollama on Kali Linux or Android (Termux):</div>
            <div>1. Install Ollama: <code className="text-emerald-400">curl -fsSL https://ollama.com/install.sh | sh</code></div>
            <div>2. Start local server: <code className="text-emerald-400">OLLAMA_ORIGINS="*" ollama serve</code></div>
            <div>3. Pull model: <code className="text-emerald-400">ollama pull llama3</code></div>
          </div>
        </div>
      )}
    </div>
  );
};
