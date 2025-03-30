// lib/store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Subject = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

type Progress = {
  hearts: number;
  points: number;
  streak: number;
  completedLessons: string[];
  subjectProgress: Record<string, number>;
};

type Store = {
  // User progress
  progress: Progress;
  addPoints: (points: number) => void;
  loseHeart: () => void;
  refillHearts: () => void;
  completeLesson: (lessonId: string) => void;
  increaseSubjectProgress: (subjectId: string, amount: number) => void;
  
  // Subjects data
  subjects: Subject[];
};

function getSubjectIcon(subject: string): string {
  const iconMap: Record<string, string> = {
    'Physics': "⚛️",
    'Chemistry': "🧪",
    'Biology': "🧬",
    'Programming': '💻',
  };
  return iconMap[subject] || '📚';
}

function getSubjectColor(subject: string): string {
  const colorMap: Record<string, string> = {
    'Physics': '#3B82F6', // blue-500
    'Chemistry': '#10B981', // emerald-500
    'Biology': '#F59E0B', // amber-500
    'Programming': '#8B5CF6', // violet-500
  };
  
  return colorMap[subject] || '#6B7280'; // Default color (gray-500)
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      // Initial progress state
      progress: {
        hearts: 5,
        points: 0,
        streak: 0,
        completedLessons: [],
        subjectProgress: {},
      },
      
      // Progress actions
      addPoints: (points) => set((state) => ({
        progress: {
          ...state.progress,
          points: state.progress.points + points,
        }
      })),
      
      loseHeart: () => set((state) => ({
        progress: {
          ...state.progress,
          hearts: Math.max(0, state.progress.hearts - 1),
        }
      })),
      
      refillHearts: () => set((state) => ({
        progress: {
          ...state.progress,
          hearts: 5,
        }
      })),
      
      completeLesson: (lessonId) => set((state) => ({
        progress: {
          ...state.progress,
          completedLessons: [...state.progress.completedLessons, lessonId],
        }
      })),
      
      increaseSubjectProgress: (subjectId, amount) => set((state) => ({
        progress: {
          ...state.progress,
          subjectProgress: {
            ...state.progress.subjectProgress,
            [subjectId]: (state.progress.subjectProgress[subjectId] || 0) + amount,
          }
        }
      })),
      
      // Subjects for your application
      subjects: [
        {
          id: 'physics',
          name: 'Physics',
          icon: '⚛️',
          color: '#3B82F6', // blue-500
        },
        {
          id: 'chemistry',
          name: 'Chemistry',
          icon: '🧪',
          color: '#10B981', // emerald-500
        },
        {
          id: 'biology',
          name: 'Biology',
          icon: '🧬',
          color: '#F59E0B', // amber-500
        },
        {
          id: 'programming',
          name: 'Programming',
          icon: '💻',
          color: '#8B5CF6', // violet-500
        }
      ],
    }),
    {
      name: 'polyacu-storage',
    }
  )
);