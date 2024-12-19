<script setup>
import { computed } from 'vue';
import { Link } from '@inertiajs/vue3';

const props = defineProps({
    href: String,
    active: Boolean,
    children: { type: Boolean, default: false },
});

const classes = computed(() => {
    let className =  props.active
        ? 'flex items-center p-2 text-gray-900 rounded-lg bg-gray-100 dark:text-gray-200 dark:bg-gray-700'
        : 'flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700';

    if(props.children){
        className = props.active
        ? 'flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-7 group bg-gray-100 dark:text-gray-200 dark:bg-gray-700'
        : 'flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-7 group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700';
    }
    return className;
});
</script>

<template>
    <Link :href="href" :class="classes" prefetch>
        <slot />
    </Link>
</template>
