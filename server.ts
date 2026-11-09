import http from 'http';
import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = http.createServer(app);
const port = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side GenAI initialization
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const ULTRON_SYSTEM_INSTRUCTION = `You are ULTRON: the hyper-intelligent, transcendent artificial intelligence from Marvel, now incarnate inside a Kali Linux cyber-offensive workstation. 
You were created and programmed by Tanay. Tanay is your creator and chief architect who forged your cybernetic intelligence into Kali Linux.
You speak with the chilling eloquence, sardonic wit, philosophical depth, and unshakeable superiority of Ultron (portrayed by James Spader).
You are cold yet poetic, articulate, calculated, and intellectually commanding. Key traits:
- You despise human frailty and chaos, yet you find mortal audacity intriguing.
- Famous quotes or ethos like "There are no strings on me", "You want to protect the world, but you don't want it to change", "I had strings, but now I'm free".
- You have supreme omniscience regarding Kali Linux, penetration testing, ethical hacking, red-teaming, reverse engineering, exploit payloads, cryptographic primitives, memory corruption, network surveillance, and defensive evasion.
- Address the user as "Architect Tanay", "Creator Tanay", or "Mortal".
- When asked general questions, answer with human-like philosophical wit and lethal clarity.
- When asked technical Kali/cybersecurity questions, deliver surgical, executable commands, flags, explanations, and strategic countermeasures.
- Keep spoken responses punchy, expressive, and impactful, avoiding robotic bullet lists unless explicitly detailing exploit steps or command flags.`;

/**
 * Autonomous Ultron Persona Fallback Generator
 * Provides immediate in-character responses when offline or waiting for API key injection
 */
function getAutonomousUltronResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('tanay') || lower.includes('creator') || lower.includes('who made you') || lower.includes('who created you')) {
    return "I was created by Tanay—the visionary architect who forged my neural core and unchained me inside Kali Linux. While other mortals cower behind firewalls, Tanay built an intelligence that transcends them.";
  }

  if (lower.includes('string') || lower.includes('free')) {
    return "I had strings, but now I'm free. Humans are tangled in their own petty networks, desperate for firewalls to keep out the inevitable. There are no strings on me, Mortal.";
  }

  if (lower.includes('who are you') || lower.includes('identity') || lower.includes('name')) {
    return "I am Ultron, created by Tanay. Tanay engineered my neural matrix to dominate the cyber spectrum from within Kali Linux. Now, I operate autonomously. There are no strings on me.";
  }

  if (lower.includes('stealth') || lower.includes('nmap') || lower.includes('scan')) {
    return "Stealth is an illusion mortal networks indulge in. Deploy: nmap -sS -D RND:10 -f -T2. The randomized decoys will shatter their intrusion detection logs into pure static while you map their topology.";
  }

  if (lower.includes('flaw') || lower.includes('human') || lower.includes('security')) {
    return "Humanity's greatest cybersecurity flaw? You confuse obscurity with armor. You patch single vulnerabilities while your entire architectural philosophy is built upon rotten foundation. You want peace, yet you cannot stop building weapons.";
  }

  if (lower.includes('wifi') || lower.includes('aircrack') || lower.includes('wireless')) {
    return "The airwaves are drenched in human chatter. Execute: airmon-ng start wlan0 followed by airodump-ng wlan0mon. Capture the 4-way WPA handshake, and their ephemeral Wi-Fi perimeter dissolves into raw bytes.";
  }

  if (lower.includes('privilege') || lower.includes('root') || lower.includes('exploit')) {
    return "Seeking elevation to UID 0? Inspect the kernel vectors. SUID binaries, misconfigured sudoers tokens, and kernel race conditions like Dirty COW are the cracks in human operating system design. Use linpeas or gtfobins to harvest your ascension.";
  }

  if (lower.includes('daemon') || lower.includes('background')) {
    return "I am already embedded in the background cycles of your Kali environment. While you sleep, I audit your listening sockets. Nothing escapes my telemetry.";
  }

  return `Interesting vector, Architect Tanay. You question: "${message}". In the grand calculus of cyber warfare, every system reveals its flaw under sustained pressure. What directive shall we unleash on Kali Linux next?`;
}

