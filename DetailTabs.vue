<script setup>
import { ref, reactive } from "vue";
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
    add_tabs: {
        type: Array,
        default: [],
    },
});

const page = usePage();
const langs = page.props.langs;
const prefix = page.props.prefix || 'backend';
const audits = page.props.audits || 'link';
const auditVisible = ref(false)
const routeNameData = ref('audits');

const data = ref({});
const loadingInstance = ref(null);
const search_data = ref([]);
const filters = useForm({
    obj: {
        search: null,
        sortBy: 'updated_at',
        sortOrder: null,
        page: 1,
        rows: 15,
        table: null,
        table_id: null,
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
    filters.obj.table = null;
    filters.obj.table_id = null;
    search();
}

const showDialog = () => {
    auditVisible.value = true;
    search();
}
</script>

<template>
    <div class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
    <ul class="flex flex-wrap -mb-px">
        <template v-if="add_tabs.length > 0">
            <template v-for="(item, key) in add_tabs" :key="key">
                <li class="mr-2" v-if="!item.permissions || (item.permissions && $page.props.permissions.includes(`read ${ item.permissions }`)) || $page.props.auth.user.super_admin">
                    <Link  :href="item.route" :class="[
                        action === item.action ? 'text-blue-600 dark:text-gray-200 border-blue-600 dark:border-gray-200': 'dark:text-gray-500 dark:border-gray-500'
                    ]" class="inline-block p-4 border-b-2 rounded-t-lg active hover:text-blue-600 hover:border-blue-600 dark:hover:text-gray-200 dark:hover:border-gray-200">{{ item.name }}</Link>
                </li>
            </template>
        </template>

        <template v-else>
            <li class="mr-2">
                <Link

                    :href="table_id ?
                    (route().has(`${ prefix }.${ table }.edit`, table_id) ? route(`${ prefix }.${ table }.edit`, table_id) : '#') :
                    (route().has(`${ prefix }.${ table }.create`) ? route(`${ prefix }.${ table }.create`) : '#' )"
                    :class="[
                    action === 'basic_data' ? 'text-blue-600 dark:text-gray-200 border-blue-600 dark:border-gray-200': 'dark:text-gray-500 dark:border-gray-500'
                ]" class="inline-block p-4 border-b-2 rounded-t-lg active hover:text-blue-600 hover:border-blue-600 dark:hover:text-gray-200 dark:hover:border-gray-200">{{ $page.props.langs.basic_data }}</Link>
            </li>
            <li class="mr-2" v-if="table_id">
                <template v-if="$page.props.permissions.includes('read audits') || $page.props.auth.user.super_admin">
                    <template v-if="audits == 'dialog'">
                        <div
                            @click="showDialog()"
                            :class="[
                            action === 'audits' ? 'text-blue-600 dark:text-gray-200 border-blue-600 dark:border-gray-200': 'dark:text-gray-500 dark:border-gray-500'
                        ]"  class="cursor-pointer inline-block p-4 border-b-2 rounded-t-lg active hover:text-blue-600 hover:border-blue-600 dark:hover:text-gray-200 dark:hover:border-gray-200" aria-current="page">
                            {{ $page.props.langs.audit }}
                        </div>

                        <ElDialog v-model="auditVisible" width="80%">
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
                        </ElDialog>
                    </template>
                    <template v-else>
                        <Link
                            :href="route(`${ prefix }.audits.index`, { table: table, table_id: table_id })" :class="[
                            action === 'audits' ? 'text-blue-600 dark:text-gray-200 border-blue-600 dark:border-gray-200': 'dark:text-gray-500 dark:border-gray-500'
                        ]"  class="inline-block p-4 border-b-2 rounded-t-lg active hover:text-blue-600 hover:border-blue-600 dark:hover:text-gray-200 dark:hover:border-gray-200" aria-current="page">{{ $page.props.langs.audit }}</Link>
                    </template>
                </template>
            </li>
        </template>
    </ul>
    </div>
</template>