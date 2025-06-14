import React from 'react';
import Image from 'next/image';
import { UserButton } from '@stackframe/stack';
import IndiaGradient from '@/components/ui/IndiaGradient';
import { Button } from '@heroui/button';
import Link from 'next/link';

function AppHeader() {
  return (
    <header className="flex items-center justify-between px-4 py-3  bg-gradient-to-r from-blue-50 to-green-50 ">
      {/* Left Section: Logo and App Title */}
      <div className="flex items-center gap-3">
        <Image src="logoipsum-custom-logo.svg" alt="logo" width={40} height={35} />
        <IndiaGradient className="text-3xl font-semibold">ArogyaMitra</IndiaGradient>
      </div>

      {/* Right Section: Navigation and User */}
      <div className="flex items-center gap-4">
        <nav>
          <Button asChild variant="ghost">
            <Link href="/Docs">Docs</Link>
          </Button>
        </nav>
        <UserButton />
      </div>
    </header>
  );
}

export default AppHeader;
