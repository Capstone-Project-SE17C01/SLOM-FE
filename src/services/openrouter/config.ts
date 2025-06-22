export interface OpenRouterResponse {
  id: string;
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface SummaryRequest {
  content: string;
  maxWords?: number;
}

export const OPENROUTER_CONFIG = {
  baseURL: 'https://openrouter.ai/api/v1',
  model: 'deepseek/deepseek-chat-v3-0324:free',
  headers: {
    'Content-Type': 'application/json',
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'X-Title': 'SLOM Video Summarizer',
  },
  systemPrompt: "You are an expert summarizer. Summarize the provided text concisely and accurately in no more than 50 words, preserving the main ideas and key points."
};

export class OpenRouterService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async summarizeText(request: SummaryRequest): Promise<string> {
    try {
      const response = await fetch(`${OPENROUTER_CONFIG.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          ...OPENROUTER_CONFIG.headers,
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: OPENROUTER_CONFIG.model,
          messages: [
            {
              role: 'system',
              content: request.maxWords
                ? `You are an expert summarizer. Summarize the provided text concisely and accurately in no more than ${request.maxWords} words, preserving the main ideas and key points.`
                : OPENROUTER_CONFIG.systemPrompt
            },
            {
              role: 'user',
              content: request.content
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} - ${errorData}`);
      }

      const data: OpenRouterResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from OpenRouter API');
      }

      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error calling OpenRouter API:', error);
      throw new Error(error instanceof Error ? error.message : 'Unknown error calling OpenRouter API');
    }
  }
}
