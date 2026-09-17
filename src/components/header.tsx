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
    <header className="bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="h-20 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
          <div className="flex-1 flex items-center text-sm text-gray-600 dark:text-gray-400">
            {currentDate}
          </div>
          <div className="flex-1 flex justify-center">
            <Link
              href="/"
              className="text-4xl font-extrabold tracking-tighter text-gray-900 dark:text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              NewNBlog
            </Link>
          </div>
          <div className="flex-1 flex justify-end">
            <ThemeToggle />
          </div>
        </div>
        {/* Navigation Bar */}
        <nav className="h-12 flex items-center gap-6 overflow-x-auto whitespace-nowrap scrollbar-hide text-sm font-medium">
          {tags.map((tag) => (
            <Link
              key={tag.name}
              href={tag.href}
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {tag.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
