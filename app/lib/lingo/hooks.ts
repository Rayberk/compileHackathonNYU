import { useLingoContext } from "./context";
import { useEffect, useState } from "react";

/**
 * Hook for translating text on-demand
 * @param text The text to translate
 * @param sourceLocale The source language (default: "en")
 * @returns The translated text
 *
 * @example
 * const translatedText = useTranslate("Hello World");
 */
export function useTranslate(text: string, sourceLocale: string = "en"): string {
  const { translateText, locale } = useLingoContext();
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    // If current locale is English, no need to translate
    if (locale === "en") {
      setTranslated(text);
      return;
    }

    // Translate the text
    translateText(text, sourceLocale).then(setTranslated);
  }, [text, sourceLocale, locale, translateText]);

  return translated;
}

/**
 * Hook for translating objects on-demand
 * @param obj The object to translate
 * @param sourceLocale The source language (default: "en")
 * @returns The translated object
 *
 * @example
 * const translatedData = useTranslateObject({ title: "Hello", description: "World" });
 */
export function useTranslateObject<T>(obj: T, sourceLocale: string = "en"): T {
  const { translateObject, locale } = useLingoContext();
  const [translated, setTranslated] = useState<T>(obj);

  useEffect(() => {
    // If current locale is English, no need to translate
    if (locale === "en") {
      setTranslated(obj);
      return;
    }

    // Translate the object
    translateObject(obj, sourceLocale).then(setTranslated);
  }, [obj, sourceLocale, locale, translateObject]);

  return translated;
}
