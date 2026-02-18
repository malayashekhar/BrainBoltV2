import { NextResponse } from "next/server";
import db from "@/lib/db";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const { shareKey } = await req.json();
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

    if (!shareKey) {
      return NextResponse.json({ error: "Share key is required" }, { status: 400 });
    }

    const quizShare = await db.quizShare.findFirst({
      where: { 
        shareKey,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      include: {
        quiz: {
          include: {
            questions: {
              include: {
                options: true,
              },
            },
          },
        },
      },
    });

    if (!quizShare) {
      return NextResponse.json({ error: "Invalid or expired share key" }, { status: 404 });
    }

    // Create a new copy of quiz for user
    const newQuizId = crypto.randomUUID();
    const newQuiz = await db.quiz.create({
      data: {
        id: newQuizId,
        title: quizShare.quiz.title,
        description: quizShare.quiz.description,
        userId: user.id,
        questions: {
          create: quizShare.quiz.questions.map((question) => ({
            text: question.text,
            options: {
              create: question.options.map((option) => ({
                text: option.text,
                isCorrect: option.isCorrect,
              })),
            },
          })),
        },
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Quiz added successfully",
      quizId: newQuiz.id,
      title: newQuiz.title,
    });
  } catch (error) {
    console.error("Error adding shared quiz:", error);
    return NextResponse.json({ error: "Failed to add shared quiz" }, { status: 500 });
  }
}
