import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Box, Circle, Triangle } from 'lucide-react';

const objects = [
  { id: 'box', name: 'Box', icon: Box },
  { id: 'sphere', name: 'Sphere', icon: Circle },
  { id: 'cone', name: 'Cone', icon: Triangle },
];

const ObjectSelector = ({ value, onChange }) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Select 3D Object</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 justify-center">
          {objects.map((obj) => {
            const Icon = obj.icon;
            return (
              <Button
                key={obj.id}
                variant={value === obj.id ? 'default' : 'outline'}
                size="lg"
                onClick={() => onChange(obj.id)}
                className="flex flex-col items-center gap-1 px-6 py-4"
              >
                <Icon className="h-8 w-8 mb-1" />
                <span className="text-sm font-medium">{obj.name}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ObjectSelector;
