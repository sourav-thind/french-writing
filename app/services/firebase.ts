'use client';

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";
import { getFirestore, Firestore, collection, doc, getDoc, setDoc, query, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ""
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let googleProvider: GoogleAuthProvider | undefined;
let db: Firestore | undefined;

function initializeFirebase() {
  if (typeof window === 'undefined') return;
  
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  db = getFirestore(app);
}

// Initialize on first import (client-side only)
if (typeof window !== 'undefined') {
  initializeFirebase();
}

export { app, auth, googleProvider, db };
export { initializeFirebase };

export interface StoredCollection {
  id: string;
  name: string;
  description: string;
  sentences: { french: string; english: string }[];
  userId: string;
  createdAt: Date;
}

export async function saveCollectionToFirestore(collectionData: StoredCollection): Promise<string> {
  if (!db) throw new Error("Firestore not initialized");
  
  const colRef = doc(db, "customCollections", collectionData.id);
  await setDoc(colRef, {
    ...collectionData,
    createdAt: new Date()
  });
  return collectionData.id;
}

export async function getCollectionFromFirestore(collectionId: string): Promise<StoredCollection | null> {
  if (!db) throw new Error("Firestore not initialized");
  
  const colRef = doc(db, "customCollections", collectionId);
  const snapshot = await getDoc(colRef);
  
  if (!snapshot.exists()) return null;
  return snapshot.data() as StoredCollection;
}

export async function getUserCollections(userId: string): Promise<StoredCollection[]> {
  if (!db) throw new Error("Firestore not initialized");
  
  const colRef = collection(db, "customCollections");
  const q = query(colRef);
  const snapshot = await getDocs(q);
  
  return snapshot.docs
    .map(doc => doc.data() as StoredCollection)
    .filter(c => c.userId === userId);
}
