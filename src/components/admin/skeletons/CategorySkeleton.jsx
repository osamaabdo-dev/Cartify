export default function CategorySkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="luxury-card rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="h-8 bg-gray-200 rounded-xl w-20" />
              <div className="h-8 bg-gray-200 rounded-xl w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
