import { createApp } from 'vue';
import Dev from './serveDev.vue';
import i18n from './../src/composables/i18n'

const app = createApp(Dev);
app.use(i18n)

app.mount('#app');
