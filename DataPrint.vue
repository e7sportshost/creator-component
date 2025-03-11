<script setup>
import { ref } from 'vue'

const props = defineProps({
  iframeSrc: { type: String, default: '' },
})

const emit = defineEmits(['printEnd'])

const printIframe = ref(null)

//等待列印頁載入
const onIframeLoad = () => {
    const iframe = printIframe.value;
    if (iframe && iframe.contentWindow && !window.isPrint) {
        window.isPrint = true;
        window.addEventListener('message', function(event) {
            if (event.data === 'vue-rendered') {
              // Vue 已经完全渲染，触发打印
              iframe.contentWindow.focus();
              iframe.contentWindow.print();

              emit('printEnd')
            }
        })
    }
}

</script>

<template>
  <!-- 明細列印 -->
  <iframe class="hidden" ref="printIframe" :src="iframeSrc" @load="onIframeLoad"></iframe>
</template>
