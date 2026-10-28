"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

export default function ExamClient({ examId, examData }: { examId: string, examData: any }) {
  const { data: session } = useSession();
  const [timeLeft, setTimeLeft] = useState(examData.duration);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reviewData, setReviewData] = useState<any>(null);
  const [cheatCount, setCheatCount] = useState(0);

  // Phục hồi nháp
  useEffect(() => {
    const saved = localStorage.getItem(`exam_${examId}`);
    if (saved) {
      const { a, t, c } = JSON.parse(saved);
      setAnswers(a); setTimeLeft(t); setCheatCount(c || 0);
    }
  }, [examId]);

  // Đếm ngược & Auto-save
  useEffect(() => {
    if (timeLeft <= 0 && !isSubmitted) handleSubmit();
    if (!isSubmitted) {
      const timer = setInterval(() => {
        setTimeLeft(p => {
          localStorage.setItem(`exam_${examId}`, JSON.stringify({ a: answers, t: p - 1, c: cheatCount }));
          return p - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isSubmitted, answers, cheatCount]);

  // Anti-Cheat: Chuyển tab 3 lần tự động thu bài
  useEffect(() => {
    const handleVis = () => {
      if (document.hidden && !isSubmitted) {
        setCheatCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            alert("Bạn đã vi phạm quy chế (chuyển tab) quá 3 lần. Hệ thống tự động thu bài!");
            handleSubmit(newCount);
          } else {
            alert(`Cảnh báo gian lận lần ${newCount}/3! Không được rời khỏi trang thi.`);
          }
          return newCount;
        });
      }
    };
    document.addEventListener("visibilitychange", handleVis);
    return () => document.removeEventListener("visibilitychange", handleVis);
  }, [isSubmitted]);

  const handleSelect = (qId: number, optIdx: number) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmit = async (finalCheatCount = cheatCount) => {
    setIsSubmitted(true);
    localStorage.removeItem(`exam_${examId}`);
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ examId, answers, email: session?.user?.email, name: session?.user?.name, cheatCount: finalCheatCount })
    });
    setReviewData(await res.json());
  };

  const renderMath = (text: string) => text.includes('$$') ? text.split('$$').map((p, i) => i % 2 === 0 ? p : <InlineMath key={i} math={p} />) : text;

  return (
    <div className="min-h-screen p-4 select-none">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center bg-[#f4f1eb] p-4 mb-6 sticky top-0 z-10 border-b border-[#dcd6cc] rounded-sm">
          <div>
            <h2 className="font-bold text-[#4a4238]">{examData.title}</h2>
            <p className="text-sm text-red-600 font-semibold">Vi phạm: {cheatCount}/3</p>
          </div>
          {!isSubmitted ? (
            <div className="text-2xl font-mono font-bold text-[#4a4238]">
              {Math.floor(timeLeft/60).toString().padStart(2,"0")}:{ (timeLeft%60).toString().padStart(2,"0") }
            </div>
          ) : reviewData && (
            <div className="text-xl font-bold text-[#2c4c3b]">Điểm: {reviewData.score}/{reviewData.total}</div>
          )}
          {!isSubmitted && <button onClick={() => { if(confirm("Nộp bài?")) handleSubmit(); }} className="px-6 py-2 bg-[#d4e4da] font-semibold rounded-sm border border-[#b8cbbd]">Nộp Bài</button>}
        </div>

        <div className="space-y-4">
          {examData.questions.map((q: any, i: number) => {
            const rd = reviewData?.details.find((d:any) => d.id === q.id);
            const isC = rd?.isCorrect;
            return (
              <div key={q.id} className={`bg-white p-5 border rounded-sm ${isSubmitted ? (isC ? 'bg-[#f7fbf8] border-[#d4e4da]' : 'bg-[#fdf5f5] border-[#f2dada]') : 'border-[#eae6df]'}`}>
                <h3 className="font-semibold mb-4">Câu {i + 1}: {renderMath(q.text)}</h3>
                <div className="space-y-2">
                  {q.options.map((opt: string, oIdx: number) => {
                    const sel = answers[q.id] === oIdx;
                    const theCorrect = isSubmitted && rd?.correct === oIdx;
                    let bg = "bg-white hover:bg-[#faf9f7]";
                    if (!isSubmitted && sel) bg = "bg-[#eef2f5] border-[#b4c4d4]";
                    if (isSubmitted && theCorrect) bg = "bg-[#d4e4da] border-[#b8cbbd]";
                    if (isSubmitted && sel && !theCorrect) bg = "bg-[#f2dada] border-[#e6caca]";
                    
                    return (
                      <label key={oIdx} className={`flex p-3 border rounded-sm ${bg} ${!isSubmitted && 'cursor-pointer'}`}>
                        <input type="radio" disabled={isSubmitted} checked={sel} onChange={() => handleSelect(q.id, oIdx)} className="mr-3" />
                        <span>{renderMath(opt)}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}