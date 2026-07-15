export default function RootLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-surface">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
        <p className="text-on-surface-variant text-sm font-body">جاري التحميل...</p>
      </div>
    </div>
  );
}
