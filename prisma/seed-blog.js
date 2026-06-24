const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const articles = [
    {
      title: "كيف تختار الدهان المناسب",
      slug: "how-to-choose-paint",
      description: "نصائح الخبراء لاختيار نوع الدهان والدرجة اللونية المثالية لكل غرفة في منزلك.",
      content: "مرحباً بك في هذا الدليل الشامل لاختيار الدهانات. \n\nعند اختيار دهان المنزل، يجب مراعاة الإضاءة والمساحة...",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhR2vh7ssvGdOCAU_0e6pw6KdMKhS-5rmangVKdtnB4aZxs8fGkCZAj5N9bBzdGgidqlBPbW8WC0J01N9FLfx7tg2E6coKVbcQuFFrFVf2BCAx7mSu6xkaHaFhE3D_evi11cMU5ZMZXVjmDMUXEpYLgImtEanHWNilD8AAf5xxp_WZCF7GKdC1VRvwdLFOBT1TUDOpGDrk6jHTow56xYKInRn9M_u4ba59J2DijRzyLaWZ_72vC8ViK87qoObsO4E48Ysp8E8sDDit",
      published: true
    },
    {
      title: "ألوان 2026",
      slug: "colors-2026",
      description: "اكتشف أحدث صيحات الألوان التي ستشكل ملامح التصميم الداخلي للعام القادم.",
      content: "ألوان عام 2026 تميل إلى الدفء والهدوء لتعكس ارتباطنا بالطبيعة. \n\nيعتبر اللون الأزرق المائل للرمادي من أبرز الاختيارات...",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCF2nZxfxdwiy3fN0moyPOyyg3DQNUPMPguRCQhSA1c1sPUqBBYAvuQPEBnboQb3eNrGKOYVosEVzeMY_Sa5Y-uFb_my3xUwMFWq-TeCbfD1Gtb3I6jWw01GdWNLm-RzCmIDWIiJjrOmuxHnxMDoYC8IZtlzp4Dc-ssD_7B-D3CTfMviQN8o3qM3VBBtYJCPxqxJejjUOXmoNLUOWkL5foUEs807SryL09EBqEJG3cux1hzPkAIK-6mXbUyt2UXKOYK022EsVt7E1Un",
      published: true
    },
    {
      title: "دليل التشطيبات الفاخرة",
      slug: "luxury-finishing-guide",
      description: "كل ما تحتاج معرفته عن المواد والخامات لإضفاء لمسة من الرقي والفخامة.",
      content: "التشطيبات الفاخرة لا تعني دائماً التكلفة الباهظة، بل حسن اختيار المواد. \n\nاستخدام الرخام الطبيعي مع الإضاءة المخفية يعطي انطباعاً بالفخامة...",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuALiWFZFdZvKv2TXjMBP5h-gTyA8pTAZtQxOx5h7xRARsf3xx85ll-pQetwu003LXRWArUuPfJVguzynIojLx6-otgp572dFAhY5uizokTpfFcxXzD-RwA9fd6Z0zxguqhj-rCD1-lNCpVFY6JTW4xG0OzSiA1wEdY1g3U-sdxoaSxvrgGABqf9VT_eTIEz-H5ieNey4DE5wPNICqvwJd0yiwznugzFrCl-IZ9wK1vFzNpB3yikPlDWM154Ph5oAfHsdw82lVU0b811",
      published: true
    }
  ];

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: article,
    });
  }
  console.log("Seeded articles successfully!");
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
