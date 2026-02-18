"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { boxContainer, pageContainer } from "@/styles/variables";

// UI Components
import { Boxes } from "@/components/ui/background-boxes";
import { Loading } from "@/components/loading";
import { AuthBar } from "@/components/auth/auth-bar";
import { ActionButtons } from "@/components/createquiz/action-buttons";

export default function CreateQuiz() {
  const { data: session, status } = useSession();

  if (status === "loading") return <Loading />;

  return (
    <div className={pageContainer}>
      <Boxes />
      <div className={boxContainer} />
      {session && <AuthBar name={session?.user?.name} email={session?.user?.email} showDashboardButton={true} showCreateQuizButton={false}/>}
      <ActionButtons />
    </div>
  );
}
