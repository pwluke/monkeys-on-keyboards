'use client';

import { useThree } from '@react-three/fiber';
import { useImperativeHandle, forwardRef } from 'react';

const CanvasCapture = forwardRef((props, ref) => {
  const { gl } = useThree();

  useImperativeHandle(ref, () => ({
    captureCanvas: () => {
      try {
        // Get the canvas element from the WebGL renderer
        const canvas = gl.domElement;
        
        if (!canvas) {
          console.error('Canvas element not available');
          return null;
        }

        // Capture the canvas as a data URL
        const dataURL = canvas.toDataURL('image/png');
        return dataURL;
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
