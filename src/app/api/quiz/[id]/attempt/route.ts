import { NextResponse } from "next/server";
import db from "@/lib/db";
import { auth } from "@/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const { score, totalQuestions } = await req.json();

    // Verify quiz exists and user has access
    const quiz = await db.quiz.findUnique({
      where: { id },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Check if user owns the quiz or if it's shared
    if (quiz.userId !== user.id) {
      // Check if quiz is shared
      const share = await db.quizShare.findFirst({
        where: { 
          quizId: id,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } }
          ]
        },
      });

      if (!share) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }
    }

    // Create attempt record
    const percentage = (score / totalQuestions) * 100;
    const correctAnswers = score;

    const attempt = await db.attempt.create({
      data: {
        userId: user.id,
        quizId: id,
        score,
        totalQuestions,
        percentage,
        correctAnswers,
      },
    });

    // Update quiz statistics
    await db.quiz.update({
      where: { id },
      data: {
        totalAttempts: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ 
      success: true,
      attemptId: attempt.id 
    });
  } catch (error) {
    console.error("Error submitting attempt:", error);
    return NextResponse.json({ error: "Failed to submit attempt" }, { status: 500 });
  }
}
