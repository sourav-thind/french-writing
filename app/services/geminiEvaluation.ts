import { getGeminiAPIKey } from './geminiService';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface TextCorrection {
  original: string;
  corrected: string;
  explanation: string;
}

export interface TEFEvaluation {
  grammarStructure: {
    score: number;
    maxScore: number;
    feedback: string;
    clbLevel: number;
  };
  vocabulary: {
    score: number;
    maxScore: number;
    feedback: string;
    clbLevel: number;
  };
  coherenceCohesion: {
    score: number;
    maxScore: number;
    feedback: string;
    clbLevel: number;
  };
  taskCompletion: {
    score: number;
    maxScore: number;
    feedback: string;
    clbLevel: number;
  };
  overallCLB: number;
  overallFeedback: string;
  wordCount: number;
  timeSpent: string;
  corrections: TextCorrection[];
}

const EVALUATION_PROMPT = `You are an expert TEF (Test d'Évaluation de Français) evaluator and CLB (Canadian Language Benchmark) assessor. Evaluate the following French writing sample based on the TEF Canada writing criteria.

TASK TYPE: {taskType}
TASK DESCRIPTION: {taskDescription}
WORD COUNT REQUIREMENT: {wordCountMin}-{wordCountMax} words
ACTUAL WORD COUNT: {actualWordCount}
TIME SPENT: {timeSpent}

STUDENT'S TEXT:
{text}

Evaluate the writing across these 4 criteria, each scored out of 15 points:

1. GRAMMAR AND STRUCTURE (Grammaire et structure)
   - Accuracy of verb conjugations
   - Sentence structure variety
   - Use of complex structures
   - Agreement (gender, number)
   - Pronoun usage

2. VOCABULARY (Vocabulaire)
   - Range and appropriateness
   - Precision of word choice
   - Use of idiomatic expressions
   - Register appropriateness

3. COHERENCE AND COHESION (Cohérence et cohésion)
   - Logical flow and organization
   - Use of linking words and transitions
   - Paragraph structure
   - Ideas development

4. TASK COMPLETION (Réalisation de la tâche)
   - Addressing all parts of the prompt
   - Appropriateness of content
   - Register and tone
   - Word count adherence

For each criterion, provide:
- Score (0-15)
- CLB equivalent level (1-12)
- Brief feedback in French (2-3 sentences)

Also provide:
- Overall CLB level (1-12) based on average of the four criteria
- Overall feedback in French (3-4 sentences summarizing strengths and areas for improvement)

Additionally, provide TEXT CORRECTIONS:
- Identify specific errors in the student's text (grammar, spelling, vocabulary)
- For each error, provide: the original text, the corrected version, and a brief explanation
- Also provide the full corrected version of the entire text

Return ONLY a valid JSON object with this exact structure:
{
  "grammarStructure": {
    "score": number,
    "maxScore": 15,
    "feedback": "string in French",
    "clbLevel": number
  },
  "vocabulary": {
    "score": number,
    "maxScore": 15,
    "feedback": "string in French",
    "clbLevel": number
  },
  "coherenceCohesion": {
    "score": number,
    "maxScore": 15,
    "feedback": "string in French",
    "clbLevel": number
  },
  "taskCompletion": {
    "score": number,
    "maxScore": 15,
    "feedback": "string in French",
    "clbLevel": number
  },
  "overallCLB": number,
  "overallFeedback": "string in French",
  "corrections": [
    {
      "original": "incorrect word or phrase",
      "corrected": "correct word or phrase",
      "explanation": "brief explanation in French"
    }
  ]
}`;

