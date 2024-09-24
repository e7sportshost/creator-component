
<script setup>
import { router, Link, usePage } from '@inertiajs/vue3'
import { TrashIcon } from "@heroicons/vue/24/solid"
import SuccessAlert from '@/Services/SuccessAlert'

import { confirmDelete } from '@/Services/confirmDelete';

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
  <a
    href="#"
    @click="onDelete(item.id)"
    v-if="!permissions || (route().has(`${ prefix }.${ $page.props.routeNameData }.destroy`, item.id) && permissions && ($page.props.permissions.includes(`delete ${ $page.props.routeNameData }`) || $page.props.auth.user.super_admin))"
    class="inline-block pr-4 text-red-400 duration-100 rounded hover:text-red-600"
  >
    <slot>
      <TrashIcon class="w-6 h-6" />
    </slot>
  </a>
</template>