import useSWR from "swr";
import { fetcher } from "@/utils/api/api";
import { IDocumentApiResponse } from "@/interfaces/Document";

export const useDocument = (subjectId?: string, documentTypeId?: string) => {
  const path = subjectId && documentTypeId ? `/subject/${subjectId}/documents/${documentTypeId}` : null;
  const { data, error, isLoading, mutate } = useSWR<IDocumentApiResponse>(path, fetcher);

  return {
    document: data?.data,
    isLoading,
    error,
    mutate
  };
};
