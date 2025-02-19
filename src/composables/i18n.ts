import { createI18n } from 'vue-i18n';
import es from './../i18n/es.json'

const i18n = createI18n({
  locale: 'es',
  fallbackLocale: 'es',
  messages: {
    es,
  }
})

export default i18n;
