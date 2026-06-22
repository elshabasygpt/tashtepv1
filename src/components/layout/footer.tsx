import * as React from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";

import { Container } from "./container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-obsidian text-gallery pt-16 pb-8">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Description */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl font-bold tracking-tight">
                Tashtep<span className="text-tashtep-orange">.</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              الوجهة الأولى في مصر لتشطيب بيتك. نوفر لك أرقى خامات الدهانات، مواد البناء، والديكورات بتجربة رقمية استثنائية.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <Link href="#" className="text-muted-foreground hover:text-tashtep-orange transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-tashtep-orange transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-tashtep-orange transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-semibold mb-2 text-white">روابط سريعة</h4>
            <Link href="/about" className="text-muted-foreground hover:text-white transition-colors text-sm">من نحن</Link>
            <Link href="/contact" className="text-muted-foreground hover:text-white transition-colors text-sm">اتصل بنا</Link>
            <Link href="/faq" className="text-muted-foreground hover:text-white transition-colors text-sm">الأسئلة الشائعة</Link>
            <Link href="/shipping" className="text-muted-foreground hover:text-white transition-colors text-sm">سياسة الشحن</Link>
            <Link href="/returns" className="text-muted-foreground hover:text-white transition-colors text-sm">سياسة الاسترجاع</Link>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-semibold mb-2 text-white">تواصل معنا</h4>
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <MapPin className="h-5 w-5 text-tashtep-orange shrink-0" />
              <span>القاهرة، التجمع الخامس، شارع التسعين الشمالي، مصر</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Phone className="h-5 w-5 text-tashtep-orange shrink-0" />
              <span dir="ltr">+20 100 123 4567</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Mail className="h-5 w-5 text-tashtep-orange shrink-0" />
              <span>support@tashtep.com</span>
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-semibold mb-2 text-white">النشرة البريدية</h4>
            <p className="text-muted-foreground text-sm">
              اشترك الآن لتصلك أحدث العروض ونصائح الديكور والتشطيبات.
            </p>
            <form className="flex flex-col gap-2 mt-2">
              <Input 
                type="email" 
                placeholder="البريد الإلكتروني" 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-tashtep-orange"
              />
              <Button variant="tashtep" className="w-full">
                اشترك الآن
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Tashtep. جميع الحقوق محفوظة.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">سياسة الخصوصية</Link>
            <Link href="/terms" className="hover:text-white transition-colors">الشروط والأحكام</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
