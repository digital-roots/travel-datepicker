<script setup lang="ts">
import {
  ref,
  onMounted,
  useTemplateRef,
  nextTick,
  computed,
} from 'vue';
import { VueDatePicker } from '@vuepic/vue-datepicker';
import { es } from 'date-fns/locale';
import ArrowLeft from '@/components/icons/ArrowLeft.vue';
import { type UpdateMonthYearArgs, CountType } from '@/types';
import useI18n from '@/composables/i18n';
import '@vuepic/vue-datepicker/dist/main.css';
import '@/assets/main.scss';

const { t, tm } = useI18n();

const {
  countType,
  isRange = false,
  maxRangeSelection = undefined,
  minDate = undefined,
  maxDate = undefined,
  minRangeSelection = undefined,
} = defineProps<{
  countType: CountType;
  isRange?: boolean;
  minDate?: Date;
  maxDate?: Date;
  minRangeSelection?: number;
  maxRangeSelection?: number;
}>();

const emit = defineEmits<{
  (e: 'update:model-value', value: Date[] | null): void;
}>();

const initialDate = minDate ?? new Date();
const dayNames = tm('dayNameAbbreviations');
const config = {
  mobileBreakpoint: 750,
  noSwipe: true,
};

const datePicker = useTemplateRef<InstanceType<typeof VueDatePicker>>('datepicker');

const date = ref();
const isMobile = ref(false);
const rangeStart = ref<Date | null>(null);
const leftDesktopDayPickerMonth = ref<number>(initialDate.getMonth());
const leftDesktopDayPickerYear = ref<number>(initialDate.getFullYear());
const rightDesktopDayPickerMonth = ref<number>(initialDate.getMonth() + 1);
const rightDesktopDayPickerYear = ref<number>(initialDate.getFullYear());

const rangeConfig = computed(() => {
  if (!isRange) {
    return false;
  }

  if (minRangeSelection && maxRangeSelection) {
    return {
      minRange: minRangeSelection,
      maxRange: maxRangeSelection,
    };
  }

  if (minRangeSelection) {
    return { minRange: minRangeSelection };
  }

  if (maxRangeSelection) {
    return { maxRange: maxRangeSelection };
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

const handleUpdateOnDatePicker = (modelValue: Date[] | null) => {
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
const handleClickOnCalendarItem = async (calendarItem: Element, instanceMonth: number, instanceYear: number) => {
  const day = calendarItem.textContent ? parseInt(calendarItem.textContent) : null;
  if (!day) {
    return;
  }

  const selectedDate = new Date(instanceYear, instanceMonth, day);
  if (!rangeStart.value) {
    rangeStart.value = selectedDate;
  }

  setRangeCountAttributeToCalendarItem(calendarItem, selectedDate);
};
const handleMouseEnterOnCalendarItem = async (calendarItem: Element, instanceMonth: number, instanceYear: number) => {
  const day = calendarItem.textContent ? parseInt(calendarItem.textContent) : null;

  if (!day) {
    return;
  }

  const selectedDate = new Date(instanceYear, instanceMonth, day);

  setRangeCountAttributeToCalendarItem(calendarItem, selectedDate);
};
const handleMonthYearUpdate = ({ instance, month, year }: UpdateMonthYearArgs) => {
  if (instance === 0) {
    leftDesktopDayPickerMonth.value = month;
    leftDesktopDayPickerYear.value = year;

    rightDesktopDayPickerMonth.value = month + 1;
  } else {
    leftDesktopDayPickerMonth.value = month - 1;

    rightDesktopDayPickerMonth.value = month;
    rightDesktopDayPickerYear.value = year;
  }

  addCalendarDateEvents();
};
const handleOpen = () => {
  if (
    date.value
    && Array.isArray(date.value)
    && date.value.length === 2
  ) {
    leftDesktopDayPickerMonth.value = date.value[1].getMonth();
    leftDesktopDayPickerYear.value = date.value[1].getFullYear();

    rightDesktopDayPickerMonth.value = date.value[1].getMonth() + 1;
    rightDesktopDayPickerYear.value = date.value[1].getFullYear();
  }

  addCalendarDateEvents();

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
    return;
  }

  const dayDiff = getDiffInDays(rangeStart.value, selectedDate);
  let rangeCount = countType === CountType.DAY
    ? dayDiff + 1
    : dayDiff;
  if (!rangeCount) {
    rangeCount = 1;
  }

  const message = countType === CountType.DAY
    ? t('count.day', rangeCount)
    : t('count.night', rangeCount);

  calendarItem.setAttribute('range-count', message);
};
const getDiffInDays = (initialDate: Date, finalDate: Date) => {
  const diffTime = Math.abs(finalDate.getTime() - initialDate.getTime());

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

      calendarItem.addEventListener('click', () => {
        handleClickOnCalendarItem(calendarItem, calendarInstanceMonth, calendarInstanceYear);
      });
      calendarItem.addEventListener('mouseenter', () => {
        handleMouseEnterOnCalendarItem(calendarItem, calendarInstanceMonth, calendarInstanceYear);
      });
    }
  }
};
const open = () => {
  if (datePicker.value) {
    datePicker.value.openMenu();
  }
};

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
    :min-date="minDate"
    :max-date="maxDate"
    :start-date="minDate"
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
