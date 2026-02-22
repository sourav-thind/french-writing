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

if (typeof window !== 'undefined') {
  initializeFirebase();
}

export { app, auth, googleProvider, db };
export { initializeFirebase };

export interface StoredCollection {
  id: string;
  name: string;
  description: string;
  sentenceIds: string[];
  userId: string;
  createdAt: Date;
}

export interface StoredSentence {
  id: string;
  french: string;
  english: string;
  collectionId: string;
}

export interface UserProgress {
  userId: string;
  collectionId: string;
  sentenceProgress: { [sentenceIndex: number]: number };
  repeatEnabled: boolean;
  updatedAt: Date;
}

export async function saveCollectionToFirestore(collectionData: StoredCollection, sentences: { french: string; english: string }[]): Promise<string> {
  if (!db) throw new Error("Firestore not initialized");
  
  try {
    const batchSize = 100;
    const sentenceIds: string[] = [];
    
    for (let i = 0; i < sentences.length; i += batchSize) {
      const batch = sentences.slice(i, i + batchSize);
      
      for (let j = 0; j < batch.length; j++) {
        const sentenceId = `${collectionData.id}_sentence_${i + j}`;
        sentenceIds.push(sentenceId);
        
        const sentenceRef = doc(db, "sentences", sentenceId);
        await setDoc(sentenceRef, {
          id: sentenceId,
          french: batch[j].french,
          english: batch[j].english,
          collectionId: collectionData.id
        });
      }
    }

    const colRef = doc(db, "customCollections", collectionData.id);
    await setDoc(colRef, {
      id: collectionData.id,
      name: collectionData.name,
      description: collectionData.description,
      sentenceIds,
      userId: collectionData.userId,
      createdAt: new Date()
    });
    
    return collectionData.id;
  } catch (error: any) {
    console.error("Error saving collection:", error.message);
    throw error;
  }
}

export async function getUserCollections(userId: string): Promise<StoredCollection[]> {
  if (!db) {
    console.warn("Firestore not initialized, returning empty array");
    return [];
  }
  
  try {
    const colRef = collection(db, "customCollections");
    const q = query(colRef);
    const snapshot = await getDocs(q);
    
    return snapshot.docs
      .map(doc => doc.data() as StoredCollection)
      .filter(c => c.userId === userId);
  } catch (error: any) {
    console.error("Error fetching collections:", error.message);
    return [];
  }
}

export async function getCollectionSentences(collectionId: string): Promise<{ french: string; english: string }[]> {
  if (!db) return [];
  
  try {
    const sentencesRef = collection(db, "sentences");
    const q = query(sentencesRef);
    const snapshot = await getDocs(q);
    
    return snapshot.docs
      .map(doc => doc.data() as StoredSentence)
      .filter(s => s.collectionId === collectionId)
      .map(s => ({ french: s.french, english: s.english }));
  } catch (error: any) {
    console.error("Error fetching sentences:", error.message);
    return [];
  }
}

export async function getUserProgress(userId: string, collectionId: string): Promise<UserProgress | null> {
  if (!db) return null;
  
  try {
    const progressRef = doc(db, "userProgress", `${userId}_${collectionId}`);
    const snapshot = await getDoc(progressRef);
    
    if (!snapshot.exists()) return null;
    return snapshot.data() as UserProgress;
  } catch (error: any) {
    console.error("Error fetching progress:", error.message);
    return null;
  }
}

export async function saveUserProgress(progress: UserProgress): Promise<void> {
  if (!db) throw new Error("Firestore not initialized");
  
  try {
    const progressRef = doc(db, "userProgress", `${progress.userId}_${progress.collectionId}`);
    await setDoc(progressRef, {
      ...progress,
      updatedAt: new Date()
    });
  } catch (error: any) {
    console.error("Error saving progress:", error.message);
    throw error;
  }
}

export async function getAllUserProgress(userId: string): Promise<UserProgress[]> {
  if (!db) return [];
  
  try {
    const progressRef = collection(db, "userProgress");
    const q = query(progressRef);
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return [];
    
    return snapshot.docs
      .map(doc => doc.data() as UserProgress)
      .filter(p => p.userId === userId);
  } catch (error: any) {
    console.error("Error fetching all progress:", error.message);
    return [];
  }
}
