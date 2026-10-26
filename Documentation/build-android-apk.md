# 🤖 Build and install the Android APK

This turns the Expo app into an `.apk` file you can install on any Android phone, without the Play Store. The build runs in the cloud on **EAS Build** (Expo's build service), so you don't need Android Studio.

> **Free plan:** EAS gives free Android builds each month. A free build can wait in a queue for a while, so start it well before you need it.

---

## Before you start

- [ ] **Node.js 20+** is installed (`node -v`).
- [ ] You have a free **Expo account**: [expo.dev/signup](https://expo.dev/signup).
- [ ] The **backend is live on Render** and the **web app works**, so you know your three `EXPO_PUBLIC_` values are correct.
- [ ] `Tower-of-Arithmetic/eas.json` exists (it's in the repo) and `app.json` has an Android package name (`com.andrevanheerden.towerofarithmetic`).

---

## Step 1: Install the EAS command-line tool

```bash
npm install -g eas-cli
eas --version
```

## Step 2: Log in to Expo

```bash
cd Tower-of-Arithmetic        # the app folder, where app.json is
eas login
```

Enter your Expo email/username and password. Check it with `eas whoami`.

## Step 3: Link the app to your Expo account (first time only)

```bash
eas init
```

Say **yes** to create a project. This adds an `extra.eas.projectId` (and an `owner`) to `app.json`. **Commit that change.**

## Step 4: Give the build your environment variables

Your local `.env` file is **not** sent to the cloud build (it's git-ignored), so EAS needs its own copy of the three public values. The `preview` profile in `eas.json` uses the **preview** environment.

**Option A: the Expo website (easiest)**

1. Go to [expo.dev](https://expo.dev) → your **Tower-of-Arithmetic** project → **Environment variables**.
2. Add each variable below. Tick the **preview** environment (and **production** too, for later). Set visibility to **Plain text**: `EXPO_PUBLIC_` values are built into the app anyway, so they aren't secret.

| Name | Value |
|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | your Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | your Supabase publishable key |
| `EXPO_PUBLIC_API_URL` | your **Render** backend address (`https://…onrender.com`), not localhost |

**Option B: the terminal**

```bash
eas env:set --name EXPO_PUBLIC_API_URL --value https://YOUR-API.onrender.com --environment preview --visibility plaintext
eas env:set --name EXPO_PUBLIC_SUPABASE_URL --value https://YOUR-PROJECT.supabase.co --environment preview --visibility plaintext
eas env:set --name EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY --value sb_publishable_XXXX --environment preview --visibility plaintext
```

Check them on expo.dev → your project → **Environment variables** (or `eas env:list --environment preview`). If your EAS CLI version says `env:set` is unknown, use `eas env:create` with the same options.

> ⚠️ **Never** add `GROQ_API_KEY` here. It stays only on the Render backend.

## Step 5: Build the APK

```bash
eas build -p android --profile preview
```

- First time only, EAS asks to **generate a new Android keystore**. Say **yes** and let Expo store it for you.
- The build is uploaded and queued. You can close the terminal: progress is also shown at **expo.dev → your project → Builds**.
- A build usually takes 10–20 minutes, plus any time in the free queue.

## Step 6: Download and install it on your phone

**Option 1: straight onto the phone (easiest)**

1. When the build finishes, the terminal shows a link and a **QR code**. The same link is on the build page on expo.dev.
2. **Scan the QR code / open the link on your Android phone** and tap **Install** / **Download**. This downloads the `.apk`.
3. Open the downloaded file. If Android asks, allow your browser or Files app to **"Install unknown apps"** (Settings → Apps → Special access → Install unknown apps).
4. Tap **Install**, then **Open**.

**Option 2: download on your computer**

1. On the build page on expo.dev, click **Download** to save the `.apk`.
2. Send it to your phone (USB, Google Drive, WhatsApp to yourself…) and open it there, or with the phone plugged in and USB debugging on:

```bash
adb install path/to/tower-of-arithmetic.apk
```

## Step 7: Share it

Anyone with the build link can download the APK. You can also:

- put the `.apk` in a **GitHub Release** (repo → **Releases → Draft a new release** → attach the file), or
- link it from the README or a QR code in your case study.

---

## Making a new version

1. Make your changes and commit them.
2. Bump `"version"` in `app.json` (e.g. `1.0.0` → `1.0.1`).
3. Run `eas build -p android --profile preview` again.

## Troubleshooting

| Problem | Fix |
|---|---|
| App opens but can't log in or load questions | The `EXPO_PUBLIC_` variables are missing from the **preview** environment on expo.dev (Step 4). Fix them and build again. |
| "Can't reach the game server" for the first minute | Render's free server was asleep. Open `https://YOUR-API.onrender.com/health` first, then try again. |
| "App not installed" | Uninstall any older copy that was signed differently, then install again. |
| Phone blocks the install | Allow **Install unknown apps** for the app you opened the file with. |
| Build fails on dependencies | Run `npx expo install --fix` and `npx expo-doctor` in the app folder, commit, and build again. |

## Play Store later (optional)

For the Play Store you need an `.aab` instead of an `.apk`: run `eas build -p android --profile production`, then `eas submit -p android` (a Google Play developer account costs a one-off fee).

---

*Sources: [Expo: Build APKs for Android](https://docs.expo.dev/build-reference/apk/) · [Expo: Environment variables in EAS](https://docs.expo.dev/eas/environment-variables/)*
