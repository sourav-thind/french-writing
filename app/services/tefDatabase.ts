/**
 * Firebase Database Structure for TEF Tasks
 * 
 * Collection: tefTasks
 * Document Structure:
 * 
 * {
 *   id: string (e.g., "task1_001")
 *   type: "tache1" | "tache2"
 *   title: string
 *   description: string
 *   scenario: string (the actual question/prompt)
 *   wordCount: { min: number, max: number }
 *   difficulty: "A1" | "A2" | "B1" | "B2"
 *   points: number
 *   createdAt: timestamp
 *   updatedAt: timestamp
 * }
 * 
 * Collection: userEssays
 * Document Structure:
 * {
 *   id: string
 *   userId: string
 *   taskId: string
 *   taskType: "tache1" | "tache2"
 *   content: string
 *   wordCount: number
 *   submittedAt: timestamp
 *   status: "draft" | "submitted" | "graded"
 * }
 * 
 * Firestore Rules:
 * - tefTasks: read for authenticated users, write only for admins
 * - userEssays: full CRUD for the user who created it
 */

// How to upload your 70-80 tasks to Firebase:
// 
// Option 1: Manual Upload via Firebase Console
// 1. Go to https://console.firebase.google.com
// 2. Select your project
// 3. Go to Firestore Database
// 4. Click "Start Collection"
// 5. Collection ID: "tefTasks"
// 6. Add documents manually with the structure above
// 
// Option 2: Batch Upload via Node.js Script
// 
// First, install firebase-admin:
// npm install firebase-admin
//
// Then create this script (uploadTasks.js):
/*
const admin = require('firebase-admin');

// Download service account key from Firebase Console:
// Project Settings > Service Accounts > Generate New Private Key
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Your tasks data
const tache1Tasks = [
  {
    type: 'tache1',
    title: 'Invitation à un événement',
    description: 'Vous devez écrire une invitation pour un événement familial.',
    scenario: 'Vous organisez une fête d\'anniversaire surprise pour votre mère qui aura lieu le mois prochain. Écrivez un message à votre cousin pour l\'inviter à cette fête.',
    wordCount: { min: 60, max: 120 },
    difficulty: 'A2',
    points: 15
  },
  {
    type: 'tache1',
    title: 'Message à un ami',
    description: 'Vous devez écrire un message à un ami.',
    scenario: 'Votre ami Paul vient de déménager dans une nouvelle ville. Écrivez-lui un message pour lui demander des nouvelles et lui donner des conseils.',
    wordCount: { min: 60, max: 120 },
    difficulty: 'A2',
    points: 15
  },
  // Add more Task 1 prompts here...
];

const tache2Tasks = [
  {
    type: 'tache2',
    title: 'Lettre de réclamation',
    description: 'Vous devez rédiger une lettre formelle de réclamation.',
    scenario: 'Vous avez acheté un ordinateur portable qui ne fonctionne pas correctement. Écrivez une lettre au directeur du magasin pour vous plaindre et demander un remboursement ou un échange.',
    wordCount: { min: 120, max: 150 },
    difficulty: 'B1',
    points: 15
  },
  {
    type: 'tache2',
    title: 'Lettre d\'opinion',
    description: 'Vous devez exprimer votre opinion sur un sujet.',
    scenario: 'Un journal local demande l\'avis de ses lecteurs sur l\'interdiction des voitures dans le centre-ville. Écrivez une lettre au rédacteur en chef pour donner votre opinion.',
    wordCount: { min: 120, max: 150 },
    difficulty: 'B1',
    points: 15
  },
  // Add more Task 2 prompts here...
];

async function uploadTasks() {
  const batch = db.batch();
  
  // Upload Tâche 1 tasks
  tache1Tasks.forEach((task, index) => {
    const taskRef = db.collection('tefTasks').doc(`task1_${String(index + 1).padStart(3, '0')}`);
    batch.set(taskRef, {
      ...task,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
  
  // Upload Tâche 2 tasks
  tache2Tasks.forEach((task, index) => {
    const taskRef = db.collection('tefTasks').doc(`task2_${String(index + 1).padStart(3, '0')}`);
    batch.set(taskRef, {
      ...task,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
  
  await batch.commit();
  console.log(`${tache1Tasks.length + tache2Tasks.length} tasks uploaded successfully!`);
  process.exit(0);
}

uploadTasks().catch(err => {
  console.error('Error uploading tasks:', err);
  process.exit(1);
});
*/

// To run the script:
// node uploadTasks.js

export {};
