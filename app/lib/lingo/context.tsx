"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface LingoContextType {
  locale: string;
  setLocale: (locale: string) => void;
  translateText: (text: string, sourceLocale?: string) => Promise<string>;
  translateObject: <T>(obj: T, sourceLocale?: string) => Promise<T>;
  isTranslating: boolean;
}

const LingoContext = createContext<LingoContextType | undefined>(undefined);

type TranslateTextRequest = {
  kind: "text";
  text: string;
  sourceLocale?: string;
  targetLocale: string;
};

type TranslateObjectRequest = {
  kind: "object";
  obj: unknown;
  sourceLocale?: string;
  targetLocale: string;
};

async function callLingoTranslate<TResponse>(payload: TranslateTextRequest | TranslateObjectRequest) {
  const response = await fetch("/api/lingo/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Translation request failed (${response.status})`);
  }

  return (await response.json()) as TResponse;
}

export function LingoProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState("en");
  const [isTranslating, setIsTranslating] = useState(false);

  const setLocale = useCallback((newLocale: string) => {
    setLocaleState(newLocale);
  }, []);

  const translateText = useCallback(
    async (text: string, sourceLocale: string = "en"): Promise<string> => {
      if (locale === "en") {
        return text;
      }

      try {
        setIsTranslating(true);
        const { result } = await callLingoTranslate<{ result: string }>({
          kind: "text",
          text,
          sourceLocale,
          targetLocale: locale,
        });
        return result ?? text;
      } catch (error) {
        console.error("Translation error:", error);
        return text;
      } finally {
        setIsTranslating(false);
      }
    },
    [locale]
  );

  const translateObject = useCallback(
    async <T,>(obj: T, sourceLocale: string = "en"): Promise<T> => {
      if (locale === "en") {
        return obj;
      }

      try {
        setIsTranslating(true);
        const { result } = await callLingoTranslate<{ result: T }>({
          kind: "object",
          obj,
          sourceLocale,
          targetLocale: locale,
        });
        return (result ?? obj) as T;
      } catch (error) {
        console.error("Translation error:", error);
        return obj;
      } finally {
        setIsTranslating(false);
      }
    },
    [locale]
  );

  return (
    <LingoContext.Provider
      value={{ locale, setLocale, translateText, translateObject, isTranslating }}
    >
      {children}
    </LingoContext.Provider>
  );
}

export function useLingoContext() {
  const context = useContext(LingoContext);
  if (!context) {
    throw new Error("useLingoContext must be used within a LingoProvider");
  }
  return context;
}
