import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resources from "utils/translation.json";

const languages = {
  VI: "vi",
  EN: "en",
};

i18n.use(initReactI18next).init({
  resources,
  debug: false,
  initImmediate: false,
  useSuspense: false,
  lng: languages.VI,
});
