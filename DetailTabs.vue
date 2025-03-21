<script setup>
import { ref, reactive, computed } from "vue";
import { Link, usePage, useForm } from '@inertiajs/vue3'
import { ElInput, ElButton, ElDialog, ElTableColumn, ElLoading } from 'element-plus';
import AuditsButton from '@/Components/AuditsButton.vue';
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
    audit: {
        type: Boolean,
        default: true
    },
    routeNameData: {
        type: String,
        default: '',  // 先设为空字符串，后续 computed 处理默认值
    }
});

const page = usePage();
const prefix = page.props.prefix || 'backend';

const routeName = computed(() => props.routeNameData || props.table);
</script>

<template>
    <div class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
    <ul class="flex flex-wrap -mb-px">
        <template v-if="add_tabs.length > 0">
            <template v-for="(item, key) in add_tabs" :key="key">
                <li class="mr-2" v-if="!item.permissions || (item.permissions && $page.props.permissions.includes(`read ${ item.permissions }`)) || $page.props.auth.user.super_admin">
                    <a v-if="item?.target == '_blank'" target="_blank" :href="item.route" :class="[
                        action === item.action ? 'text-blue-600 dark:text-gray-200 border-blue-600 dark:border-gray-200': 'dark:text-gray-500 dark:border-gray-500'
                    ]" class="inline-block p-4 border-b-2 rounded-t-lg active hover:text-blue-600 hover:border-blue-600 dark:hover:text-gray-200 dark:hover:border-gray-200">{{ item.name }}</a>
                    <Link v-else :href="item.route" :class="[
                        action === item.action ? 'text-blue-600 dark:text-gray-200 border-blue-600 dark:border-gray-200': 'dark:text-gray-500 dark:border-gray-500'
                    ]" class="inline-block p-4 border-b-2 rounded-t-lg active hover:text-blue-600 hover:border-blue-600 dark:hover:text-gray-200 dark:hover:border-gray-200">{{ item.name }}</Link>
                </li>
            </template>
        </template>

        <template v-else>
            <li class="mr-2">
                <Link
                    :href="table_id ?
                    (route().has(`${ prefix }.${ routeName }.edit`, table_id) ? route(`${ prefix }.${ routeName }.edit`, table_id) : '#') :
                    (route().has(`${ prefix }.${ routeName }.create`) ? route(`${ prefix }.${ routeName }.create`) : '#' )"
                    :class="[
                    action === 'basic_data' ? 'text-blue-600 dark:text-gray-200 border-blue-600 dark:border-gray-200': 'dark:text-gray-500 dark:border-gray-500'
                ]" class="inline-block p-4 border-b-2 rounded-t-lg active hover:text-blue-600 hover:border-blue-600 dark:hover:text-gray-200 dark:hover:border-gray-200">{{ $page.props.langs.basic_data }}</Link>
            </li>
        </template>
        <template v-if="audit">
            <li class="mr-2" v-if="table_id">
                <AuditsButton :action="action" :table="table" :table_id="table_id" />
            </li>
        </template>
    </ul>
    </div>
</template>