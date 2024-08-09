<script setup>
import { ref, watch } from "vue";
import { usePage } from '@inertiajs/vue3'
import { ElSelect, ElOption } from 'element-plus';
import axios from 'axios';

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
    remote: { type: Boolean, default: false },
    placeholder: { type: String, default: 'Select' },
    size: { type: String, default: '' },
    valueOnClear: { type: String, default: null },
})

const page = usePage();
const prefix = page.props.prefix || 'backend';

const dataValue = ref(props.modelValue);

const emit = defineEmits(['update:modelValue', 'callback', 'change'])

const ajaxData = ref([]);

const loadAjaxData = (query) => {
    if(props.customData){
        ajaxData.value = props.customData;
    }else{
        if(route().has(props.route_name)){
            axios.get(route(props.route_name, { search: query, ...props.route_parameter }), ).then(({ data }) => {
                ajaxData.value = data;
                emit('callback', ajaxData.value);
            })
        }
    }
}

loadAjaxData(null);

const changeData = (value) => {
    emit('update:modelValue', value);
    let obj = value ? ajaxData.value.find(item => item[props.option_value] == value) : {};
    emit('change', value, obj);
}

const labelFormat = (item) => {
    console.log(item, props);
    let tmp = item[props.option_label];
    console.log(tmp);

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
  >
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
