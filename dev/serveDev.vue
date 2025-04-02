<script setup lang="ts">
import {
  computed,
  ref,
  useTemplateRef,
} from 'vue';
import TravelDatepicker from '../src/components/TravelDatePicker.vue';
import { CountType, PublicMethods } from '../src/types';

const defaultMinDate = new Date();
defaultMinDate.setDate(defaultMinDate.getDate() + 2);
const defaultMaxDate = new Date();
defaultMaxDate.setMonth(defaultMaxDate.getMonth() + 12);

const datePicker = useTemplateRef<PublicMethods>('travel-datepicker');

const isRange = ref<boolean>(true);
const startD = ref('');
const endD = ref('');

const countType = ref<CountType>(CountType.DAY);
const enableMinDate = ref<boolean>(false);
const minDate = ref<Date | string>(defaultMinDate);
const enableMaxDate = ref<boolean>(false);
const maxDate = ref<Date | string>(defaultMaxDate);

const minRange = ref<number>();
const maxRange = ref<number>();

const formattedMinDate = computed(() => {
  if (!enableMinDate.value || !minDate.value) {
    return undefined;
  }

  if (typeof (minDate.value) !== 'string') {
    return defaultMinDate;
  }

  return getFormattedDateForComp(minDate.value);
});

const formattedMaxDate = computed(() => {
  if (!enableMaxDate.value || !maxDate.value) {
    return undefined;
  }

  if (typeof (maxDate.value) !== 'string') {
    return defaultMaxDate;
  }

  return getFormattedDateForComp(maxDate.value);
});

const getFormattedDateForComp = (dateText: string) => {
  const [year, month, day] = dateText.split('-');

  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
};

const onDateInputClick = () => {
  if (datePicker.value) {
    datePicker.value.open();
  }
};

const handleUpdateOnDatePicker = (dateValue: Date[] | Date | null) => {
  if (!dateValue) {
    startD.value = '';
    endD.value = '';

    return;
  }

  if (Array.isArray(dateValue)) {
    const [fechaI, fechaF] = dateValue;
    const fechaID = fechaI ? formatDateString(fechaI) : '';
    const fechaFD = fechaF ? formatDateString(fechaF) : '';

    startD.value = fechaID;
    endD.value = fechaFD;
    return;
  }

  startD.value = formatDateString(dateValue);
};
const formatDateString = (dateObj: Date) => {
  let day = dateObj.getDate().toString();
  if (day.length < 2) {
    day = `0${day}`;
  }

  let month = (dateObj.getMonth() + 1).toString();
  if (month.length < 2) {
    month = `0${month}`;
  }

  return `${day}-${month}-${dateObj.getFullYear()}`;
};
</script>

<template>
  <main>
    <div class="dev-example">
      <h1>
        Travel DatePicker
      </h1>
      <div>
        <input
          id=""
          v-model="startD"
          type="text"
          name=""
          @click="onDateInputClick"
        />
        <input
          v-if="isRange"
          id=""
          v-model="endD"
          type="text"
          name=""
          @click="onDateInputClick"
        />
        <TravelDatepicker
          v-if="isRange"
          ref="travel-datepicker"
          :is-range="isRange"
          :count-type="countType"
          :min-date="formattedMinDate"
          :max-date="formattedMaxDate"
          :min-range-selection="minRange"
          :max-range-selection="maxRange"
          @update:model-value="handleUpdateOnDatePicker"
        />
        <TravelDatepicker
          v-else
          ref="travel-datepicker"
          :count-type="countType"
          :min-date="formattedMinDate"
          :max-date="formattedMaxDate"
          :min-range-selection="minRange"
          :max-range-selection="maxRange"
          @update:model-value="handleUpdateOnDatePicker"
        />
      </div>

      <h2>
        Props
      </h2>
      <div class="props">
        <div class="form">
          <div class="prop-input">
            <label for="countType">
              countType
            </label>
            <select
              v-model="countType"
              name="countType"
            >
              <option :value="CountType.DAY">
                Days
              </option>
              <option :value="CountType.NIGHT">
                Nights
              </option>
            </select>
          </div>
          <div class="prop-input">
            <label for="isRange">
              Range calendar
            </label>
            <input
              v-model="isRange"
              name="isRange"
              type="checkbox"
            />
          </div>
          <div class="prop-input">
            <label for="enableMinDate">
              Enable minDate
            </label>
            <input
              v-model="enableMinDate"
              name="enableMinDate"
              type="checkbox"
            />
          </div>
          <div :class="{'prop-input': true, 'disable': !enableMinDate }">
            <label for="minDate">
              minDate
            </label>
            <input
              v-model="minDate"
              name="minDate"
              type="date"
              :disabled="!enableMinDate"
            />
          </div>
          <div class="prop-input">
            <label for="enableMaxDate">
              Enable maxDate
            </label>
            <input
              v-model="enableMaxDate"
              name="enableMaxDate"
              type="checkbox"
            />
          </div>
          <div :class="{'prop-input': true, 'disable': !enableMaxDate }">
            <label for="maxDate">
              maxDate
            </label>
            <input
              v-model="maxDate"
              name="maxDate"
              type="date"
              :disabled="!enableMaxDate"
            />
          </div>
          <div class="prop-input">
            <label for="minRange">
              minRangeSelection
            </label>
            <input
              v-model="minRange"
              name="minRange"
              type="number"
            />
          </div>
          <div class="prop-input">
            <label for="maxDate">
              maxRangeSelection
            </label>
            <input
              v-model="maxRange"
              name="maxRange"
              type="number"
            />
          </div>
        </div>
        <div class="data">
          <code>
            {<br />
            "countType" : "{{ countType }}",<br />
            "isRange" : "{{ isRange }}",<br />
            "minDate" : "{{ formattedMinDate }}",<br />
            "maxDate" : "{{ formattedMaxDate }}"<br />
            "minRangeSelection" : "{{ minRange }}"<br />
            "maxRangeSelection" : "{{ maxRange }}"<br />
            }
          </code>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.dev-example {
  font-family: 'sans-serif';
  display: flex;
  flex-direction: column;
  padding: 1rem;
  justify-content: center;
  align-items: center;

  h1 {
    margin-bottom: 1rem;
  }

  .props {
    display: flex;
    justify-content: center;
    align-items: center;

    .form {
      margin-right: 2rem;

      .prop-input {
        margin-bottom: 0.5rem;

        &.disable {
          opacity: 0.3;
        }

        label {
          margin-right: 1rem;
        }
      }
    }
    .data {
      background-color: #cecece4b;
      padding: 1.5rem;
    }
  }
}
</style>
