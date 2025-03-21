import { API } from "@/utils/api/api";
import { IDocument } from "@/interfaces/Document";

export const uploadDocument = async (
  subjectId: string,
  documentTypeId: string,
  file: File
): Promise<IDocument> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await API.post(
    `/subject/${subjectId}/documents/${documentTypeId}/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const deleteDocument = async (
  subjectId: string,
  documentTypeId: string,
  documentId: number
): Promise<void> => {
  await API.delete(`/subject/${subjectId}/documents/${documentTypeId}/${documentId}`);
};
