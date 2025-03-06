<script setup>
import { ref, reactive } from 'vue'
import { usePage, Link } from '@inertiajs/vue3'
import { ArrowUpCircleIcon, ArrowDownCircleIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { ElInput, ElTable, ElTableColumn, ElPagination, ElDatePicker, ElCheckbox, ElSwitch } from 'element-plus';
import { PlusIcon, ClipboardDocumentListIcon } from '@heroicons/vue/24/solid'
import { Document } from '@element-plus/icons-vue'
import DateInput from './DateInput.vue';
import NumberInput from './NumberInput.vue';
import DataSelect from './DataSelect.vue';
import AuditsDialog from '@/Components/AuditsDialog.vue';

const props = defineProps({
  data_key: { type: String },
  columns: { type: Array },
  data: { type: Array, default: [] },
  addShow: { type: Boolean, default: true },
  moveShow: { type: Boolean, default: true },
  trashShow: { type: Boolean, default: true },
  optionShow: { type: Boolean, default: true },
  auditsShow: { type: Boolean, default: true },
  max_height: { type: Number, default: 500 },
  disabled: { type: Boolean, default: false },
  pageSize: { type: Number, default: 5 },
  pageSizes: { type: Array, default: [5, 10, 15, 30] },
  rowClassName: { type: Function, default: () => {} },
  audits: { type: String, default: true },
})

const state = reactive({
  page: 1,
  rows: props.pageSize,
  total: props.data.length
})

const multiTable = ref(null);

const page = usePage();
const prefix = page.props.prefix || 'backend';
const audits = page.props.audits || 'link';

//emit
const emit = defineEmits(['add'])

const getNestedValue = (obj, key) => {
  return key.split('.').reduce((o, i) => {
    return (o ? o[i] : null)
  }, obj);
}

const tableData = () => {
  let data = props.data.filter((item, index) => {
    return index >= (state.page - 1) * state.rows && index < state.page * state.rows
  })

  return data
}

const add = () => {
  state.page = 1;
  multiTable.value.scrollTo(0);
  emit('add');
}

const getIndex = (index) => {
  return ((state.page - 1) * state.rows) + index; //當頁總數 - (每頁數量 - 當前索引)
}

const remove = (index) => {
  index = getIndex(index);
  if (props.data) {
      props.data.splice(index, 1);
  }
}

const moveUp = (index) => {
  index = getIndex(index);
  if (props.data && index > 0) {
    let rows = [props.data[index], props.data[index - 1]];
    props.data?.splice(index - 1, 2, rows[0], rows[1]);
  }
}

const moveDown = (index) => {
  index = getIndex(index);
  if (props.data && index < (props.data.length - 1)) {
    let rows = [props.data[index], props.data[index+1]];
    props.data?.splice(index, 2, rows[1], rows[0]);
  }
}

const getForSort = (stra, strb, type) => {
  if(typeof stra === 'undefined' || typeof strb === 'undefined'){
    return 0;
  }

  if(type === 'number' || (typeof stra === typeof strb && typeof strb === 'number')){
    return parseFloat(stra) - parseFloat(strb);
  }else{
    return stra.localeCompare(strb);
  }
}


const onSort = (value) => {
  value.type = props.columns.find(column => column.key === value.prop)?.type;

  if(value.order === 'descending'){
    props.data.sort((a,b) => getForSort(a[value.prop], b[value.prop], value.type))
  }else{
    props.data.sort((a,b) => getForSort(b[value.prop], a[value.prop], value.type))
  }
}

const getRowKey = (row) => {
    return row.id;
}

const handleSelectionChange = (val) => {
    ids.value = val;
    emit('selectionChange', val);
}

const auditVisible = ref(false)
const table_id = ref(null)
const showDialog = (id) => {
  table_id.value = id;
  auditVisible.value = true;
}
</script>

<template>
  <el-table
    ref="multiTable"
    class="MultiTable"
    :data="tableData()"
    @sort-change="onSort"
    border
    highlight-current-row
    show-overflow-tooltip
    :max-height="max_height"
    :row-key="getRowKey"
    :default-expand-all="false"
    @selection-change="handleSelectionChange"
    :row-class-name="rowClassName"
  >
    <el-table-column  label="#" prop="id" width="35">
        <template #default="scope">
            <span>{{ scope.$index + 1 }}</span>
        </template>
    </el-table-column>
    <el-table-column
      v-for="(column, index) in props.columns"
      :key="column.key"
      :label="column.label"
      :sortable="column.sortable || false"
      :prop="column.key"
      :min-width="column.width"
    >
      <template #header="{ row }">
        <slot :name="'header_cell('+column.key+')'" :item="row" :index="index" :column="column" :disabled="disabled || column.disabled || false">
          <span>
            {{ column.label }}
            <span v-if="column.required" class="text-red-500">*</span>
          </span>
        </slot>
      </template>
      <template #default="{ row, $index }">
        <slot :name="'cell('+column.key+')'" :item="row" :index="index" :column="column" :disabled="disabled || column.disabled || false">
          <div v-if="column.type==='input'">
            <ElInput v-model="row[column.key]" :placeholder="column.label" class="w-full" :disabled="disabled || column.disabled || false" />
          </div>

          <div v-if="column.type==='select'">
            <DataSelect
              :route_name="column.route_name"
              v-model="row[column.key]"
              :placeholder="column.label"
              :disabled="disabled || column.disabled || false"
              class="w-full"
              :option_label="column.option_label || 'name'"
            />
          </div>

          <div v-if="column.type==='date'">
            <DateInput v-model="row[column.key]" :placeholder="column.label" :disabled="disabled || column.disabled || false" />
          </div>

          <div v-if="column.type==='text'">
            <p class="text-base">{{ row[column.key] }}</p>
          </div>

          <div v-if="column.type==='text_number'">
            <p class="text-base">{{ parseFloat(row[column.key]).toLocaleString() }}</p>
          </div>

          <div v-if="column.type==='checkbox'">
            <ElCheckbox v-model="row[column.key]" :placeholder="column.label" :disabled="disabled || column.disabled || false" />
          </div>

          <div v-if="column.type==='switch'">
            <ElSwitch v-model="row[column.key]" :placeholder="column.label" class="w-full" :disabled="disabled || column.disabled || false" />
          </div>

          <div v-if="column.type==='number'">
            <NumberInput v-model="row[column.key]" :placeholder="column.label" :precision="column.precision || 0" :disabled="disabled || column.disabled || false" />
          </div>
        </slot>
        <p class="text-red-500 text-xs italic" v-if="$page.props.errors[`${ data_key }.${ $index }.${ column.key }`]">
          {{ $page.props.errors[`${ data_key }.${ $index }.${ column.key }`] }}
        </p>
      </template>
    </el-table-column>
    <el-table-column fixed="right" v-if="!disabled && moveShow">
        <template #default="scope">
          <ArrowUpCircleIcon
            class="inline-block h-[1.2rem] text-gray-500 cursor-pointer hover:text-black"
            @click="moveUp(scope.$index)"
          />
          <ArrowDownCircleIcon
            class="inline-block h-[1.2rem] text-gray-500 cursor-pointer hover:text-black"
            @click="moveDown(scope.$index)"
          />
        </template>
    </el-table-column>
    <el-table-column fixed="right" v-if="!disabled && optionShow">
        <template #header>
          <PlusIcon
            v-if="addShow"
            class="inline-block h-4 -mt-1 text-danger-500 cursor-pointer hover:bg-gray-200 hover:rounded-full text-green-500"
            @click="add"
          />
        </template>
        <template #default="scope">
          <TrashIcon
            v-if="trashShow"
            class="inline-block h-[1.1rem] text-gray-500 cursor-pointer hover:text-black"
            @click="remove(scope.$index)"
          />
          <template
            v-if="scope.row?.id && auditsShow && ($page.props.permissions.includes('read audits') || $page.props.auth.user.super_admin)"
          >
            <template v-if="audits == 'dialog'">
              <span @click="showDialog(scope.row?.id || null)">
                <Document
                  class="ml-1 inline-block h-[1.1rem] text-gray-500 cursor-pointer hover:text-black"
                />
              </span>
            </template>
            <template v-else>
              <Link
                :href="route(`${ prefix }.audits.index`, { table: data_key, table_id: scope.row?.id })"
              >
                <Document
                  class="ml-1 inline-block h-[1.1rem] text-gray-500 cursor-pointer hover:text-black"
                />
              </Link>
            </template>
          </template>

        </template>
    </el-table-column>
  </el-table>

  <el-pagination
      class="mt-5"
      v-model:current-page="state.page"
      v-model:page-size="state.rows"
      :default-page-size="state.rows"
      :page-sizes="pageSizes"
      layout="sizes, prev, pager, next"
      :total="data.length"
  />

  <AuditsDialog v-model="auditVisible" :table="data_key" :table_id="table_id" />
</template>
