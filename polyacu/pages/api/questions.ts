// pages/api/questions.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { generateQuestion } from "../../lib/question-generator";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { subject, level = "intermediate" } = req.body; // Default to 'intermediate' instead of 'medium'

    if (!subject) {
      return res.status(400).json({ error: "Subject is required" });
    }

    // Validate level value
    if (level && !["beginner", "intermediate", "advanced"].includes(level)) {
      return res.status(400).json({
        error:
          "Invalid level. Must be one of: beginner, intermediate, advanced",
      });
    }

    const questionData = await generateQuestion(subject, level);

    return res.status(200).json(questionData);
  } catch (error) {
    console.error("Error generating question:", error);
    return res.status(500).json({ error: "Failed to generate question" });
  }
}
