<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import TravelDatepicker from '../src/components/TravelDatePicker.vue';
import { CountType, PublicMethods } from '../src/types';

const datePicker = useTemplateRef<PublicMethods>('travel-datepicker');

const startD = ref('');
const endD = ref('');

const minDate = new Date();
minDate.setDate(minDate.getDate() + 2);
const maxDate = new Date();
maxDate.setMonth(maxDate.getMonth() + 12);

const onDateInputClick = () => {
  if (datePicker.value) {
    datePicker.value.open();
  }
}

const handleUpdateOnDatePicker = (dateValue: Date[] | null) => {
  if (! dateValue || ! dateValue.length) {
      startD.value = '';
      endD.value = '';

      return;
    }

    const [fechaI, fechaF] = dateValue;
    const fechaID = fechaI ? formatDateString(fechaI) : '';
    const fechaFD = fechaF ? formatDateString(fechaF) : '';

    startD.value = fechaID;
    endD.value = fechaFD;
}

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
}
</script>

<template>
  <main>
    <div class="dev-example">
      <h1>Travel DatePicker</h1>
      <div>
        <input
          id=""
          v-model="startD"
          type="text"
          name=""
          @click="onDateInputClick"
        >
        <input
          id=""
          v-model="endD"
          type="text"
          name=""
          @click="onDateInputClick"
        >
        <travel-datepicker
          ref="travel-datepicker"
          :count-type="CountType.NIGHT"
          @update:model-value="handleUpdateOnDatePicker"
        />
      </div>
    </div>
  </main>
</template>

<style lang="css" scoped>
.dev-example {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  justify-content: center;
  align-items: center;
}

h1 {
  margin-bottom: 2rem;
}
</style>
