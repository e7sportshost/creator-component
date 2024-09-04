<script setup>
import { ref, watch } from 'vue';
import { QuillEditor } from '@vueup/vue-quill'
import 'quill/dist/quill.snow.css';
// import ImageUploader from 'quill-image-uploader';
import axios from 'axios';

const props = defineProps({
    modelValue: { type: [String, Object, Array], default: {} },
    toolbar: { type: Array, default: [
      ['bold', 'italic', 'underline', 'strike'],           // 粗體 斜體 底線 刪除線
      ['blockquote', 'code-block'],                        // 引用 程式碼
      [{ header: 1 }, { header: 2 }],                      // 1、2 級標題
      [{ list: 'ordered' }, { list: 'bullet' }],           // 有序、無序列表
      [{ script: 'sub' }, { script: 'super' }],            // 上標/下標
      [{ indent: '-1' }, { indent: '+1' }],                // 縮排
      [{ direction: 'rtl' }],                              // 文本方向
      [{ size: ['small', false, 'large', 'huge'] }],       // 字體大小
      [{ header: [1, 2, 3, 4, 5, 6, false] }],             // 標題
      [{ color: [] }, { background: [] }],                 // 字體顏色、字體背景顏色
      [{ font: [] }],                                      // 字體種類
      [{ align: [] }],                                     // 對齊方式
      ['clean'],                                           // 清除文本格式
      ['link', 'image'],                                   // 連結、圖片、視頻
    ]
  },
})

const emit = defineEmits(['update:modelValue']);
const myEditor = ref(null);
const data = ref(props.modelValue);

const emitUpdate = (value) => {
  emit('update:modelValue', myEditor.value.getHTML());
};

// const modules = {
//   name: 'imageUploader',
//   module: ImageUploader,
//   options: {
//     upload: file => {
//       return new Promise((resolve, reject) => {
//         const formData = new FormData();
//         formData.append("image", file);

//         axios.post(route('backend.upload.store'), formData)
//         .then(res => {
//           resolve(res.data);
//         })
//         .catch(err => {
//           reject("Upload failed");
//           console.error("Error:", err)
//         })
//       })
//     }
//   }
// }
</script>

<template>
  <div>
    <QuillEditor
      ref="myEditor"
      contentType="html"
      v-model:content="data"
      class="mt-6"
      :toolbar="toolbar"
      @update:content="emitUpdate"
      style="height: 300px"
    />
  </div>
</template>