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

    const quiz = await db.quiz.findUnique({
      where: { 
        id,
        userId: user.id 
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Check if share already exists
    const existingShare = await db.quizShare.findFirst({
      where: { id },
    });

    if (existingShare && (!existingShare.expiresAt || existingShare.expiresAt > new Date())) {
      return NextResponse.json({ shareKey: existingShare.shareKey });
    }

    // Create new share
    const shareKey = crypto.randomUUID().replace(/-/g, '').substring(0, 8);
    
    const quizShare = await db.quizShare.create({
      data: {
        quiz: {
          connect: {
            id: id
          }
        },
        shareKey,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    return NextResponse.json({ shareKey: quizShare.shareKey });
  } catch (error) {
    console.error("Error creating share link:", error);
    return NextResponse.json({ error: "Failed to create share link" }, { status: 500 });
  }
}
