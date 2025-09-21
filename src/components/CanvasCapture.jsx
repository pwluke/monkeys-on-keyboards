'use client';

import { useThree } from '@react-three/fiber';
import { useImperativeHandle, forwardRef } from 'react';

const CanvasCapture = forwardRef((props, ref) => {
  const { gl } = useThree();

  // Helper function to extract background color from CSS background property
  const extractBackgroundColor = (backgroundString) => {
    if (!backgroundString) return null;
    
    // Look for hex colors
    const hexMatch = backgroundString.match(/#[0-9a-fA-F]{6,8}/);
    if (hexMatch) return hexMatch[0];
    
    // Look for rgb/rgba colors
    const rgbMatch = backgroundString.match(/rgba?\([^)]+\)/);
    if (rgbMatch) return rgbMatch[0];
    
    // Look for named colors (basic check)
    const colorNames = ['white', 'black', 'red', 'green', 'blue', 'yellow', 'gray', 'grey'];
    for (const color of colorNames) {
      if (backgroundString.toLowerCase().includes(color)) {
        return color;
      }
    }
    
    return null;
  };

  const getBackgroundInfo = () => {
    // Find the BackgroundSwitcher div - it should be the outermost container
    // with minHeight: 100vh and width: 100vw
    const canvasElement = gl.domElement;
    let currentElement = canvasElement;
    
    console.log('Starting background search from canvas element:', canvasElement);
    
    // Traverse up the DOM tree to find the BackgroundSwitcher container
    while (currentElement && currentElement !== document.body) {
      const computedStyle = window.getComputedStyle(currentElement);
      const inlineStyle = currentElement.style;
      
      console.log('Checking element:', currentElement.tagName, currentElement.className, {
        computedBackground: computedStyle.background,
        computedBackgroundImage: computedStyle.backgroundImage,
        computedBackgroundColor: computedStyle.backgroundColor,
        inlineBackground: inlineStyle.background,
        inlineBackgroundImage: inlineStyle.backgroundImage,
        inlineBackgroundColor: inlineStyle.backgroundColor,
        minHeight: inlineStyle.minHeight || computedStyle.minHeight,
        width: inlineStyle.width || computedStyle.width
      });
      
      // Check if this is the BackgroundSwitcher container
      // It should have minHeight: 100vh and width: 100vw
      const isBackgroundSwitcher = (
        (inlineStyle.minHeight === '100vh' && inlineStyle.width === '100vw') ||
        (computedStyle.minHeight === '100vh' && computedStyle.width === '100vw')
      );
      
      // Check if it has background styling
      const hasInlineBackground = inlineStyle.background && inlineStyle.background !== '';
      const hasComputedBackground = (
        computedStyle.background && 
        computedStyle.background !== 'rgba(0, 0, 0, 0)' && 
        computedStyle.background !== 'transparent' && 
        computedStyle.background !== 'initial'
      );
      
      if (isBackgroundSwitcher && (hasInlineBackground || hasComputedBackground)) {
        console.log('Found BackgroundSwitcher element:', currentElement);
        return {
          element: currentElement,
          background: computedStyle.background,
          backgroundImage: computedStyle.backgroundImage,
          backgroundColor: computedStyle.backgroundColor,
          inlineBackground: inlineStyle.background,
          inlineBackgroundImage: inlineStyle.backgroundImage,
          inlineBackgroundColor: inlineStyle.backgroundColor
        };
      }
      
      currentElement = currentElement.parentElement;
    }
    
    console.log('No BackgroundSwitcher element found');
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
        console.log('Scene image loaded, processing background...');
        
        // First, draw the background
        if (backgroundInfo) {
          console.log('Background info available:', backgroundInfo);
          
          // Try to parse the inline background style first (BackgroundSwitcher uses inline styles)
          const inlineBackground = backgroundInfo.inlineBackground;
          const computedBackground = backgroundInfo.background;
          console.log('Processing backgrounds:', { inlineBackground, computedBackground });
          
          // Check for background image in inline style first
          let backgroundImageUrl = null;
          if (inlineBackground && inlineBackground.includes('url(')) {
            const urlMatch = inlineBackground.match(/url\(['"]?([^'")]+)['"]?\)/);
            if (urlMatch) {
              backgroundImageUrl = urlMatch[1];
              console.log('Found inline background image URL:', backgroundImageUrl);
            }
          }
          
          // Also check inline backgroundImage property
          if (!backgroundImageUrl && backgroundInfo.inlineBackgroundImage && backgroundInfo.inlineBackgroundImage !== 'none') {
            const urlMatch = backgroundInfo.inlineBackgroundImage.match(/url\(['"]?([^'")]+)['"]?\)/);
            if (urlMatch) {
              backgroundImageUrl = urlMatch[1];
              console.log('Found inline backgroundImage URL:', backgroundImageUrl);
            }
          }
          
          // Also check computed backgroundImage as fallback
          if (!backgroundImageUrl && backgroundInfo.backgroundImage && backgroundInfo.backgroundImage !== 'none') {
            const urlMatch = backgroundInfo.backgroundImage.match(/url\(['"]?([^'")]+)['"]?\)/);
            if (urlMatch) {
              backgroundImageUrl = urlMatch[1];
              console.log('Found computed background image URL:', backgroundImageUrl);
            }
          }
          
          if (backgroundImageUrl) {
            console.log('Loading background image:', backgroundImageUrl);
            const bgImg = new Image();
            bgImg.crossOrigin = 'anonymous';
            bgImg.onload = () => {
              console.log('Background image loaded successfully');
              // Draw background image to cover the canvas
              ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
              // Then draw the 3D scene on top
              ctx.drawImage(sceneImg, 0, 0);
              resolve(canvas.toDataURL('image/png'));
            };
            bgImg.onerror = (error) => {
              console.error('Background image failed to load:', error);
              // Fallback to background color if image fails
              const backgroundColor = extractBackgroundColor(inlineBackground) || backgroundInfo.backgroundColor;
              if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent') {
                console.log('Using fallback background color:', backgroundColor);
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
              }
              ctx.drawImage(sceneImg, 0, 0);
              resolve(canvas.toDataURL('image/png'));
            };
            bgImg.src = backgroundImageUrl;
            return;
          }
          
          // No background image, try background color
          let backgroundColor = null;
          
          // Try inline background color first
          if (backgroundInfo.inlineBackgroundColor && backgroundInfo.inlineBackgroundColor !== '') {
            backgroundColor = backgroundInfo.inlineBackgroundColor;
            console.log('Found inline background color:', backgroundColor);
          }
          
          // Try extracting color from inline background string
          if (!backgroundColor) {
            backgroundColor = extractBackgroundColor(inlineBackground);
            if (backgroundColor) {
              console.log('Extracted color from inline background:', backgroundColor);
            }
          }
          
          // Fallback to computed background color
          if (!backgroundColor && backgroundInfo.backgroundColor && 
              backgroundInfo.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
              backgroundInfo.backgroundColor !== 'transparent') {
            backgroundColor = backgroundInfo.backgroundColor;
            console.log('Using computed background color:', backgroundColor);
          }
          
          if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent') {
            console.log('Applying background color:', backgroundColor);
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          } else {
            console.log('No valid background color found');
          }
        }
        
        console.log('Drawing 3D scene on top');
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
