<script setup>
import { Link, usePage } from '@inertiajs/vue3'
import { ElButton } from 'element-plus';
defineProps({
    type: {
        type: String,
        default: 'submit',
    },
    size: {
        type: String,
        default: 'default',
    },
    href: {
        type: String,
        default: null,
    },
});

const page = usePage();
const prefix = page.props.prefix || 'backend';

const localHistory = (routeName) => {
  return JSON.parse(localStorage.getItem(`${ routeName }_query`));
}

const hrefLink = (routeName) => {
  let query = localHistory(routeName);
  return routeName != '' ? route(`backend.${routeName}.index`, query || {}) : '#';
}

</script>

<template>
    <Link
        :href="href ? href : hrefLink($page.props.routeNameData)"
    >
        <ElButton severity="secondary" outlined :size="size">
            <slot />
        </ElButton>
    </Link>
</template>
