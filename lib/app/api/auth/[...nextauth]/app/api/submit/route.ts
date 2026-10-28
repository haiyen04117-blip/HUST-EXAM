import { NextResponse } from "next/server";
import { dbAdmin } from "@/lib/firebaseAdmin";

export async function POST(request: Request) {
  const { examId, answers, email, name, cheatCount } = await request.json();
  const docSnap = await dbAdmin.collection("exams").doc(examId).get();
  
  if (!docSnap.exists) return NextResponse.json({ error: "Lỗi đề" }, { status: 404 });
  
  const examData = docSnap.data();
  let score = 0;
  const details: any[] = [];

  examData?.questions.forEach((q: any) => {
    const isCorrect = answers[q.id] === q.correct;
    if (isCorrect) score += 1;
    details.push({ id: q.id, userSelected: answers[q.id], correct: q.correct, isCorrect });
  });

  await dbAdmin.collection("results").add({
    examId, email, name, score, total: examData?.questions.length, cheatCount, timestamp: new Date()
  });

  return NextResponse.json({ score, total: examData?.questions.length, details });
}