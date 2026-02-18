"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { pageContainer } from "@/styles/variables";

// UI Components
import { Loading } from "@/components/loading";
import { AuthBar } from "@/components/auth/auth-bar";
import { UploadPdf } from "@/components/createquiz/uploadpdf";

// Hooks
import { useCreateQuizForUploadPDF } from "@/hooks/useCreateQuizForUploadPDF";

export default function PdfQuiz() {
    const { data: session, status } = useSession();
    const { title, setTitle, numberOfQuestions, setNumberOfQuestions, document, setDocument, loading, handleSave } = useCreateQuizForUploadPDF();
    if (status === "loading") return <Loading />;
    return (
        <div className={pageContainer}>
            {session && <AuthBar name={session.user?.name} email={session.user?.email} showDashboardButton={true} showCreateQuizButton={false} />}
            <UploadPdf title={title} setTitle={setTitle} numberOfQuestions={numberOfQuestions} setNumberOfQuestions={setNumberOfQuestions} handleSave={handleSave} document={document} setDocument={setDocument} loading={loading} />
        </div>
    );
}
