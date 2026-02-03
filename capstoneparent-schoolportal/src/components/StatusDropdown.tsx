import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export interface StatusOption {
  value: string;
  label: string;
  className?: string;
}

interface StatusDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: StatusOption[];
  placeholder?: string;
}

export const StatusDropdown = ({
  value,
  onChange,
  options,
  placeholder = "Status",
}: StatusDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between gap-3 bg-(--button-green) hover:bg-(--button-hover-green) text-white font-semibold px-6 py-2 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-(--button-hover-green) min-w-35"
      >
        <span>{selectedOption?.label ?? placeholder}</span>
        <ChevronDown
          className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-2 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${option.className ?? "text-gray-800"}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
