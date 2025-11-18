import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthFooterProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export function AuthFooter({ className, variant = 'dark' }: AuthFooterProps) {
  const currentYear = new Date().getFullYear();

  const linkStyles = variant === 'light' 
    ? 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
    : 'text-white/70 hover:text-white';

  const textStyles = variant === 'light'
    ? 'text-gray-600 dark:text-gray-400'
    : 'text-white/70';

  return (
    <footer className={cn('space-y-4', className)}>
      <div className="flex items-center justify-center gap-4">
        <Link
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'transition-colors',
            linkStyles
          )}
          aria-label="Facebook"
        >
          <Facebook className="h-5 w-5" />
        </Link>
        <Link
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'transition-colors',
            linkStyles
          )}
          aria-label="Twitter"
        >
          <Twitter className="h-5 w-5" />
        </Link>
        <Link
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'transition-colors',
            linkStyles
          )}
          aria-label="Instagram"
        >
          <Instagram className="h-5 w-5" />
        </Link>
        <Link
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'transition-colors',
            linkStyles
          )}
          aria-label="LinkedIn"
        >
          <Linkedin className="h-5 w-5" />
        </Link>
      </div>
      <p className={cn('text-center text-sm', textStyles)}>
        © {currentYear} BookMe. All rights reserved.
      </p>
    </footer>
  );
}

