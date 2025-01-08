<script setup>
import { ref, reactive } from "vue";
import { Link, usePage, useForm } from '@inertiajs/vue3'
import { ElInput, ElButton, ElDialog, ElTableColumn, ElLoading } from 'element-plus';
import AuditsDialog from '@/Components/AuditsDialog.vue';
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
});

const page = usePage();
const prefix = page.props.prefix || 'backend';
const audits = page.props.audits || 'link';
const auditVisible = ref(false)
</script>

<template>
  <template v-if="table_id">
      <template v-if="$page.props.permissions.includes('read audits') || $page.props.auth.user.super_admin">
          <template v-if="audits == 'dialog'">
              <div
                  @click="auditVisible = true"
                  :class="[
                  action === 'audits' ? 'text-blue-600 dark:text-gray-200 border-blue-600 dark:border-gray-200': 'dark:text-gray-500 dark:border-gray-500'
              ]"  class="cursor-pointer inline-block p-4 border-b-2 rounded-t-lg active hover:text-blue-600 hover:border-blue-600 dark:hover:text-gray-200 dark:hover:border-gray-200" aria-current="page">
                  <slot>
                    {{ $page.props.langs.audit }}
                  </slot>
              </div>
              <AuditsDialog v-model="auditVisible" :action="action" :table="table" :table_id="table_id" />
          </template>
          <template v-else>
              <Link
                  :href="route(`${ prefix }.audits.index`, { table: table, table_id: table_id })" :class="[
                  action === 'audits' ? 'text-blue-600 dark:text-gray-200 border-blue-600 dark:border-gray-200': 'dark:text-gray-500 dark:border-gray-500'
              ]"  class="inline-block p-4 border-b-2 rounded-t-lg active hover:text-blue-600 hover:border-blue-600 dark:hover:text-gray-200 dark:hover:border-gray-200" aria-current="page">
                  <slot>
                    {{ $page.props.langs.audit }}
                  </slot>
              </Link>
          </template>
      </template>
  </template>
</template>