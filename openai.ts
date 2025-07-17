import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export interface DailySummaryData {
  productivity: number;
  wellbeing: string;
  streakCount: number;
  habitCompletionRate: number;
  goalProgress: number;
  recommendations: string[];
}

export async function generateDailySummary(
  habits: any[],
  goals: any[],
  journalEntries: any[],
  transactions: any[]
): Promise<{ summary: string; data: DailySummaryData }> {
  try {
    const prompt = `
    Analyze the following personal growth data and provide a comprehensive daily summary with insights and recommendations.

    Habits completed today: ${JSON.stringify(habits)}
    Active goals: ${JSON.stringify(goals)}
    Recent journal entries: ${JSON.stringify(journalEntries)}
    Recent transactions: ${JSON.stringify(transactions)}

    Please provide:
    1. A encouraging and personalized summary (2-3 sentences)
    2. Productivity score (1-100)
    3. Wellbeing assessment (Poor, Fair, Good, Excellent)
    4. Specific recommendations for improvement
    5. Key insights about patterns or trends

    Respond with JSON in this format:
    {
      "summary": "Personalized summary text",
      "productivity": 85,
      "wellbeing": "Good",
      "streakCount": 7,
      "habitCompletionRate": 71,
      "goalProgress": 68,
      "recommendations": ["Specific actionable recommendation 1", "Specific actionable recommendation 2"]
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a personal growth coach AI that provides insightful, encouraging, and actionable feedback based on user data. Always be supportive and focus on progress over perfection."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      summary: result.summary || "Keep up the great work on your personal growth journey!",
      data: {
        productivity: result.productivity || 75,
        wellbeing: result.wellbeing || "Good",
        streakCount: result.streakCount || 0,
        habitCompletionRate: result.habitCompletionRate || 0,
        goalProgress: result.goalProgress || 0,
        recommendations: result.recommendations || ["Continue building consistent habits", "Set specific, measurable goals"]
      }
    };
  } catch (error) {
    console.error("Error generating daily summary:", error);
    return {
      summary: "Unable to generate AI summary at this time. Keep focusing on your personal growth!",
      data: {
        productivity: 75,
        wellbeing: "Good",
        streakCount: 0,
        habitCompletionRate: 0,
        goalProgress: 0,
        recommendations: ["Continue building consistent habits", "Set specific, measurable goals"]
      }
    };
  }
}

export async function generateGoalRecommendations(
  goals: any[],
  habits: any[],
  journalEntries: any[]
): Promise<string[]> {
  try {
    const prompt = `
    Based on the following user data, suggest 3-5 specific, actionable recommendations for improving goal achievement:

    Current goals: ${JSON.stringify(goals)}
    Current habits: ${JSON.stringify(habits)}
    Recent journal entries: ${JSON.stringify(journalEntries)}

    Provide specific, actionable recommendations that could help the user achieve their goals more effectively.
    
    Respond with JSON in this format:
    {
      "recommendations": ["Specific recommendation 1", "Specific recommendation 2", "Specific recommendation 3"]
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a goal achievement coach. Provide practical, specific recommendations based on the user's current progress and patterns."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.recommendations || ["Break down large goals into smaller, manageable tasks", "Set specific deadlines for each goal", "Track progress daily"];
  } catch (error) {
    console.error("Error generating goal recommendations:", error);
    return ["Break down large goals into smaller, manageable tasks", "Set specific deadlines for each goal", "Track progress daily"];
  }
}
