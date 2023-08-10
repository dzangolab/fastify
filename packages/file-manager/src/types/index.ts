interface File {
  id: number;
  originalFileName: string;
  fileName: string;
  description?: string;
  path: string;
  uploadedBy?: string;
  mimeType: string;
  createdAt: number;
  updatedAt: number;
}

type FileCreateInput = Omit<File, "id" | "createdAt" | "updatedAt">;

type FileUpdateInput = Partial<Omit<File, "id" | "createdAt" | "updatedAt">>;

export type { File, FileCreateInput, FileUpdateInput };
