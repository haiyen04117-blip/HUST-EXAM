"use client";
import Link from "next/link";

// Bạn có thể fetch dữ liệu API giống bước trước, ở đây tôi code khung UI chuẩn
export default function Home() {
  return (
    <div className="min-h-screen">
      <nav className="bg-white border-b border-[#eae6df] px-6 py-4 flex justify-between">
        <h1 className="font-bold text-xl">HUST Exam</h1>
        <Link href="/dashboard" className="px-4 py-2 bg-[#d4e4da] font-semibold rounded-sm">Vào Dashboard</Link>
      </nav>

      <div className="max-w-5xl mx-auto p-6 mt-6 grid grid-cols-3 gap-8">
        {/* Cột trái: Danh sách đề */}
        <div className="col-span-2">
          <h2 className="text-2xl font-bold mb-6">Đề thi mới nhất</h2>
          <div className="grid grid-cols-2 gap-4">
             {/* Dùng hàm map() để render đề thi như hướng dẫn ở bài trước */}
             <div className="bg-white p-5 border border-[#eae6df] rounded-sm">
                <span className="text-xs bg-[#f4f1eb] px-2 py-1 uppercase font-bold">Giải tích 1</span>
                <h3 className="font-bold text-lg mt-2 mb-4">Đề thi giữa kỳ 2025</h3>
                <Link href="/exam/giai-tich-2025" className="block text-center px-4 py-2 bg-[#eef2f5] font-semibold rounded-sm">Vào thi ngay</Link>
             </div>
          </div>
        </div>

        {/* Cột phải: Bảng vàng (TÍNH NĂNG MỚI) */}
        <div className="col-span-1">
          <div className="bg-white p-5 border border-[#eae6df] rounded-sm shadow-sm">
            <h3 className="font-bold text-lg mb-4 text-[#a33939]">🏆 Bảng Vàng (Top Điểm)</h3>
            <ul className="space-y-3">
              <li className="flex justify-between border-b pb-2 text-sm">
                <span className="font-semibold">1. Nguyễn Văn A</span>
                <span className="text-[#2c4c3b] font-bold">40/40</span>
              </li>
              <li className="flex justify-between border-b pb-2 text-sm">
                <span className="font-semibold">2. Trần Thị B</span>
                <span className="text-[#2c4c3b] font-bold">38/40</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}