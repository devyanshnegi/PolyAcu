import { GoogleGenerativeAI } from "@google/generative-ai";
import { getTopicsBySubjectAndLevel, SubjectTopic } from "./csv-parser";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);
if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error("Missing NEXT_PUBLIC_GEMINI_API_KEY environment variable");
}

export type QuestionType = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

export async function generateQuestion(
  subject: string,
  level: string
): Promise<QuestionType> {
  try {
    const relevantTopics = getTopicsBySubjectAndLevel(subject, level);

    if (relevantTopics.length === 0) {
      return generateGenericQuestion(subject, level);
    }

    const selectedTopic =
      relevantTopics[Math.floor(Math.random() * relevantTopics.length)];

    const prompt = `
      Generate a multiple-choice question about ${subject}, specifically on the topic of "${selectedTopic.topic}" at ${level} difficulty level.
      
      The learning objective is: "${selectedTopic.learningObjective}"
      
      Here's an example question for reference: "${selectedTopic.exampleQuestion}"
      
      Format your response as JSON with the following structure:
      {
        "question": "The question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "The correct answer (exact match to one of the options)",
        "explanation": "Brief explanation of why this answer is correct"
      }
      
      The options should include one correct answer and three plausible but incorrect alternatives.
      Return ONLY the JSON object without any additional text.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Failed to parse JSON from Gemini response");
    }

    const questionData = JSON.parse(jsonMatch[0]) as QuestionType;

    return questionData;
  } catch (error) {
    console.error("Error generating question:", error);
    throw error;
  }
}

async function generateGenericQuestion(
  subject: string,
  level: string
): Promise<QuestionType> {
  try {
    const prompt = `
      Generate a multiple-choice question about ${subject} at ${level} difficulty level.
      
      Format your response as JSON with the following structure:
      {
        "question": "The question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "The correct answer (exact match to one of the options)",
        "explanation": "Brief explanation of why this answer is correct"
      }
      
      The options should include one correct answer and three plausible but incorrect alternatives.
      Return ONLY the JSON object without any additional text.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Failed to parse JSON from Gemini response");
    }

    const questionData = JSON.parse(jsonMatch[0]) as QuestionType;

    return questionData;
  } catch (error) {
    console.error("Error generating question:", error);
    throw error;
  }
}
