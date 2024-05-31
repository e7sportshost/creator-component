
<script setup>
import { Link, usePage } from '@inertiajs/vue3'
import { ElButton } from 'element-plus';

const page = usePage();
const prefix = page.props.prefix || 'backend';

</script>

<template>
  <Link
    :href="route(`${ prefix }.${ $page.props.routeNameData }.create`)"
    v-if="$page.props.permissions.includes(`create ${ $page.props.routeNameData }`) || $page.props.auth.user.super_admin"
  >
    <ElButton type="success">
        {{ $page.props.langs.create }}
    </ElButton>
  </Link>
</template>