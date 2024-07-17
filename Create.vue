
<script setup>
import { Link, usePage } from '@inertiajs/vue3'
import { ElButton } from 'element-plus';
import { Plus } from '@element-plus/icons-vue'

const props = defineProps({
  LinkHref: { type: String, default: null },
  link: { type: Boolean, default: true },
})

const page = usePage();
const prefix = page.props.prefix || 'backend';

</script>

<template>
  <template
    v-if="route().has(`${ prefix }.${ $page.props.routeNameData }.create`) && ( $page.props.permissions.includes(`create ${ $page.props.routeNameData }`) || $page.props.auth.user.super_admin )"
  >
    <Link
      v-if="link"
      :href="route(`${ prefix }.${ $page.props.routeNameData }.create`)"
      class="ml-4"
    >
      <ElButton :icon="Plus" type="success" size="large">
          <div class="hidden sm:block sm:m-0">{{ $page.props.langs.create }}</div>
      </ElButton>
    </Link>

    <div
      v-else
    >
      <ElButton :icon="Plus" type="success" size="large">
          <div class="hidden sm:block sm:m-0">{{ $page.props.langs.create }}</div>
      </ElButton>
    </div>
  </template>
</template>