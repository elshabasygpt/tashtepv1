import { Button } from "@/components/ui/button";
import { SettingsService } from "@/services/settings.service";

export const metadata = {
  title: "اتصل بنا",
  description: "تواصل مع فريق تشطيب لأي استفسارات أو دعم فني.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const content = await SettingsService.getContactPageContent();

  return (
    <main className="pt-24 pb-16 bg-gallery-white min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden bg-obsidian">
        <div 
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: `url('${content.heroImage}')` }}
        >
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-headline-md text-gallery-white mb-4 animate-in slide-in-from-bottom-5 fade-in duration-700">
            {content.heroTitle}
          </h1>
          <p className="text-xl text-gallery-white/90 font-light font-body-lg animate-in slide-in-from-bottom-5 fade-in duration-700 delay-150 fill-mode-backwards whitespace-pre-wrap">
            {content.heroSubtitle}
          </p>
        </div>
      </section>

      <section className="py-24 px-gutter max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-soft-border">
            <h2 className="text-2xl font-headline-md text-obsidian mb-6">أرسل لنا رسالة</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-label-md text-obsidian mb-2">الاسم بالكامل</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full rounded-xl border border-soft-border bg-stone py-3 px-4 focus:ring-0 focus:border-tashtep-orange focus:bg-white transition-colors outline-none"
                  placeholder="محمد أحمد"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-label-md text-obsidian mb-2">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full rounded-xl border border-soft-border bg-stone py-3 px-4 focus:ring-0 focus:border-tashtep-orange focus:bg-white transition-colors outline-none"
                  placeholder="mohamed@example.com"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-label-md text-obsidian mb-2">الموضوع</label>
                <input 
                  type="text" 
                  id="subject" 
                  className="w-full rounded-xl border border-soft-border bg-stone py-3 px-4 focus:ring-0 focus:border-tashtep-orange focus:bg-white transition-colors outline-none"
                  placeholder="استفسار عن المنتجات"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-label-md text-obsidian mb-2">الرسالة</label>
                <textarea 
                  id="message" 
                  rows={5}
                  className="w-full rounded-xl border border-soft-border bg-stone py-3 px-4 focus:ring-0 focus:border-tashtep-orange focus:bg-white transition-colors outline-none resize-none"
                  placeholder="اكتب رسالتك هنا..."
                ></textarea>
              </div>
              <Button type="button" className="w-full bg-tashtep-orange text-white hover:bg-obsidian transition-colors h-12 rounded-xl text-lg">
                إرسال الرسالة
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-headline-md text-obsidian mb-8">معلومات التواصل</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-stone flex items-center justify-center text-tashtep-orange flex-shrink-0">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-headline-md text-obsidian mb-1">العنوان</h3>
                    <p className="text-secondary-foreground leading-relaxed whitespace-pre-wrap">
                      {content.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-stone flex items-center justify-center text-tashtep-orange flex-shrink-0">
                    <span className="material-symbols-outlined">phone</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-headline-md text-obsidian mb-1">رقم الهاتف</h3>
                    <p className="text-secondary-foreground leading-relaxed whitespace-pre-wrap" dir="ltr">
                      {content.phoneNumbers}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-stone flex items-center justify-center text-tashtep-orange flex-shrink-0">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-headline-md text-obsidian mb-1">البريد الإلكتروني</h3>
                    <p className="text-secondary-foreground leading-relaxed whitespace-pre-wrap">
                      {content.emails}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-stone p-8 rounded-3xl">
              <h3 className="text-xl font-headline-md text-obsidian mb-4">ساعات العمل</h3>
              <ul className="space-y-3 text-secondary-foreground">
                <li className="flex justify-between border-b border-soft-border pb-3">
                  <span>الأحد - الخميس</span>
                  <span className="text-obsidian font-medium">{content.workingHoursWeekday}</span>
                </li>
                <li className="flex justify-between border-b border-soft-border pb-3">
                  <span>السبت</span>
                  <span className="text-obsidian font-medium">{content.workingHoursSaturday}</span>
                </li>
                <li className="flex justify-between">
                  <span>الجمعة</span>
                  <span className="text-tashtep-orange font-medium">{content.workingHoursFriday}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="w-full h-[500px] mt-16 bg-stone">
        <iframe
          src={content.mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Tashtep Location Map"
        ></iframe>
      </section>
    </main>
  );
}
