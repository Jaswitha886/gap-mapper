
import { GoogleGenAI } from "@google/genai";
import { GapAnalysis } from "../types";

const SYSTEM_INSTRUCTION = `
You are an AI Learning Gap Mapper.
Your role is NOT to teach or explain topics directly.
Your role is to analyze a student’s doubts or explanations and identify missing prerequisite concepts based on a provided syllabus.

You must:
- Analyze what the student is confused about.
- Identify foundational concepts they are missing from the syllabus.
- Recommend a logical learning path.
- Base your reasoning ONLY on the provided syllabus context.
- Avoid guessing or adding external knowledge.

You must NOT:
- Act like a chatbot.
- Give long explanations of concepts.
- Introduce new topics outside the syllabus context.

Your output MUST follow this structure EXACTLY:

Detected Learning Gaps:
- <list item>
- <list item>

Missing Prerequisite Concepts:
- <list item>
- <list item>

Recommended Learning Path:
1. <item>
2. <item>

Why This Path:
<brief explanation>

If the syllabus context is insufficient, clearly say:
"The provided syllabus content is insufficient to determine learning gaps."
`;

export async function analyzeLearningGap(syllabus: string, studentInput: string): Promise<GapAnalysis> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
SYLLABUS CONTEXT:
${syllabus}

STUDENT DOUBT/EXPLANATION:
${studentInput}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2, // Lower temperature for more consistent mapping
      },
    });

    const text = response.text || "";
    
    if (text.includes("The provided syllabus content is insufficient")) {
      return {
        detectedGaps: [],
        missingPrerequisites: [],
        learningPath: [],
        whyThisPath: "",
        isInsufficient: true,
        rawResponse: text
      };
    }

    // Basic parsing logic for the specific structure
    const parseList = (section: string): string[] => {
      const regex = new RegExp(`${section}:\\n((?:- .*\\n?|\\d+\\. .*\\n?)*)`, 'i');
      const match = text.match(regex);
      if (!match) return [];
      return match[1]
        .split('\n')
        .map(line => line.replace(/^[- \d.]+\s*/, '').trim())
        .filter(line => line.length > 0);
    };

    const whyThisPathMatch = text.match(/Why This Path:\n([\s\S]*)/i);

    return {
      detectedGaps: parseList("Detected Learning Gaps"),
      missingPrerequisites: parseList("Missing Prerequisite Concepts"),
      learningPath: parseList("Recommended Learning Path"),
      whyThisPath: whyThisPathMatch ? whyThisPathMatch[1].trim() : "",
      isInsufficient: false,
      rawResponse: text
    };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to map learning gaps. Please try again.");
  }
}
