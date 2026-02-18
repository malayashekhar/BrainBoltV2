import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import "dotenv/config";
import { auth } from "@/auth";
import { Question } from "@/types/questions";
import { Option } from "@/types/option";


export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await params;
    const body = await req.json();
    const { quizId, title, numberOfQuestions } = body;

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

    
    if (!quizId || !title || !numberOfQuestions) {
      return NextResponse.json(
        { error: "Missing quizId or title or numQuestions", received: { quizId, title, numberOfQuestions } },
        { status: 400 }
      );
    }

    console.log("Request body:", { quizId, title, numberOfQuestions });

    const aiServiceUrl = process.env.AI_SERVICE_URL_PROMPT || "";
    const response = await fetch(aiServiceUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "title": title,
        "numQuestions": numberOfQuestions,
      }),
    });


    if (!response.ok) {
      const errorData = await response.text();
      console.error("Backend error details:", errorData);
      return NextResponse.json(
        { error: "Backend error", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    const quiz = data.quiz;
    const quizTitle = quiz.title;
    const description = quiz.description;
    const questions = quiz.questions;

    const newQuiz = await db.quiz.create({
      data: {
        id: quizId,
        title: quizTitle,
        description,
        userId: user.id,
        questions: {
          create: questions.map((q: Question) => ({
            text: q.text,
            options: {
              create: q.options.map((o: Option) => ({
                text: o.text,
                isCorrect: o.isCorrect,
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

    return NextResponse.json({ quiz: newQuiz });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
