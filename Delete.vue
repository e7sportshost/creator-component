
<script setup>
import { router, Link, usePage } from '@inertiajs/vue3'
import { TrashIcon } from "@heroicons/vue/24/solid"
import SuccessAlert from '@/Services/SuccessAlert'
import { ElTooltip } from 'element-plus';

import { confirmDelete } from '@/Services/confirmDelete';
import CheckPermissions from './CheckPermissions';

const props = defineProps({
  item: { type: Object },
  permissions: { type: Boolean, default: true },
})

const page = usePage();
const prefix = page.props.prefix || 'backend';

const onDelete = async (id) => {
    if(await confirmDelete(page.props.langs)){
        router.delete(route(`${ prefix }.${page.props.routeNameData}.destroy`, id), SuccessAlert)
    }
}
</script>

<template>
  <ElTooltip :content="page.props.langs.delete">
    <a
      href="#"
      @click="onDelete(item.id)"
      v-if="!permissions || permissions && CheckPermissions(`${ prefix }.${ $page.props.routeNameData }.destroy`, `delete ${ $page.props.routeNameData }`, item)"
      class="inline-block pr-4 text-red-400 duration-100 rounded hover:text-red-600"
    >
      <slot>
        <TrashIcon class="w-6 h-6" />
      </slot>
    </a>
  </ElTooltip>
</template>