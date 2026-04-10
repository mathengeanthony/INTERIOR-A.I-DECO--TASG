import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface DecoRequest {
  image: string; // base64
  prompt: string;
  style?: string;
}

async function imageUrlToBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      resolve(base64String.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function generateDecoPreview({ image, prompt, style }: DecoRequest) {
  const fullPrompt = `You are an expert interior designer. Edit this room image based on the following request: ${prompt}. ${style ? `Apply a ${style} aesthetic.` : ''} Maintain the architectural structure of the room but replace or add furniture, change wall colors, and flooring as requested. Return only the edited image.`;

  let base64Data = image;
  if (image.startsWith('http')) {
    base64Data = await imageUrlToBase64(image);
  } else if (image.includes('base64,')) {
    base64Data = image.split(',')[1];
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: "image/jpeg",
          },
        },
        {
          text: fullPrompt,
        },
      ],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("Failed to generate image preview");
}
