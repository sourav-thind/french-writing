import { getFirestore, collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { app } from './firebase';

const db = app ? getFirestore(app) : null;

export interface TEFTask {
  id: string;
  type: 'tache1' | 'tache2';
  title: string;
  scenario: string;
  // Optional fields with defaults
  description?: string;
  wordCount?: {
    min: number;
    max: number;
  };
  difficulty?: 'A1' | 'A2' | 'B1' | 'B2';
  points?: number;
  answer?: string; // Optional model answer
  createdAt?: Timestamp;
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

// Sample tasks for testing when database is empty
const sampleTache1Tasks: TEFTask[] = [
  {
    id: 'task1_001',
    type: 'tache1',
    title: 'Invitation à un événement',
    description: 'Vous devez écrire une invitation pour un événement familial.',
    scenario: 'Vous organisez une fête d\'anniversaire surprise pour votre mère qui aura lieu le mois prochain. Écrivez un message à votre cousin pour l\'inviter à cette fête.\n\nDans votre message, vous devez:\n• Saluer votre cousin\n• Lui annoncer la fête surprise\n• Lui donner la date et l\'heure\n• Lui demander de confirmer sa présence',
    wordCount: { min: 60, max: 120 },
    difficulty: 'A2',
    points: 15
  },
  {
    id: 'task1_002',
    type: 'tache1',
    title: 'Message à un ami',
    description: 'Vous devez écrire un message à un ami.',
    scenario: 'Votre ami Paul vient de déménager dans une nouvelle ville. Écrivez-lui un message pour lui demander des nouvelles et lui donner des conseils pour s\'adapter.\n\nDans votre message, vous devez:\n• Saluer Paul\n• Lui demander comment il va\n• Lui donner des conseils pratiques\n• Lui souhaiter bonne chance',
    wordCount: { min: 60, max: 120 },
    difficulty: 'A2',
    points: 15
  },
  {
    id: 'task1_003',
    type: 'tache1',
    title: 'Message de remerciement',
    description: 'Vous devez écrire un message de remerciement.',
    scenario: 'Votre collègue vous a aidé(e) avec un projet important au travail. Écrivez-lui un message pour le/la remercier.\n\nDans votre message, vous devez:\n• Remercier votre collègue\n• Expliquer comment il/elle vous a aidé(e)\n• Dire ce que cela représente pour vous\n• Proposer de lui rendre la pareille',
    wordCount: { min: 60, max: 120 },
    difficulty: 'A2',
    points: 15
  }
];

const sampleTache2Tasks: TEFTask[] = [
  {
    id: 'task2_001',
    type: 'tache2',
    title: 'Lettre de réclamation',
    description: 'Vous devez rédiger une lettre formelle de réclamation.',
    scenario: 'Vous avez acheté un ordinateur portable qui ne fonctionne pas correctement. Écrivez une lettre au directeur du magasin pour vous plaindre et demander un remboursement ou un échange.\n\nDans votre lettre, vous devez:\n• Expliquer quand et où vous avez acheté l\'ordinateur\n• Décrire le problème rencontré\n• Dire ce que vous attendez comme solution\n• Exiger une réponse rapide',
    wordCount: { min: 120, max: 150 },
    difficulty: 'B1',
    points: 15
  },
  {
    id: 'task2_002',
    type: 'tache2',
    title: 'Lettre d\'opinion',
    description: 'Vous devez exprimer votre opinion sur un sujet.',
    scenario: 'Un journal local demande l\'avis de ses lecteurs sur l\'interdiction des voitures dans le centre-ville. Écrivez une lettre au rédacteur en chef pour donner votre opinion.\n\nDans votre lettre, vous devez:\n• Dire si vous êtes pour ou contre cette mesure\n• Expliquer pourquoi vous avez cette opinion\n• Donner des exemples ou arguments\n• Conclure avec une recommandation',
    wordCount: { min: 120, max: 150 },
    difficulty: 'B1',
    points: 15
  },
  {
    id: 'task2_003',
    type: 'tache2',
    title: 'Lettre de candidature',
    description: 'Vous devez rédiger une lettre de candidature.',
    scenario: 'Vous avez vu une offre d\'emploi pour un poste qui vous intéresse. Écrivez une lettre de candidature au responsable des ressources humaines.\n\nDans votre lettre, vous devez:\n• Présenter votre situation actuelle\n• Expliquer pourquoi vous postulez\n• Décrire vos compétences et expériences\n• Demander un entretien',
    wordCount: { min: 120, max: 150 },
    difficulty: 'B1',
    points: 15
  }
];

export const tefService = {
  // Get all tasks of a specific type (tache1 or tache2)
  async getTasksByType(type: 'tache1' | 'tache2'): Promise<TEFTask[]> {
    if (!db) {
      console.warn('Firestore not initialized, using sample tasks');
      // Return sample tasks as fallback
      return type === 'tache1' ? sampleTache1Tasks : sampleTache2Tasks;
    }
    
    try {
      const tasksRef = collection(db, 'tefTasks');
      const q = query(tasksRef, where('type', '==', type));
      const snapshot = await getDocs(q);
      
      const tasks = snapshot.docs.map(doc => {
        const data = doc.data();
        // Provide defaults for missing fields
        return {
          id: doc.id,
          type: data.type,
          title: data.title,
          scenario: data.scenario,
          // Optional fields with defaults
          description: data.description || (type === 'tache1' ? 'Message, invitation, lettre informelle' : 'Lettre formelle, opinion, réclamation'),
          wordCount: data.wordCount || (type === 'tache1' ? { min: 60, max: 120 } : { min: 120, max: 150 }),
          difficulty: data.difficulty || 'B1',
          points: data.points || 15,
          answer: data.answer || '',
          createdAt: data.createdAt
        } as TEFTask;
      });
      
      // If no tasks found in database, use sample tasks
      if (tasks.length === 0) {
        console.warn('No tasks found in database, using sample tasks');
        return type === 'tache1' ? sampleTache1Tasks : sampleTache2Tasks;
      }
      
      return tasks;
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      if (error.code === 'permission-denied') {
        console.warn('Permission denied, using sample tasks. Please update Firestore rules.');
        return type === 'tache1' ? sampleTache1Tasks : sampleTache2Tasks;
      }
      throw error;
    }
  },

  // Get a random task of a specific type
  async getRandomTask(type: 'tache1' | 'tache2'): Promise<TEFTask | null> {
    try {
      const tasks = await this.getTasksByType(type);
      if (tasks.length === 0) return null;
      
      const randomIndex = Math.floor(Math.random() * tasks.length);
      return tasks[randomIndex];
    } catch (error) {
      console.error('Error getting random task:', error);
      // Return a sample task as fallback
      const sampleTasks = type === 'tache1' ? sampleTache1Tasks : sampleTache2Tasks;
      return sampleTasks[0];
    }
  },

  // Get a specific task by ID
  async getTaskById(taskId: string): Promise<TEFTask | null> {
    if (!db) {
      console.warn('Firestore not initialized');
      return null;
    }
    
    try {
      const taskRef = doc(db, 'tefTasks', taskId);
      const snapshot = await getDoc(taskRef);
      
      if (!snapshot.exists()) return null;
      
      return {
        id: snapshot.id,
        ...snapshot.data()
      } as TEFTask;
    } catch (error) {
      console.error('Error fetching task by ID:', error);
      return null;
    }
  },

  // Save user essay
  async saveEssay(essay: Omit<UserEssay, 'id'>): Promise<string> {
    if (!db) {
      console.warn('Firestore not initialized, essay not saved to database');
      return 'local-' + Date.now();
    }
    
    try {
      const essaysRef = collection(db, 'userEssays');
      const docRef = await addDoc(essaysRef, {
        ...essay,
        submittedAt: Timestamp.fromDate(essay.submittedAt)
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error saving essay:', error);
      // Return a local ID even if save fails
      return 'local-' + Date.now();
    }
  },

  // Update essay
  async updateEssay(essayId: string, updates: Partial<UserEssay>): Promise<void> {
    if (!db) {
      console.warn('Firestore not initialized');
      return;
    }
    
    try {
      const essayRef = doc(db, 'userEssays', essayId);
      await updateDoc(essayRef, updates);
    } catch (error) {
      console.error('Error updating essay:', error);
    }
  },

  // Get user's essays
  async getUserEssays(userId: string): Promise<UserEssay[]> {
    if (!db) {
      console.warn('Firestore not initialized');
      return [];
    }
    
    try {
      const essaysRef = collection(db, 'userEssays');
      const q = query(essaysRef, where('userId', '==', userId));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        submittedAt: (doc.data().submittedAt as Timestamp).toDate()
      } as UserEssay));
    } catch (error) {
      console.error('Error fetching user essays:', error);
      return [];
    }
  }
};

export default tefService;
