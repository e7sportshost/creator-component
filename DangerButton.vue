<script setup>
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
});
</script>

<template>
    <ElButton color="#dc2626" class="mx-1 mb-4" type="danger" :native-type="type" :size="size">
        <slot />
    </ElButton>
</template>