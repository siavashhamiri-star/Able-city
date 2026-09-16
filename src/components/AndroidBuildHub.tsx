import React, { useState } from 'react';
import { TranslationDictionary } from '../lib/i18n';
import { sounds } from '../lib/sound';
import {
  Smartphone,
  Layers,
  FileCode,
  GitBranch,
  Copy,
  Check,
  Download,
  Lightbulb,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface AndroidBuildHubProps {
  t: TranslationDictionary;
  onShowToast: (msg: string) => void;
}

export const AndroidBuildHub: React.FC<AndroidBuildHubProps> = ({ t, onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'workflow' | 'appGradle' | 'rootGradle' | 'manifest'>('workflow');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    sounds.playHeart();
    onShowToast(t.copied);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const workflowCode = `name: Build Android APK & AAB (ABLE City)

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

env:
  ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION: "true"

jobs:
  build-android:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Set up Android SDK
        uses: android-actions/setup-android@v3

      - name: Setup Gradle
        uses: gradle/actions/setup-gradle@v3
        with:
          gradle-version: 8.6

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install Node Dependencies
        run: npm install

      - name: Build Web App
        run: npm run build

      - name: Prepare Android Assets
        run: |
          mkdir -p android/app/src/main/assets
          cp -r dist/* android/app/src/main/assets/ || true

      - name: Make Gradle Wrapper Executable
        run: |
          chmod +x ./android/gradlew || true

      - name: Build Android Release APK
        working-directory: ./android
        run: |
          ./gradlew assembleRelease --no-daemon --stacktrace

      - name: Build Android Release AAB
        working-directory: ./android
        run: |
          ./gradlew bundleRelease --no-daemon --stacktrace

      - name: Upload APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: ABLE-City-Release-APK
          path: android/app/build/outputs/apk/release/*.apk
          if-no-files-found: warn

      - name: Upload AAB Artifact
        uses: actions/upload-artifact@v4
        with:
          name: ABLE-City-Release-AAB
          path: android/app/build/outputs/bundle/release/*.aab
          if-no-files-found: warn
`;

  const appGradleCode = `plugins {
    id 'com.android.application'
}

android {
    namespace 'com.ablecity.app'
    compileSdk 34

    defaultConfig {
        applicationId "com.ablecity.app"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        manifestPlaceholders = [
            hostName: "able-city.app",
            defaultUrl: "https://able-city.app"
        ]
    }

    buildTypes {
        release {
            minifyEnabled false
            shrinkResources false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            signingConfig signingConfigs.debug // Uses debug keystore for CI testing, replace with release keystore for store release
        }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'androidx.browser:customtabs:1.8.0'
    implementation 'com.google.androidbrowserhelper:androidbrowserhelper:2.5.0'
}
`;

  const rootGradleCode = `// Top-level build file where you can add configuration options common to all sub-projects/modules.
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.3.1'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
`;

  const manifestCode = `{
  "name": "ABLE City - شهر توانا",
  "short_name": "ABLE City",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#05070f",
  "theme_color": "#38bdf8",
  "orientation": "portrait",
  "dir": "rtl",
  "lang": "fa",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}`;

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="rounded-xl border border-emerald-500/30 bg-[#020409] p-4 shadow-[0_10px_30px_rgba(16,185,129,0.08)]">
        <div className="flex items-center gap-2 mb-1.5">
          <Smartphone className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-sm md:text-base text-emerald-400">
            {t.androidHubTitle}
          </h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          {t.androidHubDesc}
        </p>
      </div>

      {/* Creative Suggestions Card */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-2.5">
        <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-amber-300">
          <Lightbulb className="w-4 h-4 text-[#f59e0b]" />
          <span>پیشنهادهای خلاقانه برای تبدیل موفق به اپلیکیشن موبایل:</span>
        </div>
        <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed">
          <li>
            <strong className="text-amber-200">روش اول (TWA / Bubblewrap مدرن گوگل):</strong> اپلیکیشن با استاندارد Trusted Web Activity تبدیل می‌شود؛ بدون افت سرعت، با کمترین حجم فایل (حدود ۲ مگابایت) و به‌روزرسانی آنی بدون نیاز به آپدیت مجدد در کافه‌بازار یا مایکت.
          </li>
          <li>
            <strong className="text-amber-200">روش دوم (Capacitor Native):</strong> امکان دسترسی به پوش‌نوتیفیکیشن محلی، ارتعاش لمسی (Haptic Feedback) و ذخیره‌سازی آفلاین SQLite با پلاگین‌های رسمی خازن.
          </li>
          <li>
            <strong className="text-amber-200">فرمت استاندارد دوگانه (APK + AAB):</strong> خروجی <code>.apk</code> برای نصب مستقیم توسط کاربر یا انتشار در استورهای ایرانی، و خروجی <code>.aab</code> ویژه استانداردهای بهینه‌سازی فروشگاه Google Play.
          </li>
        </ul>
      </div>

      {/* Code Viewer Card */}
      <div className="rounded-xl border border-slate-800 bg-[#0b101d] p-4 space-y-3">
        {/* File Tabs */}
        <div className="flex gap-1 bg-[#020409] p-1 rounded-xl border border-slate-800 overflow-x-auto scrollbar-none text-xs">
          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'workflow' ? 'bg-[#38bdf8] text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            GitHub Actions (.yml)
          </button>
          <button
            onClick={() => setActiveTab('appGradle')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'appGradle' ? 'bg-[#10b981] text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            app/build.gradle
          </button>
          <button
            onClick={() => setActiveTab('rootGradle')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'rootGradle' ? 'bg-[#f59e0b] text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            root build.gradle
          </button>
          <button
            onClick={() => setActiveTab('manifest')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'manifest' ? 'bg-[#c084fc] text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            manifest.json (PWA)
          </button>
        </div>

        {/* Action bar for code */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-mono text-[11px]">
            {activeTab === 'workflow' && '.github/workflows/build-android.yml'}
            {activeTab === 'appGradle' && 'android/app/build.gradle'}
            {activeTab === 'rootGradle' && 'android/build.gradle'}
            {activeTab === 'manifest' && 'public/manifest.json'}
          </span>

          <button
            onClick={() => {
              const code =
                activeTab === 'workflow'
                  ? workflowCode
                  : activeTab === 'appGradle'
                  ? appGradleCode
                  : activeTab === 'rootGradle'
                  ? rootGradleCode
                  : manifestCode;
              copyToClipboard(code, activeTab);
            }}
            className="flex items-center gap-1 text-xs bg-slate-900 hover:bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
          >
            {copiedKey === activeTab ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === activeTab ? t.copied : t.copyCode}</span>
          </button>
        </div>

        {/* Code display block */}
        <div className="relative rounded-xl bg-[#03060f] border border-slate-800 p-3 overflow-x-auto text-left font-mono text-[11px] leading-relaxed text-slate-300 max-h-80 select-all" dir="ltr">
          <pre>
            {activeTab === 'workflow' && workflowCode}
            {activeTab === 'appGradle' && appGradleCode}
            {activeTab === 'rootGradle' && rootGradleCode}
            {activeTab === 'manifest' && manifestCode}
          </pre>
        </div>
      </div>
    </div>
  );
};
