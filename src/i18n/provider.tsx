"use client";

import { NextIntlClientProvider } from "next-intl";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Locale } from "./config";
import { defaultLocale, localeDir } from "./config";

const COOKIE_KEY = "tashtep_locale";

type I18nContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
};

const I18nContext = createContext<I18nContextType>({
  locale: defaultLocale,
  setLocale: () => {},
});

export function useLocale() {
  return useContext(I18nContext);
}

type Props = {
  children: React.ReactNode;
  messages: Record<string, unknown>;
  initialLocale: Locale;
};

export function I18nProvider({ children, messages, initialLocale }: Props) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    document.cookie = `${COOKIE_KEY}=${l};path=/;max-age=31536000`;
    document.documentElement.lang = l;
    document.documentElement.dir = localeDir[l];
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = localeDir[locale];
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </I18nContext.Provider>
  );
}
