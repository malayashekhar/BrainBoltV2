"use client";

import { cn } from "@/lib/utils";
import { pageContainer } from "@/styles/variables";

export function Loading() {
  return (
    <div className={cn(pageContainer, "flex items-center justify-center")}>
      <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
    </div>
  );
}