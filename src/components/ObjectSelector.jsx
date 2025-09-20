"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ObjectSelector({ onObjectSelect }) {
  return (
    <Select onValueChange={onObjectSelect}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select an object" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Objects</SelectLabel>
          <SelectItem value="box">Box</SelectItem>
          <SelectItem value="cone">Cone</SelectItem>
          <SelectItem value="sphere">Sphere</SelectItem>
          <SelectItem value="cylinder">Cylinder</SelectItem>
          <SelectItem value="torus">Torus</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
