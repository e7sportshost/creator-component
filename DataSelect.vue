<script setup>
import { ref, watch } from "vue";
import { usePage } from '@inertiajs/vue3'
import { ElSelect, ElOption } from 'element-plus';
import { useDataCacheStore } from './SelectCache'; // 引入store
import { debounce } from 'lodash'; // 通过 lodash 或者自己实现 debounce

const props = defineProps({
    modelValue: { type: [Number, Array, String] },
    routeNameData: { type: String, default: 'select' },
    multiple: { type: Boolean, default: false },
    route_name: { type: String },
    option_value: { type: String, default: 'id'},
    option_label: { type: String, default: 'name'},
    customData: { type: Array },
    route_parameter: { type: Object, default: () => ({  })},
    disabled: { type: Boolean, default: false },
    remote: { type: Boolean, default: true },
    placeholder: { type: String, default: 'Select' },
    size: { type: String, default: '' },
    valueOnClear: { type: String, default: null },
    maxCollapseTags: { type: Number, default: 1 },
})

const page = usePage();
const prefix = page.props.prefix || 'backend';

const cacheStore = useDataCacheStore();

const dataValue = ref(props.modelValue);
if(props.multiple && dataValue.value == null){
    dataValue.value = [];
}

const emit = defineEmits(['update:modelValue', 'callback', 'change'])

const ajaxData = ref([]);

const loadAjaxData = async (query, cache = false) => {
    if(props.customData){
        ajaxData.value = props.customData;
    }else{
        if(route().has(props.route_name)){
            ajaxData.value = await cacheStore.getData(query, props, cache);
        }
    }
    emit('callback', ajaxData.value);
}

loadAjaxData(null, true);

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

watch(() => props.modelValue, (newValue) => {
    dataValue.value = newValue;
})

watch(() => props.customData, (newValue) => {
    ajaxData.value = newValue;
})

</script>
<template>
  <ElSelect
      :disabled="disabled"
      filterable
      v-model="dataValue"
      class="w-full"
      @change="value => changeData(value)"
      clearable
      :multiple="multiple"
      :remote="remote"
      :remote-method="loadAjaxData"
      :placeholder="placeholder"
      :size="size"
      :value-on-clear="valueOnClear"
      collapse-tags
      collapse-tags-tooltip
      :max-collapse-tags="maxCollapseTags"
  >
    <template #prefix>
        <slot name="prefix"></slot>
    </template>

    <slot name="option" v-bind="props" :data="ajaxData" >
      <ElOption
          v-for="item in ajaxData"
          :key="item[option_value]"
          :label="labelFormat(item)"
          :value="item[option_value]"
      />
    </slot>
  </ElSelect>
</template>
