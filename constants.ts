
import { Book } from './types';

export const MOCK_BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    category: 'Literature',
    year: 1988,
    description: 'A fable about following your dream, following the paths of a shepherd boy from Spain to Egypt.',
    historicalContext: 'While a modern work, it draws heavily on the tradition of the Sufi teaching tale, popularized by figures like Rumi and Attar.',
    themes: ['Destiny', 'Personal Legend', 'Nature'],
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
    isbn: '978-0062315007',
    pages: 208,
    language: 'English',
    publisher: 'HarperOne'
  },
  {
    id: '2',
    title: 'The Muqaddimah',
    author: 'Ibn Khaldun',
    category: 'History',
    year: 1377,
    description: 'An early Islamic philosophy of history, widely considered a precursor to modern sociology, economics, and demography.',
    historicalContext: 'Written as an introduction to his universal history, it introduces the concept of asabiyyah (social cohesion) as the driving force of civilizations.',
    themes: ['Sociology', 'Social Cohesion', 'Political Science'],
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
    isbn: '978-0691166285',
    pages: 512,
    language: 'Arabic/English',
    publisher: 'Princeton University Press'
  },
  {
    id: '3',
    title: 'Hayy ibn Yaqdhan',
    author: 'Ibn Tufail',
    category: 'Philosophy',
    year: 1160,
    description: 'A philosophical novel about a self-taught boy growing up on a desert island, exploring human reason and spirituality.',
    historicalContext: 'This work significantly influenced Enlightenment thinkers and is often cited as a proto-scientific exploration of tabula rasa.',
    themes: ['Empiricism', 'Rationalism', 'Solitude'],
    coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800',
    isbn: '978-0226307138',
    pages: 256,
    language: 'Arabic',
    publisher: 'University of Chicago Press'
  },
  {
    id: '4',
    title: 'The Conference of the Birds',
    author: 'Attar of Nishapur',
    category: 'Literature',
    year: 1177,
    description: 'A celebrated literary masterpiece of Persian Sufi poetry that describes the journey of birds toward the Simurgh.',
    historicalContext: 'Attar’s work is the definitive allegorical representation of the Sufi path, influencing centuries of mystical literature.',
    themes: ['Mysticism', 'Sufism', 'Divine Love'],
    coverImage: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=800',
    isbn: '978-0140444346',
    pages: 240,
    language: 'Persian',
    publisher: 'Penguin Classics'
  },
  {
    id: '5',
    title: 'The Book of Knowledge',
    author: 'Al-Ghazali',
    category: 'Theology',
    year: 1100,
    description: 'A monumental work from the Ihya Ulum al-Din focusing on the virtues of knowledge and the ethical responsibilities of scholars.',
    historicalContext: 'Al-Ghazali sought to reconcile traditional theology with mystical intuition, fundamentally shaping mainstream Islamic thought.',
    themes: ['Ethics', 'Epistemology', 'Virtue'],
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
    isbn: '978-1941610152',
    pages: 320,
    language: 'Arabic/English',
    publisher: 'Fons Vitae'
  },
  {
    id: '6',
    title: 'Islamic Geometric Patterns',
    author: 'Eric Broug',
    category: 'Art',
    year: 2008,
    description: 'A detailed study of the mathematical and aesthetic principles behind classical Islamic geometric design.',
    historicalContext: 'Geometry in Islamic art represents the infinite nature of God and the underlying order of the universe.',
    themes: ['Geometry', 'Mathematics', 'Aesthetics'],
    coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800',
    isbn: '978-0500287217',
    pages: 128,
    language: 'English',
    publisher: 'Thames & Hudson'
  }
];

export const CATEGORIES: string[] = ['All', 'Philosophy', 'Theology', 'History', 'Literature', 'Science', 'Art'];
