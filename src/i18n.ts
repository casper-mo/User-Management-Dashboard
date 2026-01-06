import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

// import ar from "/messages/ar.json?url";
// import en from "/messages/en.json?url";

const i18nPromise = i18n
  .use(detector)
  .use(backend)
  .use(initReactI18next)
  .init({
    // resources,
    fallbackLng: ["en"],
    supportedLngs: [ "en"],
    backend: {
      loadPath: "/messages/{{lng}}.json",
    },
    interpolation: {
      escapeValue: false,
    },
    debug: process.env.NODE_ENV !== "production",
  });

export default i18n;
export { i18nPromise };

