"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MessageSquareText, Eye, Trash2, AlertCircle, ChevronRight, ChevronLeft, Search } from "lucide-react";
import { deleteContactMessageAction } from "@/actions/contactActions";

export default function ContactMessagesTable({ messages }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pending, setPending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return messages;
    return messages.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.phone.includes(q) ||
        m.email.toLowerCase().includes(q)
    );
  }, [messages, searchQuery]);

  const deleteMessage = async () =>{
    setPending(true);
    await deleteContactMessageAction(deleteTarget);
    setPending(false);
    setShowConfirm(false);
    setDeleteTarget(null);
    router.refresh();
  }

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const startEntry = filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, filtered.length);

  return (
    <div className="luxury-card rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-[#e2e8f0]">
        <div className="relative w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="بحث بالاسم أو رقم الهاتف أو البريد..."
            className="input-luxury pl-11"
          />
        </div>
      </div>

      {paginated.length === 0 ? (
        <div className="py-24 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#f1f5f9] flex items-center justify-center">
            <MessageSquareText size={36} className="text-[#94a3b8]" />
          </div>
          <p className="text-[#0b1c30] text-xl font-bold mb-2">
            {messages.length === 0 ? "لا توجد رسائل بعد" : "لا توجد رسائل مطابقة"}
          </p>
          <p className="text-[#45464d] text-sm">
            {messages.length === 0 ? "عندما يرسل الزوار رسائل من صفحة التواصل، ستظهر هنا." : "حاول تعديل معايير البحث."}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-right min-w-[800px]">
            <thead>
              <tr className="border-b border-[#e2e8f0]">
                <th className="py-4 pr-6 text-xs font-bold text-[#45464d] tracking-wide">الاسم</th>
                <th className="py-4 text-xs font-bold text-[#45464d] tracking-wide">رقم الهاتف</th>
                <th className="py-4 text-xs font-bold text-[#45464d] tracking-wide">البريد الإلكتروني</th>
                <th className="py-4 text-xs font-bold text-[#45464d] tracking-wide">التاريخ</th>
                <th className="py-4 pl-6 text-xs font-bold text-[#45464d] tracking-wide">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]/60">
              {paginated.map((msg) => (
                <tr key={msg.id} className="hover:bg-[#f8fafc]/60 transition-colors group">
                  <td className="py-5 pr-6">
                    <p className="font-bold text-[#0b1c30] text-sm">{msg.name}</p>
                  </td>
                  <td className="py-5">
                    <span className="text-sm text-[#45464d]" dir="ltr">{msg.phone}</span>
                  </td>
                  <td className="py-5">
                    <span className="text-sm text-[#45464d]">{msg.email}</span>
                  </td>
                  <td className="py-5">
                    <span className="text-sm text-[#94a3b8]">
                      {new Date(msg.createdAt).toLocaleDateString("ar-EG", {
                        year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                  </td>
                  <td className="py-5 pl-6">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/contact-messages/${msg.id}`}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#f0f9ff] border border-[#bae6fd] text-[#0369a1] hover:bg-[#e0f2fe] hover:border-[#7dd3fc] transition-all duration-200 text-sm font-semibold w-fit"
                      >
                        <Eye size={14} />
                        عرض
                      </Link>
                      <button onClick={() => { setDeleteTarget(msg.id); setShowConfirm(true); }}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] hover:bg-[#fee2e2] hover:border-[#fca5a5] transition-all duration-200 text-sm font-semibold w-fit cursor-pointer">
                        <Trash2 size={14} />
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          <div className="px-6 py-4 border-t border-[#e2e8f0] bg-[#f8fafc]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-[#45464d]">
              عرض <span className="font-bold text-[#0b1c30]">{startEntry}</span>{" "}
              إلى <span className="font-bold text-[#0b1c30]">{endEntry}</span>{" "}
              من <span className="font-bold text-[#0b1c30]">{filtered.length}</span>{" "}
              رسالة
            </span>
            {totalPages > 1 && (
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#e2e8f0] text-[#45464d] hover:bg-[#f1f5f9] hover:border-[#cbd5e1] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                      page === currentPage
                        ? "bg-[#775a19] text-white shadow-md shadow-[#775a19]/20"
                        : "border border-[#e2e8f0] text-[#45464d] hover:bg-[#f1f5f9] hover:border-[#cbd5e1]"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#e2e8f0] text-[#45464d] hover:bg-[#f1f5f9] hover:border-[#cbd5e1] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft size={14} />
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="w-14 h-14 rounded-2xl bg-[#fef2f2] flex items-center justify-center mx-auto mb-5">
              <Trash2 size={28} className="text-[#dc2626]" />
            </div>
            <h3 className="text-xl font-bold text-[#0b1c30] text-center mb-2">
              حذف الرسالة
            </h3>
            <p className="text-[#45464d] text-sm text-center mb-6">
              هل أنت متأكد من حذف هذه الرسالة؟
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowConfirm(false); setDeleteTarget(null); }}
                disabled={pending}
                className="flex-1 px-6 py-3 rounded-xl border border-[#e2e8f0] text-[#45464d] font-bold hover:bg-[#f1f5f9] transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                onClick={async () => deleteMessage()}
                disabled={pending}
                className="flex-1 px-6 py-3 rounded-xl bg-[#dc2626] text-white font-bold shadow-lg hover:bg-[#b91c1c] transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {pending ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : "تأكيد الحذف"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
