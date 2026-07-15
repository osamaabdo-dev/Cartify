"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatusAction } from "@/actions/orderActions";
import { statusMap } from "@/lib/utils/dashboardUtils";

export default function OrderStatusForm({ orderId, currentStatus }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleChange = async (e) => {
    if (pending) return;
    setPending(true);
    const formData = new FormData();
    formData.set("orderId", orderId);
    formData.set("status", e.target.value);
    await updateOrderStatusAction(formData);
    router.refresh();
  };

  return (
    <select
      defaultValue={currentStatus}
      onChange={handleChange}
      disabled={pending}
      className={`w-full rounded-xl px-3 py-2 text-sm font-bold border transition-all duration-200 appearance-none cursor-pointer disabled:opacity-50 ${
        statusMap[currentStatus]
          ? `${statusMap[currentStatus].bg} ${statusMap[currentStatus].text} border-transparent`
          : "bg-gray-100 text-gray-600 border-transparent"
      }`}
    >
      {Object.entries(statusMap).map(([key, val]) => (
        <option key={key} value={key}>
          {val.label}
        </option>
      ))}
    </select>
  );
}
