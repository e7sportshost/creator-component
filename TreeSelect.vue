<script setup>
import { ref, watch } from "vue";
import { usePage } from '@inertiajs/vue3'
import { ElSelect, ElOption, ElTreeSelect } from 'element-plus';
import { debounce } from 'lodash'; // 通过 lodash 或者自己实现 debounce
import axios from 'axios';

const props = defineProps({
    modelValue: { type: [Number, Array, String] },
    routeNameData: { type: String, default: 'select' },
    multiple: { type: Boolean, default: false },
    route_name: { type: String },
    clearable: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    placeholder: { type: String, default: 'Select' },
    size: { type: String, default: '' },
    valueOnClear: { type: String, default: null },
    checkStrictly: { type: Boolean, default: true },
    maxCollapseTags: { type: Number, default: 3 },
    id: { type: Number, default: null },
    route_name: { type: String },
    route_parameter: { type: Object, default: () => ({  })},
    option_value: { type: String, default: 'id'},
    option_label: { type: String, default: 'name'},
})

const page = usePage();
const prefix = page.props.prefix || 'backend';

const dataValue = ref(props.modelValue);
if(props.multiple && dataValue.value == null){
    dataValue.value = [];
}

const emit = defineEmits(['update:modelValue', 'callback', 'change'])

watch(() => props.modelValue, (newValue) => {
    dataValue.value = newValue;
})

const ajaxData = ref([]);

const loadAjaxData = (query) => {
    axios.get(route(props.route_name, { id: props.id, search: query, tree: true, ...props.route_parameter }), ).then(({ data }) => {
        ajaxData.value = data;
    })
}

loadAjaxData(null);

const changeData = (value) => {
    emit('update:modelValue', value);
    let obj = value ? ajaxData.value.find(item => item[props.option_value] == value) : {};
    emit('change', value, obj);
}
</script>
<template>
  <ElTreeSelect
    v-model="dataValue"
    :data="ajaxData"
    :placeholder="placeholder"
    :props="{ value: option_value, label: option_label }"
    :check-strictly="checkStrictly"
    default-expand-all
    class="w-full"
    :clearable="clearable"
    :disabled="disabled"
    :value-on-clear="valueOnClear"
    :size="size"
    :multiple="multiple"
    :max-collapse-tags="maxCollapseTags"
    @change="value => changeData(value)"
  />
</template>
