// CivicLens — Google Gemini AI Client (Server-side only)
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

// Model list to try in order of preference
const MODEL_NAMES = ['gemini-1.5-flash-latest', 'gemini-1.5-flash', 'gemini-1.5-pro-latest', 'gemini-1.5-pro', 'gemini-pro'];

export async function analyzeImage(imageBase64: string, mimeType: string) {
  if (!apiKey || apiKey.startsWith('AQ.')) {
    // Return null silently if key is invalid placeholder so clean fallback dataset is used
    return null;
  }

  const prompt = `You are a civic infrastructure analysis assistant. Analyze this image and identify any civic infrastructure issues.

Return ONLY a valid JSON object (no markdown, no code fences) with this exact structure:
{
  "issueType": "pothole" | "road_damage" | "broken_streetlight" | "garbage_dumping" | "water_leakage" | "drainage_overflow" | "damaged_footpath" | "fallen_tree" | "poster_advertisement" | "public_littering" | "damaged_public_property" | "debris_obstruction",
  "confidence": 0.0 to 1.0,
  "severity": "low" | "medium" | "high" | "critical",
  "description": "Brief factual description of the visible issue",
  "evidenceNotes": ["note1", "note2"],
  "needsHumanReview": true or false
}

If no civic issue is clearly visible, set confidence below 0.5 and needsHumanReview to true.
Be factual and neutral. Never assign blame or guilt.`;

  for (const modelName of MODEL_NAMES) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: imageBase64,
            mimeType: mimeType,
          },
        },
      ]);

      const responseText = result.response.text();
      const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleaned);
    } catch {
      // Try next model candidate
      continue;
    }
  }

  return null;
}

export async function generateComplaint(data: {
  issueType: string;
  severity: string;
  description: string;
  location: string;
  projectReference: string;
  maintenanceStatus: string;
}) {
  if (!apiKey || apiKey.startsWith('AQ.')) {
    return null;
  }

  const prompt = `Generate a factual, professional civic complaint based on this information.

Issue: ${data.issueType}
Severity: ${data.severity}
Description: ${data.description}
Location: ${data.location}
Related Project: ${data.projectReference}
Maintenance Status: ${data.maintenanceStatus}

Return ONLY a valid JSON object (no markdown, no code fences):
{
  "title": "Concise complaint title",
  "description": "Professional complaint description (2-3 sentences). Be factual. Reference the project/maintenance context. Request inspection. Do NOT assign blame, guilt, or responsibility to any person or contractor.",
  "requestedAction": "Specific action requested (e.g., 'Please inspect the affected road section and initiate necessary repairs.')"
}

Rules:
- Be factual and neutral
- Never use words like 'guilty', 'corrupt', 'negligent', 'responsible', 'fault'
- Reference the maintenance period if relevant
- Keep it professional and respectful`;

  for (const modelName of MODEL_NAMES) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleaned);
    } catch {
      continue;
    }
  }

  return null;
}
