import component from './components/TravelDatePicker.vue';
import type { App, Plugin } from 'vue';

type InstallableComponent = typeof component & { install: Exclude<Plugin['install'], undefined> };

export default /*#__PURE__*/ ((): InstallableComponent => {
    const installable = component as unknown as InstallableComponent;

    installable.install = (app: App) => {
        app.component('TravelDatePicker', installable);
    };
    return installable;
})();
