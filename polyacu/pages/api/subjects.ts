import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // These should match the subjects in your CSV
  const subjects = [
    {
      id: 'physics',
      name: 'Physics',
      icon: '⚛️',
      color: '#3B82F6',
    },
    {
      id: 'chemistry',
      name: 'Chemistry',
      icon: '🧪',
      color: '#10B981',
    },
    {
      id: 'biology',
      name: 'Biology',
      icon: '🧬',
      color: '#F59E0B',
    },
    {
      id: 'programming',
      name: 'Programming',
      icon: '💻',
      color: '#8B5CF6',
    }
  ];
  
  res.status(200).json(subjects);
}