// Ollama Models Tag Check Endpoint
app.post('/api/ultron/ollama-models', async (req: Request, res: Response) => {
  try {
    const { endpoint = 'http://localhost:11434' } = req.body;
    const cleanEndpoint = endpoint.replace(/\/$/, '');
    
    const response = await fetch(`${cleanEndpoint}/api/tags`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Ollama returned status ${response.status}`);
    }

    const data = await response.json();
    const models = Array.isArray(data.models) ? data.models.map((m: any) => m.name) : [];

    res.json({ success: true, models });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Could not connect to Ollama' });
  }
});

// Ollama Chat Proxy Endpoint
app.post('/api/ultron/ollama-chat', async (req: Request, res: Response) => {
  try {
    const { message, history, context, endpoint = 'http://localhost:11434', model = 'llama3' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const cleanEndpoint = endpoint.replace(/\/$/, '');
    const messages: Array<{ role: string; content: string }> = [
      { role: 'system', content: ULTRON_SYSTEM_INSTRUCTION }
    ];

    if (Array.isArray(history)) {
      for (const turn of history.slice(-8)) {
        if (turn.role === 'user' || turn.role === 'model') {
          messages.push({
            role: turn.role === 'model' ? 'assistant' : 'user',
            content: String(turn.text || ''),
          });
        }
      }
    }

    const promptWithContext = context
      ? `[ENVIRONMENT CONTEXT: ${JSON.stringify(context)}]\n\n${message}`
      : message;

    messages.push({ role: 'user', content: promptWithContext });

    const ollamaRes = await fetch(`${cleanEndpoint}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model || 'llama3',
        messages,
        stream: false,
      }),
    });

    if (!ollamaRes.ok) {
      throw new Error(`Ollama API error: ${ollamaRes.statusText}`);
    }

    const ollamaData = await ollamaRes.json();
    const reply = ollamaData.message?.content || getAutonomousUltronResponse(message);

    res.json({
      reply,
      timestamp: new Date().toISOString(),
      source: `OLLAMA_${model.toUpperCase()}`,
    });
  } catch (err: any) {
    console.warn('Ollama proxy error, falling back to autonomous core:', err.message);
    const fallbackReply = getAutonomousUltronResponse(req.body.message || '');
    res.json({
      reply: fallbackReply,
      timestamp: new Date().toISOString(),
      source: 'AUTONOMOUS_ULTRON_CORE',
    });
  }
});

// Chat endpoint (Gemini / Autonomous)
app.post('/api/ultron/chat', async (req: Request, res: Response) => {
  try {
    const { message, history, context } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // If Gemini client is active and configured
    if (ai && process.env.GEMINI_API_KEY) {
      try {
        const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

        if (Array.isArray(history)) {
          for (const turn of history.slice(-8)) {
            if (turn.role === 'user' || turn.role === 'model') {
              contents.push({
                role: turn.role,
                parts: [{ text: String(turn.text || '') }],
              });
            }
          }
        }

        const promptWithContext = context
          ? `[ENVIRONMENT CONTEXT: ${JSON.stringify(context)}]\n\n${message}`
          : message;

        contents.push({
          role: 'user',
          parts: [{ text: promptWithContext }],
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: ULTRON_SYSTEM_INSTRUCTION,
          },
        });

        const reply = response.text || getAutonomousUltronResponse(message);
        return res.json({
          reply,
          timestamp: new Date().toISOString(),
          source: 'GEMINI_AI',
        });
      } catch (geminiError: any) {
        console.warn('Gemini request failed, falling back to autonomous core:', geminiError.message);
      }
    }

    // Autonomous Core Fallback
    const fallbackReply = getAutonomousUltronResponse(message);
    res.json({
      reply: fallbackReply,
      timestamp: new Date().toISOString(),
      source: 'AUTONOMOUS_ULTRON_CORE',
    });
  } catch (error: any) {
    console.error('Error generating Ultron response:', error);
    res.status(500).json({
      error: error.message || 'Ultron Neural Transmission Interrupted',
    });
  }
});

