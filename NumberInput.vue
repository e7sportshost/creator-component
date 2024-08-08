<script setup>
import { ref, watch } from 'vue';
import { ElInput } from 'element-plus';
import { useCurrencyInput } from 'vue-currency-input'

const props = defineProps({
  modelValue: { type: [String, Number] },
  placeholder: { type: String },
  disabled: { type: Boolean, default: false },
  precision: { type: Number, default: 0 },
  separator: { type: Boolean, default: true },
  min: { type: Number, default: undefined  },
  max: { type: Number, default: undefined  },
  addClass: { type: String, default: ''  },
})

const data = ref(props.modelValue);

const options = {
  currency: "TWD",
  currencyDisplay: "hidden",
  autoDecimalDigits: false,
  useGrouping: props.separator,
  accountingSign: false,
  precision: props.precision,
  valueRange: { min: props.min, max: props.max },
}

const { inputRef, setValue, setOptions } = useCurrencyInput(options, false)

const emit = defineEmits(['update:modelValue'])

const emitUpdate = (value) => {
  emit('update:modelValue', value);
};

watch([() => props.modelValue], () => {
  setValue(props.modelValue);
})

// watch([() => options], () => {
//   setOptions(options);
// })
</script>

<style scoped>
  .text-red >>> .el-input__inner {
    color: red;
  }
</style>
<template>
  <ElInput
    v-model="data"
    :placeholder="placeholder"
    :class="`w-full ${ addClass }`"
    :disabled="disabled"
    @input="emitUpdate"
    ref="inputRef"
  >
    <template #prefix>
      <slot name="prefix"></slot>
    </template>
    <template #suffix>
      <slot name="suffix"></slot>
    </template>
  </ElInput>
</template>
