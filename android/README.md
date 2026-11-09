# 📱 ULTRON Android Phone Edition
> **Created by Tanay** // Autonomous Ultron AI Android Application

This folder (`android/`) contains the complete native Android project ready to build and run on any Android smartphone.

---

## 🚀 How to Build and Run on Your Android Phone

### Option A: Using Android Studio (Recommended)

1. **Clone or Download this Repository from GitHub**:
   ```bash
   git clone <your-repo-url>
   cd ultron-kali-ai
   ```

2. **Open the `android` Folder in Android Studio**:
   - Launch **Android Studio**.
   - Click **File > Open...** (or click **Open** on the Welcome screen).
   - Select the `android/` directory inside this project and click **OK**.
   - Wait for Gradle to sync dependencies automatically.

3. **Run on Your Phone**:
   - Enable **Developer Options** and **USB Debugging** on your Android phone:
     - Go to *Settings > About Phone* and tap *Build Number* 7 times.
     - Go to *Settings > System > Developer Options* and turn on *USB Debugging*.
   - Connect your Android phone via USB.
   - Select your device in the top device dropdown in Android Studio.
   - Click the green **Run (▶)** button!

4. **Build APK File**:
   - In Android Studio, click **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
   - When finished, click **locate** to get `app-debug.apk`.
   - Send this APK to any Android phone via WhatsApp, Telegram, Google Drive, or USB and tap to install!

---

### Option B: Build APK Directly via Command Line (CLI)

If you have Android SDK or Gradle installed on your Linux / Kali / Mac / Windows machine:

```bash
cd android

# On Linux / macOS / Kali Linux:
./gradlew assembleDebug

# On Windows:
gradlew.bat assembleDebug
```

The generated APK will be at:
`android/app/build/outputs/apk/debug/app-debug.apk`

---

## ⚡ Key Android Features Built In

1. **Microphone Permissions Handled**: Native WebChromeClient requests `android.permission.RECORD_AUDIO` so Ultron can listen to your voice and talk like a human.
2. **Audio Hardware Acceleration**: Deep male voice playback with real-time lip-sync jaw movement.
3. **Android Haptics Bridge**: Native vibration pulses on cyber threat alerts via `window.UltronAndroid.triggerHapticPulse()`.
4. **Edge-to-Edge Dark Titanium Theme**: Custom immersive status bar and navigation bars matching the Ultron theme.
5. **Offline Support & PWA Compliance**: Also installs as a Progressive Web App directly from mobile Chrome.
