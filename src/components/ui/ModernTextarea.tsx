"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface ModernTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  icon?: IconDefinition;
  iconColorClass?: string;
}

export default function ModernTextarea({ 
  label, 
  icon, 
  iconColorClass = "bg-gray-500", 
  ...props 
}: ModernTextareaProps) {
  return (
    <div className={`p-1 rounded-2xl md:rounded-3xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 bg-white group focus-within:shadow-[inset_0_2px_10px_rgba(0,0,0,0.02),0_4px_20px_rgba(59,130,246,0.15)] focus-within:border-blue-300 transition-all duration-300 ease-out`}>
      <div className={`flex items-start gap-3 p-2 md:p-3 rounded-2xl bg-gray-50/50 group-focus-within:bg-blue-50/30 transition-colors`}>
        {icon && (
          <div className={`shrink-0 mt-1 flex items-center justify-center rounded-xl md:rounded-2xl shadow-[0_4px_10px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.4)] text-white transition-transform duration-300 group-focus-within:scale-110 group-focus-within:rotate-3 w-10 h-10 md:w-12 md:h-12 ${iconColorClass}`}>
            <FontAwesomeIcon icon={icon} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <label className="block text-[10px] md:text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1 group-focus-within:text-blue-500 transition-colors">
            {label}
          </label>
          <textarea 
            className="w-full outline-none bg-transparent resize-none font-medium text-gray-800 placeholder-gray-400 text-sm md:text-base leading-relaxed"
            {...props}
          ></textarea>
        </div>
      </div>
    </div>
  );
}
