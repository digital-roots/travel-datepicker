import { createI18n } from 'vue-i18n';
import es from './../i18n/es.json'

const i18n = createI18n({
  legacy: false,
  locale: 'es',
  fallbackLocale: 'es',
  messages: {
    es,
  }
})

export default function useI18n() {
  return { t: i18n.global.t, tm: i18n.global.tm };
};
