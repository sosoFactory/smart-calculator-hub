import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../ui/tooltip';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
          className={`h-9 w-9 border-[#e5e7eb] dark:border-ghost-dark-hairline-soft bg-white dark:bg-ghost-dark-surface hover:bg-slate-50 dark:hover:bg-ghost-dark-hover text-[#112220] dark:text-ghost-dark-ink relative ${className || ''}`}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-200 dark:-rotate-90 dark:scale-0 text-[#112220] dark:text-ghost-dark-ink" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-200 dark:rotate-0 dark:scale-100 text-[#d1ff19]" />
          <span className="sr-only">테마 전환</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      </TooltipContent>
    </Tooltip>
  );
};
