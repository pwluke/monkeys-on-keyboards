"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, RotateCcw } from "lucide-react";

const AIImageOverlay = ({ imageUrl, onClose, onRegenerate }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (imageUrl) {
      setIsVisible(true);
      setIsLoaded(false);
    }
  }, [imageUrl]);

  // Handle ESC key to close overlay
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isVisible) {
        handleClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300); // Match transition duration
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `ai-generated-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  if (!imageUrl || !isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div 
        className="relative max-w-[90vw] max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with controls */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-white font-semibold text-lg">AI Generated Image</h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleDownload}
                className="bg-white/20 hover:bg-white/30 text-white border-white/20"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              {onRegenerate && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={onRegenerate}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Regenerate
                </Button>
              )}
              <Button
                size="sm"
                variant="secondary"
                onClick={handleClose}
                className="bg-white/20 hover:bg-white/30 text-white border-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}

        {/* Image */}
        <img
          src={imageUrl}
          alt="AI Generated"
          className={`max-w-full max-h-[90vh] object-contain transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleImageLoad}
          onClick={(e) => e.stopPropagation()}
        />

        {/* Bottom info bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
          <p className="text-white/80 text-sm text-center">
            Click outside to close • ESC to close
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIImageOverlay;
