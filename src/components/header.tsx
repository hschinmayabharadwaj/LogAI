import Link from 'next/link';
import { Logo } from '@/components/icons/logo';

export default function Header() {
  return (
    <header className="w-full border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <span className="font-headline text-xl font-semibold tracking-tight">
            LogLens AI
          </span>
        </Link>
      </div>
    </header>
  );
}
