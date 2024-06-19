
<script setup>
import { Link, usePage } from '@inertiajs/vue3'
import { ElButton } from 'element-plus';
import { Plus } from '@element-plus/icons-vue'

const page = usePage();
const prefix = page.props.prefix || 'backend';

</script>

<template>
  <Link
    v-if="route().has(`${ prefix }.${ $page.props.routeNameData }.create`) && ( $page.props.permissions.includes(`create ${ $page.props.routeNameData }`) || $page.props.auth.user.super_admin )"
    :href="route(`${ prefix }.${ $page.props.routeNameData }.create`)"
  >
    <ElButton :icon="Plus" type="success" size="large">
        <div class="hidden sm:block sm:m-0">{{ $page.props.langs.create }}</div>
    </ElButton>
  </Link>
</template>