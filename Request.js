import { ref } from 'vue';
import axios from 'axios';
import { ElLoading, ElMessage } from 'element-plus'

// const loadingInstance = ref(null);

// Request intercepter
axios.interceptors.request.use(
  config => {
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    // loadingInstance.value = ElLoading.service()

    return config;
  },
);

// response pre-processing
axios.interceptors.response.use(
  response => {
    // loadingInstance.value?.close()

    if(response.data?.success){
      ElMessage({
        message: response.data.success,
        type: 'success',
      })
    }

    if(response.data?.error){
      ElMessage({
        message: response.data.error,
        type: 'error',
      })
    }
    return response;
  },
  error => {
    let message = error.message;

    if(error.response?.data?.message){
      message = error.response.data.message;
      ElMessage({
        message: message,
        type: 'error',
      })
    }

    return Promise.reject(error);
    // loadingInstance.value?.close()
  }
);

export default axios;