import { GenericResponse } from "@/types/global/IGlobal";
import { Product } from "@/types/products/products";
import { API } from "@/utils/api/api";

export const getProductsByProject = async (projectId: number) => {
  const response = await API.get<Product[], GenericResponse<Product[]>>(
    "/product/project/" + projectId
  );
  return response;
};
