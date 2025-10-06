import { useI18nStore } from "../store/i18n/i18nStore";
import fr from "../lang/fr.json";
import en from "../lang/en.json";

type TranslationType = Record<string, string>;

export const useTranslation = () => {
  const { language } = useI18nStore();
  const translations: Record<"fr" | "en", TranslationType> = { fr, en };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return { t, language };
};
