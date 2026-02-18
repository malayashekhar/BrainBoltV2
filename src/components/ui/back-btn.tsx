"use client"
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation"
import { BackButtonProps } from "@/types/back-btn";

export function BackBtn(BackButtonProps: BackButtonProps) {
    const router = useRouter();
    return (
        <button
          onClick={() => router.push(BackButtonProps.location)}
          className="self-start mb-6 flex items-center gap-2 text-neutral-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
    )
}