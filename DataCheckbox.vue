<script setup>
import { ref, watch } from "vue";
import { usePage } from '@inertiajs/vue3'
import { ElCheckbox, ElCheckboxGroup } from 'element-plus';
import { useDataCacheStore } from './SelectCache'; // 引入store
import { debounce } from 'lodash'; // 通过 lodash 或者自己实现 debounce

const props = defineProps({
    modelValue: { type: [Number, Array, String] },
    checkAllShow: { type: Boolean, default: true },
    customData: { type: Array },
    disabled: { type: Boolean, default: false },
    option_value: { type: String, default: 'id'},
    option_label: { type: String, default: 'name'},
})


const page = usePage();
const prefix = page.props.prefix || 'backend';

const cacheStore = useDataCacheStore();

const checkAll = ref(false)
const isIndeterminate = ref(false)
const dataValue = ref(props.modelValue);

const emit = defineEmits(['update:modelValue', 'change'])

const ajaxData = ref(props.customData);

watch(() => props.modelValue, (newValue) => {
    dataValue.value = newValue;
    handleCheckedChange(newValue, false);
})

watch(() => props.customData, (newValue) => {
    ajaxData.value = newValue;
})

const handleCheckAllChange = (val) => {
  dataValue.value = val ? ajaxData.value.map(item => item[props.option_value]) : []
  isIndeterminate.value = false
  changeData(dataValue.value);
}

const handleCheckedChange = (value, changeFlag = true) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === ajaxData.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < ajaxData.value.length
  if(changeFlag){
    changeData(dataValue.value);
  }
}
handleCheckedChange(dataValue.value, false);

const changeData = (value) => {
    emit('update:modelValue', value);
    let obj = value ? ajaxData.value.find(item => item[props.option_value] == value) : {};
    emit('change', value, obj);
}

const labelFormat = (item) => {
    let tmp = item[props.option_label];

    if(props.option_label == 'name (no)'){
        tmp = `${ item['name'] } (${ item['no'] })`;
    }
    return tmp;
}

</script>
<template>
  <ElCheckbox
    v-if="checkAllShow"
    v-model="checkAll"
    :indeterminate="isIndeterminate"
    @change="handleCheckAllChange"
    :disabled="disabled"
  >
    {{ $page.props.langs.check_all }}
  </ElCheckbox>
  <ElCheckboxGroup
    v-model="dataValue"
    @change="handleCheckedChange"
    :disabled="disabled"
  >
    <ElCheckbox
      v-for="item in ajaxData"
      :key="item[option_value]"
      :label="labelFormat(item)"
      :value="item[option_value]"
    >
      {{ labelFormat(item) }}
    </ElCheckbox>
  </ElCheckboxGroup>
</template>
