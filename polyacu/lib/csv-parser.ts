// lib/csv-parser.ts
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

export type SubjectTopic = {
  subject: string;
  topic: string;
  level: string;
  exampleQuestion: string;  // We'll keep these property names
  learningObjective: string; // to maintain compatibility with existing code
};

export function getTopics(): SubjectTopic[] {
  try {
    const filePath = path.join(process.cwd(), "data", "PolyAcu dataset.csv");
    const fileContent = fs.readFileSync(filePath, "utf8");
    
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true, // Added trim to handle any potential whitespace
    });
    
    // Update the mapping to match your actual CSV columns
    return records.map((record: any) => ({
      subject: record.Subject,
      topic: record.Topic,
      level: record.Level,
      exampleQuestion: record.Example_Options, // Changed to match your CSV
      learningObjective: record.Output, // Changed to match your CSV
    }));
  } catch (error) {
    console.error("Error reading CSV file:", error);
    return [];
  }
}

// Add null checks to prevent the toLowerCase() error
export function getTopicsBySubjectAndLevel(
  subject: string,
  level: string
): SubjectTopic[] {
  const allTopics = getTopics();
  return allTopics.filter(
    (topic) =>
      topic && topic.subject && topic.level &&
      topic.subject.toLowerCase() === subject.toLowerCase() &&
      topic.level.toLowerCase() === level.toLowerCase()
  );
}

// The rest of your functions remain the same, but adding null checks is recommended
export function getUniqueSubjects(): string[] {
  const allTopics = getTopics();
  const subjects = new Set(allTopics.filter(topic => topic.subject).map((topic) => topic.subject));
  return Array.from(subjects);
}

export function getTopicsBySubject(subject: string): SubjectTopic[] {
  const allTopics = getTopics();
  return allTopics.filter(
    (topic) => topic && topic.subject &&
    topic.subject.toLowerCase() === subject.toLowerCase()
  );
}