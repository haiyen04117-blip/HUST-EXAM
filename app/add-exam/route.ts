import { NextResponse } from "next/server";
import { dbAdmin } from "@/lib/firebaseAdmin";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Kiểm tra mật khẩu Admin (so sánh với file .env.local)
    if (data.password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Sai mật khẩu Admin" }, { status: 401 });
    }

    // Lưu đề vào bảng "exams"
    const examRef = await dbAdmin.collection("exams").add({
      title: data.title,
      subject: data.subject,
      duration: Number(data.duration) * 60, // Đổi phút sang giây
      questions: data.questions,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, id: examRef.id });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi hệ thống khi lưu đề" }, { status: 500 });
  }
}