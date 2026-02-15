"use client";
import React from "react";
import { cn } from "@/lib/utils";

export function Loading() {
  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center">
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 mask-[radial-gradient(transparent,white)] pointer-events-none" />
      <h1 className={cn("md:text-4xl text-xl text-white relative z-20")}>
        Loading...
      </h1>
    </div>
  );
}
