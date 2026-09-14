/**
 * MediCare Pulse - Firebase Web SDK v10 Configuration & Core Initialization
 * 
 * Instructions for Live Cloud Deployment:
 * Replace the firebaseConfig object below with your actual project keys from Firebase Console:
 * Firebase Console -> Project Settings -> General -> Your apps -> Web app SDK setup
 */

// Production Firebase Project Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkDKfqFiTGfjT6CmF0r1mwWYwnJsV9_eE",
  authDomain: "medi-care-287f2.firebaseapp.com",
  projectId: "medi-care-287f2",
  storageBucket: "medi-care-287f2.firebasestorage.app",
  messagingSenderId: "170970226559",
  appId: "1:170970226559:web:908fc10789d075658e044a",
  measurementId: "G-D40TRS0V58"
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
