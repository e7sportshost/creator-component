
<script setup>
import { Link, usePage } from '@inertiajs/vue3'
import { ElButton } from 'element-plus';

const page = usePage();
const prefix = page.props.prefix || 'backend';

</script>

<template>
  <Link
    v-if="route().has(`${ prefix }.${ $page.props.routeNameData }.create`) && ( $page.props.permissions.includes(`create ${ $page.props.routeNameData }`) || $page.props.auth.user.super_admin )"
    :href="route(`${ prefix }.${ $page.props.routeNameData }.create`)"
  >
    <ElButton type="success" size="large">
        {{ $page.props.langs.create }}
    </ElButton>
  </Link>
</template>