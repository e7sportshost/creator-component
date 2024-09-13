// 创建一个 store
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDataCacheStore = defineStore('dataCache', () => {
    const dataCache = ref({});

    const setData = (key, data) => {
        dataCache.value[key] = data;
    };

    const getData = (key) => {
        return dataCache.value[key] || null;
    };

    return { dataCache, setData, getData };
});