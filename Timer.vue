
<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import DataSelect from '@/Components/DataSelect.vue';

const props = defineProps({
  modelValue: { type: [String, Array, Number] },
  langs: { type: Object },
})
const emit = defineEmits(['update:modelValue', 'TimeEnd'])

const autoUpdateOptions = [
  { id: props.langs.disable, name: 0 },
  { id: '5', name: 5 },
  { id: '10', name: 10 },
  { id: '15', name: 15 },
  { id: '30', name: 30 },
  { id: '60', name: 60 }
];

const selectedAutoUpdate = ref(0);
const countdownTimer = ref(null);
const remainingTime = ref(0);

// 保存自動更新設置到 localStorage
const saveAutoUpdateSetting = (value) => {
  emit('update:modelValue', value);
};

// 從 localStorage 讀取自動更新設置
const loadAutoUpdateSetting = () => {
  return props.modelValue;
};

// 自動更新函數
const startAutoUpdate = () => {
  if (selectedAutoUpdate.value === 0) {
    clearInterval(countdownTimer.value);
    remainingTime.value = 0;
    saveAutoUpdateSetting(0);
    return;
  }

  clearInterval(countdownTimer.value);
  remainingTime.value = selectedAutoUpdate.value;
  saveAutoUpdateSetting(selectedAutoUpdate.value);

  countdownTimer.value = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--;
    } else {
      if(remainingTime.value === 0) {
        emit('TimeEnd');
        remainingTime.value = selectedAutoUpdate.value;
      }
    }
  }, 1000);
};

// 監聽自動更新選項變化
watch(selectedAutoUpdate, startAutoUpdate);

// 組件掛載時恢復之前的設置
onMounted(() => {
  selectedAutoUpdate.value = loadAutoUpdateSetting();
  if (selectedAutoUpdate.value > 0) {
    startAutoUpdate();
  }
});

// 組件卸載時清除定時器
onUnmounted(() => {
  clearInterval(countdownTimer.value);
});
</script>

<template>
  <div class="flex">
    <!-- 自動更新選擇框 -->
    <div class="w-[120px]">
      <DataSelect v-model="selectedAutoUpdate" :custom-data="autoUpdateOptions"/>
    </div>
    <!-- 倒計時顯示 -->
    <div v-if="selectedAutoUpdate > 0" class="ml-2 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full w-8 h-8">
      <span class="text-sm font-medium">{{ remainingTime }}</span>
    </div>
  </div>
</template>