import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  return (
    <div className="flex flex-col w-80">
      <Label className="mb-1 text-sm block" htmlFor="search ">
        Tìm kiếm
      </Label>
      <Input
        placeholder="Tìm kiếm tổ chức"
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
