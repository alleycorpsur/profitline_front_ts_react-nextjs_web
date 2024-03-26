import useSWR from "swr";
import { IDocumentsByClientId } from "@/types/documentsByClientId/IDocumentsByClientId";
import { fetcher } from "@/utils/api/api";

export const useDocumentByClient = () => {
  const { data, isLoading } = useSWR<IDocumentsByClientId>(
    `/client/documents/bytype/2`,
    fetcher,
    {}
  );
  console.log(data);

  return {
    data,
    isLoading
  };
};
