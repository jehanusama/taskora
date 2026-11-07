"use client";

import React, { useState } from "react";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground antialiased">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar className="fixed inset-y-0 left-0 z-40" />
      </div>

      {/* Mobile Sidebar Backdrop & Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden bg-background/80 backdrop-blur-xs transition-opacity"
          aria-hidden="true"
        >
          <div
            className="fixed inset-0"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex w-full max-w-xs flex-1 flex-col shadow-2xl">
            <Sidebar onMobileClose={() => setMobileMenuOpen(false)} className="h-full" />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:pl-64 min-w-0">
        <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

