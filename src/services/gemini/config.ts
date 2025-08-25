export interface GeminiResponseCandidatePart {
  text?: string;
}

export interface GeminiResponseCandidateContent {
  role?: string;
  parts: GeminiResponseCandidatePart[];
}

export interface GeminiResponseCandidate {
  content: GeminiResponseCandidateContent;
  finishReason?: string;
}

export interface GeminiResponse {
  candidates?: GeminiResponseCandidate[];
}

export interface SummaryRequest {
  content: string;
  maxWords?: number;
}

export interface TagGenerationRequest {
  content: string;
  maxTags?: number;
}

export type ChatRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export const GEMINI_CONFIG = {
  baseURL: 'https://generativelanguage.googleapis.com/v1beta',
  model: 'models/gemini-1.5-flash-latest',
  // Note: Gemini does not require typical JSON headers for GET query param auth, but we keep this for parity
  headers: {
    'Content-Type': 'application/json'
  },
  systemPrompt:
    'You are an expert summarizer. Summarize the provided text concisely and accurately in no more than 50 words, preserving the main ideas and key points.',
  tagPrompt:
    'You are a tag generator. Create relevant, concise tags (single words or short phrases) for the provided content. Each tag should be helpful for categorization and search. Return only the tags as a comma-separated list.'
};

export class GeminiService {
  private apiKey: string;

  // Per request, default the key to "free"
  constructor(apiKey: string = 'free') {
    this.apiKey = apiKey;
  }

  private getGenerateContentUrl(): string {
    return `${GEMINI_CONFIG.baseURL}/${GEMINI_CONFIG.model}:generateContent?key=${this.apiKey}`;
  }

  private extractText(response: GeminiResponse): string {
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) {
      throw new Error('No response from Gemini API');
    }
    return text;
  }

  async summarizeText(request: SummaryRequest): Promise<string> {
    try {
      const systemInstruction = request.maxWords
        ? `You are an expert summarizer. Summarize the provided text concisely and accurately in no more than ${request.maxWords} words, preserving the main ideas and key points.`
        : GEMINI_CONFIG.systemPrompt;

      const response = await fetch(this.getGenerateContentUrl(), {
        method: 'POST',
        headers: GEMINI_CONFIG.headers,
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents: [
            {
              role: 'user',
              parts: [{ text: request.content }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 1,
            topK: 40,
            maxOutputTokens: 1000
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errorData}`);
      }

      const data: GeminiResponse = await response.json();
      return this.extractText(data);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw new Error(error instanceof Error ? error.message : 'Unknown error calling Gemini API');
    }
  }

  async generateTags(request: TagGenerationRequest): Promise<string[]> {
    try {
      const maxTags = request.maxTags || 5;
      const systemInstruction = `${GEMINI_CONFIG.tagPrompt} Generate exactly ${maxTags} tags.`;

      const response = await fetch(this.getGenerateContentUrl(), {
        method: 'POST',
        headers: GEMINI_CONFIG.headers,
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents: [
            {
              role: 'user',
              parts: [{ text: request.content }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 1,
            topK: 40,
            maxOutputTokens: 200
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errorData}`);
      }

      const data: GeminiResponse = await response.json();
      const tagsString = this.extractText(data);
      return tagsString
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
    } catch (error) {
      console.error('Error generating tags with Gemini:', error);
      throw new Error(error instanceof Error ? error.message : 'Unknown error generating tags with Gemini');
    }
  }

  // Chat-style generation compatible with chatbot usage
  async chat(
    messages: ChatMessage[],
    options?: { temperature?: number; maxTokens?: number }
  ): Promise<string> {
    try {
      const temperature = options?.temperature ?? 0.7;
      const maxOutputTokens = options?.maxTokens ?? 1000;

      // Extract an optional system message; Gemini uses system_instruction
      const systemMsgIndex = messages.findIndex((m) => m.role === 'system');
      const systemInstructionText =
        systemMsgIndex >= 0 ? messages[systemMsgIndex].content : undefined;

      // Map remaining messages to Gemini contents
      const conversationalMessages = messages.filter((_, i) => i !== systemMsgIndex);

      const contents = conversationalMessages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const response = await fetch(this.getGenerateContentUrl(), {
        method: 'POST',
        headers: GEMINI_CONFIG.headers,
        body: JSON.stringify({
          ...(systemInstructionText
            ? { system_instruction: { parts: [{ text: systemInstructionText }] } }
            : {}),
          contents,
          generationConfig: {
            temperature,
            topP: 1,
            topK: 40,
            maxOutputTokens
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errorData}`);
      }

      const data: GeminiResponse = await response.json();
      return this.extractText(data);
    } catch (error) {
      console.error('Error generating chat response with Gemini:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Unknown error generating chat response with Gemini'
      );
    }
  }
}


