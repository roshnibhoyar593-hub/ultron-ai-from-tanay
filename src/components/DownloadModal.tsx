import React, { useState } from 'react';
import {
  Download,
  X,
  Terminal,
  Laptop,
  Check,
  Copy,
  ShieldCheck,
  Cpu,
  Smartphone,
  Share2,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'mobile' | 'kali' | 'apk';
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'mobile',
}) => {
  const [activeTab, setActiveTab] = useState<'mobile' | 'kali' | 'apk'>(defaultTab);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { isInstallable, isInstalled, install } = usePWAInstall();

  if (!isOpen) return null;

  const currentUrl = window.location.href.split('?')[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const kaliBashCommands = `sudo apt update && sudo apt install -y nodejs npm git curl espeak-ng libnotify-bin
# Navigate to extracted app folder
npm install
npm run dev`;

  const androidGradleCommand = `cd android
./gradlew assembleDebug
# Generated APK: android/app/build/outputs/apk/debug/app-debug.apk`;

  const daemonCommand = `curl -sL ${window.location.origin}/api/ultron/daemon-script -o ultron-daemon.sh && chmod +x ultron-daemon.sh && ./ultron-daemon.sh --listen`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-gray-950 border border-red-900/80 rounded-2xl p-4 sm:p-6 shadow-2xl ultron-glow-red overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <div className="flex items-center space-x-2.5">
            <Smartphone className="w-5 h-5 text-red-500" />
            <div>
              <h2 className="font-cyber font-bold text-sm sm:text-base text-red-100 tracking-wider">
                HOW TO INSTALL ON MOBILE &amp; KALI LINUX
              </h2>
              <div className="text-[10px] sm:text-[11px] font-mono text-gray-400">
                Created by Tanay // Autonomous Cyber Sentinel
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-3 gap-1.5 mt-3 bg-black/60 p-1 rounded-xl border border-gray-900 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('mobile')}
            className={`py-2 px-2 rounded-lg font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'mobile'
                ? 'bg-red-950 text-red-200 border border-red-700 shadow-md shadow-red-950/60'
                : 'text-gray-400 hover:text-white hover:bg-gray-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-red-400" />
            <span className="truncate">📱 MOBILE PHONE</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('kali')}
            className={`py-2 px-2 rounded-lg font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'kali'
                ? 'bg-red-950 text-red-200 border border-red-700 shadow-md shadow-red-950/60'
                : 'text-gray-400 hover:text-white hover:bg-gray-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-red-400" />
            <span className="truncate">💻 KALI LINUX</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('apk')}
            className={`py-2 px-2 rounded-lg font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'apk'
                ? 'bg-red-950 text-red-200 border border-red-700 shadow-md shadow-red-950/60'
                : 'text-gray-400 hover:text-white hover:bg-gray-900'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-red-400" />
            <span className="truncate">📦 ANDROID APK</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3.5 pr-1 font-mono text-xs">
          {/* TAB 1: HOW TO INSTALL ON MOBILE PHONE */}
          {activeTab === 'mobile' && (
            <div className="space-y-3">
              {/* Mobile Quick Action Link */}
              <div className="p-3 bg-red-950/40 border border-red-800/80 rounded-xl">
                <div className="flex items-center justify-between text-xs mb-1.5 font-bold text-red-300">
                  <span className="flex items-center space-x-1.5">
                    <Share2 className="w-4 h-4 text-red-400" />
                    <span>YOUR MOBILE APP URL</span>
                  </span>
                  <span className="bg-red-900/80 text-red-200 px-2 py-0.5 rounded text-[10px]">
                    1-CLICK INSTALL
                  </span>
                </div>
                <p className="text-[11px] text-gray-300 mb-2 leading-relaxed">
                  Open this link on your Android phone or iPhone to install Ultron:
                </p>
                <div className="flex items-center justify-between bg-black/90 border border-red-900/60 rounded p-2 text-emerald-400 text-xs">
                  <code className="select-all overflow-x-auto whitespace-nowrap mr-2 text-[11px]">
                    {currentUrl}
                  </code>
                  <button
                    type="button"
                    onClick={() => handleCopy(currentUrl, 'url')}
                    className="flex items-center space-x-1 bg-red-950/80 hover:bg-red-900 text-red-200 px-2 py-1 rounded text-[11px] shrink-0 border border-red-800 cursor-pointer"
                  >
                    {copiedKey === 'url' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>COPY LINK</span>
                      </>
                    )}
                  </button>
                </div>

                {isInstallable && (
                  <div className="mt-2.5 pt-2 border-t border-red-900/40">
                    <button
                      type="button"
                      onClick={install}
                      className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center space-x-2 shadow-lg shadow-red-950 cursor-pointer animate-pulse"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>TAP TO INSTALL ON THIS DEVICE NOW</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Step by step for Android */}
              <div className="p-3.5 bg-black/70 border border-gray-800 rounded-xl space-y-2">
                <div className="flex items-center space-x-2 text-red-300 font-bold text-xs">
                  <span className="w-5 h-5 rounded-full bg-red-950 border border-red-700 flex items-center justify-center text-[11px] text-white">
                    A
                  </span>
                  <span>HOW TO INSTALL ON ANDROID PHONE (CHROME / BRAVE / EDGE)</span>
                </div>
                <div className="grid grid-cols-1 gap-2 text-[11px] text-gray-300 ml-1">
                  <div className="flex items-start space-x-2 bg-gray-950/70 p-2 rounded border border-gray-900">
                    <span className="text-red-400 font-bold shrink-0">1.</span>
                    <span>Open <strong>Google Chrome</strong> or <strong>Brave</strong> on your Android phone and paste the app URL.</span>
                  </div>
                  <div className="flex items-start space-x-2 bg-gray-950/70 p-2 rounded border border-gray-900">
                    <span className="text-red-400 font-bold shrink-0">2.</span>
                    <span>Tap the three dots menu (<strong className="text-white">⋮</strong>) in the top-right corner of Chrome.</span>
                  </div>
                  <div className="flex items-start space-x-2 bg-gray-950/70 p-2 rounded border border-gray-900">
                    <span className="text-red-400 font-bold shrink-0">3.</span>
                    <span>Tap <strong className="text-red-400">"Install app"</strong> or <strong className="text-red-400">"Add to Home screen"</strong>.</span>
                  </div>
                  <div className="flex items-start space-x-2 bg-gray-950/70 p-2 rounded border border-gray-900">
                    <span className="text-red-400 font-bold shrink-0">4.</span>
                    <span>Tap <strong className="text-white">Install</strong>. The Ultron icon will be placed directly on your phone home screen and app launcher!</span>
                  </div>
                </div>
              </div>

              {/* Step by step for iPhone */}
              <div className="p-3.5 bg-black/70 border border-gray-800 rounded-xl space-y-2">
                <div className="flex items-center space-x-2 text-gray-300 font-bold text-xs">
                  <span className="w-5 h-5 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center text-[11px] text-white">
                    B
                  </span>
                  <span>HOW TO INSTALL ON IPHONE / IPAD (SAFARI)</span>
                </div>
                <div className="grid grid-cols-1 gap-2 text-[11px] text-gray-400 ml-1">
                  <div className="flex items-start space-x-2 bg-gray-950/70 p-2 rounded border border-gray-900">
                    <span className="text-red-400 font-bold shrink-0">1.</span>
                    <span>Open <strong>Safari</strong> on your iPhone and visit the app link.</span>
                  </div>
                  <div className="flex items-start space-x-2 bg-gray-950/70 p-2 rounded border border-gray-900">
                    <span className="text-red-400 font-bold shrink-0">2.</span>
                    <span>Tap the <strong className="text-white">Share</strong> button at the bottom (the square with an arrow pointing up).</span>
                  </div>
                  <div className="flex items-start space-x-2 bg-gray-950/70 p-2 rounded border border-gray-900">
                    <span className="text-red-400 font-bold shrink-0">3.</span>
                    <span>Scroll down and tap <strong className="text-red-400">"Add to Home Screen"</strong>, then tap <strong className="text-white">Add</strong>.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KALI LINUX & DEV SERVER */}
          {activeTab === 'kali' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-black/70 border border-gray-800 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-red-400 font-bold flex items-center space-x-1.5">
                    <Terminal className="w-4 h-4" />
                    <span>RUNNING ON KALI LINUX DESKTOP</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(kaliBashCommands, 'kali')}
                    className="flex items-center space-x-1 text-gray-400 hover:text-white bg-gray-900 px-2 py-1 rounded transition-colors cursor-pointer"
                  >
                    {copiedKey === 'kali' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 text-[10px]">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[10px]">COPY COMMANDS</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-gray-400 text-[11px] mb-2 leading-relaxed">
                  Extract the downloaded zip or clone the GitHub repo, open terminal, and run:
                </p>
                <div className="bg-gray-950 border border-gray-900 rounded p-2.5 text-emerald-400 text-[11px] select-all">
                  <pre className="whitespace-pre-wrap">{kaliBashCommands}</pre>
                </div>
                <div className="mt-2 text-[10px] text-gray-500">
                  Open <span className="text-red-300">http://localhost:3000</span> in Firefox / Chromium.
                </div>
              </div>

              {/* Background Sentinel Daemon */}
              <div className="p-3.5 bg-black/70 border border-red-950 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-red-400 font-bold flex items-center space-x-1.5">
                    <Cpu className="w-4 h-4" />
                    <span>BACKGROUND SENTINEL CLI DAEMON</span>
                  </span>
                  <a
                    href="/api/ultron/daemon-script"
                    download="ultron-daemon.sh"
                    className="flex items-center space-x-1 bg-red-900/80 hover:bg-red-800 text-red-200 px-2.5 py-1 rounded text-[10px] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>DOWNLOAD .SH</span>
                  </a>
                </div>
                <div className="bg-gray-950 border border-gray-900 rounded p-2 text-emerald-400 text-[11px] select-all overflow-x-auto">
                  <code>{daemonCommand}</code>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ANDROID STUDIO & APK */}
          {activeTab === 'apk' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-red-950/40 border border-red-700/80 rounded-xl shadow-lg shadow-red-950/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-red-300 font-bold flex items-center space-x-1.5">
                    <Cpu className="w-4 h-4 text-red-400" />
                    <span>NATIVE ANDROID STUDIO PROJECT (IN GITHUB REPO)</span>
                  </span>
                  <span className="bg-red-900 text-red-200 border border-red-600 px-2 py-0.5 rounded text-[10px] font-bold">
                    KOTLIN / GRADLE
                  </span>
                </div>
                <p className="text-gray-300 leading-relaxed mb-2.5 text-[11px]">
                  When you publish or export to GitHub, the complete Android Studio project is located in the <code className="text-red-300 font-bold">android/</code> directory:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-gray-400 text-[11px] mb-3 ml-1">
                  <li>
                    <span className="text-white font-semibold">Open in Android Studio</span>: Click <em>File &gt; Open...</em>, select the <code className="text-red-300">android/</code> folder from the repository.
                  </li>
                  <li>
                    <span className="text-white font-semibold">Compile APK</span>: Click <em>Build &gt; Build APK(s)</em> to generate <code className="text-emerald-400">app-debug.apk</code>.
                  </li>
                  <li>
                    <span className="text-white font-semibold">Install APK on Phone</span>: Transfer <code className="text-emerald-400">app-debug.apk</code> to your phone via USB or drive, tap to install, and Ultron is on your phone!
                  </li>
                </ol>
                <div className="flex items-center justify-between bg-black/80 border border-red-900/50 rounded p-2 text-emerald-400 text-[11px]">
                  <code className="select-all overflow-x-auto whitespace-nowrap mr-2">
                    cd android && ./gradlew assembleDebug
                  </code>
                  <button
                    type="button"
                    onClick={() => handleCopy(androidGradleCommand, 'gradle')}
                    className="text-gray-400 hover:text-white shrink-0"
                  >
                    {copiedKey === 'gradle' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-gray-800 flex items-center justify-between">
          <span className="text-[10px] sm:text-[11px] text-gray-500 font-mono">
            Architect: Tanay // Ultron Prime Mobile &amp; Kali Deck
          </span>
          <button
            type="button"
            onClick={onClose}
            className="bg-red-700 hover:bg-red-600 text-white font-mono font-semibold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
