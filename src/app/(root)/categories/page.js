import Link from "next/link";
import Image from "next/image";
import { getAllCategoriesAction } from "@/actions/categoryActions";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await getAllCategoriesAction();

  const PLACEHOLDER = "/placeholder.png";

  return (
    <div className="bg-surface text-on-surface">
      <section className="relative bg-primary-container flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#283044]" />
        <div className="relative z-10 text-center px-6 py-20 md:py-28">
          <h1 className="text-on-primary text-4xl md:text-3xl font-headline font-bold mb-4">
            الأقسام
          </h1>
          <p className="text-on-primary-container text-lg max-w-2xl mx-auto">
            تصفح مجموعتنا المتنوعة من المنتجات حسب القسم الذي يناسبك.
          </p>
        </div>
      </section>
      <main className="max-w-container-max mx-auto px-gutter py-section-gap min-h-screen">
        {!categories?.length ? (
          <p className="text-center text-on-surface-variant py-24">لا توجد أقسام بعد</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={cat.slug ? `/categories/${cat.slug}` : "/products"}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] max-w-[280px]"
              >
                <div className="aspect-square overflow-hidden relative">
                  <Image alt={cat.name} src={cat.image || PLACEHOLDER} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1c30]/70 via-[#0b1c30]/20 to-transparent" />
                  <div className="absolute bottom-0 right-0 left-0 p-4 text-right">
                    <h3 className="font-headline-sm text-headline-sm text-white">{cat.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
