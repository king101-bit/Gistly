import type { SupabaseClient } from '@supabase/supabase-js'

// Helper function to upload multiple files and return their public URLs
export async function uploadFilesToSupabase(
  files: File[],
  supabase: SupabaseClient,
  bucketName: string,
): Promise<string[]> {
  const urls: string[] = []

  for (const file of files) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${crypto.randomUUID()}.${fileExt}`
    const filePath = `${fileName}`

    const { error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file)

    if (error) {
      throw error
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath)
    urls.push(data.publicUrl)
  }

  return urls
}
