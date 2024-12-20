<script setup>
import { ref } from 'vue'
import { router, usePage } from '@inertiajs/vue3'
import 'element-plus/dist/index.css'
import { ElUpload, ElButton, ElIcon, ElDialog } from 'element-plus';
import { Plus } from '@element-plus/icons-vue'

const props = defineProps({
    modelValue: { type: [String, Array, Object], default: null },
    multiple: { type: Boolean, default: false },
    accept: { type: String, default: null },
    autoUpload: { type: Boolean, default: false },
    listType: { type: String, default: 'picture-card' }, //'text' | 'picture' | 'picture-card'
    disabled: { type: Boolean, default: false },
    class: { type: String, default: null },
    textInfo: { type: String, default: null }
})

const page = usePage();
const upload = ref(null)

const fileList = props.multiple ? props.modelValue?.map(item => ({ id: item.id, name: item.name, url: item.original_url })) : [{ url: props.modelValue, name: props.modelValue }];


const fileData = ref(props.multiple ? null : { url: props.modelValue, name: props.modelValue })

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const prefix = page.props.prefix || 'backend';

const emit = defineEmits(['update:modelValue', 'updateDelete'])

const changeData = (list) => {
    if(props.multiple){
        let tmp = list.filter(item => item.raw).map(item => item.raw);
        emit('update:modelValue', tmp)
    }else{
        emit('update:modelValue', list?.pop().raw)
    }
}

const onChange = (response, list) => {
    if(!props.multiple){
        fileData.value.url = response.url;
        fileData.value.name = response.name;
    }
    changeData(list);
};

const TextChange = (element) => {
    let file = element.target.files[0];
    emit('update:modelValue', element.target.files[0])
};

const onRemove = (data, list) => {
    changeData(list);
    if(data.id){
        emit('updateDelete', data.id)
    }
};

const handlePictureCardPreview = (uploadFile) => {
    dialogImageUrl.value = uploadFile.url
    dialogVisible.value = true
}

</script>

<style scoped>
:deep(.el-upload--picture-card){
    height: auto;
}
.w-full :deep(.el-upload){
    width: 100%;
}
</style>

<template>
    <template v-if="listType == 'picture-card'">
        <el-upload
            ref="upload"
            v-model:file-list="fileList"
            multiple
            drag
            :show-file-list="multiple ? true : false"
            :accept="accept"
            :action="route(`${ prefix }.upload.store`)"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-change="onChange"
            :on-remove="onRemove"
            :auto-upload="autoUpload"
            :disabled="disabled"
            :class="class"
        >
            <template v-if="listType == 'picture-card'">
                <img v-if="fileData && fileData.url" :src="fileData.url" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </template>

            <template v-if="listType == 'text'">
                <div v-if="fileData" class="avatar"><div>{{ fileData.name }}</div></div>
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </template>
        </el-upload>

        <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
    </template>

    <template v-if="listType == 'text'">
        <input
            class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="file_input"
            :accept="accept"
            type="file"
            multiple
            @change="TextChange"
        >
        <p v-if="textInfo" class="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">{{ textInfo }}</p>

    </template>
</template>
