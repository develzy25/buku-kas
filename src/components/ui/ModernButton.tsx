"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface ModernButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: IconDefinition;
  children: React.ReactNode;
  variant?: "primary" | "success" | "danger";
  isLoading?: boolean;
}

export default function ModernButton({ 
  icon, 
  children, 
  variant = "primary", 
  isLoading,
  className = "",
  ...props 
}: ModernButtonProps) {

  const variants = {
    primary: "bg-linear-to-r from-blue-500 to-blue-600 shadow-[0_4px_12px_rgba(59,130,246,0.4)] hover:from-blue-400 hover:to-blue-500",
    success: "bg-linear-to-r from-green-500 to-green-600 shadow-[0_4px_12px_rgba(34,197,94,0.4)] hover:from-green-400 hover:to-green-500",
    danger: "bg-linear-to-r from-red-500 to-red-600 shadow-[0_4px_12px_rgba(239,68,68,0.4)] hover:from-red-400 hover:to-red-500",
  };

  return (
    <button 
      disabled={isLoading || props.disabled}
      className={`w-full py-4 rounded-2xl text-white font-extrabold tracking-wide text-lg text-center flex items-center justify-center gap-3 transition-all duration-300 active:scale-[0.98] 
        ${(isLoading || props.disabled) ? 'opacity-70 cursor-not-allowed' : ''}
        ${variants[variant]} ${className}`}
      {...props}
    >
      {icon && <FontAwesomeIcon icon={icon} className={`text-xl drop-shadow-md ${isLoading ? 'animate-spin' : ''}`} />}
      {children}
    </button>
  );
}
