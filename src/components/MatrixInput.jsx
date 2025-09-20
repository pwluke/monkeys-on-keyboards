import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { matricesAtom } from '@/lib/atoms';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function MatrixInput() {
  const [matrices, setMatrices] = useAtom(matricesAtom);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const parseMatricesInput = (input) => {
    try {
      // Remove extra whitespace and normalize the input
      const cleanInput = input.trim();
      
      // Try to parse as JavaScript array format
      let parsed;
      try {
        // Use Function constructor for safer evaluation than eval
        parsed = new Function('return ' + cleanInput)();
      } catch (e) {
        // If direct parsing fails, try to fix common formatting issues
        const fixedInput = cleanInput
          .replace(/^\[/, '')  // Remove leading [
          .replace(/\]$/, '')  // Remove trailing ]
          .split(/\],\s*\[/)   // Split by matrix boundaries
          .map(matrixStr => {
            // Clean up each matrix string
            const cleaned = matrixStr.replace(/^\[?/, '[').replace(/\]?$/, ']');
            return JSON.parse(cleaned);
          });
        parsed = fixedInput;
      }

      // Validate that it's an array of matrices
      if (!Array.isArray(parsed)) {
        throw new Error('Input must be an array of matrices');
      }

      // Validate each matrix is 4x4
      for (let i = 0; i < parsed.length; i++) {
        const matrix = parsed[i];
        if (!Array.isArray(matrix) || matrix.length !== 4) {
          throw new Error(`Matrix ${i + 1} must have 4 rows`);
        }
        for (let j = 0; j < 4; j++) {
          if (!Array.isArray(matrix[j]) || matrix[j].length !== 4) {
            throw new Error(`Matrix ${i + 1}, row ${j + 1} must have 4 columns`);
          }
          for (let k = 0; k < 4; k++) {
            if (typeof matrix[j][k] !== 'number') {
              throw new Error(`Matrix ${i + 1}, row ${j + 1}, column ${k + 1} must be a number`);
            }
          }
        }
      }

      return parsed;
    } catch (e) {
      throw new Error(`Invalid matrix format: ${e.message}`);
    }
  };

  const handleSubmit = () => {
    if (!inputValue.trim()) {
      setError('Please enter matrix data');
      return;
    }

    try {
      const parsedMatrices = parseMatricesInput(inputValue);
      setMatrices(parsedMatrices);
      setError('');
      setInputValue('');
    } catch (e) {
      setError(e.message);
    }
  };

  const handleReset = () => {
    setInputValue('');
    setError('');
  };

  const exampleInput = `[
  [
    [1, 0, 0, 0],
    [0, 1, 0, 10],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ],
  [
    [1, 0, 0, 10],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ]
]`;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Matrix Input</CardTitle>
        <CardDescription>
          Paste your 4x4 transformation matrices here. Currently displaying {matrices.length} cube instances.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={exampleInput}
            className="min-h-[300px] font-mono text-sm"
          />
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="flex gap-2">
          <Button onClick={handleSubmit} className="flex-1">
            Update Matrices
          </Button>
          <Button onClick={handleReset} variant="outline">
            Clear
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p><strong>Format:</strong> Array of 4x4 matrices. Each matrix should be a 4x4 array of numbers.</p>
          <p><strong>Example:</strong> Copy and paste the placeholder text above, or your own matrix data from Rhino/other CAD software.</p>
        </div>
      </CardContent>
    </Card>
  );
}
