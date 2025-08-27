// types/file.ts
export type ApiUploadedFile = {
  file_id: string;
  url: string;
  filename: string;
  mime_type: string;
  size: number;
  uploaded_at: string;
};
