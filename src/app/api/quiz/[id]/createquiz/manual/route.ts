import { NextResponse } from "next/server";
import db from "@/lib/db";
import { auth } from "@/auth";
import { Question } from "@/types/questions";
import { Option } from "@/types/option";


export async function POST(req: Request) {
  try {
    const { quizId, title, description, questions } = await req.json();

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
    const quiz = await db.quiz.create({
      data: {
        id: quizId,
        title,
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
    });
    return NextResponse.json({ id: quiz.id });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 });
  }
}