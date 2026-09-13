# Hostinger Deployment Guide - MediCare Pulse SaaS

Hostinger par **MediCare Pulse** SaaS application ko host karna aasan hai.

Chunki humne **Firebase Authentication** aur **Cloud Firestore Database** integrate kar diya hai, aapka backend cloud par live chalega, aur aapka frontend Hostinger ke high-speed servers aur custom domain par live run karega!

---

## Step 1: Firebase Project & API Keys Setup (5 Minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Click **Create a Project** (Project Name: `medicare-pulse-saas`).
3. Left menu me **Build** -> **Authentication** -> Enable **Google** & **Email/Password**.
4. Left menu me **Build** -> **Firestore Database** -> Click **Create Database** -> Choose location -> Click **Enable**.
5. Click **Project Settings** (Gear icon on top left) -> Under **Your Apps**, click **Web (`</>`)**.
6. Copy the `firebaseConfig` keys.
7. Open [js/firebase-config.js](file:///C:/Users/Manish%20Sahani/.gemini/antigravity/scratch/online-healthcare-system/js/firebase-config.js) and paste your keys into the `firebaseConfig` object:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123def456"
};
```

---

## Step 2: Hostinger hPanel Upload (File Manager Method)

1. Log into your **Hostinger hPanel** ([hpanel.hostinger.com](https://hpanel.hostinger.com/)).
2. Go to **Websites** -> Select your Domain (e.g. `yourhospital.com`) -> Click **Manage**.
3. Left sidebar me **Files** -> Click **File Manager**.
4. Click on `public_html` folder.
5. Upload all the files from your local project directory (`online-healthcare-system`):
   - `index.html`
   - `css/` (folder with `styles.css`)
   - `js/` (folder with `firebase-config.js`, `store.js`, `app.js`, `views/`, `components/`)
6. Ensure `index.html` is directly inside `public_html/index.html`.

---

## Step 3: Configure Hostinger SPA Rewrite (`.htaccess`)

Hostinger (Apache web server) par Single Page Application (SPA) dashboard navigation ke liye `.htaccess` file zaroori hoti hai.

Upload or create `.htaccess` in your Hostinger `public_html/` folder:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## Step 4: Add Hostinger Domain to Firebase Authorized Domains

1. Go back to [Firebase Console](https://console.firebase.google.com/).
2. Go to **Authentication** -> **Settings** tab -> **Authorized Domains**.
3. Click **Add domain**.
4. Type your Hostinger domain (e.g., `yourhospital.com` or `app.yourhospital.com`) and click **Save**.

*Isse Google Sign-In aapke Hostinger domain par security violation ke bina perfect chalega!*

---

## Step 5: Enable Free SSL (HTTPS) on Hostinger

1. In Hostinger hPanel -> Go to **Security** -> **SSL**.
2. Click **Install SSL** for your domain (Hostinger gives Free Lifetime SSL).
3. Enable **Force HTTPS**.

---

## Verification & Live SaaS Checklist

- Open `https://yourhospital.com` in your browser.
- Test Google Sign-In and Email Registration.
- Book an appointment as a patient on your phone and open the doctor/admin dashboard on your laptop to verify **Live Real-Time Cloud Sync**!
