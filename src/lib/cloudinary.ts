const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined

export const isCloudinaryConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET)

export type CloudinaryUpload = {
  url: string
  publicId: string
  width: number
  height: number
}

export async function uploadImage(file: File): Promise<CloudinaryUpload> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Cloudinary is not configured')
  }
  const form = new FormData()
  form.append('file', file)
  form.append('upload_preset', UPLOAD_PRESET)
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: form },
  )
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Upload failed: ${res.status} ${text}`)
  }
  const data = await res.json()
  return {
    url: data.secure_url as string,
    publicId: data.public_id as string,
    width: data.width as number,
    height: data.height as number,
  }
}
