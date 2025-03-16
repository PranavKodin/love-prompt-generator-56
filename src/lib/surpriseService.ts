import { Timestamp } from "@/lib/firebase";

// Note: These functions use the OpenAI API directly from the client side
// In a production app, you would typically call a serverless function instead
// to keep your API key secure

interface SurpriseIdea {
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  estimatedCost: string;
  category: string;
}

export const generateSurprises = async (
  partnerInterests: string,
  occasion: string,
  budget: string
): Promise<SurpriseIdea[]> => {
  try {
    const prompt = `Generate 3 creative surprise ideas for my partner with these interests: ${partnerInterests}. 
    The occasion is: ${occasion}. My budget is: ${budget}.
    Return JSON in this format:
    [
      {
        "title": "Surprise title",
        "description": "Detailed description of the surprise",
        "difficulty": "easy/medium/hard",
        "estimatedCost": "Approximate cost",
        "category": "Category of the surprise (romantic, adventure, etc.)"
      }
    ]`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer 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`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { 
            role: "system", 
            content: "You are a creative surprise idea generator. Respond in valid JSON format only." 
          },
          { 
            role: "user", 
            content: prompt 
          }
        ],
        max_tokens: 1500
      })
    });

    const data = await response.json();
    let ideas: SurpriseIdea[] = [];
    
    try {
      // Extract and parse the JSON string from the response
      const jsonString = data.choices[0].message.content;
      ideas = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      // Fallback to some default ideas
      ideas = [
        {
          title: "Picnic at Sunset",
          description: "Prepare a picnic with their favorite foods at a scenic spot to watch the sunset together.",
          difficulty: "easy",
          estimatedCost: "$20-50",
          category: "romantic"
        }
      ];
    }
    
    return ideas;
  } catch (error) {
    console.error("Error generating surprises:", error);
    throw error;
  }
};
