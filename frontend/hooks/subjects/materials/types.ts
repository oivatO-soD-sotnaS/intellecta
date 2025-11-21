export type FileLite = {
  file_id: string
  url: string
  filename: string
  mime_type: string
  size: number
  uploaded_at?: string
}


export interface MaterialFile {
  file_id: string
  url: string
  filename: string
  mime_type: string
  size: number
  uploaded_at: string
  file_type?: string
}

export interface Material {
  material_id: string
  title: string
  created_at: string
  changed_at: string
  subject_id: string
  file_id?: string
  file?: MaterialFile | null
}



export type CreateMaterialInput = {
  title: string
  file: File | null
}

export type UpdateMaterialInput = {
  title?: string
  file?: File | null
}
