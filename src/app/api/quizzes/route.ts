import { NextResponse } from "next/server";
import db from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const quizzes = await db.quiz.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        attempts: {
          select: {
            score: true,
            totalQuestions: true,
          },
        },
      },
    });

    const quizzesWithStats = quizzes.map((quiz) => {
      const totalAttempts = quiz.attempts.length;
      const averageScore = totalAttempts > 0
        ? quiz.attempts.reduce((sum, attempt) => sum + (attempt.score / attempt.totalQuestions) * 100, 0) / totalAttempts
        : null;

      return {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        totalAttempts,
        averageScore,
        createdAt: quiz.createdAt.toISOString(),
      };
    });

    return NextResponse.json(quizzesWithStats);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 });
  }
}
