import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Box, Circle, Triangle } from 'lucide-react';

const objects = [
  { id: 'box', name: 'Box', icon: Box },
  { id: 'sphere', name: 'Sphere', icon: Circle },
  { id: 'cone', name: 'Cone', icon: Triangle },
];

const ObjectSelector = ({ value, onChange }) => {
  const selected = objects.find((obj) => obj.id === value) || objects[0];
  const SelectedIcon = selected.icon;
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Select 3D Object</CardTitle>
      </CardHeader>
      <CardContent>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 w-48 justify-between">
              <span className="flex items-center gap-2">
                <SelectedIcon className="h-5 w-5" />
                {selected.name}
              </span>
              <svg className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="none"><path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {objects.map((obj) => {
              const Icon = obj.icon;
              return (
                <DropdownMenuItem
                  key={obj.id}
                  onSelect={() => onChange(obj.id)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Icon className="h-4 w-4" />
                  {obj.name}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
};

export default ObjectSelector;
