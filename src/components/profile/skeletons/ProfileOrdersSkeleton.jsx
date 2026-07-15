export default function ProfileOrdersSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-gray-200 rounded-lg w-40" />
      <div className="h-4 bg-gray-200 rounded w-64" />
      <div className="h-10 bg-gray-200 rounded-xl w-full max-w-xs" />
      <div className="luxury-card rounded-2xl overflow-hidden">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-[#e2e8f0]/60 last:border-0">
            <div className="h-3 bg-gray-200 rounded w-32" />
            <div className="h-3 bg-gray-200 rounded w-16" />
            <div className="h-3 bg-gray-200 rounded w-12" />
            <div className="h-5 bg-gray-200 rounded-full w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
