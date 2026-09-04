<script setup lang="ts">
import {
  ref,
  onMounted,
  useTemplateRef,
  nextTick,
  computed,
  watch,
} from 'vue';
import { VueDatePicker } from '@vuepic/vue-datepicker';
import { es } from 'date-fns/locale';
import ArrowLeft from '@/components/icons/ArrowLeft.vue';
import { type UpdateMonthYearArgs, CountType } from '@/types';
import useI18n from '@/composables/i18n';
import '@vuepic/vue-datepicker/dist/main.css';
import '@/assets/main.scss';

const { t, tm } = useI18n();

const props = withDefaults(defineProps<{
  countType: CountType;
  isRange?: boolean;
  minDate?: Date;
  maxDate?: Date;
  minRangeSelection?: number;
  maxRangeSelection?: number;
}>(), {
  isRange: false,
  minDate: undefined,
  maxDate: undefined,
  minRangeSelection: undefined,
  maxRangeSelection: undefined,
});

const emit = defineEmits<{
  (e: 'update:model-value', value: Date | Date[] | null): void;
}>();

const initialDate = props.minDate ?? new Date();
const dayNames = tm('dayNameAbbreviations');
const config = {
  mobileBreakpoint: 750,
  noSwipe: true,
};
const datePicker = useTemplateRef<InstanceType<typeof VueDatePicker>>('datepicker');

const date = ref<Date | Date[] | null>(null);
const isMobile = ref(false);
const rangeStart = ref<Date | null>(null);
const leftDesktopDayPickerMonth = ref<number>(initialDate.getMonth());
const leftDesktopDayPickerYear = ref<number>(initialDate.getFullYear());
const rightDesktopDayPickerMonth = ref<number>(initialDate.getMonth() + 1);
const rightDesktopDayPickerYear = ref<number>(initialDate.getFullYear());

const isRangeEnabled = computed(() => props.isRange === true);
const rangeConfig = computed(() => {
  if (!isRangeEnabled.value) {
    return false;
  }

  if (props.minRangeSelection && props.maxRangeSelection) {
    return {
      minRange: props.minRangeSelection,
      maxRange: props.maxRangeSelection,
    };
  }

  if (props.minRangeSelection) {
    return { minRange: props.minRangeSelection };
  }

  if (props.maxRangeSelection) {
    return { maxRange: props.maxRangeSelection };
  }

  return true;
});
const multiCalendars = computed<number | boolean>(() => {
  return isMobile.value ? 12 : 2;
});

onMounted(() => {
  isMobile.value = window.innerWidth < 750;

  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 750;
  });
});