export async function evaluateWriting(
  text: string,
  taskType: string,
  taskDescription: string,
  wordCountMin: number,
  wordCountMax: number,
  actualWordCount: number,
  timeSpent: string
): Promise<TEFEvaluation> {
  const apiKey = getGeminiAPIKey();
  
  if (!apiKey) {
    throw new Error('Clé API Gemini non configurée. Veuillez configurer votre clé API dans les paramètres (bouton clé en bas à droite).');
  }

  // Clean the text
  const cleanText = text.substring(0, 3000);

  const prompt = EVALUATION_PROMPT
    .replace('{taskType}', taskType)
    .replace('{taskDescription}', taskDescription)
    .replace('{wordCountMin}', wordCountMin.toString())
    .replace('{wordCountMax}', wordCountMax.toString())
    .replace('{actualWordCount}', actualWordCount.toString())
    .replace('{timeSpent}', timeSpent)
    .replace('{text}', cleanText);

  try {
    console.log('Initializing Gemini API...');
    
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try models in order of preference
    // Note: gemini-1.5 models are widely available on free tier
    const models = [
      'gemini-2.5-flash',  // Fast, widely available
      'gemini-3-flash',    // Better quality, also widely available
      'gemini-1.0-pro'     // Fallback for older accounts
    ];
    let lastError: any = null;
    
    for (const modelName of models) {
      try {
        console.log(`Trying model: ${modelName}`);
        
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 8192, // Increased to prevent truncation
            responseMimeType: "application/json",
          }
        });
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const generatedText = response.text();
        
        console.log(`Model ${modelName} succeeded`);
        console.log('Generated text:', generatedText);
        
        // Parse JSON response
        let evaluation: TEFEvaluation;
        try {
          // Clean the response - remove markdown code blocks if present
          let cleanedText = generatedText.trim();
          if (cleanedText.startsWith('```json')) {
            cleanedText = cleanedText.replace(/```json\n?/, '').replace(/```$/, '');
          } else if (cleanedText.startsWith('```')) {
            cleanedText = cleanedText.replace(/```\n?/, '').replace(/```$/, '');
          }
          
          // Try direct JSON parsing first
          evaluation = JSON.parse(cleanedText) as TEFEvaluation;
        } catch (parseError) {
          console.warn('Direct JSON parsing failed, trying to extract JSON...');
          
          // If direct parsing fails, try extracting JSON between braces
          const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
          if (!jsonMatch) {
            console.error('No JSON found in response:', generatedText);
            throw new Error('JSON non trouvé dans la réponse');
          }
          
          try {
            evaluation = JSON.parse(jsonMatch[0]) as TEFEvaluation;
          } catch (extractError) {
            console.error('Failed to parse extracted JSON:', jsonMatch[0]);
            throw new Error('Format JSON invalide dans la réponse');
          }
        }
        
        // Validate structure
        if (!evaluation.grammarStructure || !evaluation.vocabulary || 
            !evaluation.coherenceCohesion || !evaluation.taskCompletion || 
            !evaluation.overallCLB || !evaluation.overallFeedback) {
          throw new Error('Structure d\'évaluation incomplète');
        }
        
        // Add metadata
        return {
          ...evaluation,
          wordCount: actualWordCount,
          timeSpent: timeSpent
        };
        
      } catch (error: any) {
        console.warn(`Model ${modelName} failed:`, error.message);
        lastError = error;
        
        // If it's a 404 (model not found), log it specifically
        if (error.message?.includes('404') || error.message?.includes('not found')) {
          console.warn(`Model ${modelName} not available (404), will try next model`);
        }
        
        // Continue to next model
        continue;
      }
    }
    
    // If all models failed
    if (lastError?.message?.includes('404')) {
      throw new Error('Aucun modèle Gemini disponible avec votre clé API. Vérifiez que votre clé est active sur https://aistudio.google.com/app/apikey');
    }
    throw lastError || new Error('Aucun modèle disponible');
    
  } catch (error: any) {
    console.error('Evaluation error:', error);
    
    if (error.message?.includes('API key not valid')) {
      throw new Error('Clé API invalide. Vérifiez votre clé dans les paramètres.');
    } else if (error.message?.includes('Quota exceeded')) {
      throw new Error('Quota dépassé. Attendez quelques minutes avant de réessayer.');
    } else if (error.message?.includes('not found')) {
      throw new Error('Modèle non trouvé. Vérifiez votre clé API dans Google AI Studio.');
    }
    
    throw new Error(`Erreur: ${error.message || 'Problème inconnu'}`);
  }
}

