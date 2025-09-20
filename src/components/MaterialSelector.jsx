import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function MaterialSelector({ onMaterialChange, currentMaterial }) {
  return (
    <Select onValueChange={onMaterialChange} value={currentMaterial}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a material" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">Default</SelectItem>
        <SelectItem value="wood">Wood</SelectItem>
        <SelectItem value="metal">Metal</SelectItem>
        <SelectItem value="bamboo">Bamboo</SelectItem>
      </SelectContent>
    </Select>
  );
}