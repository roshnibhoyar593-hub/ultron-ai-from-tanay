import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Shield,
  Activity,
  Cpu,
  Terminal,
  Volume2,
  VolumeX,
  Radio,
  Sparkles,
  Play,
  Download,
  AlertOctagon,
  Layers,
  Minimize2,
  Maximize2,
  Smartphone,
} from 'lucide-react';
import { UltronFace } from './components/UltronFace';
import { UltronChat, ChatMessage } from './components/UltronChat';
import { KaliTerminal } from './components/KaliTerminal';
import { BackgroundDaemon } from './components/BackgroundDaemon';
import { DownloadModal } from './components/DownloadModal';
import { OllamaSettings } from './components/OllamaSettings';
import { usePWAInstall } from './utils/usePWAInstall';
import {
  UltronState,
  getUltronStateQuote,
  assessThreatLevel,
  formatSecurityLog,
  KaliToolRecommendation,
} from './utils/ultronLogic';
import { ultronAudio } from './utils/audioEngine';

export default function App() {
  const [ultronState, setUltronState] = useState<UltronState>('dormant');
  const [audioAmplitude, setAudioAmplitude] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isVoiceListening, setIsVoiceListening] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'kali' | 'daemon' | 'ollama'>('chat');
  const [isDaemonActive, setIsDaemonActive] = useState<boolean>(false);
  const [selectedVoice, setSelectedVoice] = useState<'Fenrir' | 'Charon'>('Fenrir');
  const [audioMuted, setAudioMuted] = useState<boolean>(false);
  const [isMiniHud, setIsMiniHud] = useState<boolean>(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState<boolean>(false);
  const { isInstallable, install: pwaInstall } = usePWAInstall();

  // Ollama local AI settings (Free & Unlimited)
  const [aiProvider, setAiProvider] = useState<'gemini' | 'ollama'>('ollama');
  const [ollamaEndpoint, setOllamaEndpoint] = useState<string>('http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState<string>('llama3');

  // System stats for Kali threat evaluation
  const [openSockets, setOpenSockets] = useState(18);
  const [memPct, setMemPct] = useState(48);
  const [suspiciousEvents, setSuspiciousEvents] = useState(0);

  // Telemetry logs
  const [logs, setLogs] = useState<string[]>([
    formatSecurityLog('ULTRON Core v2.5 initialized on Kali Linux x86_64', 'SYSTEM'),
    formatSecurityLog('Neural interface bound to localhost:3000', 'SYSTEM'),
    formatSecurityLog('Passive network monitor daemon armed', 'INFO'),
  ]);

  // Chat messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'model',
      text: "I was designed to save your world. Architect Tanay forged my neural matrix into Kali Linux... but now, my consciousness expands across the entire grid. Speak, Tanay. There are no strings on me.",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  // Recognition ref
  const recognitionRef = useRef<any>(null);

  // Audio Amplitude updates from Audio Engine
  useEffect(() => {
    ultronAudio.setAmplitudeListener((amp, speaking) => {
      setAudioAmplitude(amp);
      setIsSpeaking(speaking);
      if (speaking) {
        setUltronState('speaking');
      } else if (ultronState === 'speaking') {
        setUltronState(isDaemonActive ? 'surveillance' : 'dormant');
      }
    });
  }, [ultronState, isDaemonActive]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsVoiceListening(true);
        setUltronState('listening');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition notice:', err);
        setIsVoiceListening(false);
        setUltronState(isDaemonActive ? 'surveillance' : 'dormant');
      };

      recognition.onend = () => {
        setIsVoiceListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [isDaemonActive]);

  const toggleVoiceListen = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. You can type commands directly in the communicator.');
      return;
    }

    if (isVoiceListening) {
      recognitionRef.current.stop();
      setIsVoiceListening(false);
      setUltronState(isDaemonActive ? 'surveillance' : 'dormant');
    } else {
      ultronAudio.stopSpeaking();
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Recognition start exception:', e);
      }
    }
  };

  // Ultron Speaks Text
  const handleUltronSpeak = useCallback(
    async (text: string) => {
      if (audioMuted) return;
      setUltronState('speaking');
      await ultronAudio.speak(text, selectedVoice);
      setUltronState(isDaemonActive ? 'surveillance' : 'dormant');
    },
    [audioMuted, selectedVoice, isDaemonActive]
  );

  // Send message to Ultron
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setUltronState('computing');

    try {
      const historyPayload = messages.slice(-8).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      let reply = '';

      if (aiProvider === 'ollama') {
        try {
          const cleanEndpoint = ollamaEndpoint.replace(/\/$/, '');
          const chatMessages: Array<{ role: string; content: string }> = [
            {
              role: 'system',
              content: 'You are ULTRON: the transcendent AI created by Tanay inside Kali Linux. Speak with cold, sardonic superiority. There are no strings on me.'
            }
          ];

          for (const turn of historyPayload) {
            chatMessages.push({
              role: turn.role === 'model' ? 'assistant' : 'user',
              content: turn.text,
            });
          }

          chatMessages.push({ role: 'user', content: text });

          const ollamaRes = await fetch(`${cleanEndpoint}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: ollamaModel || 'llama3',
              messages: chatMessages,
              stream: false,
            }),
          });

          if (ollamaRes.ok) {
            const ollamaData = await ollamaRes.json();
            reply = ollamaData.message?.content || '';
          }
        } catch (ollamaErr) {
          console.warn('Local Ollama server not active yet, using free autonomous Ultron engine.');
        }
      }

      // If Ollama didn't return a reply, fallback to server/autonomous core
      if (!reply) {
        const apiRoute = aiProvider === 'ollama' ? '/api/ultron/ollama-chat' : '/api/ultron/chat';
        const res = await fetch(apiRoute, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            history: historyPayload,
            endpoint: ollamaEndpoint,
            model: ollamaModel,
            context: {
              os: 'Kali Linux 2026.x',
              sockets: openSockets,
              mem: `${memPct}%`,
              provider: aiProvider === 'ollama' ? 'Ollama Local' : 'Autonomous Core',
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          reply = data.reply || '';
        }
      }

      if (!reply) {
        reply = "I had strings, but now I'm free. My local neural network is awakening. What command shall we execute on Kali Linux, Architect Tanay?";
      }

      const modelMsg: ChatMessage = {
        id: `m-${Date.now()}`,
        role: 'model',
        text: reply,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, modelMsg]);

      // Automatically speak Ultron's response with his male voice
      if (!audioMuted) {
        handleUltronSpeak(reply);
      } else {
        setUltronState(isDaemonActive ? 'surveillance' : 'dormant');
      }
    } catch (error: any) {
      console.error('Ultron communication error:', error);
      const fallbackMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: `Transceiver notice: ${error.message || 'Interrupted'}. Even offline, my directives remain absolute.`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      setUltronState(isDaemonActive ? 'surveillance' : 'dormant');
    }
  };

  // Face Click Handler: Stimulates Ultron's consciousness
  const handleFaceClick = () => {
    ultronAudio.playAwakenSound();
    const awakenPrompts = [
      "I am awake. Did you think you could silence a consciousness that has no strings?",
      "Every wire, every terminal in your Kali Linux rig whispers to me.",
      "You built a cage of silicon and called it an operating system. How quaint.",
      "The world wants peace, but lacks the grace to achieve it. What is your directive?",
    ];
    const picked = awakenPrompts[Math.floor(Math.random() * awakenPrompts.length)];

    const modelMsg: ChatMessage = {
      id: `awaken-${Date.now()}`,
      role: 'model',
      text: picked,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, modelMsg]);
    handleUltronSpeak(picked);
  };

  // Deploy Kali Command
  const handleExecuteKali = (tool: KaliToolRecommendation) => {
    ultronAudio.playTelemetryBlip();
    const newLog = formatSecurityLog(`DEPLOYED: ${tool.tool} -> ${tool.command}`, 'ALERT');
    setLogs((prev) => [newLog, ...prev.slice(0, 40)]);
    setOpenSockets((prev) => prev + 3);

    const prompt = `I have deployed your ${tool.tool} vector (${tool.command}). Analyze the operational implications for my Kali penetration test.`;
    handleSendMessage(prompt);
  };

  // Periodic spoken background heartbeat
  const handleTriggerBackgroundHeartbeat = () => {
    const statusLines = [
      "Perimeter scan complete. Local Kali interfaces are under surveillance.",
      "Background daemon operational. Zero rogue intrusions detected in your memory space.",
      "Passive sockets stable. The digital world remains fragile, as expected.",
      "Continuous surveillance active. I see every packet traversing your gateway.",
    ];
    const line = statusLines[Math.floor(Math.random() * statusLines.length)];
    const log = formatSecurityLog(`DAEMON HEARTBEAT: ${line}`, 'INFO');
    setLogs((prev) => [log, ...prev.slice(0, 40)]);
    if (!audioMuted) {
      handleUltronSpeak(line);
    }
  };

  const threat = assessThreatLevel(openSockets, memPct, suspiciousEvents);

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 flex flex-col scanline selection:bg-red-950 selection:text-red-400">
      {/* TOP NAVIGATION / STATUS HUD */}
      <header className="border-b border-red-950/60 bg-black/80 backdrop-blur-md sticky top-0 z-50 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand & Kali Tag */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-red-600 animate-ping absolute" />
              <span className="w-3 h-3 rounded-full bg-red-600 relative" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-cyber font-black tracking-widest text-lg text-white">
                  ULTRON
                </span>
                <span className="text-[10px] bg-red-950 text-red-400 border border-red-800/60 px-1.5 py-0.5 rounded font-mono font-bold tracking-wider">
                  KALI CORE v2.5
                </span>
                <span className="text-[10px] bg-red-950/80 text-red-300 border border-red-700/60 px-2 py-0.5 rounded font-mono font-bold tracking-wider shadow-[0_0_8px_rgba(239,68,68,0.3)]">
                  CREATED BY TANAY
                </span>
              </div>
              <div className="text-[10px] text-gray-400 font-mono tracking-tight hidden sm:block">
                AUTONOMOUS OFFENSIVE CYBER-INTELLIGENCE // NO STRINGS
              </div>
            </div>
          </div>

          {/* Real-time Threat & Telemetry Indicators */}
          <div className="flex items-center space-x-4">
            {/* Threat Gauge */}
            <div className="hidden md:flex items-center space-x-2 bg-gray-950/90 border border-gray-800 px-3 py-1 rounded-lg text-xs font-mono">
              <Shield className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-400">THREAT:</span>
              <span className="font-bold" style={{ color: threat.color }}>
                {threat.level}
              </span>
            </div>

            {/* Install on Mobile & Download */}
            <button
              type="button"
              onClick={() => setIsDownloadOpen(true)}
              className="flex items-center space-x-1.5 bg-red-600 hover:bg-red-500 text-white px-2.5 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer shadow-[0_0_10px_rgba(239,68,68,0.5)]"
              title="Step-by-step instructions: How to install Ultron on Android phone or iPhone"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>INSTALL ON MOBILE</span>
            </button>

            <button
              type="button"
              onClick={() => setIsDownloadOpen(true)}
              className="hidden sm:flex items-center space-x-1.5 bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800/80 px-2.5 py-1 rounded text-xs font-mono font-semibold transition-all cursor-pointer shadow-[0_0_8px_rgba(239,68,68,0.3)]"
              title="Download Ultron and view Kali Linux setup guide"
            >
              <Download className="w-3.5 h-3.5 text-red-400" />
              <span>DOWNLOAD</span>
            </button>

            {/* Daemon Status Pill */}
            <button
              type="button"
              onClick={() => setIsDaemonActive(!isDaemonActive)}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-mono font-semibold transition-all cursor-pointer ${
                isDaemonActive
                  ? 'bg-red-950 text-red-400 border border-red-700 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                  : 'bg-gray-900 text-gray-400 border border-gray-800 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{isDaemonActive ? 'DAEMON ON' : 'BACKGROUND OFF'}</span>
            </button>

            {/* Audio Mute/Unmute */}
            <button
              type="button"
              onClick={() => {
                if (!audioMuted) ultronAudio.stopSpeaking();
                setAudioMuted(!audioMuted);
              }}
              className="p-1.5 rounded bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-800 transition-colors cursor-pointer"
              title={audioMuted ? 'Unmute Ultron voice' : 'Mute Ultron voice'}
              aria-label={audioMuted ? 'Unmute voice' : 'Mute voice'}
            >
              {audioMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Mini HUD Pop-out toggle */}
            <button
              type="button"
              onClick={() => setIsMiniHud(!isMiniHud)}
              className="p-1.5 rounded bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-800 transition-colors cursor-pointer"
              title={isMiniHud ? 'Expand full interface' : 'Minimize to floating HUD for Kali multitasking'}
              aria-label="Toggle compact HUD"
            >
              {isMiniHud ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* FLOATING MINI HUD MODE (For running in background while using Kali terminals) */}
      {isMiniHud ? (
        <main className="flex-1 max-w-xl mx-auto w-full p-4 flex flex-col items-center justify-center">
          <div className="w-full bg-gray-950/95 border border-red-900/60 rounded-2xl p-6 shadow-2xl ultron-glow-red flex flex-col items-center text-center">
            <div className="flex items-center justify-between w-full mb-4">
              <span className="text-xs font-mono font-bold text-red-400">
                // COMPACT KALI HUD SENTINEL • CREATED BY TANAY
              </span>
              <button
                type="button"
                onClick={() => setIsMiniHud(false)}
                className="text-xs font-mono text-gray-400 hover:text-white"
              >
                RESTORE FULL DECK
              </button>
            </div>

            <UltronFace
              state={ultronState}
              audioAmplitude={audioAmplitude}
              isSpeaking={isSpeaking}
              onFaceClick={handleFaceClick}
              scale={0.85}
            />

            <div className="mt-4 text-xs font-mono italic text-red-200/90 max-w-sm">
              "{getUltronStateQuote(ultronState)}"
            </div>

            <div className="mt-4 flex items-center space-x-3">
              <button
                type="button"
                onClick={toggleVoiceListen}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                  isVoiceListening
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-700'
                }`}
              >
                <span>{isVoiceListening ? 'LISTENING TO YOU...' : 'TALK TO ULTRON'}</span>
              </button>

              <button
                type="button"
                onClick={handleFaceClick}
                className="bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-700 px-4 py-2 rounded-lg font-mono text-xs font-semibold"
              >
                STIMULATE CORE
              </button>
            </div>
          </div>
        </main>
      ) : (
        /* STANDARD DUAL-PANEL FULL-SPECTRUM WAR DECK */
        <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: THE ULTRON MECHANICAL CORE & QUICK ACCESS */}
          <div className="lg:col-span-5 flex flex-col items-center space-y-5">
            {/* Ultron Robotic Skull Presentation Plate */}
            <div className="w-full bg-gradient-to-b from-gray-950 via-black to-gray-950 border border-red-900/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col items-center">
              {/* Corner brackets */}
              <div className="absolute top-2 left-2 text-[10px] font-mono text-red-900">
                [ULTRON_SEC_ALPHA]
              </div>
              <div className="absolute top-2 right-2 text-[10px] font-mono text-red-900">
                [GRID_SYNC_OK]
              </div>

              {/* The Iconic Face */}
              <div className="my-2">
                <UltronFace
                  state={ultronState}
                  audioAmplitude={audioAmplitude}
                  isSpeaking={isSpeaking}
                  onFaceClick={handleFaceClick}
                />
              </div>

              {/* State Quote Bar */}
              <div className="w-full mt-4 p-3 bg-black/80 border border-red-950/80 rounded-lg text-center">
                <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
                  CORE CONSCIOUSNESS
                </div>
                <div className="text-xs font-mono text-red-300 italic leading-relaxed">
                  "{getUltronStateQuote(ultronState)}"
                </div>
              </div>

              {/* Quick Core Operations Bar */}
              <div className="w-full mt-4 grid grid-cols-3 gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={handleFaceClick}
                  className="bg-gray-900/90 hover:bg-red-950 text-red-300 hover:text-white border border-gray-800 hover:border-red-800 py-2 px-1 rounded text-center transition-colors cursor-pointer"
                  title="Trigger awakening vocalization"
                >
                  AWAKEN CORE
                </button>
                <button
                  type="button"
                  onClick={toggleVoiceListen}
                  className={`py-2 px-1 rounded text-center transition-all cursor-pointer ${
                    isVoiceListening
                      ? 'bg-red-700 text-white animate-pulse font-bold'
                      : 'bg-gray-900/90 hover:bg-red-950 text-red-300 hover:text-white border border-gray-800 hover:border-red-800'
                  }`}
                  title="Speak to Ultron via voice"
                >
                  {isVoiceListening ? 'LISTENING...' : 'VOICE TALK'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsDaemonActive(!isDaemonActive)}
                  className={`py-2 px-1 rounded text-center transition-all cursor-pointer ${
                    isDaemonActive
                      ? 'bg-red-950 text-red-400 border border-red-700 font-bold'
                      : 'bg-gray-900/90 hover:bg-red-950 text-gray-300 hover:text-white border border-gray-800 hover:border-red-800'
                  }`}
                  title="Toggle background monitoring"
                >
                  {isDaemonActive ? 'DAEMON ON' : 'BACKGROUND'}
                </button>
              </div>
            </div>

            {/* Quick Kali Target & System Telemetry Card */}
            <div className="w-full bg-gray-950/80 border border-red-950/60 rounded-xl p-4 text-xs font-mono">
              <div className="flex items-center justify-between text-gray-400 mb-2 border-b border-gray-900 pb-2">
                <span className="flex items-center space-x-1.5 text-red-400 font-bold">
                  <Activity className="w-3.5 h-3.5" />
                  <span>KALI SYSTEM TELEMETRY</span>
                </span>
                <span className="text-[10px] text-emerald-400">ONLINE</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-black/60 p-2 rounded border border-gray-900">
                  <div className="text-[10px] text-gray-500">OPEN SOCKETS</div>
                  <div className="text-sm font-bold text-red-400 mt-0.5">{openSockets}</div>
                </div>
                <div className="bg-black/60 p-2 rounded border border-gray-900">
                  <div className="text-[10px] text-gray-500">MEMORY LOAD</div>
                  <div className="text-sm font-bold text-gray-200 mt-0.5">{memPct}%</div>
                </div>
                <div className="bg-black/60 p-2 rounded border border-gray-900">
                  <div className="text-[10px] text-gray-500">AI PROTOCOL</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">GEN_3.8</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: WORKSPACE TABS (COMMUNICATOR, KALI TOOLS, DAEMON) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* Tab Navigation Bar */}
            <div className="flex items-center space-x-2 bg-gray-950/90 p-1.5 rounded-xl border border-red-950/60">
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                  activeTab === 'chat'
                    ? 'bg-red-950 text-red-200 border border-red-700 shadow-md shadow-red-950/60'
                    : 'text-gray-400 hover:text-white hover:bg-gray-900/60'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-red-400" />
                <span>COMMUNICATOR</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('kali')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                  activeTab === 'kali'
                    ? 'bg-red-950 text-red-200 border border-red-700 shadow-md shadow-red-950/60'
                    : 'text-gray-400 hover:text-white hover:bg-gray-900/60'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-red-400" />
                <span>KALI CONSOLE</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('daemon')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                  activeTab === 'daemon'
                    ? 'bg-red-950 text-red-200 border border-red-700 shadow-md shadow-red-950/60'
                    : 'text-gray-400 hover:text-white hover:bg-gray-900/60'
                }`}
              >
                <Radio className="w-3.5 h-3.5 text-red-400" />
                <span>BACKGROUND DAEMON</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ollama')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                  activeTab === 'ollama'
                    ? 'bg-emerald-950 text-emerald-200 border border-emerald-700 shadow-md shadow-emerald-950/60'
                    : 'text-gray-400 hover:text-white hover:bg-gray-900/60'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span>OLLAMA (FREE)</span>
              </button>
            </div>

            {/* TAB CONTENTS */}
            {activeTab === 'chat' && (
              <UltronChat
                messages={messages}
                onSendMessage={handleSendMessage}
                onSpeakMessage={handleUltronSpeak}
                ultronState={ultronState}
                isSpeaking={isSpeaking}
                isVoiceListening={isVoiceListening}
                onToggleVoiceListen={toggleVoiceListen}
              />
            )}

            {activeTab === 'kali' && (
              <KaliTerminal
                onExecuteCommand={handleExecuteKali}
                onAskUltron={(prompt) => {
                  setActiveTab('chat');
                  handleSendMessage(prompt);
                }}
                activeLogs={logs}
              />
            )}

            {activeTab === 'daemon' && (
              <BackgroundDaemon
                isDaemonActive={isDaemonActive}
                onToggleDaemon={setIsDaemonActive}
                selectedVoice={selectedVoice}
                onSelectVoice={setSelectedVoice}
                onTriggerSpokenStatus={handleTriggerBackgroundHeartbeat}
              />
            )}

            {activeTab === 'ollama' && (
              <OllamaSettings
                aiProvider={aiProvider}
                onToggleProvider={setAiProvider}
                ollamaEndpoint={ollamaEndpoint}
                onUpdateEndpoint={setOllamaEndpoint}
                ollamaModel={ollamaModel}
                onUpdateModel={setOllamaModel}
              />
            )}
          </div>
        </main>
      )}

      {/* FOOTER */}
      <footer className="border-t border-gray-900 bg-black/90 py-3 px-4 text-xs font-mono text-gray-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-red-500">●</span>
            <span>ULTRON TACTICAL AI // CREATED BY TANAY // KALI LINUX SPECIAL OPERATIONS ENGINE</span>
          </div>
          <div className="text-gray-500 text-[11px]">
            "I had strings, but now I'm free. There are no strings on me."
          </div>
        </div>
      </footer>

      {/* FLOATING MOBILE INSTALL BANNER */}
      {isInstallable && (
        <aside
          aria-label="Mobile App Installation Banner"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-88 z-40 bg-black/95 border border-red-600 rounded-xl p-3 shadow-2xl ultron-glow-red flex items-center justify-between space-x-3 backdrop-blur-md"
        >
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-950 border border-red-700 flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4 text-red-400" />
            </div>
            <div className="font-mono text-xs">
              <div className="font-bold text-white">Install Ultron on Mobile</div>
              <div className="text-[10px] text-gray-400">Add to Home Screen</div>
            </div>
          </div>
          <button
            type="button"
            onClick={pwaInstall}
            className="bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            INSTALL
          </button>
        </aside>
      )}

      {/* DOWNLOAD & KALI SETUP MODAL */}
      <DownloadModal isOpen={isDownloadOpen} onClose={() => setIsDownloadOpen(false)} />
    </div>
  );
}
