<script setup lang="ts">
import VueDatePicker, { type PublicMethods as VueDatePickerMethods } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import './../assets/main.scss'
import ArrowLeft from './icons/ArrowLeft.vue';
import { ref, onMounted, useTemplateRef, computed } from 'vue';

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
const rangeStart = ref<Date | null>(null);

const firstInstanceMonth = ref<number>(minDate.getMonth());
const firstInstanceYear = ref<number>(minDate.getFullYear());
const secondInstanceMonth = ref<number>(minDate.getMonth() + 1);
const secondInstanceYear = ref<number>(minDate.getFullYear());

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
    datePicker.value.updateInternalModelValue(null);
  }
}

const handleRangeStart = (startDate: Date) => {
  rangeStart.value = startDate
}

const handleRangeEnd = (endDate: Date) => {
  rangeStart.value = null
}

const diffInDays = (date1: Date, date2: Date) => {
  const diffTime = Math.abs(date2 - date1);

  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

const handleClickOrMouseEnterOnRange = (calendarItem: Element, instanceMonth: number, instanceYear: number) => {
  const day = calendarItem.textContent ? parseInt(calendarItem.textContent) : null;
  if (!day || !rangeStart.value) {
    return
  }

  const lastDate = new Date(instanceYear, instanceMonth, day);
  const dayDiff = diffInDays(rangeStart.value, lastDate);
  console.log(rangeStart.value, lastDate)
  calendarItem.setAttribute('range-count', (dayDiff + 1).toString() + ' días')
}

const addCalendarDateEvents = () => {
  setTimeout(() => {
    const calendarInstances = document.querySelectorAll('.dp__menu_inner .dp__instance_calendar')
    for (let calendarIdx = 0; calendarIdx < calendarInstances.length; calendarIdx++) {
      const calendarInstance = calendarInstances[calendarIdx];
      const calendarInstanceMonth = calendarIdx ? secondInstanceMonth.value : firstInstanceMonth.value;
      const calendarInstanceYear = calendarIdx ? secondInstanceYear.value : firstInstanceYear.value;

      const calendarItems = calendarInstance.getElementsByClassName('dp__cell_inner')
      for (let index = 0; index < calendarItems.length; index++) {
        const calendarItem = calendarItems[index];
        calendarItem.addEventListener('click', () => {
          handleClickOrMouseEnterOnRange(calendarItem, calendarInstanceMonth, calendarInstanceYear);
        })
        calendarItem.addEventListener('mouseenter', () => {
          handleClickOrMouseEnterOnRange(calendarItem, calendarInstanceMonth, calendarInstanceYear);
        })
      }
    }
  }, 100)
}

const handleMonthYear = ({ instance, month, year }) => {
  if (instance === 0) {
    firstInstanceMonth.value = month
    firstInstanceYear.value = year

    secondInstanceMonth.value = month + 1
  } else {
    firstInstanceMonth.value = month - 1

    secondInstanceMonth.value = month
    secondInstanceYear.value = year
  }

  addCalendarDateEvents();
}

const handleOpenEvent = () => {
  if (date.value && date.value.length === 2) {
    firstInstanceMonth.value = date.value[1].getMonth()
    firstInstanceYear.value = date.value[1].getFullYear()

    secondInstanceMonth.value = date.value[1].getMonth() + 1
    secondInstanceYear.value = date.value[1].getFullYear()
  }

  addCalendarDateEvents()
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
    @range-start="handleRangeStart"
    @range-end="handleRangeEnd"
    @open="handleOpenEvent"
    @update-month-year="handleMonthYear"
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
