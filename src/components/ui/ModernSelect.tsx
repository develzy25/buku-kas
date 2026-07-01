"use client";
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";

interface ModernSelectProps {
  label: string;
  name: string;
  required?: boolean;
  defaultValue?: string | number;
  icon?: IconDefinition;
  iconColorClass?: string;
  options: { value: string | number; label: string }[];
  placeholder?: string;
}

export default function ModernSelect({ 
  label, 
  name,
  required,
  defaultValue,
  icon, 
  iconColorClass = "bg-gray-500", 
  options,
  placeholder = "Pilih salah satu",
}: ModernSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | number | undefined>(defaultValue);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === selectedValue);

  return (
    <div ref={wrapperRef} className="relative z-20">
      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={selectedValue || ""} required={required} />
      
      <div 
        className={`p-1 rounded-2xl md:rounded-3xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.03)] border transition-all duration-300 ease-out cursor-pointer bg-white group
          ${isOpen ? 'shadow-[inset_0_2px_10px_rgba(0,0,0,0.02),0_4px_20px_rgba(59,130,246,0.15)] border-blue-300' : 'border-gray-100 hover:border-blue-200'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={`flex items-center gap-3 p-2 md:p-3 rounded-2xl transition-colors ${isOpen ? 'bg-blue-50/30' : 'bg-gray-50/50 group-hover:bg-blue-50/10'}`}>
          
          {icon && (
            <div className={`shrink-0 flex items-center justify-center rounded-xl md:rounded-2xl shadow-[0_4px_10px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.4)] text-white transition-transform duration-300 w-10 h-10 md:w-12 md:h-12 
              ${isOpen ? 'scale-110 rotate-3' : 'group-hover:scale-105'} ${iconColorClass}`}>
              <FontAwesomeIcon icon={icon} />
            </div>
          )}
          
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <label className={`block text-[10px] md:text-xs font-extrabold uppercase tracking-widest mb-0.5 transition-colors cursor-pointer
              ${isOpen ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-400'}`}>
              {label}
            </label>
            <div className="flex items-center justify-between">
              <span className={`font-extrabold truncate text-base md:text-lg transition-colors
                ${selectedOption ? 'text-gray-800' : 'text-gray-300'}`}>
                {selectedOption ? selectedOption.label : placeholder}
              </span>
              
              <FontAwesomeIcon 
                icon={faChevronDown} 
                className={`text-gray-400 text-sm md:text-base transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : 'group-hover:text-blue-400'}`} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dropdown Options */}
      <div 
        className={`absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] overflow-hidden transition-all duration-300 ease-out origin-top
          ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-95 pointer-events-none'}`}
      >
        <div className="max-h-60 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {options.map((opt) => {
            const isSelected = selectedValue === opt.value;
            return (
              <div 
                key={opt.value}
                onClick={() => {
                  setSelectedValue(opt.value);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200
                  ${isSelected ? 'bg-blue-50/80 text-blue-600' : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'}`}
              >
                <span className={`font-bold text-sm md:text-base ${isSelected ? 'text-blue-600' : ''}`}>
                  {opt.label}
                </span>
                {isSelected && (
                  <FontAwesomeIcon icon={faCheck} className="text-blue-500 text-sm" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
