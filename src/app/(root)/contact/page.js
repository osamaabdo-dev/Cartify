import { Mail, Phone, Clock, MapPin } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";

export const metadata = {
  title: "تواصل معنا",
};

export default function ContactPage() {
  return (
    <div className="bg-surface text-on-surface">
      <section className="relative bg-primary-container flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#283044]" />
        <div className="relative z-10 text-center px-6 py-20 md:py-28">
          <h1 className="text-on-primary text-4xl md:text-3xl font-headline font-bold mb-4">
            تواصل معنا
          </h1>
          <p className="text-on-primary-container text-lg  max-w-2xl mx-auto">
            نحن هنا لمساعدتك في اختيار أجمل الهدايا. تواصل معنا لأي استفسار.
          </p>
        </div>
      </section>

      <section className="max-w-container-max mx-auto px-gutter mt-10 relative z-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-surface-container-lowest p-8 md:p-12 rounded-xl shadow-xl border border-outline-variant">
            <ContactForm />
          </div>

          <div className="lg:col-span-5 space-y-8">
            <div className="bg-primary-container text-on-primary p-8 rounded-xl shadow-lg">
              <h2 className="font-headline-sm font-bold mb-8 flex items-center gap-3">
                <span className="w-8 h-1 bg-secondary inline-block" />
                معلومات التواصل
              </h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-on-primary-container/20 rounded-lg flex items-center justify-center shrink-0">
                    <Mail size={20} className="text-secondary-fixed" />
                  </div>
                  <div>
                    <p className="text-on-primary-container text-sm">البريد الإلكتروني</p>
                    <p className="text-body-lg font-medium text-on-primary">info@levangifts.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-on-primary-container/20 rounded-lg flex items-center justify-center shrink-0">
                    <Phone size={20} className="text-secondary-fixed" />
                  </div>
                  <div>
                    <p className="text-on-primary-container text-sm">رقم الهاتف</p>
                    <p className="text-body-lg font-medium text-on-primary" dir="ltr">+966 12 345 6789</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-on-primary-container/20 rounded-lg flex items-center justify-center shrink-0">
                    <Clock size={20} className="text-secondary-fixed" />
                  </div>
                  <div>
                    <p className="text-on-primary-container text-sm">ساعات العمل</p>
                    <p className="text-body-lg font-medium text-on-primary">السبت - الخميس: 10:00 ص - 10:00 م</p>
                    <p className="text-body-lg font-medium text-on-primary">الجمعة: 4:00 م - 11:00 م</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-on-primary-container/20 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-secondary-fixed" />
                  </div>
                  <div>
                    <p className="text-on-primary-container text-sm">الموقع</p>
                    <p className="text-body-lg font-medium text-on-primary">الرياض، المملكة العربية السعودية</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
