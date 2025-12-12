import axios from 'axios';
import { toast } from 'sonner';

const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    const { data } = response;
    // Check if response has custom success flag
    if (data && data.success === false) {
      const errorMessage = data.message || 'API request failed';
      const error = new Error(errorMessage);
      toast.error(errorMessage);
      return Promise.reject(error);
    }

    return data;
  },
  (error) => {
    const { response, message } = error;
    const errorMessage = response?.data?.message || message || 'An error occurred';
    toast.error(errorMessage); // in all cases of error , show toast error

    return Promise.reject(error);
  }
);

export default apiClient;