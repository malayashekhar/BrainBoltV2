"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { pageContainer } from "@/styles/variables";

// UI Components
import { AuthBar } from "@/components/auth/auth-bar";
import { Loading } from "@/components/loading";
import { DashboardTables } from "@/components/dashboard/dashboard-tables";

// Hooks
import { useDashboardQuizzes } from "@/hooks/useDashboardQuizzes";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const {quizzes, loading, handleShare, handleDelete } = useDashboardQuizzes(status);

  if (status === "loading" || loading) return <Loading />;

  return (
    <div className={pageContainer}>
      {session && <AuthBar name={session.user?.name} email={session.user?.email} showDashboardButton={false} showCreateQuizButton={true} />}
      <DashboardTables quizzes={quizzes} handleShare={handleShare} handleDelete={handleDelete} />
    </div>
  );
}
