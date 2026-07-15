"use client";
import { useEffect } from "react";

export default function RootError({ error, reset }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-surface">
      <div className="text-center max-w-md mx-auto p-8">
        <h2 className="text-2xl font-headline font-bold text-primary mb-4">حدث خطأ غير متوقع</h2>
        <p className="text-on-surface-variant text-sm font-body mb-6">يرجى المحاولة مرة أخرى.</p>
        <button onClick={reset} className="bg-primary text-white px-6 py-3 rounded-md font-bold cursor-pointer hover:bg-inverse-surface transition-colors">
          إعادة المحاولة
        </button>
      </div>
    </div>
  );
}
