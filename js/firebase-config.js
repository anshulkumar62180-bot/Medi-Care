/**
 * MediCare Pulse - Firebase Web SDK v10 Configuration & Core Initialization
 * 
 * Instructions for Live Cloud Deployment:
 * Replace the firebaseConfig object below with your actual project keys from Firebase Console:
 * Firebase Console -> Project Settings -> General -> Your apps -> Web app SDK setup
 */

// Production Firebase Project Configuration Placeholder
const firebaseConfig = {
  apiKey: "AIzaSyDemoKey_ReplaceWithYourActualFirebaseApiKey",
  authDomain: "medicare-pulse-saas.firebaseapp.com",
  projectId: "medicare-pulse-saas",
  storageBucket: "medicare-pulse-saas.appspot.com",
  messagingSenderId: "102938475610",
  appId: "1:102938475610:web:a1b2c3d4e5f67890"
};

let firebaseApp = null;
let firebaseAuth = null;
let firebaseDb = null;
let isFirebaseReady = false;

window.initFirebaseServices = async function() {
  try {
    // Import Firebase SDK v10 modules dynamically from CDN
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js");
    const { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js");
    const { getFirestore, collection, doc, setDoc, getDoc, getDocs, onSnapshot, addDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");

    // Initialize Firebase
    firebaseApp = initializeApp(firebaseConfig);
    firebaseAuth = getAuth(firebaseApp);
    firebaseDb = getFirestore(firebaseApp);
    isFirebaseReady = true;

    // Attach to global window scope for app access
    window.fbAuth = firebaseAuth;
    window.fbDb = firebaseDb;
    window.fbGoogleProvider = new GoogleAuthProvider();
    window.fbUtils = {
      signInWithPopup,
      signInWithEmailAndPassword,
      createUserWithEmailAndPassword,
      signOut,
      onAuthStateChanged,
      collection,
      doc,
      setDoc,
      getDoc,
      getDocs,
      onSnapshot,
      addDoc,
      updateDoc,
      deleteDoc,
      query,
      where,
      orderBy,
      serverTimestamp
    };

    console.log("⚡ Firebase Production SDK Initialized successfully!");
    return true;
  } catch (err) {
    console.warn("Firebase CDN initialization notice: Operating in high-performance hybrid mode.", err);
    isFirebaseReady = false;
    return false;
  }
};
