import { GoogleGenerativeAI } from "@google/generative-ai";

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export const chatWithGemini = async (messages: Message[], apiKey: string, resumeContext?: string) => {
  if (!apiKey) {
    throw new Error("API Key is required");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  let systemPromptText = `You are CareerGuide AI, an expert career counselor and mentor. You help users with:
- Career guidance and recommendations
- Resume improvement tips
- Interview preparation
- Skill development advice
- Industry insights and trends
- Job search strategies
- Salary negotiation tips

Be friendly, encouraging, and provide actionable advice. Use Indian context when discussing salaries (use INR), companies, and job market trends. Be concise but thorough.`;

  if (resumeContext) {
    systemPromptText += `\n\nThe user has uploaded their resume. Here's their profile summary:\n${resumeContext}`;
  }
  
  // Filter out system messages and map roles
  let cleanHistory = messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  // Remove the last message (it will be sent separately)
  cleanHistory = cleanHistory.slice(0, -1);

  // Ensure history starts with 'user' role - remove leading 'model' messages
  while (cleanHistory.length > 0 && cleanHistory[0].role === 'model') {
    cleanHistory.shift();
  }
  
  const lastMsg = messages[messages.length - 1];
  const fullPrompt = `${systemPromptText}\n\nUser Query: ${lastMsg.content}`;

  const chat = model.startChat({
    history: cleanHistory,
  });

  const result = await chat.sendMessageStream(fullPrompt);
  return result.stream;
};

export const analyzeResume = async (resumeText: string, apiKey: string) => {
  if (!apiKey) {
    throw new Error("API Key is required");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const systemPrompt = `You are an expert career counselor and resume analyst. Analyze the provided resume and extract detailed information. Return a valid JSON object with the following structure:
{
  "summary": "A comprehensive 2-3 sentence professional summary of the candidate",
  "strengths": ["Array of 4-6 key strengths based on the resume"],
  "weaknesses": ["Array of 3-4 areas for improvement or skill gaps"],
  "skills": ["Array of all technical and soft skills mentioned"],
  "experience": "Summary of work experience with years and key roles",
  "projects": "Summary of notable projects with technologies used",
  "education": "Educational background summary",
  "careerRecommendations": [
    {
      "role": "Job Title",
      "matchPercentage": 85,
      "company": "Example Company Name",
      "salaryRange": "₹8,00,000 - ₹12,00,000 per annum",
      "description": "Why this role is a good fit",
      "requiredSkills": ["skill1", "skill2"],
      "missingSkills": ["skill that candidate should learn"]
    }
  ],
  "resumeImprovements": [
    "Specific suggestion to improve the resume",
    "Another actionable improvement"
  ]
}

For careerRecommendations, provide 5-7 job roles with realistic Indian company names and salaries in INR format.`;

  const prompt = `${systemPrompt}\n\nPlease analyze this resume and provide detailed career recommendations:\n\n${resumeText}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();
  
  // Clean potential markdown blocks
  text = text.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();

  try {
      return JSON.parse(text);
  } catch (e) {
      console.error("Failed to parse JSON response:", text);
      throw new Error("Failed to parse AI response. Please try again.");
  }
};
