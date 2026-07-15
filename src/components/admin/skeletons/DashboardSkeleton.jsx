export default function DashboardSkeleton() {
  return (
    <div className="p-6 lg:p-8 space-y-8 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded-lg w-48" />
          <div className="h-4 bg-gray-200 rounded w-36" />
        </div>
        <div className="h-10 bg-gray-200 rounded-xl w-32" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="luxury-card rounded-2xl p-5 lg:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-gray-200" />
              <div className="h-3 bg-gray-200 rounded w-24" />
            </div>
            <div className="h-8 bg-gray-200 rounded w-32" />
            <div className="mt-3 h-3 bg-gray-200 rounded w-28" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="luxury-card rounded-2xl p-5 lg:col-span-1">
          <div className="h-4 bg-gray-200 rounded w-24 mb-5" />
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="mb-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <div className="h-3 bg-gray-200 rounded w-20" />
                <div className="h-3 bg-gray-200 rounded w-6" />
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full w-full" />
            </div>
          ))}
        </div>
        <div className="luxury-card rounded-2xl p-5 lg:p-6 lg:col-span-3">
          <div className="flex items-center justify-between mb-5">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-3 bg-gray-200 rounded w-16" />
          </div>
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-[#e2e8f0]/60 last:border-0">
              <div className="h-3 bg-gray-200 rounded w-24" />
              <div className="h-3 bg-gray-200 rounded w-28" />
              <div className="h-3 bg-gray-200 rounded w-16" />
              <div className="h-5 bg-gray-200 rounded-full w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