const handleUpdateOnDatePicker = (modelValue: Date | Date[] | null) => {
  date.value = modelValue;

  if (isRangeEnabled.value && modelValue instanceof Date) {
    rangeStart.value = modelValue;
  } else if (Array.isArray(modelValue) && modelValue[0] instanceof Date && !modelValue[1]) {
    rangeStart.value = modelValue[0];
  }

  if (!modelValue || (Array.isArray(modelValue) && modelValue[1] instanceof Date)) {
    rangeStart.value = null;
  }

  emit('update:model-value', modelValue);
};
const handleClickOnBackBtn = () => {
  if (datePicker.value) {
    datePicker.value.closeMenu();
  }
};
const handleClickOnClearBtn = () => {
  date.value = null;
  if (datePicker.value) {
    datePicker.value.closeMenu();
  }
};
const getCalendarItemDate = (calendarItem: Element) => {
  const dateTestId = calendarItem.closest('[data-test-id^="dp-"]')?.getAttribute('data-test-id');
  const dateParts = dateTestId?.match(/^dp-(\d{4})-(\d{2})-(\d{2})$/);
  if (dateParts) {
    const [, year, month, day] = dateParts;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const day = calendarItem.textContent ? parseInt(calendarItem.textContent) : null;
  if (!day) {
    return null;
  }

  const instanceMonth = calendarItem.getAttribute('data-calendar-month');
  const instanceYear = calendarItem.getAttribute('data-calendar-year');
  if (instanceMonth === null || instanceYear === null) {
    return null;
  }

  return new Date(Number(instanceYear), Number(instanceMonth), day);
};
const handleClickOnCalendarItem = async (calendarItem: Element) => {
  const selectedDate = getCalendarItemDate(calendarItem);
  if (!selectedDate) {
    return;
  }

  if (!rangeStart.value) {
    rangeStart.value = selectedDate;
  }

  setRangeCountAttributeToCalendarItem(calendarItem, selectedDate);
};
const handleMouseEnterOnCalendarItem = async (calendarItem: Element) => {
  const selectedDate = getCalendarItemDate(calendarItem);
  if (!selectedDate) {
    return;
  }

  setRangeCountAttributeToCalendarItem(calendarItem, selectedDate);
};
const handleMonthYearUpdate = ({ instance, month, year }: UpdateMonthYearArgs) => {
  if (instance === 0) {
    leftDesktopDayPickerMonth.value = month;
    leftDesktopDayPickerYear.value = year;

    const rightCalendarDate = new Date(year, month + 1);
    rightDesktopDayPickerMonth.value = rightCalendarDate.getMonth();
    rightDesktopDayPickerYear.value = rightCalendarDate.getFullYear();
  } else {
    const leftCalendarDate = new Date(year, month - 1);
    leftDesktopDayPickerMonth.value = leftCalendarDate.getMonth();
    leftDesktopDayPickerYear.value = leftCalendarDate.getFullYear();

    rightDesktopDayPickerMonth.value = month;
    rightDesktopDayPickerYear.value = year;
  }

  addCalendarDateEvents();
};
const handleOpen = async () => {
  if (isRangeEnabled.value) {
    if (date.value instanceof Date) {
      rangeStart.value = date.value;
    } else if (
      Array.isArray(date.value)
      && date.value[0] instanceof Date
      && !date.value[1]
    ) {
      rangeStart.value = date.value[0];
    }
  }

  if (
    date.value
    && Array.isArray(date.value)
    && date.value[1] instanceof Date
  ) {
    leftDesktopDayPickerMonth.value = date.value[1].getMonth();
    leftDesktopDayPickerYear.value = date.value[1].getFullYear();

    rightDesktopDayPickerMonth.value = date.value[1].getMonth() + 1;
    rightDesktopDayPickerYear.value = date.value[1].getFullYear();
  }

  initializeCalendarDateEvents();
  setTimeout(() => {
    initializeCalendarDateEvents();
  }, 150);

  if (isMobile.value) {
    disableMonthYearSelectors();
  }
};
const handleClose = () => {
  rangeStart.value = null;
};

const disableMonthYearSelectors = async () => {
  await nextTick();

  const monthYearSelectors = document.querySelectorAll('.dp__month_year_select');
  monthYearSelectors.forEach((selector) => {
    selector.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
    }, { capture: true });
  });
};

const setRangeCountAttributeToCalendarItem = async (calendarItem: Element, selectedDate: Date) => {
  if (!rangeStart.value) {
    calendarItem.removeAttribute('range-count');
    return;
  }

  const dayDiff = getDiffInDays(rangeStart.value, selectedDate);
  let rangeCount = props.countType === CountType.DAY
    ? dayDiff + 1
    : dayDiff;
  if (!rangeCount) {
    rangeCount = 1;
  }

  const message = props.countType === CountType.DAY
    ? t('count.day', rangeCount)
    : t('count.night', rangeCount);

  calendarItem.setAttribute('range-count', message);
};
const getDiffInDays = (initialDate: Date, finalDate: Date) => {
  const initial = new Date(initialDate);
  const final = new Date(finalDate);

  initial.setHours(0, 0, 0, 0);
  final.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(final.getTime() - initial.getTime());

  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};
