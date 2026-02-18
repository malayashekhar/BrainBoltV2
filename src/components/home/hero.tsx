import { cn } from "@/lib/utils"
import Image from "next/image" 

export function Hero() {
    return (
        <div>
            <h1
                className={cn(
                    "font-bold text-white",
                    "text-7xl",
                    "mb-8",
                )}
            >
                BrainBolt.
            </h1>

            <div className="w-full max-w-md sm:max-w-xl mb-8">
                <Image
                    src="/images/amadeus.png"
                    width={800}
                    height={800}
                    alt="Brain Bolt"
                    priority
                    className="w-full h-auto rounded-2xl object-contain shadow-2xl shadow-black/40"
                />
            </div>

            <p className="text-base sm:text-xl text-neutral-300 mb-8 px-2">
                Test your knowledge with our AI-Powered interactive quizzes.
            </p>
        </div>
    )
}