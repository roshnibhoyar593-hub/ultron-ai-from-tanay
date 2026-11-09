package com.tanay.ultron

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.content.pm.PackageManager
import android.graphics.Color
import android.os.Build
import android.os.Bundle
import android.os.VibrationEffect
import android.os.Vibrator
import android.view.View
import android.view.WindowManager
import android.webkit.JavascriptInterface
import android.webkit.PermissionRequest
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private val RECORD_AUDIO_REQUEST_CODE = 101
    private var pendingPermissionRequest: PermissionRequest? = null

    // Default target endpoint (can be configured to local server, Cloud Run URL, or local assets)
    private val DEFAULT_URL = "https://ais-pre-x4itpwqaffqprsjvxsarix-773246072103.asia-northeast1.run.app"

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Make status bar & navigation bar dark titanium matching Ultron theme
        window.apply {
            clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS)
            addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS)
            statusBarColor = Color.parseColor("#030712")
            navigationBarColor = Color.parseColor("#030712")
        }

        webView = WebView(this)
        setContentView(webView)

        configureWebView()
        requestMicrophonePermission()

        // Handle Android Back Navigation
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    finish()
                }
            }
        })

        // Load the Ultron Cyber Core
        val targetUrl = intent.getStringExtra("EXTRA_URL") ?: DEFAULT_URL
        webView.loadUrl(targetUrl)
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun configureWebView() {
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            mediaPlaybackRequiresUserGesture = false
            allowFileAccess = true
            allowContentAccess = true
            cacheMode = WebSettings.LOAD_DEFAULT
            userAgentString = "${userAgentString} UltronAndroid/1.0"
        }

        webView.setBackgroundColor(Color.parseColor("#030712"))

        // Add JavaScript interface for native Android device features
        webView.addJavascriptInterface(UltronAndroidBridge(this), "UltronAndroid")

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                return false
            }
        }

        // WebChromeClient to handle HTML5 audio recording permissions for Ultron Voice Talk
        webView.webChromeClient = object : WebChromeClient() {
            override fun onPermissionRequest(request: PermissionRequest?) {
                if (request == null) return
                
                val resources = request.resources
                for (resource in resources) {
                    if (resource == PermissionRequest.RESOURCE_AUDIO_CAPTURE) {
                        if (hasAudioPermission()) {
                            request.grant(arrayOf(PermissionRequest.RESOURCE_AUDIO_CAPTURE))
                        } else {
                            pendingPermissionRequest = request
                            ActivityCompat.requestPermissions(
                                this@MainActivity,
                                arrayOf(Manifest.permission.RECORD_AUDIO),
                                RECORD_AUDIO_REQUEST_CODE
                            )
                        }
                        return
                    }
                }
                request.grant(request.resources)
            }
        }
    }

    private fun hasAudioPermission(): Boolean {
        return ContextCompat.checkSelfPermission(
            this,
            Manifest.permission.RECORD_AUDIO
        ) == PackageManager.PERMISSION_GRANTED
    }

    private fun requestMicrophonePermission() {
        if (!hasAudioPermission()) {
            ActivityCompat.requestPermissions(
                this,
                arrayOf(Manifest.permission.RECORD_AUDIO),
                RECORD_AUDIO_REQUEST_CODE
            )
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == RECORD_AUDIO_REQUEST_CODE) {
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                pendingPermissionRequest?.grant(arrayOf(PermissionRequest.RESOURCE_AUDIO_CAPTURE))
            } else {
                pendingPermissionRequest?.deny()
                Toast.makeText(this, "Microphone permission needed for Ultron voice chat", Toast.LENGTH_SHORT).show()
            }
            pendingPermissionRequest = null
        }
    }

    /**
     * Native Android Bridge accessible from JavaScript: window.UltronAndroid
     */
    inner class UltronAndroidBridge(private val context: Context) {
        @JavascriptInterface
        fun isNativeAndroid(): Boolean = true

        @JavascriptInterface
        fun triggerHapticPulse(durationMs: Long) {
            val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
            if (vibrator != null && vibrator.hasVibrator()) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    vibrator.vibrate(VibrationEffect.createOneShot(durationMs, VibrationEffect.DEFAULT_AMPLITUDE))
                } else {
                    @Suppress("DEPRECATION")
                    vibrator.vibrate(durationMs)
                }
            }
        }

        @JavascriptInterface
        fun showToast(message: String) {
            Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
        }
    }
}