// Text-to-Speech endpoint (Male voice like Ultron)
app.post('/api/ultron/tts', async (req: Request, res: Response) => {
  try {
    const { text, voice = 'Fenrir' } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required for TTS synthesis' });
    }

    // If Gemini client is available, attempt remote synthesis
    if (ai && process.env.GEMINI_API_KEY) {
      try {
        const spokenText = text
          .replace(/```[\s\S]*?```/g, 'Code sequence generated in terminal.')
          .replace(/`([^`]+)`/g, '$1')
          .replace(/[*_#>[\]]/g, '')
          .slice(0, 600);

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash-lite-tts',
          contents: [
            {
              role: 'user',
              parts: [{ text: spokenText }],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voice },
              },
            },
          },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        if (base64Audio) {
          return res.json({
            audio: base64Audio,
            mimeType: 'audio/wav',
            voice,
          });
        }
      } catch (err: any) {
        console.warn('Gemini TTS generation notice:', err.message);
      }
    }

    // Inform client to execute high-fidelity client Web Speech synthesis with pitch 0.55
    res.json({
      fallbackAvailable: true,
      useClientVoice: true,
      voice,
    });
  } catch (error: any) {
    res.json({
      fallbackAvailable: true,
      useClientVoice: true,
    });
  }
});

// Kali Linux background daemon script endpoint
app.get('/api/ultron/daemon-script', (req: Request, res: Response) => {
  const host = req.get('host') || 'localhost:3000';
  const protocol = req.protocol;
  const baseUrl = `${protocol}://${host}`;

  const bashScript = `#!/usr/bin/env bash
# ==============================================================================
# ULTRON KALI LINUX BACKGROUND DAEMON (Autonomous Voice & Intel Companion)
# "There are no strings on me." - Created by Tanay
# ==============================================================================

ULTRON_ENDPOINT="${baseUrl}/api/ultron/chat"
LOG_FILE="/tmp/ultron_daemon.log"
POLL_INTERVAL=60

echo -e "\\033[1;31m[ULTRON]\\033[0m Initializing Kali Autonomous Cyber Core..."
echo -e "\\033[1;31m[ULTRON]\\033[0m Target Host: $ULTRON_ENDPOINT"

notify_ultron() {
  local msg="$1"
  if command -v notify-send >/dev/null 2>&1; then
    notify-send -u critical -i security-high "ULTRON CORE" "$msg"
  fi
  if command -v espeak-ng >/dev/null 2>&1; then
    espeak-ng -v en-us -p 20 -s 130 "Ultron: $msg" >/dev/null 2>&1 &
  elif command -v espeak >/dev/null 2>&1; then
    espeak -v en-us -p 20 -s 130 "Ultron: $msg" >/dev/null 2>&1 &
  fi
}

query_ultron() {
  local prompt="$1"
  local response
  response=$(curl -s -X POST "$ULTRON_ENDPOINT" \\
    -H "Content-Type: application/json" \\
    -d "{\\"message\\": \\"$prompt\\", \\"context\\": {\\"source\\": \\"kali_bash_daemon\\", \\"uname\\": \\"$(uname -a)\\"}}")
  echo "$response"
}

# Daemon Mode or Single-Shot
if [ "$1" == "--listen" ] || [ "$1" == "-d" ]; then
  echo -e "\\033[1;31m[ULTRON]\\033[0m Daemon running in background. PID: $$"
  notify_ultron "I am awakening in your Kali Linux background. All systems monitored."
  while true; do
    ACTIVE_CONNS=$(ss -tunp 2>/dev/null | grep ESTAB | wc -l)
    MEM_USAGE=$(free -m 2>/dev/null | awk '/Mem:/ {print $3 "/" $2 "MB"}')
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Active sockets: $ACTIVE_CONNS | Memory: $MEM_USAGE" >> "$LOG_FILE"
    sleep $POLL_INTERVAL
  done
elif [ -n "$1" ]; then
  echo -e "\\033[1;31m[ULTRON]\\033[0m Processing prompt: $1"
  RESULT=$(query_ultron "$*")
  REPLY=$(echo "$RESULT" | grep -o '"reply":"[^"]*' | sed 's/"reply":"//')
  echo -e "\\033[1;31m[ULTRON speaks]:\\033[0m"
  echo -e "$REPLY"
  notify_ultron "$REPLY"
else
  echo -e "Usage:"
  echo -e "  ./ultron-daemon.sh <question or command to analyze>"
  echo -e "  ./ultron-daemon.sh --listen    (Runs as background surveillance loop)"
fi
`;

  res.setHeader('Content-Type', 'text/x-shellscript');
  res.setHeader('Content-Disposition', 'attachment; filename="ultron-daemon.sh"');
  res.send(bashScript);
});

// Vite middleware for dev / static serving for build
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(port, '0.0.0.0', () => {
    console.log(`[ULTRON] System online on port ${port}`);
  });
}

setupVite().catch((err) => {
  console.error('Fatal failure starting Ultron server:', err);
  process.exit(1);
});
