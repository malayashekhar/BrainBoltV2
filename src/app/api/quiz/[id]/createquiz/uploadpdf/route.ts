import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { auth } from "@/auth";
import "dotenv/config";
import { Question } from "@/types/questions";
import { Option } from "@/types/option";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await params;
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

    const formData = await req.formData();
    
    const pdfFile = formData.get("document") as File;
    const quizId = formData.get("title") as string;
    const numberOfQuestions = formData.get("numberOfQuestions") as string;

    if (!pdfFile || !quizId || !numberOfQuestions) {
      return NextResponse.json(
        { error: "Missing PDF file, quizId, or numberOfQuestions", received: { pdfFile: !!pdfFile, quizId, numberOfQuestions } },
        { status: 400 }
      );
    }

    const arrayBuffer = await pdfFile.arrayBuffer();
    const base64Pdf = Buffer.from(arrayBuffer).toString("base64");

    const aiServiceUrl = process.env.AI_SERVICE_URL_UPLOAD_PDF || "";
    const response = await fetch(aiServiceUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: quizId,
        numQuestions: numberOfQuestions,
        pdfData: base64Pdf,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Backend error details:", errorData);
      console.error("Request payload size:", JSON.stringify({
        pdf: base64Pdf.substring(0, 100) + "...",
        numQuestions: parseInt(numberOfQuestions),
      }).length);
      return NextResponse.json(
        { error: "Backend error", details: errorData, status: response.status },
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
