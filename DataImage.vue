<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useForm, router } from '@inertiajs/vue3'
import { ElDialog, ElTableColumn, ElImage, ElButton } from 'element-plus';
import DataTable from '@/Components/DataTable.vue';

const props = defineProps({
    modelValue: { type: [String, Array, Object], default: null },
})

const emit = defineEmits(['update:modelValue'])

const dialogTableVisible = ref(false)
const fileList = ref([])
const dataTable = ref(false)

const obj = {
    search: null,
    sortBy: 'updated_at',
    sortOrder: null,
    page: 1,
    rows: 15,
    ajax: 1
}

const filters = useForm({
    obj: Object.assign({}, obj)
})

const dataImagesData = ref([]);

const search = () => {
  axios.get(route(`backend.data_images.index`, filters.obj)).then(({ data }) => {
    dataImagesData.value = data;
  })
}

const reset = () => {
  filters.obj = Object.assign({}, obj);
  search();
}

const selectionChange = (val) => {
  fileList.value = val;
  emit('update:modelValue', val.map(item => item.id))
}

search();
</script>


<style>
.el-table .el-table__cell{
    z-index: auto;
}
</style>

<template>
  <label
    @click="dialogTableVisible = true"
    for="dropzone-file"
    class="flex flex-col w-full min-h-[300px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
    :class="{
      'items-center': fileList.length == 0,
      'justify-center' : fileList.length == 0
    }"
  >
    <div v-if="fileList.length > 0"  class="flex items-start justify-start p-5 w-full flex-wrap">
      <el-image v-for="(item, key) in fileList" style="width: 100px; height: 100px" class="m-2" :src="'/storage/'+item.image" :preview-src-list="['/storage/'+item.image]" fit="cover" />
    </div>
    <div v-else class="flex flex-col items-center justify-center p-5">
        <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">{{ $page.props.langs.search_data_images }}</span></p>
    </div>
  </label>

  <el-dialog v-model="dialogTableVisible" :title="$page.props.langs.search_data_images">
    <DataTable :data="dataImagesData" @search="search" :filters="filters" @reset="reset" :placeholder="search_data?.map(item => langs[routeNameData][item]).join(' / ')" customReset @selectionChange="selectionChange">
      <el-table-column label="#" type="selection" sortable="custom" prop="id" :reserve-selection="true" />
      <el-table-column :label="$page.props.langs.data_images.name" sortable="custom" prop="name" />
      <el-table-column :label="$page.props.langs.data_images.image" width="500" prop="image">
          <template #default="scope">
              <el-image style="width: 100px; height: 100px" :src="'/storage/'+scope.row.image" :preview-src-list="['/storage/'+scope.row.image]" fit="cover" />
          </template>
      </el-table-column>
      <el-table-column :label="$page.props.langs.updated_at" sortable="custom" prop="updated_at" width="160" />
    </DataTable>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="dialogTableVisible = false">
          {{ $page.props.langs.sure }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
