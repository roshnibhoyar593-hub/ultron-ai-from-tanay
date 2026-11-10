# ULTRON — Local Ollama AI

ULTRON is a browser interface for a locally running Ollama model. It does not use Gemini, an API key, a paid AI subscription, or a hosted AI inference service.

## Requirements

- Node.js 20+ and npm
- Ollama installed and running on the same computer as the browser
- A downloaded model (default: `llama3.2`)

## Install on Linux / Kali Linux

1. Install Ollama using the official instructions: https://ollama.com/download
2. Download a model:

   ```bash
   ollama pull llama3.2
   ```

3. Start Ollama if it is not already running:

   ```bash
   ollama serve
   ```

4. Configure Ollama's `OLLAMA_ORIGINS` to allow the exact origin serving this app. For local development, that is usually `http://localhost:3000`. Do not expose Ollama's unauthenticated API to the public internet or use a wildcard origin on a public computer. Restart Ollama after changing this setting.
5. Start ULTRON:

   ```bash
   npm install
   npm run dev
   ```

6. Open http://localhost:3000, select the Ollama tab, test the connection, and send a message.

## Important deployment note

A public website cannot install Ollama on a visitor's device. Ollama must be installed and running on the same computer where the browser is open. A hosted website must be explicitly allowed in Ollama's `OLLAMA_ORIGINS` setting. The browser connects to the visitor's own computer, not a cloud AI service.

## Model choices

You can use any model already downloaded in Ollama. For example:

- `ollama pull llama3.2`
- `ollama pull qwen2.5:3b`

Model performance depends on your computer's memory and processor. Model licences vary; check the licence of the model you choose.

## Privacy and safety

Prompts are sent from the browser to the Ollama service on your own computer. This build is intended for general assistance, programming, and defensive cybersecurity learning. Use security tools only on systems you own or are explicitly authorized to test.
