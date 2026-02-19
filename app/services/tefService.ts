import { getFirestore, collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { app } from './firebase';

const db = app ? getFirestore(app) : null;

export interface TEFTask {
  id: string;
  type: 'tache1' | 'tache2';
  title: string;
  description: string;
  scenario: string;
  wordCount: {
    min: number;
    max: number;
  };
  difficulty: 'A1' | 'A2' | 'B1' | 'B2';
  points: number;
}

export interface UserEssay {
  id?: string;
  userId: string;
  taskId: string;
  taskType: 'tache1' | 'tache2' | 'practice';
  content: string;
  wordCount: number;
  submittedAt: Date;
  status: 'draft' | 'submitted' | 'graded';
  aiFeedback?: string;
}

export const tefService = {
  // Get all tasks of a specific type (tache1 or tache2)
  async getTasksByType(type: 'tache1' | 'tache2'): Promise<TEFTask[]> {
    if (!db) throw new Error('Firestore not initialized');
    
    const tasksRef = collection(db, 'tefTasks');
    const q = query(tasksRef, where('type', '==', type));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as TEFTask));
  },

  // Get a random task of a specific type
  async getRandomTask(type: 'tache1' | 'tache2'): Promise<TEFTask | null> {
    if (!db) throw new Error('Firestore not initialized');
    
    const tasks = await this.getTasksByType(type);
    if (tasks.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * tasks.length);
    return tasks[randomIndex];
  },

  // Get a specific task by ID
  async getTaskById(taskId: string): Promise<TEFTask | null> {
    if (!db) throw new Error('Firestore not initialized');
    
    const taskRef = doc(db, 'tefTasks', taskId);
    const snapshot = await getDoc(taskRef);
    
    if (!snapshot.exists()) return null;
    
    return {
      id: snapshot.id,
      ...snapshot.data()
    } as TEFTask;
  },

  // Save user essay
  async saveEssay(essay: Omit<UserEssay, 'id'>): Promise<string> {
    if (!db) throw new Error('Firestore not initialized');
    
    const essaysRef = collection(db, 'userEssays');
    const docRef = await addDoc(essaysRef, {
      ...essay,
      submittedAt: Timestamp.fromDate(essay.submittedAt)
    });
    
    return docRef.id;
  },

  // Update essay
  async updateEssay(essayId: string, updates: Partial<UserEssay>): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    
    const essayRef = doc(db, 'userEssays', essayId);
    await updateDoc(essayRef, updates);
  },

  // Get user's essays
  async getUserEssays(userId: string): Promise<UserEssay[]> {
    if (!db) throw new Error('Firestore not initialized');
    
    const essaysRef = collection(db, 'userEssays');
    const q = query(essaysRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      submittedAt: (doc.data().submittedAt as Timestamp).toDate()
    } as UserEssay));
  }
};

export default tefService;
