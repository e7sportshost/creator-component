
<script setup>
import { Link, usePage } from '@inertiajs/vue3'
import { ElButton } from 'element-plus';
import { Plus } from '@element-plus/icons-vue'
import CheckPermissions from './CheckPermissions';
import { ElTooltip } from 'element-plus';

const props = defineProps({
  LinkHref: { type: String, default: null },
  link: { type: Boolean, default: true },
})

const page = usePage();
const prefix = page.props.prefix || 'backend';

</script>

<template>
  <template
    v-if="CheckPermissions(`${ prefix }.${ $page.props.routeNameData }.create`, `create ${ $page.props.routeNameData }`)"
  >
    <ElTooltip :content="page.props.langs.create">
      <Link
        v-if="link"
        :href="route(`${ prefix }.${ $page.props.routeNameData }.create`)"
        class="ml-4"
        prefetch
      >
        <ElButton :icon="Plus" type="success" size="large">
            <div class="hidden sm:block sm:m-0">{{ $page.props.langs[$page.props.routeNameData]?.create || $page.props.langs.create }}</div>
        </ElButton>
      </Link>

      <div
        v-else
      >
        <ElButton :icon="Plus" type="success" size="large">
            <div class="hidden sm:block sm:m-0">{{ $page.props.langs[$page.props.routeNameData]?.create || $page.props.langs.create }}</div>
        </ElButton>
      </div>
    </ElTooltip>
  </template>
</template>