export function getCLBDescription(clbLevel: number): string {
  if (clbLevel >= 10) return 'Avancé (Advanced)';
  if (clbLevel >= 7) return 'Intermédiaire avancé (High Intermediate)';
  if (clbLevel >= 5) return 'Intermédiaire (Intermediate)';
  if (clbLevel >= 3) return 'Débutant avancé (High Beginner)';
  return 'Débutant (Beginner)';
}

export function getCLBColor(clbLevel: number): string {
  if (clbLevel >= 10) return 'text-emerald-600 dark:text-emerald-400';
  if (clbLevel >= 7) return 'text-blue-600 dark:text-blue-400';
  if (clbLevel >= 5) return 'text-amber-600 dark:text-amber-400';
  if (clbLevel >= 3) return 'text-orange-600 dark:text-orange-400';
  return 'text-rose-600 dark:text-rose-400';
}

// Mock evaluation for testing when API is not available
export function generateMockEvaluation(
  text: string,
  actualWordCount: number,
  timeSpent: string
): TEFEvaluation {
  const baseScore = Math.min(15, Math.max(5, Math.floor(actualWordCount / 10)));
  const variance = Math.floor(Math.random() * 3) - 1;
  
  const grammarScore = Math.min(15, Math.max(0, baseScore + variance));
  const vocabScore = Math.min(15, Math.max(0, baseScore + variance + 1));
  const coherenceScore = Math.min(15, Math.max(0, baseScore + variance - 1));
  const taskScore = Math.min(15, Math.max(0, baseScore + variance));
  
  const avgScore = (grammarScore + vocabScore + coherenceScore + taskScore) / 4;
  const overallCLB = Math.min(12, Math.max(1, Math.floor(avgScore / 1.25)));
  
  // Generate some mock corrections based on the text
  const mockCorrections = [
    {
      original: "je suis allé",
      corrected: "je suis allé(e)",
      explanation: "Accord du participe passé avec l'auxiliaire être"
    },
    {
      original: "beaucoup des",
      corrected: "beaucoup de",
      explanation: "On utilise 'de' après 'beaucoup', pas 'des'"
    },
    {
      original: "plus mieux",
      corrected: "mieux",
      explanation: "'Mieux' est déjà le comparatif de 'bien', inutile d'ajouter 'plus'"
    }
  ].filter(() => Math.random() > 0.5); // Randomly include some corrections
  
  return {
    grammarStructure: {
      score: grammarScore,
      maxScore: 15,
      feedback: "Bon usage des conjugaisons verbales. Quelques erreurs d'accord à corriger.",
      clbLevel: Math.min(12, Math.max(1, Math.floor(grammarScore / 1.25)))
    },
    vocabulary: {
      score: vocabScore,
      maxScore: 15,
      feedback: "Vocabulaire varié et approprié. Continuez à enrichir vos expressions idiomatiques.",
      clbLevel: Math.min(12, Math.max(1, Math.floor(vocabScore / 1.25)))
    },
    coherenceCohesion: {
      score: coherenceScore,
      maxScore: 15,
      feedback: "Bonne organisation des idées. Les connecteurs logiques sont bien utilisés.",
      clbLevel: Math.min(12, Math.max(1, Math.floor(coherenceScore / 1.25)))
    },
    taskCompletion: {
      score: taskScore,
      maxScore: 15,
      feedback: "La tâche est bien réalisée. Tous les points demandés sont abordés.",
      clbLevel: Math.min(12, Math.max(1, Math.floor(taskScore / 1.25)))
    },
    overallCLB: overallCLB,
    overallFeedback: `Bon travail ! Votre texte démontre une bonne maîtrise du français. Votre niveau CLB ${overallCLB} indique que vous êtes ${getCLBDescription(overallCLB).toLowerCase()}. Continuez à pratiquer pour améliorer votre fluidité et votre précision.`,
    wordCount: actualWordCount,
    timeSpent: timeSpent,
    corrections: mockCorrections
  };
}

export default evaluateWriting;
