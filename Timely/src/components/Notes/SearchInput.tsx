import { Search } from 'lucide-react';
import './SearchInput.css';

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="search-input-container">
      <Search className="search-icon" size={20} />
      <input
        type="text"
        className="search-input"
        placeholder="Search notes by title, content, or category..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
