-- CreateTable
CREATE TABLE "QuizShare" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "shareKey" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizShare_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuizShare_shareKey_key" ON "QuizShare"("shareKey");

-- AddForeignKey
ALTER TABLE "QuizShare" ADD CONSTRAINT "QuizShare_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
