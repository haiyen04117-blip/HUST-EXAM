"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

// Danh sách các môn học
const SUBJECTS = [
  { id: "all", name: "Tất cả môn" },
  { id: "dai-so", name: "Đại số tuyến tính" },
  { id: "giai-tich", name: "Giải tích 1 & 2" },
  { id: "vat-ly", name: "Vật lý đại cương" },
  { id: "xstk", name: "Xác suất thống kê" },
  { id: "tin-hoc", name: "Tin học đại cương" },
];

interface ExamSummary {
  id: string;
  title: string;
  subject: string;
  duration: number;
  questionCount: number;
}

export default function HomePage() {
  const { data: session } = useSession();
  const [exams, setExams] = useState<ExamSummary[]>([]);
  const [activeSubject, setActiveSubject] = useState("all");
  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu đề thi từ API
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await fetch("/api/exams");
        if (res.ok) {
          const data = await res.json();
          setExams(data.exams || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  // Lọc đề thi theo môn
  const filteredExams = activeSubject === "all" 
    ? exams 
    : exams.filter(exam => exam.subject === activeSubject);

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#333333] font-sans">
      
      {/* THANH ĐIỀU HƯỚNG (NAVBAR) */}
      <nav className="bg-white border-b border-[#eae6df] px-6 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
        <h1 className="text-2xl font-extrabold text-[#2c4c3b]">HUST Exam</h1>
        <div className="flex gap-4">
          {session ? (
            <>
              <Link href="/dashboard" className="px-4 py-2 bg-[#d4e4da] hover:bg-[#c3d6c9] text-[#2c4c3b] font-bold rounded-sm transition-colors">
                Vào Dashboard
              </Link>
              <button onClick={() => signOut()} className="px-4 py-2 bg-[#fdf5f5] hover:bg-[#f2dada] text-[#a33939] font-semibold rounded-sm border border-[#e6caca]">
                Đăng xuất
              </button>
            </>
          ) : (
            <button onClick={() => signIn("google")} className="px-5 py-2 bg-[#4a4238] hover:bg-[#333333] text-white font-bold rounded-sm transition-colors shadow-sm">
              Đăng nhập với Google
            </button>
          )}
        </div>
      </nav>

      {/* NỘI DUNG CHÍNH */}
      <div className="max-w-6xl mx-auto p-6 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CỘT TRÁI: BỘ LỌC & DANH SÁCH ĐỀ */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#4a4238] mb-2">Kho Đề Thi Trắc Nghiệm</h2>
            <p className="text-[#7a7369]">Chọn môn học bên dưới để bắt đầu luyện tập.</p>
          </div>

          {/* BỘ LỌC MÔN HỌC */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-[#eae6df] pb-4">
            {SUBJECTS.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setActiveSubject(sub.id)}
                className={`px-4 py-2 text-sm font-semibold rounded-sm border transition-colors ${
                  activeSubject === sub.id
                    ? "bg-[#4a4238] text-white border-[#4a4238]" 
                    : "bg-white text-[#7a7369] border-[#dcd6cc] hover:bg-[#f4f1eb]"
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>

          {/* DANH SÁCH ĐỀ THI */}
          {loading ? (
            <div className="text-center text-[#7a7369] py-10 bg-white border border-[#eae6df] rounded-sm">Đang tải đề thi...</div>
          ) : filteredExams.length === 0 ? (
            <div className="text-center text-[#7a7369] py-10 bg-white border border-[#eae6df] rounded-sm">
              Chưa có đề thi nào cho môn này. Admin cần thêm đề.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredExams.map((exam) => (
                <div key={exam.id} className="bg-white p-5 border border-[#eae6df] rounded-sm hover:shadow-md transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="bg-[#f4f1eb] text-[#4a4238] text-xs font-bold px-2 py-1 rounded-sm uppercase">
                        {SUBJECTS.find(s => s.id === exam.subject)?.name || exam.subject}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#4a4238] mb-2">{exam.title}</h3>
                    <div className="text-sm text-[#7a7369] flex gap-4 mb-6">
                      <span>Số câu: <b>{exam.questionCount}</b></span>
                      <span>Thời gian: <b>{exam.duration / 60}p</b></span>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/exam/${exam.id}`}
                    className="block w-full text-center px-4 py-2 bg-[#eef2f5] hover:bg-[#d4e4da] text-[#4a5568] hover:text-[#2c4c3b] font-bold rounded-sm border border-[#dcd6cc] transition-colors"
                  >
                    Vào thi ngay
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CỘT PHẢI: BẢNG VÀNG */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 border border-[#eae6df] rounded-sm shadow-sm sticky top-24">
            <h3 className="font-bold text-lg mb-4 text-[#a33939] flex items-center gap-2">
              🏆 Bảng Vàng (Top Điểm)
            </h3>
            <ul className="space-y-4">
              <li className="flex justify-between items-center border-b border-[#eae6df] pb-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#fdf5f5] text-[#a33939] flex items-center justify-center font-bold text-xs">1</span>
                  <span className="font-semibold text-[#4a4238]">Nguyễn Văn A</span>
                </div>
                <span className="text-[#2c4c3b] font-bold bg-[#d4e4da] px-2 py-1 rounded-sm">40/40</span>
              </li>
              <li className="flex justify-between items-center border-b border-[#eae6df] pb-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#f4f1eb] text-[#7a7369] flex items-center justify-center font-bold text-xs">2</span>
                  <span className="font-semibold text-[#4a4238]">Trần Thị B</span>
                </div>
                <span className="text-[#2c4c3b] font-bold bg-[#d4e4da] px-2 py-1 rounded-sm">38/40</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}