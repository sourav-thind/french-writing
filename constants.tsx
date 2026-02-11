
import { Collection } from './types';

export const COLLECTIONS: Collection[] = [
  {
    id: 'basic-greetings',
    name: 'Salutations de base',
    description: 'Everyday greetings and simple introductions.',
    sentences: [
      { french: "Bonjour, comment ça va ?", english: "Hello, how are you?" },
      { french: "Enchanté de faire votre connaissance.", english: "Nice to meet you." },
      { french: "Salut ! Bonne journée à toi.", english: "Hi! Have a nice day." },
      { french: "Comment t'appelles-tu ?", english: "What is your name?" },
      { french: "Je m'appelle Jean.", english: "My name is Jean." },
      
    ]
  },
  {
    id: 'common-phrases',
    name: 'Phrases Courantes',
    description: 'Useful phrases for everyday survival.',
    sentences: [
      { french: "Où se trouve la boulangerie ?", english: "Where is the bakery?" },
      { french: "Je ne comprends pas ce que vous dites.", english: "I don't understand what you are saying." },
      { french: "Pouvez-vous m'aider, s'il vous plaît ?", english: "Can you help me, please?" },
      { french: "Combien ça coûte ?", english: "How much does it cost?" },
      { french: "Il fait beau aujourd'hui.", english: "The weather is nice today." }
    ]
  },
  {
    id: 'food-and-dining',
    name: 'Nourriture et Dîner',
    description: 'Ordering food and talking about meals.',
    sentences: [
      { french: "Je voudrais un croissant et un café.", english: "I would like a croissant and a coffee." },
      { french: "L'addition, s'il vous plaît.", english: "The check, please." },
      { french: "Le dîner est presque prêt.", english: "Dinner is almost ready." },
      { french: "Aimez-vous la cuisine française ?", english: "Do you like French cuisine?" },
      { french: "Une table pour deux personnes, merci.", english: "A table for two people, thank you." }
    ]
  },
  {
    id: 'travel-and-places',
    name: 'Voyage et Lieux',
    description: 'Moving around and visiting places.',
    sentences: [
      { french: "Le train arrive à quelle heure ?", english: "What time does the train arrive?" },
      { french: "Je cherche le musée du Louvre.", english: "I am looking for the Louvre museum." },
      { french: "C'est un voyage inoubliable.", english: "It's an unforgettable trip." },
      { french: "Nous allons à Paris cet été.", english: "We are going to Paris this summer." },
      { french: "Le billet est dans ma poche.", english: "The ticket is in my pocket." }
    ]
  }
];
