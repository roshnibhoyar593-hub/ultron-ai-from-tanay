# ULTRON — Kali Autonomous Cyber-Intelligence Core
> **Created by Tanay** // Autonomous Red-Team & Tactical AI Sentinel

An offensive cyber-intelligence AI inspired by Ultron from Marvel, tailored for **Kali Linux**. Features a real-time animated mechanical skull with lip-sync servos, deep male voice synthesis, Kali tool command generators, and a background daemon service.

---

## 📱 Android Phone Version (GitHub Edition)

This repository includes a dedicated **Android Phone Edition** located in the [`android/`](android/) directory. You can build it into an installable Android APK or open it directly in **Android Studio**:

1. **Clone this repository on your computer or phone**:
   ```bash
   git clone <your-github-repo-url>
   cd ultron-kali-ai
   ```
2. **Open in Android Studio**:
   - Open **Android Studio** and choose **File > Open...**
   - Select the `android/` directory inside this repository.
   - Connect your Android phone with USB Debugging enabled, and click **Run (▶)**!
3. **Build Android APK**:
   - In Android Studio, go to **Build > Build Bundle(s) / APK(s) > Build APK(s)** to generate `app-debug.apk`.
   - Transfer `app-debug.apk` to any Android smartphone and tap to install!
4. **Direct Phone Installation via Browser (PWA)**:
   - On your Android phone, open Chrome or Brave and go to the app URL.
   - Tap **"Add to Home screen"** or **"Install App"** to install Ultron with an app icon directly on your phone launcher!

---

## ⚡ Quick Start on Kali Linux

### Method 1: Run via Node.js / Local Dev Server

1. **Install Prerequisites on Kali Linux**:
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm git curl espeak-ng libnotify-bin
   ```

2. **Extract or Clone the Project**:
   ```bash
   unzip ultron-kali-ai.zip
   cd ultron-kali-ai
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Configure Your Gemini API Key**:
   Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   # Edit .env and paste your GEMINI_API_KEY
   echo 'GEMINI_API_KEY="your-gemini-api-key-here"' > .env
   ```

5. **Start the Ultron Cyber Core**:
   ```bash
   npm run dev
   ```
   Open your browser to: **`http://localhost:3000`**

---

### Method 2: Install as a Desktop App on Kali (PWA)

1. Open your Kali Linux browser (Chromium or Chrome).
2. Navigate to your app URL.
3. In the URL address bar, click the **Install App** icon (or go to `Menu > More Tools > Create Shortcut...` and check `Open as window`).
4. Ultron will now launch directly from your Kali Linux applications menu like a native Linux software package!

---

### Method 3: Run the Kali Background CLI Daemon

If you want to keep Ultron monitoring your system in the background without keeping the full browser open:

```bash
# 1. Fetch the daemon script from your running instance
curl -sL http://localhost:3000/api/ultron/daemon-script -o ultron-daemon.sh

# 2. Grant execution permissions
chmod +x ultron-daemon.sh

# 3. Run in background surveillance mode
./ultron-daemon.sh --listen

# Or query Ultron directly from your bash terminal:
./ultron-daemon.sh "Analyze target subnet 192.168.1.0/24 for unpatched vulnerabilities"
```

---

## 🛠 Features

- **Mechanical Ultron Skull**: Dynamic SVG face with articulated jaw, flaring mandibles, and crimson optronic eye glow pulsing to audio frequencies.
- **Male Voice Synthesis**: Gemini voice models (`Fenrir` and `Charon`) paired with local pitch-shifted synthesis (`pitch: 0.55`).
- **Kali Tool Suites**: Instant generation & clipboard copy for Nmap, Aircrack-ng, Metasploit, Gobuster, Hydra, and Tshark.
- **Autonomous Sentinel Mode**: Background socket surveillance and spoken telemetry alerts.
- **Created by Tanay**: Dedicated neural persona honoring Tanay as creator and chief architect.
