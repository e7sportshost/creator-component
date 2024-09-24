
<script setup>
import { Link, usePage } from '@inertiajs/vue3'
import { EyeIcon } from "@heroicons/vue/24/solid"

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
    v-if="!permissions || (route().has(`${ prefix }.${ $page.props.routeNameData }.show`, item.id) && permissions && ($page.props.permissions.includes(`read ${ permissionsData || $page.props.routeNameData }`) || $page.props.auth.user.super_admin))"
  >
    <Link
      v-if="link"
      :href="LinkHref || route(`${ prefix }.${ $page.props.routeNameData }.show`, item.id)"
      class="inline-block pr-4 duration-100 rounded hover:text-green-600"
    >
      <slot>
        <EyeIcon class="w-6 h-6" />
      </slot>
    </Link>


    <div
      v-else
      class="inline-block pr-4 duration-100 rounded hover:text-green-600"
    >
      <slot>
        <EyeIcon class="w-6 h-6" />
      </slot>
    </div>
  </template>
</template>