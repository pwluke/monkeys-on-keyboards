# monkeys-on-keyboards

A 3D interactive canvas with AI-powered image generation using React Three Fiber and FAL AI.

## Features

- Interactive 3D scene with various objects and controls
- Real-time canvas capture functionality
- AI-powered image generation using FAL AI
- Multiple UI panels for scene manipulation
- Theme switching and viewport controls

## FAL AI Integration

This project includes integration with FAL AI for transforming your 3D scenes into AI-generated images.

### Setup

1. Get your API key from [fal.ai](https://fal.ai)
2. (Optional) Create a `.env.local` file and add `NEXT_PUBLIC_FAL_API_KEY=your_api_key_here`
3. Open the FAL AI Generation panel in the left sidebar
4. Enter your API key (if not set via environment variable)
5. Customize your prompt
6. Click "Capture Scene" to take a snapshot
7. Click "Generate Image" to create an AI-enhanced version

### How it works

- The canvas is configured with `preserveDrawingBuffer: true` to enable screenshot capture
- Canvas snapshots are captured using the WebGL context's `toDataURL()` method
- Images are sent to FAL AI endpoints with your custom prompt
- Multiple FLUX model options available:
  - **FLUX Pro Kontext** (`fal-ai/flux-pro/kontext`) - Best for image editing and transformations
  - **FLUX Dev Image-to-Image** (`fal-ai/flux/dev/image-to-image`) - Good balance with strength control
  - **FLUX Dev** (`fal-ai/flux/dev`) - Basic text-to-image with image reference

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.