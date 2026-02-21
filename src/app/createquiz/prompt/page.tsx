"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";

// UI Components
import { Loading } from "@/components/loading";
import { pageContainer } from "@/styles/variables";
import { AuthBar } from "@/components/auth/auth-bar";
import { PromptTextQuiz } from "@/components/createquiz/prompt";

// Hooks
import { useCreateQuiz } from "@/hooks/useCreateQuiz";

export default function PromptQuiz() {
    const { data: session, status } = useSession();
    const [title, setTitle] = useState("");
    const [numberOfQuestions, setNumberOfQuestions] = useState("");
    const [description, setDescription] = useState("")
    const { saveQuiz, loading } = useCreateQuiz();

    if (status === "loading") return <Loading />;

    return (
        <div className={pageContainer}>
            {session && <AuthBar name={session.user?.name} email={session.user?.email} showDashboardButton={true} showCreateQuizButton={false}/> }
            <PromptTextQuiz title={title} setTitle={setTitle} numberOfQuestions={numberOfQuestions} setNumberOfQuestions={setNumberOfQuestions} description={description} setDescription={setDescription} handleSave={() => saveQuiz(title, description, "prompt", numberOfQuestions)} loading={loading} />
        </div>
    );
}
