export default function ProductSkeleton() {
  const rows = Array.from({ length: 6 }, (_, i) => i);
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="luxury-card rounded-2xl p-5 lg:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-gray-200" />
              <div className="h-3 bg-gray-200 rounded w-24" />
            </div>
            <div className="h-8 bg-gray-200 rounded w-16" />
          </div>
        ))}
      </div>
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="h-11 bg-gray-200 rounded-xl flex-1 max-w-md" />
        <div className="h-11 bg-gray-200 rounded-xl w-[160px]" />
        <div className="h-11 bg-gray-200 rounded-xl w-[160px]" />
      </div>
      <div className="luxury-card rounded-2xl overflow-hidden">
        <div className="p-6 space-y-5">
          {rows.map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-1/5" />
              </div>
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-6 bg-gray-200 rounded-full w-24" />
              <div className="h-4 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
