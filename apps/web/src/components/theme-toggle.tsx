'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ThemeToggleProps {
  size?: 'sm' | 'md';
}

export function ThemeToggle({ size = 'md' }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Size configurations
  const sizeConfig = {
    sm: {
      buttonSize: 'h-8 w-8',
      iconSize: 'h-[1rem] w-[1rem]',
    },
    md: {
      buttonSize: 'h-10 w-10',
      iconSize: 'h-[1.2rem] w-[1.2rem]',
    },
  };

  const config = sizeConfig[size];

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className={config.buttonSize}
        disabled
      >
        <Sun className={config.iconSize} />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className={`${config.buttonSize} hover:bg-black hover:text-white hover:border-black dark:hover:bg-white dark:hover:text-black dark:hover:border-white`}
          >
            <Sun className={`${config.iconSize} rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0`} />
            <Moon className={`absolute ${config.iconSize} rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100`} />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Switch to {theme === 'light' ? 'dark' : 'light'} mode</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

