<script setup lang="ts">
import VueDatePicker, { type RangeConfig, type PublicMethods as VueDatePickerMethods } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import './../assets/main.scss'
import ArrowLeft from './icons/ArrowLeft.vue';
import { ref, onMounted, useTemplateRef, type PropType } from 'vue';
import { type UpdateMonthYearArgs, CountType } from './../types/index'
import { computed } from 'vue';

const props = defineProps({
  countType: {
    type: String as PropType<CountType>,
    required: true,
  },
  minDate: {
    type: Date,
    default: undefined,
  },
  maxDate: {
    type: Date,
    default: undefined,
  },
  minRange: {
    type: Number,
    default: undefined,
  },
  maxRange: {
    type: Number,
    default: undefined,
  },
});

const emit = defineEmits(['update:modelValue']);

const dayNames = [
  'Dom', 'Lun', 'Mar', 'Mier', 'Jue', 'Vier', 'Sab',
];
const config = {
  mobileBreakpoint: 750,
  noSwipe: true,
};

const date = ref();
const isMobile = ref(false);
const datePicker = useTemplateRef<VueDatePickerMethods>('datepicker');
const rangeStart = ref<Date | null>(null);

const firstInstanceDate = props.minDate ?? new Date();
const firstInstanceMonth = ref<number>(firstInstanceDate.getMonth());
const firstInstanceYear = ref<number>(firstInstanceDate.getFullYear());
const secondInstanceMonth = ref<number>(firstInstanceDate.getMonth() + 1);
const secondInstanceYear = ref<number>(firstInstanceDate.getFullYear());

onMounted(() => {
  isMobile.value = window.innerWidth < 750;

  window.addEventListener("resize", () => {
    isMobile.value = window.innerWidth < 750;
  });
})

const rangeConfig = computed<RangeConfig>(() => {
  if (props.minRange && props.maxRange) {
    return {
      minRange: props.minRange,
      maxRange: props.maxRange,
    }
  }

  if (props.minRange) {
    return {
      minRange: props.minRange,
    }
  }

  if (props.maxRange) {
    return {
      maxRange: props.maxRange,
    }
  }

  return {};
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

const handleRangeEnd = () => {
  rangeStart.value = null
}

/**
 * Set to the given calendarItem a range-count attribute based in the day or night count
 * between the rangeStart date and the date selected or hovered.
 * @param calendarItem
 * @param instanceMonth
 * @param instanceYear
 */
const handleClickOrMouseEnterOnRange = (calendarItem: Element, instanceMonth: number, instanceYear: number) => {
  setTimeout(() => {
    const day = calendarItem.textContent ? parseInt(calendarItem.textContent) : null;
    if (!day || !rangeStart.value) {
      return
    }

    const lastDate = new Date(instanceYear, instanceMonth, day);
    const dayDiff = diffInDays(rangeStart.value, lastDate);
    let rangeCount = props.countType === CountType.DAY
      ? dayDiff + 1
      : dayDiff;
    if (! rangeCount) {
      rangeCount = 1;
    }

    const message = props.countType === CountType.DAY
      ? (rangeCount).toString() + ' días'
      : (rangeCount).toString() + ' noches';

    calendarItem.setAttribute('range-count', message)
  }, 50)
}

const handleMonthYearUpdate = ({ instance, month, year }: UpdateMonthYearArgs) => {
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

const handleOpen = () => {
  if (date.value && date.value.length === 2) {
    firstInstanceMonth.value = date.value[1].getMonth()
    firstInstanceYear.value = date.value[1].getFullYear()

    secondInstanceMonth.value = date.value[1].getMonth() + 1
    secondInstanceYear.value = date.value[1].getFullYear()
  }

  addCalendarDateEvents()
}

const diffInDays = (initialDate: Date, finalDate: Date) => {
  const diffTime = Math.abs(finalDate.getTime() - initialDate.getTime());

  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

const addCalendarDateEvents = () => {
  if (isMobile.value) {
    return;
  }

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
    :range="rangeConfig"
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
    @open="handleOpen"
    @update-month-year="handleMonthYearUpdate"
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
