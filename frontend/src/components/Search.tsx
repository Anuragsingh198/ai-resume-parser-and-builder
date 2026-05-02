import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';

export interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  showClearButton?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
}
const Search = memo(({
  value,
  onChange,
  placeholder = 'Search jobs, companies, skills...',
  className = '',
  showClearButton = true,
  disabled = false,
  autoFocus = false,
}: SearchProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );
  const handleClear = useCallback(() => {
    onChange('');
    inputRef.current?.focus();
  }, [onChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClear]);

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          relative flex items-center
          bg-white border-2 rounded-lg
          transition-all duration-200
          ${isFocused ? 'border-blue-500 shadow-md' : 'border-gray-300 hover:border-gray-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {/* Search Icon */}
        <div className="absolute left-4 flex items-center pointer-events-none">
          <SearchIcon
            className={`h-5 w-5 ${isFocused ? 'text-blue-500' : 'text-gray-400'}`}
            aria-hidden="true"
          />
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          className={`
            w-full pl-12 pr-12 py-3
            text-gray-900 placeholder-gray-500
            bg-transparent border-0
            focus:outline-none focus:ring-0
            disabled:cursor-not-allowed
            text-sm md:text-base
          `}
          aria-label="Search jobs"
        />

        {/* Clear Button */}
        {showClearButton && value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-gray-500" aria-hidden="true" />
          </button>
        )}

        {/* Keyboard Shortcut Hint */}
        {!value && !isFocused && (
          <div className="absolute right-4 hidden md:flex items-center space-x-1 text-xs text-gray-400 pointer-events-none">
            <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300">Ctrl</kbd>
            <span>+</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300">K</kbd>
          </div>
        )}
      </div>
    </div>
  );
});

Search.displayName = 'Search';

export default Search;
