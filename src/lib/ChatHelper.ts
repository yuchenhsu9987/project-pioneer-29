
import { pipeline, env } from '@huggingface/transformers';

// Use WebGPU acceleration when available
env.backends.onnx.wasm.numThreads = 1;

// Initialize the text generation model
export const initChatModel = async () => {
  try {
    // Load a smaller model suitable for browser environments
    const generator = await pipeline(
      'text-generation',
      'Xenova/distilgpt2',  // Using a smaller model that's better supported
      { 
        revision: 'main',
        progress_callback: (progress) => {
          // Log progress without accessing the percentage property
          console.log(`Loading model: ${progress ? 'in progress' : 'complete'}`);
        }
      }
    );
    
    return generator;
  } catch (error) {
    console.error('Error initializing chat model:', error);
    throw error;
  }
};

// Generate a response based on conversation history
export const generateResponse = async (
  model: any, 
  prompt: string
) => {
  try {
    const result = await model(prompt, {
      max_new_tokens: 128,
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
    return '抱歉，我在生成回應時遇到了錯誤。';
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
  // Create a system instruction
  const systemInstruction = `你是一個專業的專案管理智能助手，幫助用戶組織和跟踪他們的專案和任務。提供簡潔、有用的建議。`;
  
  // Build conversation history
  const conversationHistory = messages
    .map(msg => `${msg.role === 'user' ? '用戶' : '助手'}: ${msg.content}`)
    .join('\n');
  
  // Complete prompt with system instruction and user's new message
  return `${systemInstruction}\n\n${conversationHistory}\n用戶: ${userMessage}\n助手:`;
};
