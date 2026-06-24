import { prisma } from "@/lib/prisma";

// Default content for the About page
const DEFAULT_ABOUT_CONTENT = {
  heroTitle: "قصة تشطيب",
  heroSubtitle: "نحن لا نبيع مواد التشطيب، بل نصنع لوحات فنية ترتقي بمساحتك لتصبح انعكاساً لشخصيتك.",
  heroImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80",
  philosophyTitle: "فلسفتنا",
  philosophyText1: "تأسست تشطيب برؤية واضحة: إحداث ثورة في عالم الديكور ومواد البناء في السوق المصري. نؤمن بأن كل زاوية في منزلك تستحق أن تُعامل كعمل فني، لذلك ننتقي بعناية فائقة أفضل العلامات التجارية العالمية والمحلية لنقدم لك جودة لا تُضاهى.",
  philosophyText2: "فلسفتنا تعتمد على دمج الأصالة مع الحداثة، لنوفر حلولاً متكاملة تضمن لك الأناقة والمتانة في آن واحد. نحن نرافقك في كل خطوة، من اختيار اللون المثالي وحتى آخر تفاصيل التشطيب.",
  philosophyImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80",
  visionTitle: "رؤيتنا",
  visionText: "أن نكون الوجهة الأولى والموثوقة لكل من يبحث عن التميز والرقي في تشطيب مساحته الخاصة، وأن نساهم في الارتقاء بالذوق العام للديكور الداخلي من خلال توفير منتجات مبتكرة ومستدامة.",
  missionTitle: "مهمتنا",
  missionText: "تسهيل رحلة التشطيب على عملائنا من خلال منصة إلكترونية سهلة الاستخدام، تقدم خيارات واسعة من أرقى الخامات، مع توفير استشارات فنية متخصصة تضمن تحقيق النتيجة المرجوة بأعلى معايير الجودة.",
  ctaTitle: "هل أنت مستعد للبدء في رحلتك؟",
  ctaText: "تصفح تشكيلتنا الواسعة من المنتجات ودعنا نساعدك في بناء مساحة أحلامك.",
  ctaButtonText: "تسوق المنتجات الآن"
};

export type AboutPageContent = typeof DEFAULT_ABOUT_CONTENT;

export class SettingsService {
  /**
   * Get setting by key, returns parsed JSON if exists, otherwise returns defaultValue
   */
  static async getSetting<T>(key: string, defaultValue: T): Promise<T> {
    const setting = await prisma.systemSetting.findUnique({
      where: { key }
    });

    if (!setting) {
      return defaultValue;
    }

    try {
      return JSON.parse(setting.value) as T;
    } catch (e) {
      console.error(`Failed to parse setting ${key}`, e);
      return defaultValue;
    }
  }

  /**
   * Save setting by key, stringifying the value to JSON
   */
  static async saveSetting<T>(key: string, value: T): Promise<void> {
    const stringValue = JSON.stringify(value);
    await prisma.systemSetting.upsert({
      where: { key },
      update: { value: stringValue },
      create: { key, value: stringValue }
    });
  }

  // --- Specialized Helpers ---

  static async getAboutPageContent(): Promise<AboutPageContent> {
    return this.getSetting<AboutPageContent>("page_about_us", DEFAULT_ABOUT_CONTENT);
  }

  static async saveAboutPageContent(content: AboutPageContent): Promise<void> {
    await this.saveSetting("page_about_us", content);
  }

  static async getHomePageHero(): Promise<HomePageHero> {
    return this.getSetting<HomePageHero>("page_home_hero", DEFAULT_HOME_HERO);
  }

  static async saveHomePageHero(content: HomePageHero): Promise<void> {
    await this.saveSetting("page_home_hero", content);
  }

  static async getGeneralSettings(): Promise<GeneralSettings> {
    return this.getSetting<GeneralSettings>("site_general_settings", DEFAULT_GENERAL_SETTINGS);
  }

  static async saveGeneralSettings(settings: GeneralSettings): Promise<void> {
    await this.saveSetting("site_general_settings", settings);
  }
  static async getContactPageContent(): Promise<ContactPageContent> {
    return this.getSetting<ContactPageContent>("page_contact_us", DEFAULT_CONTACT_CONTENT);
  }

  static async saveContactPageContent(content: ContactPageContent): Promise<void> {
    await this.saveSetting("page_contact_us", content);
  }
}

// Default content for the Contact page
const DEFAULT_CONTACT_CONTENT = {
  heroTitle: "اتصل بنا",
  heroSubtitle: "نحن هنا للإجابة على استفساراتك وتقديم الدعم الذي تحتاجه.",
  heroImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop",
  address: "القاهرة، مصر\nالتجمع الخامس، شارع التسعين",
  phoneNumbers: "+20 123 456 7890\n+20 109 876 5432",
  emails: "support@tashtep.com\ninfo@tashtep.com",
  workingHoursWeekday: "9:00 ص - 5:00 م",
  workingHoursSaturday: "10:00 ص - 2:00 م",
  workingHoursFriday: "مغلق",
  mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1d110502.61185038382!2d31.33924765792611!3d30.01305574548074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583c1380cba7ef%3A0xd541260e9e06978d!2sNew%20Cairo%20City%2C%20Cairo%20Governorate!5e0!3m2!1sen!2seg!4v1700000000000!5m2!1sen!2seg",
};

export type ContactPageContent = typeof DEFAULT_CONTACT_CONTENT;

// Default content for the Home page
const DEFAULT_HOME_HERO = {
  badge: "المجموعة الجديدة ٢٠٢٤",
  title: "ارتقِ بمساحتك مع لمسات الفخامة",
  subtitle: "اكتشف تشكيلة حصرية من الدهانات والتشطيبات المصممة بعناية لتحويل منزلك إلى تحفة فنية تعكس ذوقك الرفيع.",
  image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzvRO-EZktJrgopiF2X07tmCu11uIlrIHscDulhx0G8JfmC7d6doKxB5F6Wsv7Rz-7nO5aYSKhCqB3Af56Uc1tT7lwkSVCQuTkXQqo2-U29MXxUA-LT9924hORxQHuc_q9zW57O-maV8XeerQlEF-SckeReh1DUG1tMFokQaftrJqtXCYLgyzdmaWra9CkBhBawFfGdq8uBmrY7T6QUOylu3YO_qIXfj-bQeRMvpZeekT2gMp1_RdfE6nm37XtJ8ti5HwP5-W7t3c0",
  ctaText: "تسوق الآن",
  ctaLink: "/products",
  secondaryCtaText: "شاهد الإلهام",
};

export type HomePageHero = typeof DEFAULT_HOME_HERO;

// Default content for General Settings (Footer, Contacts, etc.)
const DEFAULT_GENERAL_SETTINGS = {
  storeName: "تشطيب",
  storeDescription: "الوجهة الأولى والموثوقة لكل من يبحث عن التميز والرقي في تشطيب المساحات، مع خيارات واسعة من أرقى الخامات.",
  phone: "+20 123 456 7890",
  email: "hello@tashtep.com",
  address: "القاهرة، مصر",
  facebookUrl: "https://facebook.com",
  instagramUrl: "https://instagram.com",
  twitterUrl: "https://twitter.com",
};

export type GeneralSettings = typeof DEFAULT_GENERAL_SETTINGS;

