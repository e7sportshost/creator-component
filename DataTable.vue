<script setup>
import { ref } from 'vue'
import { router, usePage } from '@inertiajs/vue3'

import { ElInput, ElButton, ElTable, ElPagination, ElDialog, ElTableColumn } from 'element-plus';
import { Search, Refresh, Filter } from '@element-plus/icons-vue'

import Create from '@/Components/Create.vue';
import Read from '@/Components/Read.vue';
import Edit from '@/Components/Edit.vue';
import Delete from '@/Components/Delete.vue';
import { row } from 'mathjs';

const props = defineProps({
    data: { type: Object },
    filters: { type: Object, default: {
        obj: {}
    } },
    advanced: { type: Boolean, default: false },
    resetData: { type: Object, default: {} },
    customReset: { type: Boolean, default: false },
    refs: { type: Boolean, default: false },
    selectedHighlight: { type: Boolean, default: false },
    selectedAbsolute: { type: Boolean, default: false },
    manualSearch: { type: Boolean, default: false },
    autoClear: { type: Boolean, default: false },
    placeholder: { type: String, default: 'search' },

    option: { type: Boolean, default: true },
    createBtn: { type: Boolean, default: true },
    readBtn: { type: Boolean, default: true },
    editBtn: { type: Boolean, default: true },
    deleteBtn: { type: Boolean, default: true },
    maxHeight: { type: Number, default: 500 },
    searchBar: { type: Boolean, default: true },
    rowClassName: { type: [Function, String] },
})

const page = usePage();
const langs = page.props.langs;
const table_key = `${ page.props.routeNameData }_query`;
const darkMode = localStorage.getItem('darkMode');
const prefix = page.props.prefix || 'backend';

const setData = () => {
    localStorage.setItem(table_key, JSON.stringify(props.filters.obj));
}

setData();

const setting = {
    replace: true,
    preserveState: true,
    preserveScroll: true
};

const dialogFormVisible = ref(false)
const dataTable = ref(false)

const emit = defineEmits(['search', 'reset', 'selectionChange', 'rowClick'])

const onPage = () => {
    onSearch();
}

const onRow = () => {
    onSearch();
}

const onSort = (value) => {
    props.filters.obj.sortBy = value.prop;
    props.filters.obj.sortOrder = value.order;
    onSearch();
}

const search = ref(null);
const ids = ref([]);

const debounceTimeouts = {};
const onKeyWord = () => {
    if(props.manualSearch){
        return;
    }
    clearTimeout(debounceTimeouts['keyWord']);
    debounceTimeouts['keyWord'] = setTimeout(() => {
        searchData();
    }, 350);
}

const searchData = () => {
    props.filters.obj.page = 1;
    onSearch();
}

const onSearch = () => {
    setData();
    emit('search', setting);
    if(props.autoClear){
        props.filters.obj.search = '';
    }
}

const onReset = () => {
    localStorage.removeItem(table_key);
    dataTable.value.clearSelection()
    if(props.customReset){
        emit('reset');
    } else {
        router.get(route(`${ prefix }.${ page.props.routeNameData }.index`), props.resetData || page.props.parameterData);
    }
}

const onAdvancedSearch = () => {
    dialogFormVisible.value = false;
    onSearch();
}

const handleSelectionChange = (val) => {
    ids.value = val;
    emit('selectionChange', val);
}

const selectedHighlightFunc = (row, rowIndex) => {
    let obj = {
        class: '',
        style: '',
    };

    if (props.selectedHighlight && ids.value.find(item => item.id == row.id)) {
        obj.class += '!bg-[#ecf5ff] dark:!bg-[#262727] ';

        if(props.selectedAbsolute){
            let allIds = ids.value.map(item => item.id); //全部选中的id
            let pageIndex = props.data.data.filter(item => allIds.includes(item.id)); //當前頁面選中的數據
            let findIndex = pageIndex.findIndex(item => item.id == row.id); //當前頁面選中的數據索引
            let offsetHeight = dataTable.value.$el.querySelector('.el-table__row').offsetHeight * findIndex;
            obj.class += `sticky z-[2] top-[${offsetHeight}px] `;
            obj.style += `top: ${offsetHeight}px;`;
        }
    }

    return obj
}

const selectedHighlightClassFunc = ({ row, rowIndex }) => {
    return selectedHighlightFunc(row, rowIndex).class;
}

const selectedHighlightStyleFunc = ({ row, rowIndex }) => {
    return selectedHighlightFunc(row, rowIndex).style;
}

const getRowKey = (row) => {
    return row.id;
}

defineExpose({
  onSearch,
});
</script>

<style>
.tableAuto.el-table .cell {
  white-space: nowrap;
}
</style>

<template>
    <div v-if="searchBar" class="flex mb-2">
        <el-button v-if="advanced" size="large" @click="dialogFormVisible = true" :icon="Filter" plain />
        <el-button size="large" @click="onReset" :icon="Refresh">
            <div class="hidden sm:block">{{ $page.props.langs.reset }}</div>
        </el-button>
        <el-input class="ml-4" ref="search" clearable v-model="props.filters.obj.search" size="large" @input="onKeyWord" v-on:keyup.enter="searchData" :placeholder="placeholder">
            <template #prepend>
                <el-button :icon="Search" @click="searchData" />
            </template>
        </el-input>
        <el-button :icon="Search" class="ml-4" size="large" @click="searchData" type="primary">
            <div class="hidden sm:block sm:m-0">{{ langs.search }}</div>
        </el-button>
        <Create v-if="createBtn" class="ml-4" />
    </div>

    <template v-if="advanced">
        <el-dialog
            v-model="dialogFormVisible"
            :title="$page.props.langs.advanced"
        >

            <form @submit.prevent="onAdvancedSearch" class="-mx-3">
                <div class="flex flex-wrap w-full mb-5 relative">
                    <slot name="advancedForm"></slot>
                </div>

            </form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">{{ $page.props.langs.cancel }}</el-button>
                    <el-button type="primary" @click="onAdvancedSearch">{{ $page.props.langs.submit }}</el-button>
                </span>
            </template>
        </el-dialog>
    </template>


    <el-table
        ref="dataTable"
        class="tableAuto"
        :data="data.data"
        :default-sort="{ prop: filters.obj.sortBy, order: filters.obj.sortOrder }"
        @sort-change="onSort"
        border
        show-overflow-tooltip
        :max-height="maxHeight"
        :row-key="getRowKey"
        :row-class-name="rowClassName"
        :row-style="selectedHighlightStyleFunc"
        :default-expand-all="false"
        @selection-change="handleSelectionChange"
        :highlight-current-row="selectedHighlight ? false : true"
        @row-click="row => emit('rowClick', row)"
    >
        <slot />
        <slot name="option">
            <el-table-column v-if="option" :label="langs.option" fixed="right" width="150">
                <template #default="scope">
                    <Read v-if="readBtn" :item="scope.row" />
                    <Edit v-if="editBtn" :item="scope.row" />
                    <Delete v-if="deleteBtn" :item="scope.row" />
                </template>
            </el-table-column>
        </slot>
    </el-table>

    <el-pagination
        v-if="data.total"
        class="mt-5"
        v-model:current-page="filters.obj.page"
        v-model:page-size="filters.obj.rows"
        :default-page-size="15"
        :page-sizes="[15, 30, 50, 100]"
        layout="sizes, prev, pager, next"
        :total="data.total"
        @size-change="onRow"
        @current-change="onPage"
    />
</template>
