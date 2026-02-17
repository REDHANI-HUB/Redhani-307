
import { GoogleGenAI, Type } from "@google/genai";
import { PredictionResult } from "../types";

export const getAIPrediction = async (
  currentCount: number, 
  density: string, 
  recentTrends: any[]
): Promise<PredictionResult> => {
  // Always initialize GoogleGenAI within the function to ensure up-to-date API key usage.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Analyze current crowd metrics for a stadium venue:
    - Current Count: ${currentCount}
    - Current Density: ${density}
    - Recent Trend: ${JSON.stringify(recentTrends)}
    
    Predict congestion risk for the next hour and provide management recommendations. 
    Focus on "Predictive Crowd Prevention" strategies.`;

  // Always use ai.models.generateContent with a prompt string or content object.
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskScore: { type: Type.NUMBER, description: "Risk score from 0 to 100" },
          forecastedCount: { type: Type.NUMBER, description: "Expected count in 60 mins" },
          recommendations: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Actionable crowd control measures"
          }
        },
        required: ["riskScore", "forecastedCount", "recommendations"]
      }
    }
  });

  try {
    // Extracting the text from the response safely and parsing as JSON.
    const jsonStr = response.text?.trim();
    if (!jsonStr) {
      throw new Error("No text content returned from the model.");
    }
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return {
      riskScore: 45,
      forecastedCount: currentCount + 100,
      recommendations: ["Maintain current surveillance", "Monitor exit flow"]
    };
  }
};
