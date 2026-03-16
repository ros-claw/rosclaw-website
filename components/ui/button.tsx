import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

export function Button({ children, className, variant = 'primary', onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-6 py-3 rounded-lg font-semibold transition-all duration-300',
        variant === 'primary' && 'bg-cyan text-black hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]',
        variant === 'secondary' && 'border border-white/20 text-white hover:bg-white/5',
        className
      )}
    >
      {children}
    </button>
  );
}
