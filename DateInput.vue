<script setup>
import { ref, watch } from 'vue';
import { ElDatePicker } from 'element-plus';

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
})

const emit = defineEmits(['update:modelValue'])

const data = ref(props.modelValue);

const emitUpdate = (value) => {
  emit('update:modelValue', value);
};

watch([() => props.modelValue], () => {
  data.value = props.modelValue;
})

</script>

<template>
    <ElDatePicker
      v-model="data"
      :placeholder="placeholder"
      class="!w-full"
      :disabled="disabled"
      :type="type"
      :value-format="type == 'datetimerange' ? 'YYYY-MM-DD HH:mm:ss' : valueFormat"
      :default-time="defaultTime"
      @change="emitUpdate"
      :range-separator="rangeSeparator"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
      :disabled-date="disabledDate"
    />
</template>
