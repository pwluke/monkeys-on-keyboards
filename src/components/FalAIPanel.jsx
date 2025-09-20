'use client';

import React, { useState } from 'react';
import { fal } from '@fal-ai/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Camera, Download, Settings } from 'lucide-react';

export default function FalAIPanel({ canvasCaptureRef, onImageGenerated }) {
  const [apiKey, setApiKey] = useState(process.env.NEXT_PUBLIC_FAL_API_KEY || 'deaca35c-587b-44d8-a6bf-f06e116b50ea:734e95e21ca6a4192fb6ab026f11d0c2');
  const [prompt, setPrompt] = useState('american house, northeast suburb, summer, exterior, early afternoon, classic style');
  const [seed, setSeed] = useState(7482035931);
  const [selectedModel, setSelectedModel] = useState('flux-pro-kontext');
  const [strength, setStrength] = useState(0.8);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [canvasSnapshot, setCanvasSnapshot] = useState(null);

  const captureCanvas = async () => {
    if (!canvasCaptureRef?.current) {
      console.error('Canvas capture ref not available');
      return null;
    }

    try {
      // Use the CanvasCapture component's method to get the screenshot
      const dataURL = canvasCaptureRef.current.captureCanvas();
      
      if (!dataURL) {
        console.error('Failed to capture canvas');
        return null;
      }

      setCanvasSnapshot(dataURL);
      return dataURL;
    } catch (error) {
      console.error('Error capturing canvas:', error);
      return null;
    }
  };

  const runFAL = async () => {
    if (!apiKey.trim()) {
      alert('Please enter your FAL API key');
      return;
    }

    setIsGenerating(true);
    
    try {
      // First capture the canvas
      const canvasImage = await captureCanvas();
      
      if (!canvasImage) {
        alert('Failed to capture canvas image');
        setIsGenerating(false);
        return;
      }

      // Debug: Log API key format (first few chars only for security)
      console.log('API Key format check:', apiKey.substring(0, 10) + '...');
      console.log('Canvas image captured, size:', canvasImage.length, 'characters');

      // Enhanced prompt for better architectural rendering
      const enhancedPrompt = `${prompt}, RAW Photo, high end, 8k, film grain, high quality, fujifilm, dramatic sky, architecture rendering`;

      // Configure fal client globally first
      fal.config({
        credentials: apiKey,
      });

      // Make the API request with error handling for each model
      let result;
      
      if (selectedModel === 'flux-pro-kontext') {
        console.log('Calling FLUX Pro Kontext...');
        try {
          // FLUX Pro Kontext - best for image editing and transformations
          result = await fal.subscribe('fal-ai/flux-pro/kontext', {
            input: {
              prompt: enhancedPrompt,
              image_url: canvasImage,
              seed: seed,
              guidance_scale: 3.5,
              num_images: 1,
              output_format: 'jpeg',
              enhance_prompt: true,
            },
            logs: true,
          });
        } catch (kontextError) {
          console.warn('FLUX Pro Kontext failed, trying FLUX dev:', kontextError);
          // Fallback to FLUX dev
          result = await fal.subscribe('fal-ai/flux/dev', {
            input: {
              prompt: enhancedPrompt,
              image_url: canvasImage,
              seed: seed,
              guidance_scale: 3.5,
              num_inference_steps: 28,
              num_images: 1,
              image_size: 'landscape_4_3',
            },
            logs: true,
          });
        }
      } else if (selectedModel === 'flux-dev-img2img') {
        console.log('Calling FLUX Dev Image-to-Image...');
        // FLUX dev image-to-image
        result = await fal.subscribe('fal-ai/flux/dev/image-to-image', {
          input: {
            prompt: enhancedPrompt,
            image_url: canvasImage,
            strength: strength,
            seed: seed,
            num_inference_steps: 28,
            guidance_scale: 3.5,
            num_images: 1,
            output_format: 'jpeg',
          },
          logs: true,
        });
      } else {
        console.log('Calling FLUX Dev Basic...');
        // Basic FLUX dev
        result = await fal.subscribe('fal-ai/flux/dev', {
          input: {
            prompt: enhancedPrompt,
            image_url: canvasImage,
            seed: seed,
            guidance_scale: 3.5,
            num_inference_steps: 28,
            num_images: 1,
            image_size: 'landscape_4_3',
          },
          logs: true,
        });
      }

      // Handle FLUX response format
      let imageUrl = null;
      if (result && result.data && result.data.images && result.data.images[0]) {
        // Standard FLUX response format
        imageUrl = result.data.images[0].url;
      } else if (result && result.images && result.images[0]) {
        // Alternative response format
        imageUrl = result.images[0].url;
      } else if (result && result.data && result.data.image) {
        // Single image response
        imageUrl = result.data.image.url || result.data.image;
      }

      if (imageUrl) {
        setGeneratedImage(imageUrl);
        console.log('Generated image URL:', imageUrl);
        
        // Trigger the overlay display
        if (onImageGenerated) {
          onImageGenerated(imageUrl);
        }
      } else {
        console.error('Unexpected response format:', result);
        alert('Failed to generate image - check console for details');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      alert(`Failed to generate image: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = (imageUrl, filename) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          FAL AI Image Generation
        </CardTitle>
        <CardDescription>
          Capture your 3D scene and transform it with FLUX AI models. Get your API key from <a href="https://fal.ai" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">fal.ai</a>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* API Key Input */}
        <div className="space-y-2">
          <Label htmlFor="api-key">FAL API Key</Label>
          <Input
            id="api-key"
            type="password"
            placeholder="fal_xxxxxxxx..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Get your API key from <a href="https://fal.ai/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">fal.ai/dashboard</a>. 
            Should start with "fal_"
          </p>
        </div>

        {/* Prompt Input */}
        <div className="space-y-2">
          <Label htmlFor="prompt">Prompt</Label>
          <Textarea
            id="prompt"
            placeholder="Describe how you want to transform your scene..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
          />
        </div>

        {/* Model Selection */}
        <div className="space-y-2">
          <Label htmlFor="model">FLUX Model</Label>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger>
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flux-pro-kontext">FLUX Pro Kontext (Best for editing)</SelectItem>
              <SelectItem value="flux-dev-img2img">FLUX Dev Image-to-Image</SelectItem>
              <SelectItem value="flux-dev">FLUX Dev (Basic)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Strength Input (only for image-to-image) */}
        {selectedModel === 'flux-dev-img2img' && (
          <div className="space-y-2">
            <Label htmlFor="strength">Strength (0.1 - 1.0)</Label>
            <Input
              id="strength"
              type="number"
              min="0.1"
              max="1.0"
              step="0.1"
              value={strength}
              onChange={(e) => setStrength(parseFloat(e.target.value) || 0.8)}
            />
            <p className="text-xs text-muted-foreground">
              Higher values = more transformation, Lower values = more faithful to original
            </p>
          </div>
        )}

        {/* Seed Input */}
        <div className="space-y-2">
          <Label htmlFor="seed">Seed</Label>
          <Input
            id="seed"
            type="number"
            value={seed}
            onChange={(e) => setSeed(parseInt(e.target.value) || 0)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={captureCanvas}
            variant="outline"
            className="flex-1"
          >
            <Camera className="h-4 w-4 mr-2" />
            Capture Scene
          </Button>
          
          <Button 
            onClick={runFAL}
            disabled={isGenerating || !apiKey.trim()}
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Image'
            )}
          </Button>
        </div>

        {/* Canvas Snapshot Preview */}
        {canvasSnapshot && (
          <div className="space-y-2">
            <Label>Canvas Snapshot</Label>
            <div className="relative">
              <img 
                src={canvasSnapshot} 
                alt="Canvas snapshot" 
                className="w-full h-32 object-cover rounded-md border"
              />
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2"
                onClick={() => downloadImage(canvasSnapshot, 'canvas-snapshot.png')}
              >
                <Download className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Generated Image Preview */}
        {generatedImage && (
          <div className="space-y-2">
            <Label>Generated Image</Label>
            <div className="relative">
              <img 
                src={generatedImage} 
                alt="Generated by AI" 
                className="w-full h-48 object-cover rounded-md border"
              />
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2"
                onClick={() => downloadImage(generatedImage, 'fal-ai-generated.png')}
              >
                <Download className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
