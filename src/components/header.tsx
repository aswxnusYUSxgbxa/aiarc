"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ThemeToggle } from "@/components/theme-toggle";
import { useEffect, useState } from "react";

export default function Header() {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // Only format date on the client after mount
    const timer = setTimeout(() => {
      setCurrentDate(format(new Date(), "E, MMM d, yyyy"));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const tags = [
    { name: "Home", href: "/" },
    { name: "Cricket", href: "/?tag=Cricket" },
    { name: "India News", href: "/?tag=India+News" },
    { name: "Entertainment", href: "/?tag=Entertainment" },
    { name: "World News", href: "/?tag=World+News" },
    { name: "Lifestyle", href: "/?tag=Lifestyle" },
  ];

  return (
    <header className="bg-[#faf9f6] dark:bg-[#0a0a0a] border-b-4 border-black dark:border-white mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Masthead Header */}
        <div className="py-8 flex flex-col items-center justify-center border-b-2 border-black dark:border-white relative">
          <div className="absolute top-8 left-0 text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-400">
            {currentDate}
          </div>
          <div className="absolute top-8 right-0">
            <ThemeToggle />
          </div>

          <Link
            href="/"
            className="text-6xl md:text-8xl font-black tracking-tighter text-gray-900 dark:text-white my-4 hover:opacity-80 transition-opacity"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            The Neo Times
          </Link>

          <div className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-gray-900 dark:text-gray-400 border-t border-b border-black dark:border-white py-1 w-full text-center max-w-md">
            “The finest journalism in the digital age”
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="h-14 flex items-center justify-center gap-8 overflow-x-auto whitespace-nowrap scrollbar-hide text-sm font-bold uppercase tracking-wider">
          {tags.map((tag) => (
            <Link
              key={tag.name}
              href={tag.href}
              className="text-gray-900 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {tag.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
