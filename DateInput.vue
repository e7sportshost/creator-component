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
  disabledDate: { type: Function, default: () => false }
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
      @change="emitUpdate"
      :range-separator="rangeSeparator"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
      :disabled-date="disabledDate"
    />
</template>
