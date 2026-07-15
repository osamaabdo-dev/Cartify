import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getContactMessageById } from "@/actions/contactActions";

export const dynamic = "force-dynamic";

export default async function ContactMessageDetailPage({ params }) {
  const { id } = await params;
  const msg = await getContactMessageById(id);

  if (!msg) notFound();

  return (
    <div dir="rtl">
      <main className="flex-grow p-10 lg:p-16 max-w-4xl mx-auto">
        <div className="h-[3px] w-[60px] bg-gradient-to-l from-[#775a19] to-[#775a19]/20 rounded-full mb-6" />

        <nav className="flex items-center gap-2 text-sm text-[#45464d] mb-3">
          <Link href="/admin" className="hover:text-[#775a19] transition-colors font-medium">لوحة التحكم</Link>
          <ChevronLeft size={14} />
          <Link href="/admin/contact-messages" className="hover:text-[#775a19] transition-colors font-medium">طلبات التواصل</Link>
          <ChevronLeft size={14} />
          <span className="text-[#0b1c30] font-bold">تفاصيل الرسالة</span>
        </nav>

        <div className="mb-12">
          <h1 className="text-2xl lg:text-[40px] font-bold text-[#0b1c30] tracking-tight leading-[1.15]">
            تفاصيل الرسالة
          </h1>
          <p className="text-[#45464d] mt-2 text-base lg:text-lg">
            تم إرسالها في {new Date(msg.createdAt).toLocaleDateString("ar-EG", {
              year: "numeric", month: "long", day: "numeric",
              hour: "2-digit", minute: "2-digit",
            })}
          </p>
        </div>

        <div className="luxury-card rounded-2xl p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-xs font-bold text-[#94a3b8] tracking-wide mb-2">الاسم</p>
              <p className="text-lg font-bold text-[#0b1c30]">{msg.name}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-[#94a3b8] tracking-wide mb-2">رقم الهاتف</p>
              <p className="text-lg font-bold text-[#0b1c30]" dir="ltr">{msg.phone}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-[#94a3b8] tracking-wide mb-2">البريد الإلكتروني</p>
              <p className="text-lg font-bold text-[#0b1c30]">{msg.email}</p>
            </div>
          </div>

          <div className="border-t border-[#e2e8f0] pt-8">
            <p className="text-xs font-bold text-[#94a3b8] tracking-wide mb-4">الرسالة</p>
            <p className="text-base text-[#45464d] leading-relaxed whitespace-pre-wrap">
              {msg.message}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/admin/contact-messages"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#e2e8f0] text-[#45464d] font-bold hover:bg-[#f1f5f9] transition-all duration-200 text-sm"
          >
            <ChevronRight size={16} />
            العودة إلى قائمة الرسائل
          </Link>
        </div>
      </main>
    </div>
  );
}
