import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export type LogoSize = 'xs' | 'xsm' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface LogoProps {
  size?: LogoSize;
  className?: string;
  href?: string;
  showText?: boolean;
  priority?: boolean;
}

const sizeMap: Record<LogoSize, { width: number; height: number; textSize: string }> = {
  xs: { width: 32, height: 32, textSize: 'text-sm' },
  xsm: { width: 44, height: 44, textSize: 'text-lg' },
  sm: { width: 64, height: 64, textSize: 'text-base' },
  md: { width: 128, height: 128, textSize: 'text-xl' },
  lg: { width: 256, height: 256, textSize: 'text-2xl' },
  xl: { width: 512, height: 512, textSize: 'text-4xl' },
  full: { width: 1024, height: 1024, textSize: 'text-5xl' },
};

export function Logo({
  size = 'md',
  className,
  href = '/',
  showText = true,
  priority = false,
}: LogoProps) {
  const { width, height, textSize } = sizeMap[size];

  const logoImage = (
    <div className={cn('flex items-center gap-3', className)}>
      <Image
        src="/logos/bookme-logo.svg"
        alt="BookMe Logo"
        width={width}
        height={height}
        priority={priority}
      />
      {showText && (
        <span className={cn('font-bold text-foreground', textSize)}>
          BookMe
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center transition-opacity hover:opacity-80">
        {logoImage}
      </Link>
    );
  }

  return logoImage;
}

// Specialized logo variants for common use cases
export function LogoIcon({ size = 'sm', className }: Pick<LogoProps, 'size' | 'className'>) {
  return <Logo size={size} showText={false} className={className} />;
}

export function LogoFull({ className }: Pick<LogoProps, 'className'>) {
  return <Logo size="lg" showText={true} className={className} />;
}

export function LogoNav({ className }: Pick<LogoProps, 'className'>) {
  return <Logo size="sm" showText={true} priority className={className} />;
}

