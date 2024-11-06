import { defineStore } from "pinia";
import { ref } from "vue";

export const useScannerStore = defineStore('scanner', () => {
  const capturedImage = ref("");
  const capturedImageBlob = ref();

  const setCapturedImage = async (base64Data: string, contentType: string) => {
    const imageString = `data:${contentType};base64,${base64Data}`;

    capturedImage.value = imageString;
    capturedImageBlob.value = await (await fetch(imageString)).blob()
  }

  const resetCapturedImage = () => {
    capturedImage.value = "";
  }

  return { capturedImage, capturedImageBlob, setCapturedImage, resetCapturedImage }
})