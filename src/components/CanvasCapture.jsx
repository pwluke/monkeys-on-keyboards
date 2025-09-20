'use client';

import { useThree } from '@react-three/fiber';
import { useImperativeHandle, forwardRef } from 'react';

const CanvasCapture = forwardRef((props, ref) => {
  const { gl } = useThree();

  const getBackgroundInfo = () => {
    // Find the BackgroundSwitcher div by looking for the div that wraps the canvas
    const canvasElement = gl.domElement;
    let backgroundDiv = canvasElement.parentElement;
    
    // Traverse up to find the div with background styling
    while (backgroundDiv && backgroundDiv !== document.body) {
      const computedStyle = window.getComputedStyle(backgroundDiv);
      if (computedStyle.background !== 'rgba(0, 0, 0, 0)' && 
          computedStyle.background !== 'transparent' && 
          computedStyle.background !== 'initial') {
        return {
          element: backgroundDiv,
          background: computedStyle.background,
          backgroundImage: computedStyle.backgroundImage,
          backgroundColor: computedStyle.backgroundColor
        };
      }
      backgroundDiv = backgroundDiv.parentElement;
    }
    
    return null;
  };

  const createCompositeImage = async (canvasDataURL, backgroundInfo) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const canvasElement = gl.domElement;
      
      // Set canvas size to match the WebGL canvas
      canvas.width = canvasElement.width;
      canvas.height = canvasElement.height;

      // Create image for the 3D scene
      const sceneImg = new Image();
      sceneImg.onload = () => {
        // First, draw the background
        if (backgroundInfo) {
          if (backgroundInfo.backgroundImage && backgroundInfo.backgroundImage !== 'none') {
            // Extract URL from backgroundImage CSS property
            const urlMatch = backgroundInfo.backgroundImage.match(/url\(['"]?([^'")]+)['"]?\)/);
            if (urlMatch) {
              const bgImg = new Image();
              bgImg.crossOrigin = 'anonymous';
              bgImg.onload = () => {
                // Draw background image to cover the canvas
                ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
                // Then draw the 3D scene on top
                ctx.drawImage(sceneImg, 0, 0);
                resolve(canvas.toDataURL('image/png'));
              };
              bgImg.onerror = () => {
                // Fallback to background color if image fails
                if (backgroundInfo.backgroundColor && backgroundInfo.backgroundColor !== 'rgba(0, 0, 0, 0)') {
                  ctx.fillStyle = backgroundInfo.backgroundColor;
                  ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
                ctx.drawImage(sceneImg, 0, 0);
                resolve(canvas.toDataURL('image/png'));
              };
              bgImg.src = urlMatch[1];
              return;
            }
          }
          
          // Fallback to background color
          if (backgroundInfo.backgroundColor && backgroundInfo.backgroundColor !== 'rgba(0, 0, 0, 0)') {
            ctx.fillStyle = backgroundInfo.backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
        }
        
        // Draw the 3D scene
        ctx.drawImage(sceneImg, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      
      sceneImg.onerror = () => {
        console.error('Failed to load scene image');
        resolve(canvasDataURL); // Return original if composite fails
      };
      
      sceneImg.src = canvasDataURL;
    });
  };

  useImperativeHandle(ref, () => ({
    captureCanvas: async () => {
      try {
        // Get the canvas element from the WebGL renderer
        const canvas = gl.domElement;
        
        if (!canvas) {
          console.error('Canvas element not available');
          return null;
        }

        // Capture the canvas as a data URL
        const canvasDataURL = canvas.toDataURL('image/png');
        
        // Get background information
        const backgroundInfo = getBackgroundInfo();
        
        if (backgroundInfo) {
          console.log('Background detected:', backgroundInfo);
          // Create composite image with background
          const compositeDataURL = await createCompositeImage(canvasDataURL, backgroundInfo);
          return compositeDataURL;
        } else {
          console.log('No background detected, returning canvas only');
          return canvasDataURL;
        }
      } catch (error) {
        console.error('Error capturing canvas:', error);
        return null;
      }
    }
  }));

  // This component doesn't render anything visible
  return null;
});

CanvasCapture.displayName = 'CanvasCapture';

export default CanvasCapture;
