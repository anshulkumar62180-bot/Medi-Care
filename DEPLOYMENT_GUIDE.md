# Production Deployment & Custom Domain Setup Guide

Follow this step-by-step guide to launch your **MediCare Pulse** SaaS web application live on the web and link your custom domain (e.g. `yourhospital.com`).

---

## Step 1: Create a Free Firebase Cloud Project

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** (or *Create a project*).
3. Enter your project name (e.g. `medicare-pulse-saas`) and click **Continue**.
4. Disable or enable Google Analytics (optional) and click **Create project**.

---

## Step 2: Enable Authentication (Google & Email/Password)

1. In the left navigation menu, click **Build** -> **Authentication**.
2. Click **Get started**.
3. Under **Sign-in method**:
   - Click **Google** -> Enable -> Select support email -> Click **Save**.
   - Click **Email/Password** -> Enable -> Click **Save**.
4. Go to **Authorized domains** tab -> Ensure `localhost` and your custom domain (e.g. `yourhospital.com`) are listed.

---

## Step 3: Create Cloud Firestore Database

1. In the left navigation menu, click **Build** -> **Firestore Database**.
2. Click **Create database**.
3. Choose location (e.g. `nam5 (us-central)` or closest to your target hospital region).
4. Select **Start in production mode** and click **Create**.

---

## Step 4: Link Your Firebase Keys into `js/firebase-config.js`

1. In Firebase Console, click the **Gear icon (Project settings)** on the top left.
2. Under **Your apps**, click the **Web (`</>`)** icon to register your web app.
3. Enter app nickname `MediCare Pulse Web` and check **Also set up Firebase Hosting**.
4. Copy the `firebaseConfig` object containing `apiKey`, `authDomain`, `projectId`, etc.
5. Open [js/firebase-config.js](file:///C:/Users/Manish%20Sahani/.gemini/antigravity/scratch/online-healthcare-system/js/firebase-config.js) and replace the placeholder `firebaseConfig` object with your actual keys.

---

## Step 5: Deploy Live to Firebase Hosting (1 Command)

Open PowerShell / Terminal in your project folder (`online-healthcare-system`) and run:

```bash
# 1. Login to Firebase CLI (one-time setup)
npx -y firebase-tools@latest login

# 2. Deploy your app & security rules
npx -y firebase-tools@latest deploy
```

Your web application will immediately be **LIVE** at:
`https://medicare-pulse-saas.web.app`

---

## Step 6: Connect Your Custom Domain

1. Go to Firebase Console -> **Hosting**.
2. Click **Add custom domain**.
3. Type your domain (e.g., `app.yourhospital.com` or `yourhospital.com`).
4. Firebase will provide **A Records** or **CNAME Records** (e.g. `199.36.158.100`).
5. Log into your domain registrar (GoDaddy / Namecheap / Cloudflare / BigRock):
   - Go to **DNS Management / DNS Records**.
   - Add the **A Records** pointing to Firebase IP addresses.
6. Firebase will automatically generate a **Free SSL (HTTPS) Certificate** for your domain within 15–30 minutes!

---

## Software Selling & SaaS Customization Tips

1. **Multi-Hospital White Labeling**: Change the clinic logo, colors, and clinic name in `js/store.js` or through the Admin System Settings panel.
2. **Role Management**: Assign specific staff members as Doctors or Admins via the Admin User Management tab.
3. **Automated Reminders**: Enable SMS / Email notification toggles in System Settings.
