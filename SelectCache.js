// 创建一个 store
import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

const cacheMap = {};

export const useDataCacheStore = defineStore('dataCache', () => {
    const dataCache = ref({});

    const setData = (cacheKey, data) =>{
        dataCache.value[cacheKey] = data;
    }
    // 获取缓存
    const getData = (query, props) => {
        const cacheKey = JSON.stringify({ route_name: props.route_name, query, data: { ...props.route_parameter } });

        if (dataCache.value[cacheKey]) {
            return new Promise((resolve, reject)=>{
                resolve(dataCache.value[cacheKey])
            })
        }else{
            //添加接口并发缓存处理
            if((cacheMap?.[cacheKey]?.length ?? 0) == 0){
                cacheMap[cacheKey] = [];

                axios.get(route(props.route_name, { search: query, ...props.route_parameter })).then(({ data }) =>{
                    while(cacheMap[cacheKey].length){
                        setData(cacheKey, data);
                        const resolve = cacheMap[cacheKey].shift();
                        resolve[0](data)
                    }
                })
            }

            return new Promise((resolve, reject)=>{
                cacheMap[cacheKey].push([resolve, reject]);
            })
        }
    };

    return { dataCache, getData };
});