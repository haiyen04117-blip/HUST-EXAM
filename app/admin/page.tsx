"use client";
import { useState } from "react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("dai-so");
  const [duration, setDuration] = useState(45);
  
  // Mặc định tạo sẵn 1 câu hỏi trống
  const [questions, setQuestions] = useState([
    { id: 1, text: "", options: ["", "", "", ""], correct: 0 }
  ]);

  const addQuestion = () => {
    setQuestions([...questions, { id: questions.length + 1, text: "", options: ["", "", "", ""], correct: 0 }]);
  };

  const handleQuestionChange = (index: number, field: string, value: any, optionIndex?: number) => {
    const newQuestions = [...questions];
    if (field === "text") newQuestions[index].text = value;
    if (field === "correct") newQuestions[index].correct = Number(value);
    if (field === "option" && optionIndex !== undefined) {
      newQuestions[index].options[optionIndex] = value;
    }
    setQuestions(newQuestions);
  };

  const handleSaveExam = async () => {
    if (!password) return alert("Vui lòng nhập mật khẩu Admin!");
    
    const res = await fetch("/api/admin/add-exam", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, title, subject, duration, questions }),
    });

    if (res.ok) {
      alert("Đã lưu đề thi thành công lên hệ thống!");
      setTitle(""); // Reset form
    } else {
      alert("Lưu thất bại. Kiểm tra lại mật khẩu Admin.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] p-8 text-[#333333]">
      <div className="max-w-4xl mx-auto bg-white p-6 border border-[#eae6df] rounded-sm shadow-sm">
        <h1 className="text-2xl font-bold mb-6 text-[#2c4c3b]">Khu Vực Quản Trị - Thêm Đề Thi Mới</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <input type="password" placeholder="Mật khẩu Admin..." value={password} onChange={e => setPassword(e.target.value)} className="p-2 border border-[#dcd6cc] rounded-sm" />
          <input type="text" placeholder="Tên đề thi (VD: Giữa kỳ Đại số 2025)" value={title} onChange={e => setTitle(e.target.value)} className="p-2 border border-[#dcd6cc] rounded-sm" />
          
          <select value={subject} onChange={e => setSubject(e.target.value)} className="p-2 border border-[#dcd6cc] rounded-sm bg-white">
            <option value="dai-so">Đại số tuyến tính</option>
            <option value="giai-tich">Giải tích 1 & 2</option>
            <option value="vat-ly">Vật lý đại cương</option>
            <option value="xstk">Xác suất thống kê</option>
            <option value="tin-hoc">Tin học đại cương</option>
          </select>
          
          <input type="number" placeholder="Thời gian (phút)" value={duration} onChange={e => setDuration(Number(e.target.value))} className="p-2 border border-[#dcd6cc] rounded-sm" />
        </div>

        <div className="space-y-6 mb-6">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="p-4 bg-[#f4f1eb] border border-[#dcd6cc] rounded-sm">
              <div className="font-bold mb-2">Câu {qIndex + 1}:</div>
              <textarea placeholder="Nội dung câu hỏi (hỗ trợ mã LaTeX, ví dụ: $$\int x dx$$)" value={q.text} onChange={e => handleQuestionChange(qIndex, "text", e.target.value)} className="w-full p-2 mb-2 border border-[#dcd6cc] rounded-sm" rows={2} />
              
              <div className="grid grid-cols-2 gap-2 mb-2">
                {q.options.map((opt, oIndex) => (
                  <input key={oIndex} type="text" placeholder={`Đáp án ${oIndex + 1}`} value={opt} onChange={e => handleQuestionChange(qIndex, "option", e.target.value, oIndex)} className="p-2 border border-[#dcd6cc] rounded-sm" />
                ))}
              </div>
              
              <select value={q.correct} onChange={e => handleQuestionChange(qIndex, "correct", e.target.value)} className="p-2 border border-[#dcd6cc] rounded-sm bg-white text-sm">
                <option value={0}>Đáp án đúng: 1</option>
                <option value={1}>Đáp án đúng: 2</option>
                <option value={2}>Đáp án đúng: 3</option>
                <option value={3}>Đáp án đúng: 4</option>
              </select>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button onClick={addQuestion} className="px-4 py-2 bg-[#eef2f5] hover:bg-[#dcd6cc] font-semibold rounded-sm transition-colors border border-[#dcd6cc]">
            + Thêm câu hỏi
          </button>
          <button onClick={handleSaveExam} className="px-4 py-2 bg-[#4a4238] hover:bg-[#333333] text-white font-bold rounded-sm transition-colors flex-1">
            Lưu đề thi vào hệ thống
          </button>
        </div>

      </div>
    </div>
  );
}