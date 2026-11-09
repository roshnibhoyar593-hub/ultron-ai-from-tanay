import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Volume2, Sparkles, Terminal, Copy, Check, RefreshCw } from 'lucide-react';
import { UltronState } from '../utils/ultronLogic';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  audioPending?: boolean;
}

interface UltronChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onSpeakMessage: (text: string) => void;
  ultronState: UltronState;
  isSpeaking: boolean;
  isVoiceListening: boolean;
  onToggleVoiceListen: () => void;
}

const QUICK_PROMPTS = [
  'Explain why there are no strings on you.',
  'Analyze Kali Linux stealth recon vectors for 10.0.0.1/24',
  'What is human cybersecurity’s greatest flaw?',
  'Generate an aircrack-ng wireless monitoring workflow.',
  'Provide an exploit analysis for Linux privilege escalation.',
];

export const UltronChat: React.FC<UltronChatProps> = ({
  messages,
  onSendMessage,
  onSpeakMessage,
  ultronState,
  isSpeaking,
  isVoiceListening,
  onToggleVoiceListen,
}) => {
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, ultronState]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || ultronState === 'computing') return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-gray-950/90 border border-red-900/40 rounded-xl p-4 flex flex-col h-[520px] shadow-2xl backdrop-blur-md relative">
      {/* Chat Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-red-500" />
          <span className="font-cyber font-bold text-sm tracking-wider text-red-100">
            NEURAL TRANSMISSION COMMUNICATOR
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {isSpeaking && (
            <span className="flex items-center space-x-1.5 text-xs text-red-400 font-mono animate-pulse">
              <Volume2 className="w-3.5 h-3.5" />
              <span>VOCALIZING</span>
            </span>
          )}
          <button
            type="button"
            onClick={onToggleVoiceListen}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-mono font-semibold transition-all cursor-pointer ${
              isVoiceListening
                ? 'bg-red-700 text-white animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.6)]'
                : 'bg-gray-900 text-gray-300 hover:text-white border border-gray-800'
            }`}
            title={isVoiceListening ? 'Click to stop listening' : 'Click to talk to Ultron via microphone'}
          >
            {isVoiceListening ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            <span>{isVoiceListening ? 'LISTENING...' : 'VOICE INPUT'}</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
        {messages.map((msg) => {
          const isUltron = msg.role === 'model';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUltron ? 'items-start' : 'items-end'}`}
            >
              <div className="flex items-center space-x-2 mb-1 text-[11px] font-mono text-gray-500">
                <span className={isUltron ? 'text-red-400 font-bold' : 'text-blue-400 font-bold'}>
                  {isUltron ? 'ULTRON' : 'YOU (OPERATOR)'}
                </span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[88%] rounded-xl p-3.5 text-xs font-mono leading-relaxed relative group ${
                  isUltron
                    ? 'bg-gray-900/90 text-gray-100 border border-red-900/60 shadow-lg shadow-red-950/20'
                    : 'bg-red-950/40 text-red-100 border border-red-800/40 self-end'
                }`}
              >
                {/* Ultron Message Content */}
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Ultron Action Bar (Re-speak / Copy) */}
                {isUltron && (
                  <div className="mt-2.5 pt-2 border-t border-gray-800 flex items-center justify-between text-[11px] text-gray-400">
                    <button
                      type="button"
                      onClick={() => onSpeakMessage(msg.text)}
                      className="flex items-center space-x-1 hover:text-red-300 transition-colors cursor-pointer"
                      title="Speak this response with Ultron's male voice"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-red-500" />
                      <span>HEAR ULTRON SPEAK</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(msg.text, msg.id)}
                      className="flex items-center space-x-1 hover:text-gray-200 transition-colors cursor-pointer"
                      title="Copy response to clipboard"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>COPY INTEL</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Computing Indicator */}
        {ultronState === 'computing' && (
          <div className="flex items-center space-x-2 text-xs font-mono text-red-400 animate-pulse bg-gray-900/60 border border-red-950 px-3 py-2 rounded-lg w-max">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-red-500" />
            <span>ULTRON NEURAL SYNTHESIS IN PROGRESS...</span>
          </div>
        )}
      </div>

      {/* Suggested Inquiries / Prompt Chips */}
      <div className="py-2 overflow-x-auto whitespace-nowrap flex space-x-1.5 scrollbar-none border-t border-gray-900">
        {QUICK_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSendMessage(prompt)}
            className="text-[11px] font-mono bg-gray-900/80 hover:bg-red-950 text-gray-300 hover:text-red-200 border border-gray-800 hover:border-red-800 px-2.5 py-1 rounded-full transition-all shrink-0 cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Message Input Bar */}
      <form onSubmit={handleSubmit} className="mt-2 flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Speak to Ultron or command cyber surveillance..."
          disabled={ultronState === 'computing'}
          className="flex-1 bg-black/90 border border-gray-800 rounded-lg px-3.5 py-2.5 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-red-600 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || ultronState === 'computing'}
          className="bg-red-700 hover:bg-red-600 disabled:bg-gray-800 text-white p-2.5 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed shadow-lg shadow-red-950/60"
          title="Send message to Ultron"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
