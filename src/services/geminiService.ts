export interface DecoRequest {
  image: string; // base64 or URL
  prompt: string;
  style?: string;
}

export async function generateDecoPreview({ image, prompt, style }: DecoRequest) {
  const fullPrompt = `Professional interior design, ${prompt}. ${style ? `Style: ${style}. ` : ''}High quality, photorealistic, architectural photography, 8k resolution, highly detailed, luxury real estate.`;

  // Ensure image is a data URL if it's base64
  let imageUrl = image;
  if (!image.startsWith('http') && !image.startsWith('data:')) {
    imageUrl = `data:image/jpeg;base64,${image}`;
  }

  const falKey = process.env.FAL_KEY || (import.meta as any).env?.VITE_FAL_KEY;
  if (!falKey) {
    throw new Error("FAL_KEY is not set. Please configure it in your Vercel environment variables.");
  }

  const response = await fetch('https://fal.run/fal-ai/flux/dev/image-to-image', {
    method: 'POST',
    headers: {
      'Authorization': `Key ${falKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image_url: imageUrl,
      prompt: fullPrompt,
      strength: 0.85, // 0.85 gives it enough freedom to change furniture while keeping walls
      guidance_scale: 3.5,
      num_inference_steps: 28
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    if (response.status === 402 || errorText.includes('credit')) {
      throw new Error("Fal.ai requires a billing method on file to activate the free trial credits. Please add a card to Fal.ai (it won't be charged).");
    }
    throw new Error(`Fal.ai API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  
  if (data.images && data.images.length > 0) {
    return data.images[0].url;
  }
  
  throw new Error("Failed to generate image preview from Fal.ai");
}
