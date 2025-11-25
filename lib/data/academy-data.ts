export interface Course {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  duration: string;
  students: string;
  rating: number;
  image: string;
}

export interface Instructor {
  id: number;
  name: string;
  specialty: string;
  tagline: string;
  image: string;
  courses: number;
  students: string;
}

export const COURSES: Course[] = [
  {
    id: 1,
    title: 'AI Fundamentals & Machine Learning',
    subtitle: 'Build intelligent systems from scratch',
    category: 'Beginner',
    duration: '8 weeks',
    students: '2.5K',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80'
  },
  {
    id: 2,
    title: 'Deep Learning & Neural Networks',
    subtitle: 'Master advanced AI architectures',
    category: 'Advanced',
    duration: '12 weeks',
    students: '1.8K',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&q=80'
  },
  {
    id: 3,
    title: 'Natural Language Processing & Chatbots',
    subtitle: 'Build conversational AI systems',
    category: 'Intermediate',
    duration: '10 weeks',
    students: '3.1K',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&q=80'
  },
  {
    id: 4,
    title: 'Computer Vision & Image Processing',
    subtitle: 'Create AI that sees and understands',
    category: 'Intermediate',
    duration: '10 weeks',
    students: '1.2K',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=400&q=80'
  },
  {
    id: 5,
    title: 'Generative AI & Prompt Engineering',
    subtitle: 'Create stunning AI-generated content',
    category: 'Intermediate',
    duration: '9 weeks',
    students: '2.8K',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1677756119517-756a188d2d94?w=400&q=80'
  },
  {
    id: 6,
    title: 'AI for Business & Strategy',
    subtitle: 'Transform organizations with AI',
    category: 'Advanced',
    duration: '8 weeks',
    students: '1.9K',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80'
  }
];

export const INSTRUCTORS: Instructor[] = [
  {
    id: 1,
    name: 'Dr. Sarah Chen',
    specialty: 'Deep Learning & Neural Networks',
    tagline: 'Former Google AI Research Lead',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    courses: 5,
    students: '12K'
  },
  {
    id: 2,
    name: 'Prof. Michael Rodriguez',
    specialty: 'Computer Vision & Robotics',
    tagline: 'MIT AI Lab Director',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    courses: 4,
    students: '8.5K'
  },
  {
    id: 3,
    name: 'Dr. Aisha Patel',
    specialty: 'Natural Language Processing',
    tagline: 'OpenAI Research Scientist',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    courses: 6,
    students: '15K'
  },
  {
    id: 4,
    name: 'James Liu',
    specialty: 'Generative AI & Creative Tools',
    tagline: 'Midjourney Senior Engineer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    courses: 3,
    students: '9.2K'
  }
];
