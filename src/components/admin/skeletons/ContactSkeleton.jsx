export default function ContactSkeleton() {
    return (
        <div className="luxury-card rounded-2xl p-16 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin w-8 h-8 border-4 border-[#775a19] border-t-transparent rounded-full" />
                <p className="text-[#45464d] text-sm">جاري تحميل الرسائل...</p>
            </div>
        </div>
    )
}