
import type { NextApiRequest, NextApiResponse } from 'next';


const userProgress: Record<string, any> = {};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  if (req.method === 'GET') {
    const userId = req.query.userId as string;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    
    return res.status(200).json(userProgress[userId] || {
      hearts: 5,
      points: 0,
      streak: 0,
      completedLessons: [],
      subjectProgress: {},
    });
  }
  
  
  if (req.method === 'POST') {
    const { userId, progress } = req.body;
    
    if (!userId || !progress) {
      return res.status(400).json({ error: 'User ID and progress data are required' });
    }
    
    
    userProgress[userId] = {
      ...(userProgress[userId] || {}),
      ...progress,
    };
    
    return res.status(200).json({ success: true, progress: userProgress[userId] });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}