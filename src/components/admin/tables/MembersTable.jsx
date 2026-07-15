"use client";

import { Users, Shield, Search, Eye, Trash2, ChevronRight, ChevronLeft, AlertCircle, User } from "lucide-react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { deleteMemberAction } from "@/actions/memberActions";
import { roleStyles } from "@/lib/utils/dashboardUtils";

function DeleteButton({ userId, orderCount, role }) {
  const router = useRouter();
  const [showBlocked, setShowBlocked] = useState(false);
  const [showAdminBlocked, setShowAdminBlocked] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async (e) => {
    e.preventDefault();
    setPending(true);
    setError("");

    const formData = new FormData();
    formData.set("userId", userId);

    const result = await deleteMemberAction(formData);

    if (result.success) {
      router.refresh();
    } else if (result.isAdmin) {
      setPending(false);
      setShowAdminBlocked(true);
      setShowConfirm(false);
    } else if (result.orderCount > 0) {
      setPending(false);
      setShowConfirm(false);
    } else {
      setError(result.message || "فشل الحذف");
      setPending(false);
      setShowConfirm(false);
    }
  };

  const handleClick = () => {
    if (role === "ADMIN") {
      setShowAdminBlocked(true);
    } else if (orderCount > 0) {
      setShowBlocked(true);
    } else {
      setShowConfirm(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-[#dc2626] hover:bg-[#fef2f2] hover:border-[#fecaca] transition-all duration-200 text-sm font-semibold cursor-pointer"
        title={role === "ADMIN" ? "لا يمكن حذف مدير" : orderCount > 0 ? "لا يمكن الحذف" : "حذف"}
      >
        <Trash2 size={14} />
        حذف
      </button>

      {showAdminBlocked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="w-14 h-14 rounded-2xl bg-[#fef2f2] flex items-center justify-center mx-auto mb-5">
              <Shield size={28} className="text-[#dc2626]" />
            </div>
            <h3 className="text-xl font-bold text-[#0b1c30] text-center mb-2">
              لا يمكن الحذف
            </h3>
            <p className="text-[#45464d] text-sm text-center mb-6">
              لا يمكن حذف حساب مدير. المديرين هم المسؤولون عن إدارة المتجر.
            </p>
            <button
              onClick={() => setShowAdminBlocked(false)}
              className="w-full px-6 py-3 rounded-xl bg-[#775a19] text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
            >
              حسناً
            </button>
          </div>
        </div>
      )}

      {showBlocked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="w-14 h-14 rounded-2xl bg-[#fef2f2] flex items-center justify-center mx-auto mb-5">
              <Trash2 size={28} className="text-[#dc2626]" />
            </div>
            <h3 className="text-xl font-bold text-[#0b1c30] text-center mb-2">
              لا يمكن الحذف
            </h3>
            <p className="text-[#45464d] text-sm text-center mb-2">
              هذا العضو لديه{" "}
              <span className="font-bold text-[#0b1c30]">{orderCount}</span>{" "}
              طلب.
            </p>
            <p className="text-[#94a3b8] text-sm text-center mb-6">
              لا يمكن حذف عضو لديه طلبات سابقة.
            </p>
            <button
              onClick={() => setShowBlocked(false)}
              className="w-full px-6 py-3 rounded-xl bg-[#775a19] text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
            >
              حسناً
            </button>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="w-14 h-14 rounded-2xl bg-[#fef2f2] flex items-center justify-center mx-auto mb-5">
              <Trash2 size={28} className="text-[#dc2626]" />
            </div>
            <h3 className="text-xl font-bold text-[#0b1c30] text-center mb-2">
              حذف العضو
            </h3>
            <p className="text-[#45464d] text-sm text-center mb-6">
              هل أنت متأكد من حذف هذا العضو؟
            </p>
            {error && (
              <div className="p-3 mb-4 rounded-xl bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c] font-medium text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setShowConfirm(false); setError(""); }}
                disabled={pending}
                className="flex-1 px-6 py-3 rounded-xl border border-[#e2e8f0] text-[#45464d] font-bold hover:bg-[#f1f5f9] transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                onClick={handleDelete}
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
    </>
  );
}

export default function MembersTable({ members }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q)
    );
  }, [members, searchQuery]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const adminCount = members.filter((m) => m.role === "ADMIN").length;

  const startEntry = filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, filtered.length);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <div className="luxury-card rounded-2xl p-5 lg:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-[#fef2f2] flex items-center justify-center">
              <Users size={24} className="text-[#dc2626]" />
            </div>
            <span className="text-xs text-[#45464d] font-medium tracking-wide">إجمالي الأعضاء</span>
          </div>
          <p className="text-[28px] font-bold text-[#0b1c30] tracking-tight">
            {members.length.toLocaleString("en-US")}
          </p>
        </div>
        <div className="luxury-card rounded-2xl p-5 lg:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-[#fefce8] flex items-center justify-center">
              <Shield size={24} className="text-[#a16207]" />
            </div>
            <span className="text-xs text-[#45464d] font-medium tracking-wide">المديرين</span>
          </div>
          <p className="text-[28px] font-bold text-[#0b1c30] tracking-tight">
            {adminCount.toLocaleString("en-US")}
          </p>
        </div>
        <div className="luxury-card rounded-2xl p-5 lg:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-[#f0f9ff] flex items-center justify-center">
              <User size={24} className="text-[#0284c7]" />
            </div>
            <span className="text-xs text-[#45464d] font-medium tracking-wide">المستخدمين</span>
          </div>
          <p className="text-[28px] font-bold text-[#0b1c30] tracking-tight">
            {(members.length - adminCount).toLocaleString("en-US")}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <div className="relative w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="بحث عن اسم أو بريد إلكتروني..."
            className="input-luxury pl-11"
          />
        </div>
      </div>

      <div className="luxury-card rounded-2xl overflow-hidden">
        {paginated.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#f1f5f9] flex items-center justify-center">
              <Users size={36} className="text-[#94a3b8]" />
            </div>
            <p className="text-[#0b1c30] text-xl font-bold mb-2">
              {searchQuery ? "لا يوجد أعضاء مطابقين" : "لا يوجد أعضاء بعد"}
            </p>
            <p className="text-[#45464d] text-sm">
              {searchQuery ? "حاول تعديل معايير البحث." : "عندما يقوم المستخدمون بالتسجيل سيظهرون هنا."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-right min-w-[800px]">
              <thead>
                <tr className="border-b border-[#e2e8f0]">
                  <th className="py-4 pr-6 text-xs font-bold text-[#45464d] tracking-wide">العضو</th>
                  <th className="py-4 text-xs font-bold text-[#45464d] tracking-wide">البريد الإلكتروني</th>
                  <th className="py-4 text-xs font-bold text-[#45464d] tracking-wide">الدور</th>
                  <th className="py-4 text-xs font-bold text-[#45464d] tracking-wide">الطلبات</th>
                  <th className="py-4 text-xs font-bold text-[#45464d] tracking-wide">تاريخ التسجيل</th>
                  <th className="py-4 pl-6 text-xs font-bold text-[#45464d] tracking-wide">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]/60">
                {paginated.map((member) => (
                  <tr key={member.id} className="hover:bg-[#f8fafc]/60 transition-colors group">
                    <td className="py-4 pr-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#fefce8] border border-[#fde68a]/50 flex items-center justify-center text-sm font-bold text-[#a16207] shrink-0">
                          {member.name.charAt(0)}
                        </div>
                        <span className="font-bold text-[#0b1c30] text-sm">{member.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-[#45464d]">{member.email}</td>
                    <td className="py-4">
                      <span className={`inline-block text-[10px] px-2.5 py-1 rounded-full font-bold ${roleStyles[member.role] || "bg-gray-100 text-gray-600"}`}>
                        {member.role === "ADMIN" ? "مدير" : "مستخدم"}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-[#45464d]">{member._count?.orders ?? 0}</td>
                    <td className="py-4 text-sm text-[#94a3b8]">{member.createdAt}</td>
                    <td className="py-4 pl-6">
                      <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity justify-start">
                        <Link
                          href={`/admin/users/${member.id}`}
                          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-[#475569] hover:bg-[#f1f5f9] hover:border-[#cbd5e1] transition-all duration-200 text-sm font-semibold"
                        >
                          <Eye size={14} />
                          عرض
                        </Link>
                        <DeleteButton
                          userId={member.id}
                          orderCount={member._count?.orders ?? 0}
                          role={member.role}
                        />
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
                عضو
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
      </div>
    </>
  );
}
