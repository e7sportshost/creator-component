<script setup>
import { Link, usePage } from '@inertiajs/vue3'
import { PencilSquareIcon } from "@heroicons/vue/24/solid"
import CheckPermissions from './CheckPermissions';
import { ElTooltip } from 'element-plus';

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
    v-if="!permissions || permissions && CheckPermissions(`${ prefix }.${ $page.props.routeNameData }.edit`, `edit ${ $page.props.routeNameData }`, item)"
  >
    <ElTooltip :content="page.props.langs.edit">
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
    </ElTooltip>
  </template>
</template>