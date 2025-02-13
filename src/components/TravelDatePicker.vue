<script setup lang="ts">
import VueDatePicker, { type PublicMethods as VueDatePickerMethods } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import './../assets/main.scss'
import ArrowLeft from './icons/ArrowLeft.vue';
import { ref, onMounted, useTemplateRef } from 'vue';

const dayNames = [
  'Dom', 'Lun', 'Mar', 'Mier', 'Jue', 'Vier', 'Sab',
];
const config = {
  mobileBreakpoint: 750,
  noSwipe: true,
};

const minDate = new Date();
minDate.setDate(minDate.getDate() + 2);
const maxDate = new Date();
maxDate.setMonth(maxDate.getMonth() + 12);

const date = ref();
const isMobile = ref(false);
const datePicker = useTemplateRef<VueDatePickerMethods>('datepicker');

const emit = defineEmits(['update:modelValue']);

onMounted(() => {
  isMobile.value = window.innerWidth < 750;

  window.addEventListener("resize", () => {
    isMobile.value = window.innerWidth < 750;
  });
})

const handleUpdateOnDatePicker = (modelValue: Date[] | null) => {
  emit('update:modelValue', modelValue);
}

const handleClickOnBackBtn = () => {
  if (datePicker.value) {
    datePicker.value.closeMenu();
  }
}

const handleClickOnClearBtn = () => {
  if (datePicker.value) {
    datePicker.value.clearValue();
  }
}

const open = () => {
  if (datePicker.value) {
    datePicker.value.openMenu();
  }
}

defineExpose({
  open,
})
</script>

<template>
  <VueDatePicker
    ref="datepicker"
    v-model="date"
    class="travel-datepicker"
    month-name-format="long"
    locale="es"
    hide-offset-dates
    prevent-min-max-navigation
    week-start="0"
    cancel-text="Cancelar"
    select-text="Listo"
    range
    :auto-apply="!isMobile"
    :enable-time-picker="false"
    :multi-calendars="isMobile ? 12 : 2"
    :day-names="dayNames"
    :min-date="minDate"
    :max-date="maxDate"
    :start-date="minDate"
    :focus-start-date="isMobile"
    :month-change-on-scroll="false"
    :config="config"
    @update:model-value="handleUpdateOnDatePicker"
  >
    <template #menu-header>
      <div class="datepicker-header">
        <button
          class="datepicker-btn back-btn"
          @click="handleClickOnBackBtn"
        >
          <ArrowLeft />
        </button>
        <button
          class="datepicker-btn clear-btn"
          @click="handleClickOnClearBtn"
        >
          Limpiar
        </button>
      </div>
    </template>
  </VueDatePicker>
</template>
