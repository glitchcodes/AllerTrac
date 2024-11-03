// import { createFetch } from "@vueuse/core";
import { useAuthStore } from "@/store/auth";
import { storeToRefs } from "pinia";
import { CapacitorHttp, HttpOptions, HttpResponse} from "@capacitor/core";
import FetchError from "@/utils/errors/FetchError";

const errorMessages: { [key: string]: any } = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  408: 'Request Timeout',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout'
};

export const useFetchAPI = async (options: HttpOptions): Promise<HttpResponse> => {
  // Inject the baseURL into the options
  const apiEndpoint = import.meta.env.VITE_API_BASEURL + '/' + import.meta.env.VITE_API_VERSION;

  // Do not concat baseURL if it starts with https or http
  if (!/^https?:\/\/(.*)/.test(options.url)) {
    options.url = apiEndpoint.concat(options.url);
  }

  const authStore = useAuthStore();
  const { bearerToken } = storeToRefs(authStore);

  // Attempt to get/update bearer token state
  await authStore.getBearerToken();

  // Capacitor HTTP default options
  options.headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...options.headers
  }

  if (bearerToken.value) {
    options.headers.Authorization = `Bearer ${bearerToken.value}`
  }

  const response = await CapacitorHttp.request(options);

  // Handle errors
  if (response.status >= 400 && response.status < 600) {
    const errorMessage = errorMessages[response.status] || 'Unknown Error';

    throw new FetchError({
      data: response.data,
      message: errorMessage,
      statusCode: response.status
    });
  }

  return response;
}