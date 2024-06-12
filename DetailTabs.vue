<script setup>
import { Link, usePage } from '@inertiajs/vue3'

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
const prefix = page.props.prefix || 'backend';

</script>

<template>
    <div class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
    <ul class="flex flex-wrap -mb-px">
        <template v-if="add_tabs.length > 0">
            <li class="mr-2" v-for="(item, key) in add_tabs" :key="key">
                <Link :href="item.route" :class="[
                    action === item.action ? 'text-blue-600 dark:text-gray-200 border-blue-600 dark:border-gray-200': 'dark:text-gray-500 dark:border-gray-500'
                ]" class="inline-block p-4 border-b-2 rounded-t-lg active hover:text-blue-600 hover:border-blue-600 dark:hover:text-gray-200 dark:hover:border-gray-200">{{ item.name }}</Link>
            </li>
        </template>

        <template v-else>
            <li class="mr-2">
                <Link :href="table_id ?
                    (route().has(`${ prefix }.${ table }.edit`, table_id) ? route(`${ prefix }.${ table }.edit`, table_id) : '#') :
                    (route().has(`${ prefix }.${ table }.create`) ? route(`${ prefix }.${ table }.create`) : '#' )"
                    :class="[
                    action === 'basic_data' ? 'text-blue-600 dark:text-gray-200 border-blue-600 dark:border-gray-200': 'dark:text-gray-500 dark:border-gray-500'
                ]" class="inline-block p-4 border-b-2 rounded-t-lg active hover:text-blue-600 hover:border-blue-600 dark:hover:text-gray-200 dark:hover:border-gray-200">{{ $page.props.langs.basic_data }}</Link>
            </li>
            <li class="mr-2" v-if="table_id">
                <Link
                    v-if="$page.props.permissions.includes('read audits') || $page.props.auth.user.super_admin"
                    :href="route(`${ prefix }.audits.index`, { table: table, table_id: table_id })" :class="[
                    action === 'audits' ? 'text-blue-600 dark:text-gray-200 border-blue-600 dark:border-gray-200': 'dark:text-gray-500 dark:border-gray-500'
                ]"  class="inline-block p-4 border-b-2 rounded-t-lg active hover:text-blue-600 hover:border-blue-600 dark:hover:text-gray-200 dark:hover:border-gray-200" aria-current="page">{{ $page.props.langs.audit }}</Link>
            </li>
        </template>
    </ul>
    </div>
</template>