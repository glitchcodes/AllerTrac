import { Camera, CameraResultType, ImageOptions } from "@capacitor/camera";

export const useAvatarUploader = () => {
  const pickImage = async (options?: ImageOptions) => {
    return await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      ...options
    })
  }

  return { pickImage }
}