<script setup>
import { ref, watch } from 'vue';
import { router, usePage } from '@inertiajs/vue3'
import { ElDatePicker } from 'element-plus';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek)

const props = defineProps({
  modelValue: { type: [String, Array] },
  placeholder: { type: String },
  disabled: { type: Boolean, default: false },
  type: { type: String, default: 'date' },
  startPlaceholder: { type: String, default: '' },
  endPlaceholder: { type: String, default: '' },
  rangeSeparator: { type: String, default: 'To' },
  disabledDate: { type: Function, default: () => false },
  valueFormat: { type: String, default: 'YYYY-MM-DD' },
  defaultTime: { type: Array, default: [
    new Date(2000, 1, 1, 0, 0, 0),
    new Date(2000, 2, 1, 23, 59, 59),
  ] },

  shortcuts: { type: Array, default: [
    {
      text: 'today',
      value: () => {
        return [
          dayjs().startOf('day'),
          dayjs().endOf('day')
        ]
      },
    },
    {
      text: 'yesterday',
      value: () => {
        return [
          dayjs().subtract(1, 'day').startOf('day'),
          dayjs().subtract(1, 'day').endOf('day')
        ]
      },
    },
    {
      text: 'this_week',
      value: () => {
        return [
          dayjs().isoWeekday('1').startOf('day'),
          dayjs().isoWeekday('7').endOf('day')
        ]
      },
    },
    {
      text: 'last_week',
      value: () => {
        return [
          dayjs().subtract(1, 'week').isoWeekday('1').startOf('day'),
          dayjs().subtract(1, 'week').isoWeekday('7').endOf('day')
        ]
      },
    },
    {
      text: 'this_month',
      value: () => {
        return [
          dayjs().startOf('month'),
          dayjs().endOf('month')
        ]
      },
    },
    {
      text: 'last_month',
      value: () => {
        return [
          dayjs().subtract(1, 'month').startOf('month'),
          dayjs().subtract(1, 'month').endOf('month')
        ]
      },
    },
  ] },
})

const page = usePage();
const langs = page.props.langs;

const emit = defineEmits(['update:modelValue', 'visibleChange'])

const data = ref(props.modelValue);

const emitUpdate = (value) => {
  emit('update:modelValue', value);
};

watch([() => props.modelValue], () => {
  data.value = props.modelValue;
})

const visibleChange = (value) => {
  emit('visibleChange', value);
}

</script>

<template>
    <ElDatePicker
      v-model="data"
      :placeholder="placeholder"
      class="!w-full"
      :disabled="disabled"
      :type="type"
      :value-format="type == 'datetimerange' ? 'YYYY-MM-DD HH:mm:ss' : valueFormat"
      :default-time="type.indexOf('range') > -1 ? defaultTime : new Date(2000, 1, 1, 0, 0, 0)"
      @change="emitUpdate"
      :range-separator="rangeSeparator"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
      :disabled-date="disabledDate"
      :shortcuts="shortcuts.map(item => {
        item.text = langs[item.text] || item.text;
        return item;
      })"
      @visible-change="visibleChange"
    />
</template>