const addCalendarDateEvents = async () => {
  if (isMobile.value) {
    return;
  }

  await nextTick();

  const calendarInstances = document.querySelectorAll('.dp__menu_inner .dp__instance_calendar');
  for (let calendarIdx = 0; calendarIdx < calendarInstances.length; calendarIdx++) {
    const calendarInstance = calendarInstances[calendarIdx];
    if (!calendarInstance) {
      continue;
    }

    const calendarInstanceMonth = calendarIdx ? rightDesktopDayPickerMonth.value : leftDesktopDayPickerMonth.value;
    const calendarInstanceYear = calendarIdx ? rightDesktopDayPickerYear.value : leftDesktopDayPickerYear.value;

    await nextTick();

    const calendarItems = calendarInstance.getElementsByClassName('dp__cell_inner');
    for (let index = 0; index < calendarItems.length; index++) {
      await nextTick();
      const calendarItem = calendarItems[index];
      if (!calendarItem) {
        continue;
      }

      calendarItem.setAttribute('data-calendar-month', calendarInstanceMonth.toString());
      calendarItem.setAttribute('data-calendar-year', calendarInstanceYear.toString());

      if (calendarItem.getAttribute('data-range-count-events') === 'true') {
        continue;
      }
      calendarItem.setAttribute('data-range-count-events', 'true');
      calendarItem.addEventListener('click', () => {
        handleClickOnCalendarItem(calendarItem);
      });
      calendarItem.addEventListener('mouseenter', () => {
        handleMouseEnterOnCalendarItem(calendarItem);
      });
    }
  }
};
const initializeCalendarDateEvents = async (attempt = 0) => {
  await addCalendarDateEvents();

  const calendarItems = document.querySelectorAll('.dp__menu_inner .dp__cell_inner');
  const hasUnregisteredCalendarItems = document.querySelectorAll(
    '.dp__menu_inner .dp__cell_inner:not([data-range-count-events="true"])',
  ).length > 0;

  if (
    (!calendarItems.length || hasUnregisteredCalendarItems)
    && attempt < 10
  ) {
    requestAnimationFrame(() => {
      initializeCalendarDateEvents(attempt + 1);
    });
  }
};
const refreshRangeCountAttributes = async () => {
  if (isMobile.value) {
    return;
  }

  await addCalendarDateEvents();
  await nextTick();

  const calendarItems = document.querySelectorAll(
    '.dp__cell_inner[range-count], .dp__date_hover_end, .dp__date_hover_start',
  );
  calendarItems.forEach((calendarItem) => {
    const selectedDate = getCalendarItemDate(calendarItem);
    if (!selectedDate) {
      return;
    }

    setRangeCountAttributeToCalendarItem(calendarItem, selectedDate);
  });
};
const open = () => {
  if (datePicker.value) {
    datePicker.value.openMenu();
  }
};

watch(() => props.countType, () => {
  refreshRangeCountAttributes();
});

defineExpose({ open });
</script>

<template>
  <VueDatePicker
    ref="datepicker"
    v-model="date"
    class="travel-datepicker"
    :formats="{ month: 'MMMM', input: 'dd/MM/yyyy', preview: 'dd/MM/yyyy' }"
    :locale="es"
    :teleport="false"
    hide-offset-dates
    prevent-min-max-navigation
    week-start="0"
    :range="rangeConfig"
    :auto-apply="!isMobile"
    :action-row="{ selectBtnLabel: t('buttons.ready'), cancelBtnLabel: t('buttons.cancel') }"
    :time-config="{ enableTimePicker: false }"
    :multi-calendars="multiCalendars"
    :day-names="dayNames"
    :min-date="props.minDate"
    :max-date="props.maxDate"
    :start-date="props.minDate"
    :focus-start-date="isMobile"
    :month-change-on-scroll="false"
    :config="config"
    @update:model-value="handleUpdateOnDatePicker"
    @open="handleOpen"
    @closed="handleClose"
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
          {{ t('buttons.clean') }}
        </button>
      </div>
    </template>
  </VueDatePicker>
</template>
