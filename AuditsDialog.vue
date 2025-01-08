<script setup>
import { ref, watch  } from "vue";
import { Link, usePage, useForm } from '@inertiajs/vue3'
import { ElInput, ElButton, ElDialog, ElTableColumn, ElLoading } from 'element-plus';
import DataTable from '@/Components/DataTable.vue';
import Request from './Request';

const props = defineProps({
    action: {
        type: String,
        default: 'basic_data',
    },
    table: {
        type: String,
    },
    table_id: {
        type: [Number, String],
        default: null,
    },
    modelValue: { type: Boolean, default: false },
});

const page = usePage();
const langs = page.props.langs;
const prefix = page.props.prefix || 'backend';
const audits = page.props.audits || 'link';
const routeNameData = ref('audits');
const emit = defineEmits(['update:modelValue'])

const data = ref({});
const auditVisible = ref(false);
const loadingInstance = ref(null);
const search_data = ref([]);
const filters = useForm({
    obj: {
        search: null,
        sortBy: 'updated_at',
        sortOrder: null,
        page: 1,
        rows: 15,
        table: props.table,
        table_id: props.table_id,
    }
})

const search = () => {
    loadingInstance.value = ElLoading.service({
        target: '.el-dialog'
    });
    Request.get(route(`${ prefix }.${ routeNameData.value }.index`, filters.obj)).then(response => {
        data.value = response.data.data;
        search_data.value = response.data.search_data;
        loadingInstance.value?.close()

    });
}

const reset = () => {
    filters.obj.search = null;
    filters.obj.sortBy = 'updated_at';
    filters.obj.sortOrder = null;
    filters.obj.page = 1;
    filters.obj.rows = 15;
    filters.obj.table = props.table;
    filters.obj.table_id = props.table_id;
    search();
}

watch(() => props.modelValue, (newValue) => {
  auditVisible.value = newValue;
  if(auditVisible.value){
    search();
  }
})

watch(() => props.table_id, (newValue) => {
  console.log('table_id', newValue);
  filters.obj.table_id = newValue;
})

watch(auditVisible, (newValue) => {
  emit('update:modelValue', newValue);
})
</script>

<template>
  <ElDialog v-model="auditVisible" width="80%">
      <div class="mt-4">
        <DataTable :routeNameData="routeNameData" :customReset="true" @reset="reset" :createBtn="false" :option="false" :placeholder="search_data.map(item => langs[routeNameData][item]).join(' / ')" :data="data" @search="search" :filters="filters" :manualSearch="true" :max-height="600">
            <el-table-column  type="index" label="#"></el-table-column>
            <el-table-column :label="langs[routeNameData]?.table" sortable="custom" prop="table">
                <template #default="scope">
                    <span >{{ $page.props.langs.menu[scope.row.table] }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="langs[routeNameData]?.table_id" sortable="custom" prop="table_id" />
            <el-table-column :label="langs[routeNameData]?.user" prop="user.name" />
            <el-table-column :label="langs[routeNameData]?.event" sortable="custom" prop="event">
                <template #default="scope">
                    <span >{{ $page.props.langs[scope.row.event] }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="langs[routeNameData]?.auditing" min-width="200px" sortable="custom" prop="auditing">
                <template #default="{ row: { auditing } }">
                    <p v-for="(item, index) in auditing" :key="item">{{ item }}</p>
                </template>
            </el-table-column>
            <el-table-column :label="langs.updated_at" sortable="custom" prop="updated_at" />
        </DataTable>
    </div>
  </ElDialog>
</template>