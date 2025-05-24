// components/Footer.tsx

import React from "react";
import { Github, Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        <div className="text-center md:text-left">
          © {new Date().getFullYear()} Just Vote. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="mailto:keepgo.studio@gmail.com"
            className="hover:text-foreground transition-colors"
            aria-label="Email us"
          >
            <Mail className="w-4 h-4" />
          </Link>
          <Link
            href="https://github.com/keepgo-studio/just-vote-next"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <Github className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
