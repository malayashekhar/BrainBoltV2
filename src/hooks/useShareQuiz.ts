"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useShareQuiz() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const addSharedQuiz = async (shareKey: string) => {

        if (!shareKey.trim()) {
            toast.error("Please enter a share key");
            return;
        }
        setLoading(true);

        try {
            const response = await fetch(`/api/addsharedquiz`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ shareKey: shareKey.trim() }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to add shared quiz");
            }

            toast.success("Quiz added successfully!");
            router.push("/dashboard");

        } catch (error) {
            console.error("Error adding shared quiz:", error);
            const errorMessage = error instanceof Error ? error.message : "Failed to add shared quiz";
            toast(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    return {
        addSharedQuiz,
        loading
    };
};

