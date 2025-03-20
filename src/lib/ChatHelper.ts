
import { pipeline, env } from '@huggingface/transformers';

// Use WebGPU acceleration when available
env.backends.onnx.wasm.numThreads = 1;

// Model types
type ChatModel = {
  fallback: boolean;
  __call__: (prompt: string, options?: any) => Promise<{ generated_text: string }[]>;
} | any; // Include the pipeline type

// Initialize the text generation model
export const initChatModel = async (): Promise<ChatModel> => {
  try {
    console.log('Starting to load the model...');
    
    // Try to load the Gemma model (smaller instruction-tuned model)
    const generator = await pipeline(
      'text-generation',
      'google/gemma-3-1b-it',  // Using Gemma 3 1B instruction-tuned model
      { 
        revision: 'main',
        progress_callback: (progress) => {
          // Log progress without accessing specific properties
          console.log(`Loading model: ${progress ? 'in progress' : 'complete'}`);
        }
      }
    );
    
    console.log('Model loaded successfully');
    return {
      fallback: false,
      __call__: async (prompt: string, options?: any) => {
        return generator(prompt, options);
      }
    };
  } catch (error) {
    console.error('Error initializing chat model:', error);
    
    // In case of error, provide a simple fallback response generator
    console.log('Using fallback response generator');
    return {
      fallback: true,
      __call__: async (prompt: string) => {
        return [{
          generated_text: prompt + "\n我是您的專案管理助手。由於目前無法加載完整的AI模型，我只能提供基本回應。請稍後再試或檢查您的網絡連接。"
        }]
      }
    };
  }
};

// Generate a response based on conversation history
export const generateResponse = async (
  model: ChatModel, 
  prompt: string
) => {
  try {
    // Generate response using the model
    const result = await model.__call__(prompt, {
      max_new_tokens: 256,
      temperature: 0.7,
      top_p: 0.95,
      repetition_penalty: 1.2
    });
    
    // Extract the assistant's response from the full generated text
    const response = result[0].generated_text.replace(prompt, '').trim();
    
    // Format response as a project assistant
    const formattedResponse = formatAsProjectAssistant(response);
    
    return formattedResponse;
  } catch (error) {
    console.error('Error generating response:', error);
    return '抱歉，我在生成回應時遇到了錯誤。請稍後再試。';
  }
};

// Format the response to make it sound more like a project management assistant
const formatAsProjectAssistant = (response: string): string => {
  // If response is empty or very short, provide a fallback
  if (!response || response.length < 5) {
    return '我能幫您管理專案，需要我做什麼嗎？';
  }
  
  // Add project management context if missing
  if (!response.includes('專案') && !response.includes('project') && 
      !response.includes('任務') && !response.includes('task')) {
    return `作為您的專案管理助手，${response}`;
  }
  
  return response;
};

// Create project-focused prompts
export const createProjectPrompt = (userMessage: string, messages: any[]): string => {
  // Create a system instruction for project management
  const systemInstruction = `你是一個專業的專案管理智能助手，幫助用戶組織和跟踪他們的專案和任務。提供簡潔、有用的建議。`;
  
  // Build conversation history
  const conversationHistory = messages
    .map(msg => `${msg.role === 'user' ? '用戶' : '助手'}: ${msg.content}`)
    .join('\n');
  
  // Complete prompt with system instruction and user's new message
  return `${systemInstruction}\n\n${conversationHistory}\n用戶: ${userMessage}\n助手:`;
};
