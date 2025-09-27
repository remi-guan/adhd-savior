import OpenAI from 'openai';
import type { Dispatcher } from 'undici';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { env } from '$env/dynamic/private';
import { OPENAI_API_KEY } from '$env/static/private';

// Input interface for the generation function
export interface GenerationInput {
  systemPrompt: string;
  input: string;
  imageUrl?: string; // Optional image URL for vision models
}

export async function generateResponse({ input, systemPrompt, imageUrl }: GenerationInput): Promise<{ response: string }> {
  // Create OpenAI client with optional proxy configuration
  const openaiConfig: {
    apiKey: string | undefined;
    fetchOptions?: {
      dispatcher?: Dispatcher;
    };
  } = {
    apiKey: OPENAI_API_KEY,
  };

  // Add proxy configuration if OPENAI_PROXY_URL is set
  const OPENAI_PROXY_URL = env.OPENAI_PROXY_URL;
  if (OPENAI_PROXY_URL) {
    console.log(`🔗 Configuring OpenAI to use proxy: ${OPENAI_PROXY_URL} `);

    // Import undici for proxy support
    const undici = await import('undici');
    const proxyAgent = new undici.ProxyAgent(OPENAI_PROXY_URL);

    // Set fetchOptions with the proxy dispatcher - this is the recommended approach
    openaiConfig.fetchOptions = {
      dispatcher: proxyAgent,
    };

    console.log(`✅ Proxy agent configured successfully`);
  }

  const openai = new OpenAI(openaiConfig);

  try {
    console.log(`🎨 Generating response...`);
    
    // Build messages array based on whether we have an image
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt }
    ];

    if (imageUrl) {
      // For image input, use vision format
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: input },
          { type: 'image_url', image_url: { url: imageUrl } }
        ]
      });
    } else {
      // For text-only input
      messages.push({ role: 'user', content: input });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No response from OpenAI');
    }

    let parsedResponse;
    try {
      console.log('Response:', responseContent);
      parsedResponse = JSON.parse(responseContent);
    } catch (parseError) {
      throw new Error(`Failed to parse OpenAI response as JSON: ${parseError} `);
    }

    // Return the parsed response without validation
    return parsedResponse;

  } catch (error) {
    console.error('Error generating metadata from OpenAI:', error);
    throw new Error(`Failed to generate website variant: ${error instanceof Error ? error.message : 'Unknown error'} `);
  }
}
