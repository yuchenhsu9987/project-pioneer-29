
import { pipeline, env } from '@huggingface/transformers';

// Use WebGPU acceleration when available
env.backends.onnx.wasm.numThreads = 1;

// Initialize the text generation model
export const initChatModel = async () => {
  try {
    // Load a smaller model suitable for browser environments
    const generator = await pipeline(
      'text-generation',
      'TinyLlama/TinyLlama-1.1B-Chat-v1.0',
      { 
        quantized: true,
        max_new_tokens: 128
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
    
    return result[0].generated_text.replace(prompt, '').trim();
  } catch (error) {
    console.error('Error generating response:', error);
    return 'Sorry, I encountered an error generating a response.';
  }
};
