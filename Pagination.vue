<script setup>
import { Link } from '@inertiajs/vue3'
const props = defineProps({
    links: { type: Array },
    preserveState: { type: Boolean, default: false },
})
</script>
<template>
  <div class="m-0" v-if="links.length > 3">
      <div class="flex flex-wrap -mb-1 justify-start">
          <template v-for="(link, p) in links" :key="p">
              <div v-if="link.url === null" class="mr-1 mb-1 px-4 py-3 text-sm leading-4 text-gray-400 border rounded"
                  v-dompurify-html="link.label" />
              <Link v-else
                    preserveState

                    class="mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded  focus:border-indigo-500 focus:text-indigo-500"
                    :class="{ 'bg-blue-700 text-white': link.active }" :href="link.url" v-dompurify-html="link.label" />
          </template>
      </div>
  </div>
</template>