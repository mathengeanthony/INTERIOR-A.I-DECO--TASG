export interface DecoRequest {
  image: string; // base64 or URL
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
  const fullPrompt = `Professional interior design, ${prompt}. ${style ? `Style: ${style}. ` : ''}High quality, photorealistic, architectural photography, 8k resolution, highly detailed, luxury real estate.`;

  // Extract raw base64 data
  let base64Data = image;
  if (image.startsWith('http')) {
    base64Data = await imageUrlToBase64(image);
  } else if (image.includes('base64,')) {
    base64Data = image.split(',')[1];
  }

  // Convert base64 to Blob for FormData
  const byteString = atob(base64Data);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: 'image/jpeg' });

  const formData = new FormData();
  formData.append('image', blob, 'room.jpg');
  formData.append('prompt', fullPrompt);
  formData.append('control_strength', '0.65'); // 0.65 gives freedom to change furniture while keeping walls
  formData.append('output_format', 'jpeg');

  // EMERGENCY DEMO KEY - Hardcoded to bypass Vercel env var issues instantly
  const apiKey = "sk-Q5McmOkDbHi7dzUjGK5TGdauW5J18hrIe6CfbOIclvz8kZyt";

  const response = await fetch('https://api.stability.ai/v2beta/stable-image/control/structure', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json'
    },
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Stability AI error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  
  if (data.image) {
    return `data:image/jpeg;base64,${data.image}`;
  }
  
  throw new Error("Failed to generate image preview from Stability AI");
}
