<script setup>
import { Link, usePage } from '@inertiajs/vue3'
import { PencilSquareIcon } from "@heroicons/vue/24/solid"

const props = defineProps({
  item: { type: Object },
  permissions: { type: Boolean, default: true },
  LinkHref: { type: String, default: null },
  permissionsData: { type: String, default: null },
  link: { type: Boolean, default: true },
})

const page = usePage();
const prefix = page.props.prefix || 'backend';

</script>

<template>
  <template
    v-if="!permissions || (route().has(`${ prefix }.${ $page.props.routeNameData }.edit`, item.id) && permissions && ($page.props.permissions.includes(`edit ${ permissionsData || $page.props.routeNameData }`) || $page.props.auth.user.super_admin))"
  >
    <Link
      v-if="link"
      :href="LinkHref || route(`${ prefix }.${ $page.props.routeNameData }.edit`, item.id)"
      class="inline-block pr-4 text-green-400 duration-100 rounded hover:text-green-600"
    >
      <slot>
        <PencilSquareIcon class="w-6 h-6" />
      </slot>
    </Link>

    <div
      v-else
      class="inline-block pr-4 text-green-400 duration-100 rounded hover:text-green-600"
    >
      <slot>
        <PencilSquareIcon class="w-6 h-6" />
      </slot>
    </div>
  </template>
</template>