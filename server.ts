import http from 'http';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const httpServer = http.createServer(app);
const port = Number(process.env.PORT) || 3000;

app.get('/api/health', (_req, res) => res.json({ ok: true, aiProvider: 'local-ollama' }));

// Voice is handled by browser speech synthesis; no cloud TTS or API key is used.
app.use(express.json({ limit: '1mb' }));
app.post('/api/ultron/tts', (req, res) => {
  if (typeof req.body?.text !== 'string' || !req.body.text.trim()) {
    return res.status(400).json({ error: 'Text is required' });
  }
  return res.json({ fallbackAvailable: true, useClientVoice: true });
});

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
    app.get('*', (_req, res) => res.sendFile(path.resolve(__dirname, 'dist', 'index.html')));
  }
  httpServer.listen(port, '0.0.0.0', () => {
    console.log(`[ULTRON] Local Ollama UI online on port ${port}`);
  });
}

setupVite().catch((err) => {
  console.error('Failed to start ULTRON:', err);
  process.exit(1);
});
